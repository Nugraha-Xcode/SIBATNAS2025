// Fixed siteSetting.controller.js
const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { uploadSiteMiddleware, mergeChunksIfComplete } = require("../middleware/uploadSiteSetting");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const SiteSetting = db.site_setting;

// Constants for file size limits
const maxSizeImage = 10 * 1024 * 1024; // 10MB max file size for images
const maxSizeVideo = 50 * 1024 * 1024; // 50MB max file size for videos

// Get site settings
exports.getSiteSettings = (req, res) => {
  SiteSetting.findOne()
    .then((data) => {
      if (!data) {
        // If no settings exist, create default settings
        const defaultSettings = {
          uuid: uuidv4(),
          name: "Geoportal Palapa",
          institusi: "Badan Informasi Geospasial",
          url: "https://geodev.big.go.id",
          alamat: "JL. Raya Jakarta - Bogor KM 46, Cibinong 16911",
          email: "info@big.go.id",
          telp: "021-8752062 ext.3608/3611/3103",
          fax: "021-87908988/8753155",
          deskripsi: "Geoportal Simpul Jaringan Palapa adalah sebuah platform terintegrasi yang mengumpulkan, menyajikan, dan menyebarluaskan data dan informasi geospasial yang menjadi tanggung jawab dan kewenangan unit produksi dan walidata di Badan Informasi Geospasial.",
          format_background: "image",
          coverage_area: "{\"id\": \"1\", \"name\": \"INDONESIA\", \"alt_name\": \"INDONESIA\", \"latitude\": -1.93, \"longitude\": 115}",
          logo: "",
          icon: "",
          background: ""
        };

        SiteSetting.create(defaultSettings)
          .then((newData) => {
            res.send(newData);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while creating default site settings."
            });
          });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving site settings."
      });
    });
};

// Handle a chunk upload for large files
exports.uploadChunk = async (req, res) => {
  try {
    console.log("Beginning chunk upload processing");
    
    // Apply middleware
    await uploadSiteMiddleware(req, res);
    
    // Extract necessary parameters
    const { chunkId, totalChunks, originalFilename, fieldname, uuid } = req.body;
    
    // Validation
    if (!chunkId || !totalChunks || !originalFilename || !fieldname || !uuid) {
      return res.status(400).send({
        message: "Missing required parameters for chunk upload",
        details: { chunkId, totalChunks, originalFilename, fieldname, uuid }
      });
    }
    
    console.log(`Received chunk ${chunkId} of ${totalChunks} for ${fieldname} with uuid ${uuid}`);
    
    // Check if this is the last chunk
    const isLastChunk = parseInt(chunkId) === parseInt(totalChunks) - 1;
    
    if (isLastChunk) {
      console.log(`Last chunk received, attempting to merge chunks for ${fieldname}`);
      
      // Try to merge all chunks
      const result = await mergeChunksIfComplete(uuid, fieldname, originalFilename, totalChunks);
      
      if (result.success) {
        console.log(`Successfully merged all chunks for ${fieldname}. Output filename: ${result.filename}`);
        
        // Update the database with the new filename
        try {
          const settingToUpdate = await SiteSetting.findOne({ where: { uuid } });
          
          if (!settingToUpdate) {
            return res.status(404).send({
              message: "Site settings not found."
            });
          }
          
          // Remove old file if it exists
          if (settingToUpdate[fieldname]) {
            const oldFilePath = path.join(__basedir, "/app/resources/static/assets/site/", settingToUpdate[fieldname]);
            if (fs.existsSync(oldFilePath)) {
              try {
                fs.unlinkSync(oldFilePath);
                console.log(`Removed old file: ${oldFilePath}`);
              } catch (unlinkError) {
                console.error(`Error removing old file ${settingToUpdate[fieldname]}:`, unlinkError);
              }
            }
          }
          
          // Update database with new filename
          await SiteSetting.update(
            { [fieldname]: result.filename },
            { where: { uuid } }
          );
          
          console.log(`Database updated for ${fieldname} with new filename: ${result.filename}`);
          
          return res.send({
            message: "All chunks received and merged successfully",
            filename: result.filename,
            complete: true
          });
        } catch (dbError) {
          console.error("Database error during update:", dbError);
          return res.status(500).send({
            message: `Database error: ${dbError.message}`
          });
        }
      } else {
        console.log(`Failed to merge chunks: ${result.message}`);
        return res.status(202).send({
          message: result.message || "Failed to merge chunks",
          progress: (parseInt(chunkId) + 1) / parseInt(totalChunks)
        });
      }
    } else {
      // Not the last chunk, just acknowledge receipt
      return res.status(202).send({
        message: `Chunk ${parseInt(chunkId) + 1} of ${totalChunks} received`,
        progress: (parseInt(chunkId) + 1) / parseInt(totalChunks)
      });
    }
  } catch (err) {
    console.error('Chunk Upload Error:', err);
    
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({
          message: `Chunk size exceeds the limit`
        });
      }
      return res.status(400).send({
        message: `Upload error: ${err.message}`
      });
    }
    
    res.status(500).send({
      message: `Could not upload chunk: ${err.message}`
    });
  }
};

