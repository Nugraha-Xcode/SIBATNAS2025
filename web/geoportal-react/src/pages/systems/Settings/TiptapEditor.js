import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import YouTube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Tooltip
} from '@mui/material';

// Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TitleIcon from '@mui/icons-material/Title';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ImageIcon from '@mui/icons-material/Image';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

const TiptapEditor = ({ content, onChange }) => {
  const fileInputRef = useRef(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Konfigurasikan ekstensi bawaan
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      YouTube.configure({
        width: 640,
        height: 480,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Konversi file ke base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handler untuk upload gambar
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Batasi ukuran file (misalnya 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran gambar maksimal 5MB');
          return;
        }

        // Konversi ke base64
        const base64Image = await fileToBase64(file);
        
        // Tambahkan gambar ke editor
        if (editor) {
          editor.chain().focus().setImage({ src: base64Image }).run();
        }
      } catch (error) {
        console.error('Gagal memproses gambar:', error);
        alert('Gagal mengunggah gambar');
      }
    }
  };

  // Handler untuk menambah link
  const handleAddLink = () => {
    if (editor) {
      // Jika tidak ada teks yang dipilih, batalkan
      if (!editor.state.selection.empty) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
        setLinkDialogOpen(false);
        setLinkUrl('');
      } else {
        alert('Pilih teks terlebih dahulu sebelum menambah link');
      }
    }
  };

  // Handler untuk embed video
  const handleEmbedVideo = () => {
    if (editor) {
      // Cek apakah URL YouTube valid
      const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
      if (!youtubeRegex.test(videoUrl)) {
        alert('Harap masukkan URL YouTube yang valid');
        return;
      }

      // Ekstrak ID video dari berbagai format URL YouTube
      let videoId;
      const urlObj = new URL(videoUrl);
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      } else if (urlObj.searchParams.get('v')) {
        videoId = urlObj.searchParams.get('v');
      } else {
        alert('Tidak dapat menemukan ID video YouTube');
        return;
      }

      // Tambahkan video YouTube ke editor
      editor.chain().focus().setYoutubeVideo({ 
        src: `https://www.youtube.com/embed/${videoId}` 
      }).run();

      // Tutup dialog
      setVideoDialogOpen(false);
      setVideoUrl('');
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          marginBottom: 2 
        }}
      >
        {/* Formatting Buttons */}
        <Tooltip title="Bold">
          <Button
            size="small"
            variant={editor.isActive('bold') ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Italic">
          <Button
            size="small"
            variant={editor.isActive('italic') ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Heading 1">
          <Button
            size="small"
            variant={editor.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <TitleIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Paragraph">
          <Button
            size="small"
            variant={editor.isActive('paragraph') ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <TextFieldsIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Bullet List">
          <Button
            size="small"
            variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Numbered List">
          <Button
            size="small"
            variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </Button>
        </Tooltip>

        {/* Alignment Buttons */}
        <Tooltip title="Rata Kiri">
          <Button
            size="small"
            variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <FormatAlignLeftIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Rata Tengah">
          <Button
            size="small"
            variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <FormatAlignCenterIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Rata Kanan">
          <Button
            size="small"
            variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <FormatAlignRightIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Justify">
          <Button
            size="small"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'contained' : 'outlined'}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <FormatAlignJustifyIcon />
          </Button>
        </Tooltip>

        {/* Media Buttons */}
        <Tooltip title="Unggah Gambar">
          <Button
            size="small"
            variant="outlined"
            onClick={() => fileInputRef.current.click()}
          >
            <ImageIcon />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Tooltip>

        <Tooltip title="Embed Video YouTube">
          <Button
            size="small"
            variant="outlined"
            onClick={() => setVideoDialogOpen(true)}
          >
            <YouTubeIcon />
          </Button>
        </Tooltip>

        <Tooltip title="Tambah Link">
          <Button
            size="small"
            variant="outlined"
            onClick={() => setLinkDialogOpen(true)}
          >
            <LinkIcon />
          </Button>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        style={{ 
          border: '1px solid #ccc', 
          minHeight: '200px', 
          padding: '10px' 
        }} 
      />

      {/* Dialog untuk menambah link */}
      <Dialog 
        open={linkDialogOpen} 
        onClose={() => setLinkDialogOpen(false)}
      >
        <DialogTitle>Tambah Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            fullWidth
            variant="standard"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Batal</Button>
          <Button onClick={handleAddLink}>Tambah</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog untuk embed video YouTube */}
      <Dialog 
        open={videoDialogOpen} 
        onClose={() => setVideoDialogOpen(false)}
      >
        <DialogTitle>Embed Video YouTube</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL YouTube"
            fullWidth
            variant="standard"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Masukkan URL lengkap video YouTube
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Batal</Button>
          <Button onClick={handleEmbedVideo}>Embed</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TiptapEditor;