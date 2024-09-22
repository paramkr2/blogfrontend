import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/PostEditPage.css';
import { Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { parse } from 'node-html-parser';

function PostCreatePage() {
  const [content, setContent] = useState('<h1></h1><p></p>');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });
  const [isSaved, setIsSaved] = useState(true); // Track if content is saved
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isSaved) {
        event.preventDefault();
        event.returnValue = 'Changes not saved, and will be lost!';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSaved]);

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

  const handleSaveDraft = () => {
    setLoadingDraft(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingDraft(false);
      setNotification({ open: true, message: 'No authentication token found. Please log in.' });
      return;
    }

    const { title, finalContent } = extractTitleAndCleanContent(content);

    axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`,
      { content: finalContent, is_published: false, title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        setLoadingDraft(false);
        setNotification({ open: true, message: 'Draft saved successfully!' });
        navigate(`/blog/${response.data.id}/edit`);
        setIsSaved(true); // Mark content as saved
      })
      .catch((error) => {
        setLoadingDraft(false);
        console.error('Error saving draft:', error);
        setNotification({ open: true, message: 'Failed to save draft.' });
      });
  };

  // Update isSaved state when content changes
  useEffect(() => {
    setIsSaved(false);
  }, [content]);

  const handleSavePublish = () => {
    setLoadingPublish(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingPublish(false);
      setNotification({ open: true, message: 'No authentication token found. Please log in.' });
      return;
    }

    const { title, finalContent } = extractTitleAndCleanContent(content);

    axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`,
      { content: finalContent, is_published: true, title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((response) => {
        setLoadingPublish(false);
        console.log(response.data);
        navigate(`/blog/${response.data.id}`);
        setIsSaved(true); // Mark content as saved
      })
      .catch((error) => {
        setLoadingPublish(false);
        console.error('Error publishing post:', error);
        setNotification({ open: true, message: 'Failed to publish post.' });
      });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  const handlePreview = () => {
    const { title, finalContent } = extractTitleAndCleanContent(content);
    const previewUrl = `${window.location.origin}/posts/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(finalContent)}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <Box className='edit post-content' sx={{ padding: '20px' }}>
      <RichTextEditor onUpdate={setContent} content={content} />
      
      <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSavePublish}
          startIcon={loadingPublish ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loadingPublish}  // Disable the button while loading
        >
          {loadingPublish ? 'Saving...' : 'Save and Publish Post'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDraft}
          startIcon={loadingDraft ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loadingDraft}  // Disable the button while loading
        >
          {loadingDraft ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={handlePreview}
          startIcon={<PreviewIcon />}
        >
          Preview Post
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PostCreatePage;
