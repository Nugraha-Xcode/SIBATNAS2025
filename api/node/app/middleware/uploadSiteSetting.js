// Fixed uploadSiteSetting.js
const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const maxSizeImage = 10 * 1024 * 1024; // 10MB max file size for images
const maxSizeVideo = 50 * 1024 * 1024; // 50MB max file size for videos

// Create upload directory if it doesn't exist
const uploadDir = __basedir + "/app/resources/static/assets/site/";
const tempDir = path.join(__basedir, "/app/resources/static/assets/site/temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if this is a chunked upload
    if (req.body && req.body.chunkId !== undefined) {
      // Create a unique directory for this file's chunks based on field name and uuid
      const fieldname = req.body.fieldname || file.fieldname;
      const uuid = req.body.uuid;
      
      if (!fieldname || !uuid) {
        return cb(new Error('Missing required parameters for chunked upload'));
      }
      
      const uniqueId = `${fieldname}-${uuid}`;
      const uniqueChunkDir = path.join(tempDir, uniqueId);
      
      // Ensure the temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Ensure the unique chunk directory exists
      if (!fs.existsSync(uniqueChunkDir)) {
        fs.mkdirSync(uniqueChunkDir, { recursive: true });
      }
      
      console.log(`Storing chunk in directory: ${uniqueChunkDir}`);
      cb(null, uniqueChunkDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // For chunked uploads, use a consistent name pattern with chunk number
    if (req.body && req.body.chunkId !== undefined) {
      const chunkId = parseInt(req.body.chunkId);
      const chunkFilename = `chunk-${chunkId.toString().padStart(5, '0')}`;
      console.log(`Creating chunk file: ${chunkFilename}`);
      cb(null, chunkFilename);
    } else {
      // Determine file prefix based on fieldname
      let filePrefix;
      if (file.fieldname === "logo") {
        filePrefix = "logo";
      } else if (file.fieldname === "icon") {
        filePrefix = "icon";
      } else {
        filePrefix = "background";
      }
      cb(null, `${Date.now()}-site-${filePrefix}-${file.originalname}`);
    }
  },
});

// Function to determine file size limit based on mimetype
function getFileSizeLimit(file) {
  return file.mimetype.startsWith('video/') ? maxSizeVideo : maxSizeImage;
}

// Create multer upload instance
var uploadSite = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // For chunked uploads, skip content type validation
    if (req.body && req.body.chunkId !== undefined) {
      return cb(null, true);
    }
    
    // Validate file type based on fieldname
    if (file.fieldname === "logo" && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for logo'), false);
    }
    
    if (file.fieldname === "icon" && file.mimetype !== 'image/x-icon') {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.ico') {
        return cb(new Error('Only .ico files are allowed for icon'), false);
      }
    }
    
    if (file.fieldname === "background") {
      const formatBackground = req.body.format_background || JSON.parse(req.body.data || '{}').format_background;
      if (formatBackground === 'image' && !file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for image background'), false);
      }
      if (formatBackground === 'video' && !file.mimetype.startsWith('video/')) {
        return cb(new Error('Only video files are allowed for video background'), false);
      }
    }
    
    cb(null, true);
  },
  limits: {
    fileSize: maxSizeVideo, // Set to the maximum possible size we'd allow
  },
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "icon", maxCount: 1 },
  { name: "background", maxCount: 1 },
  { name: "chunk", maxCount: 1 } // For chunked uploads
]);

