import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/PostEditPage.css';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material'; // Import MUI icons

function BlogEditPage() {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`)
      .then((response) => {
        console.log(response.data.content);
        setTitle(response.data.title);
        setContent(response.data.content);
        setIsLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setIsLoading(false); // Handle error case
      });
  }, [postId]);

  const handleSavePublish = () => {
    const is_published = true;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }
    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`,
      { title, content, is_published },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        navigate(`/posts/${response.data.id}/view`);
      })
      .catch(error => console.error('Error saving post:', error));
  };

  const handleSaveDraft = () => {
    const is_published = false;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }
    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`,
      { title, content, is_published },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        navigate(`/posts/${response.data.id}/view`);
      })
      .catch(error => console.error('Error saving draft:', error));
  };

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }
    axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        navigate('/admin');
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handlePreview = () => {
    const previewUrl = `${window.location.origin}/posts/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <Box className='edit post-content' sx={{ padding: '20px' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TextField
            label="Post Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <RichTextEditor onUpdate={setContent} content={content} />
          <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleSavePublish}
              startIcon={<SaveIcon />}
            >
              Save and Publish Post
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveDraft}
              startIcon={<SaveIcon />}
            >
              Save as Draft Post
            </Button>
            <Button 
              variant="outlined" 
              color="info" 
              onClick={handlePreview}
              startIcon={<PreviewIcon />}
            >
              Preview Post
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
            >
              Delete Post
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default BlogEditPage;