// Update site settings
exports.updateSiteSettings = async (req, res) => {
  try {
    // Check if this is a chunked upload request
    if (req.headers['content-type'] && req.headers['content-type'].includes('chunked-upload')) {
      console.log("Detected chunked upload request, forwarding to uploadChunk handler");
      return exports.uploadChunk(req, res);
    }
    
    // Regular (non-chunked) upload process
    await new Promise((resolve, reject) => {
      uploadSiteMiddleware(req, res, (err) => {
        if (err) {
          // Handle Multer-specific errors
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return reject(new Error(`File too large. Maximum size for images is 10MB, for videos is 50MB. Error on: ${err.field}`));
            }
            return reject(new Error(`Upload error: ${err.message}`));
          }
          // Handle other errors
          return reject(err);
        }
        resolve();
      });
    });
    
    // Manually validate file sizes after multer has processed them
    if (req.files) {
      const validateFileSize = (file, fieldName) => {
        const isVideo = file.mimetype.startsWith('video/');
        const maxSize = isVideo ? maxSizeVideo : maxSizeImage;
        
        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024);
          throw new Error(`File ${file.originalname} (${fieldName}) exceeds the maximum size of ${maxSizeMB}MB`);
        }
      };
      
      // Check each file field
      ['logo', 'icon', 'background'].forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName].length > 0) {
          validateFileSize(req.files[fieldName][0], fieldName);
        }
      });
    }
    
    const uuid = req.params.uuid;
    
    // Get the existing site settings to check for file changes
    const existingSetting = await SiteSetting.findOne({
      where: { uuid: uuid }
    });
    
    if (!existingSetting) {
      return res.status(404).send({
        message: "Site settings not found."
      });
    }

    // Parse JSON data
    const settingsData = JSON.parse(req.body.data);
    
    // Initialize update object with parsed data
    const updateData = {
      name: settingsData.name,
      institusi: settingsData.institusi,
      url: settingsData.url,
      alamat: settingsData.alamat,
      email: settingsData.email,
      telp: settingsData.telp,
      fax: settingsData.fax,
      deskripsi: settingsData.deskripsi,
      format_background: settingsData.format_background,
      coverage_area: settingsData.coverage_area
    };

    // Function to remove old file
    const removeOldFile = (oldFilename) => {
      if (oldFilename) {
        const oldFilePath = __basedir + "/app/resources/static/assets/site/" + oldFilename;
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (unlinkError) {
            console.error(`Error removing old file ${oldFilename}:`, unlinkError);
          }
        }
      }
    };

    // Check and handle logo upload
    if (req.files && req.files.logo && req.files.logo.length > 0) {
      updateData.logo = req.files.logo[0].filename;
      removeOldFile(existingSetting.logo);
    }
    
    // Check and handle icon upload
    if (req.files && req.files.icon && req.files.icon.length > 0) {
      updateData.icon = req.files.icon[0].filename;
      removeOldFile(existingSetting.icon);
    }
    
    // Check and handle background upload (only for regular uploads)
    if (req.files && req.files.background && req.files.background.length > 0) {
      updateData.background = req.files.background[0].filename;
      removeOldFile(existingSetting.background);
    }

    // Update the site settings
    const [num] = await SiteSetting.update(updateData, {
      where: { uuid: uuid }
    });

    if (num !== 1) {
      return res.status(500).send({
        message: "Error updating site settings."
      });
    }

    // Get updated settings to return
    const updatedSettings = await SiteSetting.findOne({
      where: { uuid: uuid },
      attributes: { exclude: ['id', 'uuid'] } 
    });

    res.send(updatedSettings);
  } catch (err) {
    console.error('Update Site Settings Error:', err);
    
    // Specific error handling
    if (err.message.includes('File too large') || err.message.includes('exceeds the maximum size')) {
      return res.status(400).send({
        message: err.message
      });
    }

    res.status(500).send({
      message: `Could not update site settings: ${err.message}`
    });
  }
};

// Get site logo
exports.getLogo = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      attributes: { 
        exclude: ['id', 'uuid'] 
      }
    });
    if (!setting || !setting.logo) {
      return res.status(404).send({
        message: "Logo not found."
      });
    }

    const logoPath = __basedir + "/app/resources/static/assets/site/" + setting.logo;
    
    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      return res.status(404).send({
        message: "Logo file not found on server."
      });
    }
    
    res.sendFile(logoPath);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the logo."
    });
  }
};

// Get site icon
exports.getIcon = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      attributes: { 
        exclude: ['id', 'uuid'] 
      }
    });
    if (!setting || !setting.icon) {
      return res.status(404).send({
        message: "Icon not found."
      });
    }

    const iconPath = __basedir + "/app/resources/static/assets/site/" + setting.icon;
    
    // Check if file exists
    if (!fs.existsSync(iconPath)) {
      return res.status(404).send({
        message: "Icon file not found on server."
      });
    }
    
    res.sendFile(iconPath);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the icon."
    });
  }
};

// Get site background
exports.getBackground = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({
      attributes: { 
        exclude: ['id', 'uuid'] 
      }
    });
    if (!setting || !setting.background) {
      return res.status(404).send({
        message: "Background not found."
      });
    }

    const bgPath = __basedir + "/app/resources/static/assets/site/" + setting.background;
    
    // Check if file exists
    if (!fs.existsSync(bgPath)) {
      return res.status(404).send({
        message: "Background file not found on server."
      });
    }
    
    // For video files, use streaming to reduce memory usage
    const isVideo = setting.format_background === 'video';
    if (isVideo) {
      const stat = fs.statSync(bgPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      if (range) {
        // Handle range requests for video streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(bgPath, { start, end });
        
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4' // Adjust based on actual video type
        };
        
        res.writeHead(206, headers);
        fileStream.pipe(res);
      } else {
        // Send entire file if no range is specified
        const headers = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4', // Adjust based on actual video type
          'Accept-Ranges': 'bytes'
        };
        
        res.writeHead(200, headers);
        fs.createReadStream(bgPath).pipe(res);
      }
    } else {
      // For images, use sendFile
      res.sendFile(bgPath);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the background."
    });
  }
};

// Get public site settings
exports.getPublicSiteSettings = (req, res) => {
  SiteSetting.findOne({
      attributes: { 
        exclude: ['id', 'uuid']
      }
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving site settings."
      });
    });
};