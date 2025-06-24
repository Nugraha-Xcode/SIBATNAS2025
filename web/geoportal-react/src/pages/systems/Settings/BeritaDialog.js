import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBerita, deleteBerita, updateBerita } from "src/redux/actions/berita";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Article,
  Visibility,
  Edit,
  Save,
  Cancel,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  FormatSize,
  Undo,
  Redo
} from "@mui/icons-material";
import swal from "sweetalert";
import { blue, green, orange } from "@mui/material/colors";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FriendlyTextEditor = ({ content, onChange, placeholder }) => {
  const [value, setValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageData, setImageData] = useState({}); // Store image data separately

  useEffect(() => {
    if (content !== undefined && content !== null) {
      const userFriendlyContent = htmlToUserFriendly(content);
      setValue(userFriendlyContent);

      // Extract existing images from content to imageData
      const existingImages = {};
      const imageMatches = content.match(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g);
      if (imageMatches) {
        imageMatches.forEach((match, index) => {
          const srcMatch = match.match(/src="([^"]*)"/);
          const altMatch = match.match(/alt="([^"]*)"/);
          if (srcMatch && altMatch) {
            const imageId = `existing_img_${index}`;
            existingImages[imageId] = {
              base64: srcMatch[1],
              filename: altMatch[1]
            };
          }
        });
        setImageData(existingImages);
      } else {
        setImageData({});
      }
    } else {
      setValue('');
      setImageData({});
    }
  }, [content]);

  // Convert HTML ke format yang user-friendly untuk editing
  const htmlToUserFriendly = (html) => {
    if (!html) return '';

    let text = html
      // Extract image info first
      .replace(/<div[^>]*style="text-align: center[^>]*>[\s\S]*?<img[^>]*alt="([^"]*)"[\s\S]*?<\/div>/gi, '[IMG: $1]')

      // Hapus tag div wrapper dulu
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')

      // Convert heading
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')

      // Convert formatting
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')

      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

      // Convert lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')

      // Convert paragraphs and breaks
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')

      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return text;
  };

  // Convert format user-friendly kembali ke HTML
  const userFriendlyToHtml = (text) => {
    if (!text.trim()) return '<br>'; // Handle empty content

    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle empty lines
      if (trimmedLine === '') {
        if (index < lines.length - 1) { // Don't add trailing <br>
          html += '<br>';
        }
        return;
      }

      // Headers
      if (trimmedLine.startsWith('### ')) {
        html += `<h3>${trimmedLine.substring(4)}</h3>`;
      } else if (trimmedLine.startsWith('## ')) {
        html += `<h2>${trimmedLine.substring(3)}</h2>`;
      } else if (trimmedLine.startsWith('# ')) {
        html += `<h1>${trimmedLine.substring(2)}</h1>`;
      }
      // Lists
      else if (trimmedLine.startsWith('• ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${trimmedLine.substring(2)}</li>`;
      }
      // Regular text
      else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }

        let processedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<u>$1</u>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

        // JANGAN replace [IMG] placeholder di sini - biarkan untuk processing nanti
        html += processedLine;
      }

      // Add line break except after last line
      if (index < lines.length - 1) {
        html += '<br>';
      }
    });

    // Close any open list
    if (inList) {
      html += '</ul>';
    }

    return html;
  };

  const getPreviewHtml = () => {
    let html = userFriendlyToHtml(value);

    console.log('Preview Debug - Original HTML:', html);
    console.log('Preview Debug - Image Data:', imageData);
    console.log('Preview Debug - Current Value:', value);

    // Replace SEMUA placeholder gambar dengan gambar yang sesuai
    if (Object.keys(imageData).length > 0) {
      Object.keys(imageData).forEach(imageId => {
        const data = imageData[imageId];
        const placeholder = `[IMG: ${data.filename}]`;

        console.log('Looking for placeholder:', placeholder);

        if (html.includes(placeholder)) {
          // Escape special characters in filename untuk regex
          const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // Gunakan replace dengan function untuk mengganti satu per satu
          let replacementCount = 0;
          html = html.replace(new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g'), (match) => {
            replacementCount++;
            const imageHtml = `<img src="${data.base64}" alt="${data.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px; margin: 2px; display: inline-block; vertical-align: top;" />`;
            console.log(`Replaced placeholder ${replacementCount} for:`, data.filename);
            return imageHtml;
          });
        }
      });
    }

    // Handle layout untuk multiple images per baris
    const lines = html.split('<br>');
    html = lines.map(line => {
      // Hitung jumlah tag img dalam line ini
      const imageMatches = line.match(/<img[^>]*>/g);
      const imageCount = imageMatches ? imageMatches.length : 0;

      if (imageCount >= 1) {
        // Jika ada gambar, wrap dalam container dan adjust width
        if (imageCount === 1) {
          // Single image - center alignment
          line = `<div style="text-align: center; margin: 16px 0;">${line}</div>`;
        } else if (imageCount > 1) {
          // Multiple images - adjust width berdasarkan jumlah
          let imageWidth = '48%';
          if (imageCount === 3) imageWidth = '32%';
          else if (imageCount >= 4) imageWidth = '23%';

          // Update width semua images di line ini
          line = line.replace(
            /style="([^"]*?)"/g,
            (match, styles) => {
              // Remove existing width dan add new width
              let newStyles = styles.replace(/width:[^;]*;?/gi, '').trim();
              if (newStyles && !newStyles.endsWith(';')) newStyles += ';';
              newStyles = `width: ${imageWidth}; max-width: ${imageWidth}; ${newStyles}`;
              return `style="${newStyles}"`;
            }
          );

          line = `<div style="text-align: center; margin: 16px 0; display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">${line}</div>`;
        }
      }

      return line;
    }).join('<br>');

    console.log('Final Preview HTML:', html);
    return html || '<em style="color: #999;">Belum ada konten...</em>';
  };

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);

    console.log('Text Change Debug - New value:', newValue);
    console.log('Text Change Debug - Current imageData:', imageData);

    let htmlContent = userFriendlyToHtml(newValue);

    console.log('Text Change Debug - HTML before image replacement:', htmlContent);

    if (Object.keys(imageData).length > 0) {
      Object.keys(imageData).forEach(imageId => {
        const data = imageData[imageId];
        const placeholder = `[IMG: ${data.filename}]`;

        if (htmlContent.includes(placeholder)) {
          const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g');

          // Untuk final output, gunakan div wrapper
          const imageHtml = `<div style="text-align: center; margin: 16px 0;"><img src="${data.base64}" alt="${data.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px;" /></div>`;

          htmlContent = htmlContent.replace(regex, imageHtml);
          console.log('Text Change Debug - Replaced placeholder for:', data.filename);
        }
      });
    }

    console.log('Text Change Debug - Final HTML:', htmlContent);
    onChange(htmlContent);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Fungsi untuk menyisipkan format dengan shortcut
  const insertFormat = (formatType) => {
    const textarea = document.getElementById('friendly-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let replacement = '';

    switch (formatType) {
      case 'bold':
        replacement = selectedText ? `**${selectedText}**` : '**teks tebal**';
        break;
      case 'italic':
        replacement = selectedText ? `*${selectedText}*` : '*teks miring*';
        break;
      case 'underline':
        replacement = selectedText ? `_${selectedText}_` : '_teks bergaris bawah_';
        break;
      case 'h1':
        replacement = selectedText ? `# ${selectedText}` : '# Judul Besar';
        break;
      case 'h2':
        replacement = selectedText ? `## ${selectedText}` : '## Judul Sedang';
        break;
      case 'h3':
        replacement = selectedText ? `### ${selectedText}` : '### Judul Kecil';
        break;
      case 'bullet':
        replacement = selectedText ? `• ${selectedText}` : '• Item daftar';
        break;
      case 'link':
        const url = prompt('Masukkan URL link:');
        if (url) {
          replacement = selectedText ? `[${selectedText}](${url})` : `[teks link](${url})`;
        } else {
          return;
        }
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);

    // Convert ke HTML dan kirim ke parent dengan SEMUA gambar
    let htmlContent = userFriendlyToHtml(newValue);

    // Replace SEMUA image placeholders yang ada
    Object.keys(imageData).forEach(imageId => {
      const data = imageData[imageId];
      const placeholder = `[IMG: ${data.filename}]`;

      if (htmlContent.includes(placeholder)) {
        const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g');

        // Handle multiple images dalam satu baris
        const lines = htmlContent.split('<br>');
        htmlContent = lines.map(line => {
          if (line.includes(placeholder)) {
            const imageCount = (line.match(/\[IMG: [^\]]+\]/g) || []).length;
            let processedLine = line;

            Object.keys(imageData).forEach(id => {
              const imgData = imageData[id];
              const imgPlaceholder = `[IMG: ${imgData.filename}]`;
              if (processedLine.includes(imgPlaceholder)) {
                let imageWidth = '100%';
                if (imageCount === 2) imageWidth = '48%';
                else if (imageCount === 3) imageWidth = '32%';
                else if (imageCount >= 4) imageWidth = '23%';

                const imageHtml = `<img src="${imgData.base64}" alt="${imgData.filename}" style="width: ${imageWidth}; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px; margin: 2px; display: inline-block; vertical-align: top;" />`;
                processedLine = processedLine.replace(new RegExp(`\\[IMG: ${imgData.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g'), imageHtml);
              }
            });

            if (processedLine.includes('<img')) {
              processedLine = `<div style="text-align: center; margin: 16px 0;">${processedLine}</div>`;
            }

            return processedLine;
          }
          return line;
        }).join('<br>');
      }
    });

    onChange(htmlContent);

    // Set cursor position
    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        const cursorPos = start + replacement.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
      textarea.focus();
    }, 0);
  };

  // Upload gambar
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi
    if (!file.type.startsWith('image/')) {
      swal("Error", "Hanya file gambar yang diperbolehkan!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      swal("Error", "Ukuran gambar tidak boleh lebih dari 2MB!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const filename = file.name;

      console.log('Upload Debug - File name:', filename);
      console.log('Upload Debug - Image ID:', imageId);
      console.log('Upload Debug - Base64 length:', base64String.length);

      // Update imageData dengan ID unik
      const newImageData = {
        ...imageData,
        [imageId]: {
          base64: base64String,
          filename: filename,
          id: imageId
        }
      };
      setImageData(newImageData);

      console.log('Upload Debug - New imageData:', newImageData);

      const textarea = document.getElementById('friendly-editor');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert placeholder di posisi cursor
        const placeholder = `[IMG: ${filename}]`;
        const newValue = value.substring(0, start) + placeholder + value.substring(end);

        console.log('Upload Debug - New value with placeholder:', newValue);

        setValue(newValue);

        // Convert ke HTML untuk output final dengan semua gambar yang ada
        let htmlContent = userFriendlyToHtml(newValue);

        // Replace SEMUA placeholder dengan gambar yang sesuai
        Object.keys(newImageData).forEach(imgId => {
          const imgData = newImageData[imgId];
          const imgPlaceholder = `[IMG: ${imgData.filename}]`;

          if (htmlContent.includes(imgPlaceholder)) {
            const escapedFilename = imgData.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g');
            const imageHtml = `<div style="text-align: center; margin: 16px 0;"><img src="${imgData.base64}" alt="${imgData.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px;" /></div>`;
            htmlContent = htmlContent.replace(regex, imageHtml);
            console.log('Upload Debug - Replaced placeholder for:', imgData.filename);
          }
        });

        onChange(htmlContent);

        // Set cursor position
        setTimeout(() => {
          const newCursorPos = start + placeholder.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }, 0);
      }

      setUploadingImage(false);
      event.target.value = '';

      swal("Berhasil!", "Gambar berhasil ditambahkan!", "success", {
        buttons: false,
        timer: 1500,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit color="primary" />
          {showPreview ? 'Preview Artikel' : 'Tulis Artikel'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={showPreview ? <Edit /> : <Visibility />}
          onClick={togglePreview}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </Box>

      {showPreview ? (
        <Card variant="outlined" sx={{ minHeight: 300 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Preview Artikel
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <div
              dangerouslySetInnerHTML={{
                __html: getPreviewHtml()
              }}
              style={{ lineHeight: 1.6 }}
            />
          </CardContent>
        </Card>
      ) : (
        <Box>
          {/* Toolbar Sederhana */}
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 1,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              backgroundColor: '#f8f9fa',
              borderRadius: 2
            }}
          >
            <Tooltip title="Teks Tebal (ketik **teks**)">
              <IconButton size="small" onClick={() => insertFormat('bold')}>
                <FormatBold />
              </IconButton>
            </Tooltip>

            <Tooltip title="Teks Miring (ketik *teks*)">
              <IconButton size="small" onClick={() => insertFormat('italic')}>
                <FormatItalic />
              </IconButton>
            </Tooltip>

            <Tooltip title="Garis Bawah (ketik _teks_)">
              <IconButton size="small" onClick={() => insertFormat('underline')}>
                <FormatUnderlined />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Judul Besar (ketik # teks)">
              <Button size="small" onClick={() => insertFormat('h1')} sx={{ minWidth: 'auto' }}>
                H1
              </Button>
            </Tooltip>

            <Tooltip title="Judul Sedang (ketik ## teks)">
              <Button size="small" onClick={() => insertFormat('h2')} sx={{ minWidth: 'auto' }}>
                H2
              </Button>
            </Tooltip>

            <Tooltip title="Judul Kecil (ketik ### teks)">
              <Button size="small" onClick={() => insertFormat('h3')} sx={{ minWidth: 'auto' }}>
                H3
              </Button>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Daftar Poin (ketik • teks)">
              <IconButton size="small" onClick={() => insertFormat('bullet')}>
                <FormatListBulleted />
              </IconButton>
            </Tooltip>

            <Tooltip title="Tambah Link">
              <IconButton size="small" onClick={() => insertFormat('link')}>
                <Link />
              </IconButton>
            </Tooltip>

            <Tooltip title="Upload Gambar">
              <IconButton
                size="small"
                onClick={() => document.getElementById('image-upload-friendly').click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <CircularProgress size={20} /> : <Image />}
              </IconButton>
            </Tooltip>

            <input
              id="image-upload-friendly"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </Paper>

          {/* Text Area */}
          <TextField
            id="friendly-editor"
            multiline
            rows={15}
            fullWidth
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder || `Mulai menulis artikel Anda di sini...

Tips menulis:
• Tekan Enter untuk baris baru
• Ketik **teks** untuk membuat teks tebal
• Ketik *teks* untuk membuat teks miring  
• Ketik # Judul untuk membuat judul besar
• Ketik • untuk membuat daftar poin
• Upload gambar akan muncul di posisi cursor
• Bisa upload beberapa gambar dalam 1 baris untuk gallery

Contoh:
# Judul Artikel Saya
Ini adalah baris pertama artikel.
**Teks ini akan tebal** dan *teks ini akan miring*.

Upload gambar di baris ini akan muncul di sini.
Gambar akan otomatis menyesuaikan ukuran jika ada beberapa dalam 1 baris.

## Sub Judul
Berikut adalah daftar:
• Poin pertama
• Poin kedua  
• Poin ketiga

Di baris ini bisa ada gambar juga jika dibutuhkan.`}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                lineHeight: 1.6,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }
            }}
          />

          {/* Quick Tips */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Tips Cepat:</strong> Tekan <kbd>Enter</kbd> untuk baris baru. Upload gambar di posisi cursor.
              Multiple gambar dalam 1 baris akan otomatis menyesuaikan ukuran.
              Format: <code>**tebal**</code>, <code>*miring*</code>, <code># Judul</code>
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

// Komponen Upload Gambar yang disederhanakan
const SimpleImageUpload = ({ previewImage, onFileChange, onRemove, disabled }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files: [files[0]] }
      };
      onFileChange(fakeEvent);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoCamera color="primary" />
          Gambar Utama Berita
        </Typography>

        {previewImage ? (
          <Box>
            <Box
              component="img"
              src={previewImage.startsWith('data:') ? previewImage : `${process.env.REACT_APP_API_URL || ''}${previewImage}`}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2
              }}
            />
            <Chip label="Gambar sudah dipilih" color="success" />
          </Box>
        ) : (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragOver ? '#1976d2' : '#ccc'}`,
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: dragOver ? '#f0f8ff' : '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => document.getElementById('main-image-upload').click()}
          >
            <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              Klik atau seret gambar ke sini
            </Typography>
            <Typography variant="body2" color="text.secondary">
              JPG, PNG, GIF (Maksimal 5MB)
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <input
          id="main-image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
          disabled={disabled}
        />

        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => document.getElementById('main-image-upload').click()}
          disabled={disabled}
        >
          {previewImage ? 'Ganti Gambar' : 'Pilih Gambar'}
        </Button>

        {previewImage && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={onRemove}
            disabled={disabled}
          >
            Hapus
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

function BeritaDialog(props) {
  const { onClose, open, config } = props;
  const initialDataState = {
    judul: "",
    konten: "",
    kategori: "",
    gambar: null,
    uuid: ""
  };
  const [data, setData] = useState(initialDataState);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Kategori yang disederhanakan
  const kategoriOptions = [
    "Berita Utama",
    "Batimetri Nasional",
    "Pemetaan Dasar Laut",
    "Survey Hidrografi",
    "Teknologi Geospasial",
    "Penelitian Kelautan",
    "Pelatihan",
    "Kerjasama",
    "Inovasi",
    "Pengumuman"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!data.judul.trim()) {
      newErrors.judul = "Judul berita harus diisi";
    } else if (data.judul.length < 10) {
      newErrors.judul = "Judul minimal 10 karakter";
    }

    if (!data.kategori) {
      newErrors.kategori = "Pilih kategori berita";
    }

    if (config.mode !== "delete" && !data.konten.trim()) {
      newErrors.konten = "Konten berita harus diisi";
    } else if (config.mode !== "delete" && data.konten.length < 50) {
      newErrors.konten = "Konten minimal 50 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        swal("Error", "Hanya file gambar yang diperbolehkan!", "error", {
          buttons: false,
          timer: 2000,
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        swal("Error", "Ukuran file tidak boleh lebih dari 5MB!", "error", {
          buttons: false,
          timer: 2000,
        });
        return;
      }

      setData({ ...data, gambar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setData({ ...data, gambar: null });
    setPreviewImage(null);
    const fileInput = document.getElementById("main-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleEditorChange = (htmlContent) => {
    setData({ ...data, konten: htmlContent });

    if (errors.konten) {
      setErrors({ ...errors, konten: '' });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (config && config.data) {
      setData(config.data);
      if (config.data.gambar) {
        if (typeof config.data.gambar === 'string') {
          setPreviewImage(config.data.gambar);
        }
      }
    } else {
      setData(initialDataState);
      setPreviewImage(null);
    }
    setErrors({});
  }, [config]);

  const save = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      swal("Error", "Mohon lengkapi semua data yang diperlukan!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("konten", data.konten);
    formData.append("kategori", data.kategori);

    if (data.gambar && data.gambar instanceof File) {
      formData.append("gambar", data.gambar);
    }

    dispatch(createBerita(formData))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Berita berhasil disimpan!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
        setPreviewImage(null);
        setErrors({});
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage = e.response?.data?.message || "Terjadi kesalahan tidak diketahui.";
        console.error("Error creating berita:", e);
        swal("Gagal", errorMessage, "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const updateContent = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      swal("Error", "Mohon lengkapi semua data yang diperlukan!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("konten", data.konten);
    formData.append("kategori", data.kategori);

    if (data.gambar instanceof File) {
      formData.append("gambar", data.gambar);
    } else if (typeof data.gambar === 'string') {
      formData.append("gambar", data.gambar);
    }

    dispatch(updateBerita(data.uuid, formData))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Berita berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
        setPreviewImage(null);
        setErrors({});
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        console.error("Error updating berita:", e);
        swal("Error", e.response?.data?.message || "Terjadi kesalahan!", "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const removeData = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(deleteBerita(data.uuid))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Berita berhasil dihapus!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
        setPreviewImage(null);
        setErrors({});
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        swal("Error", e.response?.data?.message || "Terjadi kesalahan!", "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const getDialogTitle = () => {
    switch (config.mode) {
      case 'add':
        return 'Buat Berita Baru';
      case 'edit':
        return 'Edit Berita';
      case 'delete':
        return 'Hapus Berita';
      default:
        return 'Berita';
    }
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      maxWidth="lg"
      fullWidth
      scroll="paper"
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: config.mode === 'delete' ? '#fff3e0' : '#f8f9fa'
      }}>
        <Article color={config.mode === 'delete' ? 'error' : 'primary'} />
        {getDialogTitle()}
        {config.mode !== 'delete' && (
          <Chip
            label={config.mode === 'add' ? 'Baru' : 'Edit'}
            size="small"
            color={config.mode === 'add' ? 'success' : 'primary'}
            sx={{ ml: 'auto' }}
          />
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {config.mode !== "delete" ? (
          <Stack spacing={3}>
            {/* Info Helper */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                {config.mode === 'add'
                  ? 'Isi form di bawah untuk membuat berita baru. Semua field yang bertanda * wajib diisi.'
                  : 'Edit informasi berita. Perubahan akan tersimpan setelah menekan tombol "Perbarui".'
                }
              </Typography>
            </Alert>

            {/* Judul */}
            <TextField
              required
              fullWidth
              label="Judul Berita"
              name="judul"
              value={data.judul}
              onChange={handleInputChange}
              autoFocus
              error={!!errors.judul}
              helperText={errors.judul || `${data.judul.length} karakter (minimal 10)`}
              placeholder="Contoh: Peluncuran Program Batimetri Nasional 2024"
              InputProps={{
                startAdornment: <Article sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            {/* Kategori */}
            <FormControl fullWidth required error={!!errors.kategori}>
              <InputLabel>Kategori Berita</InputLabel>
              <Select
                name="kategori"
                value={data.kategori}
                label="Kategori Berita"
                onChange={handleInputChange}
              >
                {kategoriOptions.map((kategori) => (
                  <MenuItem key={kategori} value={kategori}>
                    {kategori}
                  </MenuItem>
                ))}
              </Select>
              {errors.kategori && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.kategori}
                </Typography>
              )}
            </FormControl>

            {/* Upload Gambar */}
            <SimpleImageUpload
              previewImage={previewImage}
              onFileChange={handleFileChange}
              onRemove={handleRemoveImage}
              disabled={loading}
            />

            {/* Editor Konten */}
            <Box>
              <FriendlyTextEditor
                content={data.konten}
                onChange={handleEditorChange}
                placeholder="Mulai menulis berita Anda..."
              />
              {errors.konten && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.konten}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {data.konten.length} karakter (minimal 50)
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Konfirmasi Penghapusan
            </Typography>
            <Typography gutterBottom>
              Apakah Anda yakin ingin menghapus berita <strong>"{data.judul}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1, backgroundColor: '#fafafa' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          startIcon={<Cancel />}
          size="large"
        >
          Batal
        </Button>

        {config.mode === "add" ? (
          <Button
            onClick={save}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            size="large"
            color="success"
          >
            {loading ? 'Menyimpan...' : 'Simpan Berita'}
          </Button>
        ) : config.mode === "edit" ? (
          <Button
            onClick={updateContent}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            size="large"
          >
            {loading ? 'Memperbarui...' : 'Perbarui Berita'}
          </Button>
        ) : (
          <Button
            onClick={removeData}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
            size="large"
          >
            {loading ? 'Menghapus...' : 'Hapus Berita'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

BeritaDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default BeritaDialog;