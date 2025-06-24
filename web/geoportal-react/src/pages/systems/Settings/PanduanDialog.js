import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPanduan, deletePanduan, updatePanduan } from "src/redux/actions/panduan";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  MenuBook,
  Edit,
  Delete,
  Visibility,
  Save,
  Cancel,
  Assignment,
  ListAlt,
  CheckCircle,
  RadioButtonUnchecked,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  Link,
  Image,
  Code,
  Warning,
  Lightbulb
} from "@mui/icons-material";
import swal from "sweetalert";
import { blue, green, orange } from "@mui/material/colors";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Komponen Editor User-Friendly untuk Panduan
const UserFriendlyPanduanEditor = ({ content, onChange, placeholder }) => {
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
      .replace(/<div[^>]*class="image-container"[^>]*>[\s\S]*?<img[^>]*alt="([^"]*)"[\s\S]*?<\/div>/gi, '[IMG: $1]')
      .replace(/<div[^>]*style="text-align: center[^>]*>[\s\S]*?<img[^>]*alt="([^"]*)"[\s\S]*?<\/div>/gi, '[IMG: $1]')

      // Special panduan elements
      .replace(/<div[^>]*class="step"[^>]*><h4>(.*?):<\/h4><p>(.*?)<\/p><\/div>/gi, '📋 LANGKAH: $1\n$2\n')
      .replace(/<div[^>]*class="warning"[^>]*><strong>⚠️ Perhatian:<\/strong>\s*(.*?)<\/div>/gi, '⚠️ PERHATIAN: $1\n')
      .replace(/<div[^>]*class="tip"[^>]*><strong>💡 Tips:<\/strong>\s*(.*?)<\/div>/gi, '💡 TIPS: $1\n')

      // Hapus tag div wrapper dulu
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')

      // Convert heading
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')

      // Convert formatting
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

      // Convert lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')

      // Convert horizontal rule
      .replace(/<hr\s*\/?>/gi, '---\n')

      // Convert paragraphs and breaks
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
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
    if (!text.trim()) return '<br>';

    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle empty lines - always add <br> for empty lines
      if (trimmedLine === '') {
        html += '<br>';
        return;
      }

      // Special panduan elements
      if (trimmedLine.startsWith('📋 LANGKAH: ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const stepTitle = trimmedLine.substring(12);
        // Cari baris berikutnya untuk deskripsi
        let nextLineIndex = index + 1;
        let stepDescription = '';
        while (nextLineIndex < lines.length && lines[nextLineIndex].trim() && 
               !lines[nextLineIndex].startsWith('📋 LANGKAH:') &&
               !lines[nextLineIndex].startsWith('⚠️ PERHATIAN:') &&
               !lines[nextLineIndex].startsWith('💡 TIPS:') &&
               !lines[nextLineIndex].startsWith('#')) {
          stepDescription += (stepDescription ? ' ' : '') + lines[nextLineIndex].trim();
          nextLineIndex++;
        }
        html += `<div class="step" style="border: 1px solid #e0e0e0; padding: 16px; margin: 12px 0; border-radius: 8px; background: #f9f9f9;"><h4 style="margin: 0 0 8px 0; color: #1976d2;">📋 ${stepTitle}:</h4><p style="margin: 0;">${stepDescription}</p></div>`;
        return;
      }

      if (trimmedLine.startsWith('⚠️ PERHATIAN: ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const warningText = trimmedLine.substring(15);
        html += `<div class="warning" style="border: 1px solid #ff9800; padding: 12px; margin: 12px 0; border-radius: 8px; background: #fff3e0;"><strong style="color: #e65100;">⚠️ Perhatian:</strong> ${warningText}</div>`;
        return;
      }

      if (trimmedLine.startsWith('💡 TIPS: ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const tipText = trimmedLine.substring(9);
        html += `<div class="tip" style="border: 1px solid #4caf50; padding: 12px; margin: 12px 0; border-radius: 8px; background: #e8f5e8;"><strong style="color: #2e7d32;">💡 Tips:</strong> ${tipText}</div>`;
        return;
      }

      // Horizontal rule
      if (trimmedLine === '---') {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />';
        return;
      }

      // Headers
      if (trimmedLine.startsWith('#### ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h4 style="color: #333; margin: 16px 0 8px 0;">${trimmedLine.substring(5)}</h4>`;
      } else if (trimmedLine.startsWith('### ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h3 style="color: #333; margin: 18px 0 10px 0;">${trimmedLine.substring(4)}</h3>`;
      } else if (trimmedLine.startsWith('## ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h2 style="color: #333; margin: 20px 0 12px 0;">${trimmedLine.substring(3)}</h2>`;
      } else if (trimmedLine.startsWith('# ')) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<h1 style="color: #333; margin: 24px 0 16px 0;">${trimmedLine.substring(2)}</h1>`;
      }
      // Lists
      else if (trimmedLine.startsWith('• ')) {
        if (!inList) {
          html += '<ul style="margin: 12px 0; padding-left: 24px;">';
          inList = true;
        }
        let listContent = trimmedLine.substring(2);
        // Process formatting dalam list item
        listContent = listContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*?)_/g, '<u>$1</u>')
          .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #1976d2;">$1</a>');
        html += `<li style="margin: 4px 0;">${listContent}</li>`;
      }
      // Regular text atau baris dengan placeholder gambar
      else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }

        // Cek apakah baris ini hanya berisi placeholder gambar
        const imageOnlyRegex = /^\[IMG: [^\]]+\](\s+\[IMG: [^\]]+\])*\s*$/;
        if (imageOnlyRegex.test(trimmedLine)) {
          // Baris khusus gambar - jangan wrap dengan <p>
          html += trimmedLine;
        } else {
          // Regular text content
          let processedLine = trimmedLine
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<u>$1</u>')
            .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #1976d2;">$1</a>');

          html += `<p style="margin: 8px 0; line-height: 1.6;">${processedLine}</p>`;
        }
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

    // Replace image placeholders dengan penanganan multiple images
    if (Object.keys(imageData).length > 0) {
      // Process line by line untuk handle multiple images per baris
      const lines = html.split('<br>');
      html = lines.map(line => {
        // Cek apakah line ini berisi placeholder gambar
        const imagePlaceholders = line.match(/\[IMG: [^\]]+\]/g);
        
        if (imagePlaceholders && imagePlaceholders.length > 0) {
          let processedLine = line;
          
          // Hitung jumlah gambar untuk menentukan layout
          const imageCount = imagePlaceholders.length;
          let imageWidth = '100%';
          let containerStyle = 'text-align: center; margin: 16px 0;';
          
          if (imageCount === 2) {
            imageWidth = '48%';
            containerStyle = 'display: flex; gap: 8px; justify-content: center; margin: 16px 0; flex-wrap: wrap;';
          } else if (imageCount === 3) {
            imageWidth = '32%';
            containerStyle = 'display: flex; gap: 8px; justify-content: center; margin: 16px 0; flex-wrap: wrap;';
          } else if (imageCount >= 4) {
            imageWidth = '23%';
            containerStyle = 'display: flex; gap: 8px; justify-content: center; margin: 16px 0; flex-wrap: wrap;';
          }
          
          // Replace setiap placeholder dengan gambar
          Object.keys(imageData).forEach(imageId => {
            const data = imageData[imageId];
            const placeholder = `[IMG: ${data.filename}]`;
            
            if (processedLine.includes(placeholder)) {
              const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const imageHtml = `<img src="${data.base64}" alt="${data.filename}" style="width: ${imageWidth}; max-width: ${imageWidth}; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px; object-fit: cover;" />`;
              processedLine = processedLine.replace(new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g'), imageHtml);
            }
          });
          
          // Wrap dalam container jika ada gambar
          if (processedLine.includes('<img')) {
            processedLine = `<div style="${containerStyle}">${processedLine}</div>`;
          }
          
          return processedLine;
        }
        
        return line;
      }).join('<br>');
    }

    return html || '<em style="color: #999;">Belum ada konten...</em>';
  };

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);

    let htmlContent = userFriendlyToHtml(newValue);

    // Replace image placeholders dengan handling multiple images per baris
    if (Object.keys(imageData).length > 0) {
      // Process line by line untuk handle multiple images
      const lines = htmlContent.split('<br>');
      htmlContent = lines.map(line => {
        // Cek apakah line ini berisi placeholder gambar
        const imagePlaceholders = line.match(/\[IMG: [^\]]+\]/g);
        
        if (imagePlaceholders && imagePlaceholders.length > 0) {
          let processedLine = line;
          
          // Replace setiap placeholder dengan gambar
          Object.keys(imageData).forEach(imageId => {
            const data = imageData[imageId];
            const placeholder = `[IMG: ${data.filename}]`;

            if (processedLine.includes(placeholder)) {
              const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              // Untuk final output, gunakan div wrapper tanpa caption
              const imageHtml = `<div class="image-container" style="text-align: center; margin: 16px 0;"><img src="${data.base64}" alt="${data.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px;" /></div>`;
              processedLine = processedLine.replace(new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g'), imageHtml);
            }
          });
          
          return processedLine;
        }
        
        return line;
      }).join('<br>');
    }

    onChange(htmlContent);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Fungsi untuk menyisipkan format
  const insertFormat = (formatType) => {
    const textarea = document.getElementById('panduan-editor');
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
      case 'code':
        replacement = selectedText ? `\`${selectedText}\`` : '`kode`';
        break;
      case 'h1':
        replacement = selectedText ? `# ${selectedText}` : '# Judul Utama';
        break;
      case 'h2':
        replacement = selectedText ? `## ${selectedText}` : '## Sub Judul';
        break;
      case 'h3':
        replacement = selectedText ? `### ${selectedText}` : '### Judul Bagian';
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
      case 'step':
        replacement = selectedText ? `📋 LANGKAH: ${selectedText}\nDeskripsi langkah di sini...` : '📋 LANGKAH: Nama Langkah\nDeskripsi langkah di sini...';
        break;
      case 'warning':
        replacement = selectedText ? `⚠️ PERHATIAN: ${selectedText}` : '⚠️ PERHATIAN: Pesan peringatan penting';
        break;
      case 'tip':
        replacement = selectedText ? `💡 TIPS: ${selectedText}` : '💡 TIPS: Tips berguna untuk pengguna';
        break;
      case 'separator':
        replacement = '---';
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);

    // Convert to HTML and send to parent
    let htmlContent = userFriendlyToHtml(newValue);

    // Replace image placeholders - handle multiple images per line
    Object.keys(imageData).forEach(imageId => {
      const data = imageData[imageId];
      const placeholder = `[IMG: ${data.filename}]`;
      if (htmlContent.includes(placeholder)) {
        const escapedFilename = data.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const imageHtml = `<div class="image-container" style="text-align: center; margin: 16px 0;"><img src="${data.base64}" alt="${data.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px;" /></div>`;
        htmlContent = htmlContent.replace(new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g'), imageHtml);
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

      // Update imageData
      const newImageData = {
        ...imageData,
        [imageId]: {
          base64: base64String,
          filename: filename,
          id: imageId
        }
      };
      setImageData(newImageData);

      const textarea = document.getElementById('panduan-editor');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const placeholder = `[IMG: ${filename}]`;
        const newValue = value.substring(0, start) + placeholder + value.substring(end);
        setValue(newValue);

        // Convert to HTML
        let htmlContent = userFriendlyToHtml(newValue);

        // Replace all image placeholders
        Object.keys(newImageData).forEach(imgId => {
          const imgData = newImageData[imgId];
          const imgPlaceholder = `[IMG: ${imgData.filename}]`;
          if (htmlContent.includes(imgPlaceholder)) {
            const escapedFilename = imgData.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const imageHtml = `<div class="image-container" style="text-align: center; margin: 16px 0;"><img src="${imgData.base64}" alt="${imgData.filename}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px;" /></div>`;
            htmlContent = htmlContent.replace(new RegExp(`\\[IMG: ${escapedFilename}\\]`, 'g'), imageHtml);
          }
        });

        onChange(htmlContent);

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
          {showPreview ? 'Preview Panduan' : 'Tulis Panduan'}
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
              Preview Panduan
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
          {/* Toolbar untuk Panduan */}
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
            {/* Basic Formatting */}
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

            <Tooltip title="Kode (ketik `kode`)">
              <IconButton size="small" onClick={() => insertFormat('code')}>
                <Code />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            {/* Headers */}
            <Tooltip title="Judul Utama (ketik # teks)">
              <Button size="small" onClick={() => insertFormat('h1')} sx={{ minWidth: 'auto', fontSize: '11px' }}>
                H1
              </Button>
            </Tooltip>

            <Tooltip title="Sub Judul (ketik ## teks)">
              <Button size="small" onClick={() => insertFormat('h2')} sx={{ minWidth: 'auto', fontSize: '11px' }}>
                H2
              </Button>
            </Tooltip>

            <Tooltip title="Judul Bagian (ketik ### teks)">
              <Button size="small" onClick={() => insertFormat('h3')} sx={{ minWidth: 'auto', fontSize: '11px' }}>
                H3
              </Button>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            {/* Lists and Links */}
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
                onClick={() => document.getElementById('panduan-image-upload').click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <CircularProgress size={20} /> : <Image />}
              </IconButton>
            </Tooltip>

            <input
              id="panduan-image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </Paper>

          {/* Special Panduan Elements */}
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              mb: 1,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              backgroundColor: '#e8f4fd',
              borderRadius: 2
            }}
          >
            <Typography variant="caption" sx={{ alignSelf: 'center', fontWeight: 'bold', color: 'primary.main' }}>
              Elemen Panduan:
            </Typography>

            <Tooltip title="Langkah Tutorial">
              <Button
                size="small"
                variant="outlined"
                onClick={() => insertFormat('step')}
                startIcon={<Assignment />}
                sx={{ fontSize: '11px' }}
              >
                Langkah
              </Button>
            </Tooltip>

            <Tooltip title="Peringatan Penting">
              <Button
                size="small"
                variant="outlined"
                onClick={() => insertFormat('warning')}
                startIcon={<Warning />}
                sx={{ fontSize: '11px' }}
                color="warning"
              >
                Peringatan
              </Button>
            </Tooltip>

            <Tooltip title="Tips Berguna">
              <Button
                size="small"
                variant="outlined"
                onClick={() => insertFormat('tip')}
                startIcon={<Lightbulb />}
                sx={{ fontSize: '11px' }}
                color="success"
              >
                Tips
              </Button>
            </Tooltip>

            <Tooltip title="Garis Pembatas">
              <Button
                size="small"
                variant="outlined"
                onClick={() => insertFormat('separator')}
                sx={{ fontSize: '11px' }}
              >
                ───
              </Button>
            </Tooltip>
          </Paper>

          {/* Text Area */}
          <TextField
            id="panduan-editor"
            multiline
            rows={15}
            fullWidth
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder || `Mulai menulis panduan Anda di sini...

Tips menulis panduan:
• Gunakan judul untuk membagi bagian (# ## ###)
• Buat langkah-langkah dengan tombol "Langkah" 
• Tambahkan peringatan untuk hal penting
• Sisipkan tips untuk membantu pengguna
• Upload gambar di posisi yang tepat
• Gunakan format **tebal**, *miring*, dan \`kode\`

Contoh struktur:
# Panduan Menggunakan Sistem

## Persiapan
📋 LANGKAH: Login ke Sistem
Buka halaman login dan masukkan username serta password

⚠️ PERHATIAN: Pastikan koneksi internet stabil

## Langkah Utama
📋 LANGKAH: Akses Menu Utama
Klik menu "Dashboard" pada sidebar kiri

💡 TIPS: Gunakan shortcut Ctrl+D untuk akses cepat

---

Upload gambar akan muncul di posisi cursor. 
Untuk multiple gambar dalam 1 baris, upload beberapa gambar berturut-turut tanpa menekan Enter.`}
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
              <strong>Format Cepat:</strong> <code>**tebal**</code>, <code>*miring*</code>, <code># Judul</code>, <code>• Daftar</code>, <code>📋 LANGKAH:</code>, <code>⚠️ PERHATIAN:</code>, <code>💡 TIPS:</code>
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

function PanduanDialog(props) {
  const { onClose, open, config } = props;
  const initialDataState = {
    title: "",
    content: "",
    order: 0,
    is_active: true,
    uuid: ""
  };
  const [data, setData] = useState(initialDataState);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!data.title.trim()) {
      newErrors.title = "Judul panduan harus diisi";
    } else if (data.title.length < 5) {
      newErrors.title = "Judul minimal 5 karakter";
    }
    
    if (config.mode !== "delete" && !data.content.trim()) {
      newErrors.content = "Konten panduan harus diisi";
    } else if (config.mode !== "delete" && data.content.length < 20) {
      newErrors.content = "Konten minimal 20 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setData({ ...data, [name]: newValue });
    
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleEditorChange = (htmlContent) => {
    setData({ ...data, content: htmlContent });
    
    // Clear error saat user mulai mengetik
    if (errors.content) {
      setErrors({ ...errors, content: '' });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (config && config.data) {
      setData(config.data);
    } else {
      setData(initialDataState);
    }
    setErrors({});
  }, [config]);

  const save = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      swal("Error", "Mohon periksa kembali form Anda!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    setLoading(true);
    dispatch(createPanduan(data))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Panduan berhasil disimpan!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
        setErrors({});
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        const errorMessage = e.response?.data?.message || "Terjadi kesalahan tidak diketahui.";
        console.error("Error creating panduan:", e);
        swal("Gagal", errorMessage, "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const updateContent = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      swal("Error", "Mohon periksa kembali form Anda!", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }

    setLoading(true);
    dispatch(updatePanduan(data.uuid, data))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Panduan berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
        setErrors({});
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        console.error("Error updating panduan:", e);
        swal("Error", e.response?.data?.message || "Terjadi kesalahan!", "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const removeData = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(deletePanduan(data.uuid))
      .then(() => {
        setLoading(false);
        swal("Berhasil!", "Panduan berhasil dihapus!", "success", {
          buttons: false,
          timer: 2000,
        });
        setData(initialDataState);
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

  const getDialogIcon = () => {
    switch (config.mode) {
      case 'add':
        return <MenuBook sx={{ color: green[500] }} />;
      case 'edit':
        return <Edit sx={{ color: blue[500] }} />;
      case 'delete':
        return <Delete sx={{ color: 'error.main' }} />;
      default:
        return <MenuBook />;
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        {getDialogIcon()}
        {config.title}
        {config.mode !== 'delete' && (
          <Chip 
            label={config.mode === 'add' ? 'Buat Baru' : 'Edit'} 
            size="small" 
            color={config.mode === 'add' ? 'success' : 'primary'}
            sx={{ ml: 'auto' }}
          />
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {config.description && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {config.description}
          </Alert>
        )}

        {config.mode !== "delete" ? (
          <Stack spacing={3}>
            {/* Judul Panduan */}
            <TextField
              required
              fullWidth
              id="title"
              label="Judul Panduan"
              name="title"
              value={data.title}
              onChange={handleInputChange}
              autoFocus
              error={!!errors.title}
              helperText={errors.title || `${data.title.length} karakter (minimal 5)`}
              InputProps={{
                startAdornment: <Assignment sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            {/* Pengaturan Panduan */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ListAlt sx={{ color: 'primary.main' }} />
                  Pengaturan Panduan
                </Typography>
                
                <Stack direction="row" spacing={3} alignItems="center">
                  {/* Urutan */}
                  <FormControl sx={{ minWidth: 120 }} error={!!errors.order}>
                    <InputLabel>Urutan</InputLabel>
                    <Select
                      name="order"
                      value={data.order}
                      label="Urutan"
                      onChange={handleInputChange}
                    >
                      {[...Array(20)].map((_, i) => (
                        <MenuItem key={i} value={i}>
                          {i === 0 ? 'Tidak Ada Urutan' : `Urutan ${i}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Status Aktif */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.is_active}
                        onChange={handleInputChange}
                        name="is_active"
                        color="success"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {data.is_active ? (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: 'text.secondary', fontSize: 20 }} />
                        )}
                        <Typography>
                          {data.is_active ? 'Panduan Aktif' : 'Panduan Nonaktif'}
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Urutan menentukan posisi panduan dalam daftar. Panduan nonaktif tidak akan ditampilkan kepada pengguna.
                </Typography>
              </CardContent>
            </Card>

            {/* Editor Konten User-Friendly */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Edit sx={{ color: 'primary.main' }} />
                Konten Panduan *
              </Typography>
              <UserFriendlyPanduanEditor
                content={data.content}
                onChange={handleEditorChange}
                placeholder="Mulai menulis panduan Anda..."
              />
              {errors.content && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.content}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {data.content.length} karakter (minimal 20)
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Konfirmasi Penghapusan
            </Typography>
            <Typography>
              Apakah Anda yakin ingin menghapus panduan <strong>"{data.title}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
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
            {loading ? 'Menyimpan...' : 'Simpan Panduan'}
          </Button>
        ) : config.mode === "edit" ? (
          <Button
            onClick={updateContent}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            size="large"
          >
            {loading ? 'Memperbarui...' : 'Perbarui Panduan'}
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
            {loading ? 'Menghapus...' : 'Hapus Panduan'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

PanduanDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default PanduanDialog;