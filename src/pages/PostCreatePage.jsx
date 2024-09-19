// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/PostEditPage.css'

function PostCreatePage() {
  const [title, setTitle] = useState('');  // New state for title
  const [content, setContent] = useState(`
      <p>Click on the plus button on a new line to see the floating menu</p>
      <p>Select the content to see the bubble menu</p>
      `);
  const navigate = useNavigate();

  const handleSavePublish = () => {
    console.log('Saving Content',content);
    const is_published = true 
    const token = localStorage.getItem('token'); // Get token from local storage
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`, 
      { title,content , is_published },
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

  const handleSaveDraft = () => {
    console.log('Saving Draft',content);
    const token = localStorage.getItem('token'); // Get token from local storage
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`, 
      { title,content  },
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

  const handlePreview = () => {
    // Construct the URL with query parameters or any method you prefer
    const previewUrl = `${window.location.origin}/posts/preview?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
    
    // Open the URL in a new tab
    window.open(previewUrl, '_blank');
  };

  return (
    <div className='edit post-content'>
       {/* Input for title */}
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="post-title-input"
      />
      <RichTextEditor onUpdate={setContent} content={content} />
      <button onClick={handleSavePublish}>Save and Publish Post </button>
      <button onClick={handleSaveDraft}> Save as Draft Post </button> 
      <button onClick={handlePreview}>Preview Post</button>
    </div>
  );
}

export default PostCreatePage;