// Helper to handle chunked file uploads
const mergeChunksIfComplete = async (uuid, fieldname, originalFilename, totalChunks) => {
  try {
    console.log(`Attempting to merge chunks for ${fieldname} with uuid ${uuid}`);
    
    // Ensure parameters are valid
    if (!uuid || !fieldname || !originalFilename || !totalChunks) {
      return {
        success: false,
        message: 'Missing required parameters for merging chunks'
      };
    }
    
    const uniqueId = `${fieldname}-${uuid}`;
    const uniqueChunkDir = path.join(tempDir, uniqueId);
    
    console.log(`Looking for chunks in directory: ${uniqueChunkDir}`);
    
    // Check if the unique chunk directory exists
    if (!fs.existsSync(uniqueChunkDir)) {
      console.error(`Chunk directory not found: ${uniqueChunkDir}`);
      // Attempt to find chunks in the main directory that might have been misplaced
      const misplacedChunks = fs.readdirSync(uploadDir)
        .filter(file => file.includes(`site-${fieldname}-blob`));
      
      if (misplacedChunks.length > 0) {
        console.log(`Found ${misplacedChunks.length} misplaced chunks in main directory`);
        
        // Create the chunk directory if it doesn't exist
        if (!fs.existsSync(uniqueChunkDir)) {
          fs.mkdirSync(uniqueChunkDir, { recursive: true });
        }
        
        // Move misplaced chunks to the proper directory
        for (let i = 0; i < misplacedChunks.length; i++) {
          const misplacedPath = path.join(uploadDir, misplacedChunks[i]);
          const properPath = path.join(uniqueChunkDir, `chunk-${i.toString().padStart(5, '0')}`);
          fs.renameSync(misplacedPath, properPath);
        }
        
        // Update totalChunks to match what we found
        totalChunks = misplacedChunks.length;
        console.log(`Moved ${misplacedChunks.length} chunks to proper directory`);
      } else {
        return {
          success: false,
          message: 'Chunk directory not found and no misplaced chunks detected'
        };
      }
    }

    // Get all chunk files in the directory
    const chunkFiles = fs.readdirSync(uniqueChunkDir).filter(file => 
      file.startsWith('chunk-')
    );
    
    console.log(`Found ${chunkFiles.length} chunks of ${totalChunks} expected`);
    
    // Check if all chunks are present
    if (chunkFiles.length !== parseInt(totalChunks)) {
      return {
        success: false,
        message: `Not all chunks uploaded yet. Got ${chunkFiles.length} of ${totalChunks}`,
        progress: chunkFiles.length / parseInt(totalChunks)
      };
    }
    
    // Sort chunks by their numeric part (important for correct file reassembly)
    chunkFiles.sort((a, b) => {
      const numA = parseInt(a.split('-')[1]);
      const numB = parseInt(b.split('-')[1]);
      return numA - numB;
    });
    
    // Create the output file with a unique name
    const timestamp = Date.now();
    const outputFilename = `${timestamp}-site-${fieldname}-${originalFilename}`;
    const outputPath = path.join(uploadDir, outputFilename);
    
    console.log(`Creating merged file at: ${outputPath}`);
    
    // Create a write stream for the output file
    const writeStream = fs.createWriteStream(outputPath);
    
    // Set up promise to know when the stream is finished
    const streamFinished = new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    // Process each chunk sequentially
    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(uniqueChunkDir, chunkFile);
      
      // Skip if the chunk file doesn't exist
      if (!fs.existsSync(chunkPath)) {
        console.warn(`Chunk file not found: ${chunkPath}`);
        continue;
      }
      
      console.log(`Appending chunk: ${chunkFile}`);
      
      // Read the chunk and append it to the output file
      const chunkData = fs.readFileSync(chunkPath);
      writeStream.write(chunkData);
    }
    
    // Close the write stream
    writeStream.end();
    
    // Wait for the stream to finish
    await streamFinished;
    
    console.log(`File merge complete. Cleaning up chunk directory.`);
    
    // Clean up the chunk files and directory
    try {
      for (const chunkFile of chunkFiles) {
        const chunkPath = path.join(uniqueChunkDir, chunkFile);
        fs.unlinkSync(chunkPath);
      }
      
      fs.rmdirSync(uniqueChunkDir);
    } catch (err) {
      console.error(`Error during cleanup: ${err.message}`);
      // Don't fail the operation if cleanup has issues
    }
    
    return {
      success: true,
      filename: outputFilename
    };
  } catch (err) {
    console.error('Error merging chunks:', err);
    return {
      success: false,
      message: `Error merging chunks: ${err.message}`
    };
  }
};

// Promisify and export
let uploadSiteMiddleware = util.promisify(uploadSite);
module.exports = {
  uploadSiteMiddleware,
  mergeChunksIfComplete
};