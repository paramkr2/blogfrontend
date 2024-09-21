import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/PostEditPage.css';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material'; // Import MUI icons
import { parse } from 'node-html-parser'; // Import node-html-parser for content parsing

function PostCreatePage() {
  const [content, setContent] = useState(`
      <h1></h1>
      <p></p>
  `);
  const navigate = useNavigate();

  // Utility function to extract title and clean content
  const extractTitleAndCleanContent = (content) => {
    const parsedContent = parse(content);
    const titleElement = parsedContent.querySelector('h1');
    const title = titleElement ? titleElement.textContent : 'Untitled';

    // Remove the title (h1 tag) from the content
    if (titleElement) {
      titleElement.remove(); // Modify the parsed HTML by removing the h1 tag
    }

    // Get the final content without the h1 tag
    const finalContent = parsedContent.toString();

    return { title, finalContent };
  };

  const handleSave = (isPublished = false) => {
    
    const token = localStorage.getItem('token'); // Get token from local storage
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    // Extract title and final content
    const { title, finalContent } = extractTitleAndCleanContent(content);

    axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`, 
      { content: finalContent, is_published: isPublished, title },
      {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      })
      .then(response => {
        navigate(`/posts/${response.data.id}/view`);
      })
      .catch(error => console.error('Error creating post:', error));
  };

  const handleSavePublish = () => {
    handleSave(true);  // Save and publish the post
  };

  const handleSaveDraft = () => {
    handleSave(false);  // Save as draft
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
          
        </Box>
    </Box>
  );
}

export default PostCreatePage;
