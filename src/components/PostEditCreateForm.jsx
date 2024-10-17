import React, { useState } from 'react';
import { Box, Button, CircularProgress, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RichTextEditor from '../components/Editor/RichTextEditor.jsx';
import { parse } from 'node-html-parser';

const PostForm = ({ initialContent, onSubmit, onDelete, isPublished }) => {
  const [content, setContent] = useState(initialContent || '<h1></h1><p></p>');
  const [loadingPublish, setLoadingPublish] = useState(false); // Separate loading state for Publish
  const [loadingDraft, setLoadingDraft] = useState(false); // Separate loading state for Draft
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const extractTitleAndCleanContent = (content) => {
    const parsedContent = parse(content);
    const titleElement = parsedContent.querySelector('h1');
    const title = titleElement ? titleElement.textContent : 'Untitled';
    if (titleElement) titleElement.remove();
    return { title, finalContent: parsedContent.toString() };
  };

  const handleError = (error) => {
    let errorMessage = 'An unexpected error occurred.';
    let severity = 'error'; // Default to error severity

    // Check if the error response contains validation errors
    if (error.response) {
        const { data } = error.response;
        
        // Handle title-specific error
        if (data.title) {
            errorMessage = `Title Error: ${data.title.join(', ')}`;
        } else {
            // For unexpected errors, log the entire object
            errorMessage = 'Unexpected error: ' + JSON.stringify(data, null, 2);
        }
    }

    // Update the notification state with the error message and severity
    setNotification({ open: true, message: errorMessage, severity });
  };

  const handleSave = (isDraft) => {
    const { title, finalContent } = extractTitleAndCleanContent(content);

    if (isDraft) {
      setLoadingDraft(true); // Set loading state for Draft
    } else {
      setLoadingPublish(true); // Set loading state for Publish
    }

    onSubmit(title, finalContent, isDraft)
      .then(() => {
        setNotification({ open: true, message: isDraft ? 'Draft saved successfully!' : 'Post published successfully!', severity: 'success' });
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        if (isDraft) {
          setLoadingDraft(false); // Reset loading state for Draft
        } else {
          setLoadingPublish(false); // Reset loading state for Publish
        }
      });
  };

  const handleCloseNotification = () => setNotification({ open: false });

  return (
    <Box className="edit post-content">
      <RichTextEditor onUpdate={setContent} content={content} />

      <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Save and Publish Button */}
        <Button
          onClick={() => handleSave(false)}
          startIcon={loadingPublish ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loadingPublish}
          sx={{ '&:hover': { color: 'green', backgroundColor: '#E3FCE3' } }}
        >
          {loadingPublish ? 'Saving...' : 'Save and Publish'}
        </Button>

        {/* Save as Draft Button */}
        <Button
          onClick={() => handleSave(true)}
          startIcon={loadingDraft ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loadingDraft}
          sx={{ '&:hover': { color: 'orange', backgroundColor: '#FFFAE1' } }}
        >
          {loadingDraft ? 'Saving as Draft...' : (isPublished ? 'Revert to Draft' : 'Save as Draft')}
          
        </Button>

        <Tooltip title="Preview Post">
          <IconButton color="info" onClick={() => window.open(`/posts/preview?title=${title}&content=${content}`, '_blank')} sx={{ '&:hover': { color: 'blue' } }}>
            <PreviewIcon />
          </IconButton>
        </Tooltip>

        {onDelete && (
          <Tooltip title="Delete Post">
            <IconButton color="error" onClick={onDelete} sx={{ '&:hover': { color: 'red' } }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostForm;
