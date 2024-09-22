import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/PostEditPage.css';
import { Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { parse } from 'node-html-parser';

function BlogEditPage() {
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingRevert, setLoadingRevert] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });
  const [isPublished, setIsPublished] = useState(false); // Track if post is published
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`)
      .then((response) => {
        const finalContent = `<h1>${response.data.title}</h1>` + response.data.content;
        setContent(finalContent);
        setIsPublished(response.data.is_published); // Set published status
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setIsLoading(false);
      });
  }, [postId]);

  const extractTitleAndCleanContent = (content) => {
    const parsedContent = parse(content);
    const titleElement = parsedContent.querySelector('h1');
    const title = titleElement ? titleElement.textContent : 'Untitled';

    if (titleElement) {
      titleElement.remove();
    }

    const finalContent = parsedContent.toString();
    return { title, finalContent };
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ open: true, message: 'No authentication token found. Please log in.' });
      return;
    }

    const { title, finalContent } = extractTitleAndCleanContent(content);
    setLoadingSave(true);

    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`,
      { content: finalContent, title },
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
      .then(response => {
        setIsPublished(true); // Update local state
        setNotification({ open: true, message: 'Post saved successfully!' });
        navigate(`/blog/${response.data.id}`);
      })
      .catch(error => {
        console.error('Error saving post:', error);
        setNotification({ open: true, message: 'Failed to save post.' });
      })
      .finally(() => {
        setLoadingSave(false);
      });
  };

  const handleRevertToDraft = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }

    const { title, finalContent } = extractTitleAndCleanContent(content);
    setLoadingRevert(true);

    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`,
      { content: finalContent, is_published: false, title },
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
      .then(response => {
        setIsPublished(false); // Update local state
        setNotification({ open: true, message: 'Post saved as draft successfully!' });
      })
      .catch(error => {
        console.error('Error saving as draft:', error);
        setNotification({ open: true, message: 'Failed to save as draft.' });
      })
      .finally(() => {
        setLoadingRevert(false);
      });
  };

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }
    axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(() => {
        navigate('/admin');
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handlePreview = () => {
    const { title, finalContent } = extractTitleAndCleanContent(content);
    const previewUrl = `${window.location.origin}/posts/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(finalContent)}`;
    window.open(previewUrl, '_blank');
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box className='edit post-content' sx={{ padding: '20px' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <RichTextEditor onUpdate={setContent} content={content} />
          <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              startIcon={loadingSave ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loadingSave}
            >
              {loadingSave ? 'Saving...' : 'Save Post'}
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleRevertToDraft}
              startIcon={loadingRevert ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loadingRevert}
            >
              {loadingRevert ? 'Saving as Draft...' : isPublished ? 'Revert to Draft' : 'Save as Draft'}
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
          <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={handleCloseNotification}
          >
            <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}

export default BlogEditPage;
