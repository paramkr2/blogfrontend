import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/PostEditPage.css';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material'; // Import MUI icons
import { parse } from 'node-html-parser'; // Import node-html-parser for content parsing

function BlogEditPage() {
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post data on mount
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`)
      .then((response) => {
        const finalContent = `<h1> ${response.data.title} </h1>` + response.data.content;
        setContent(finalContent); 
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

    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, 
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
    const { title, finalContent } = extractTitleAndCleanContent(content);
    const previewUrl = `${window.location.origin}/posts/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(finalContent)}`;
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
            />
              
          </Box>
        </>
      )}
    </Box>
  );
}

export default BlogEditPage;
