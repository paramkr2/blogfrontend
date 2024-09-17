// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PostEditPage.css'

function PostCreatePage() {
  const [content, setContent] = useState(`
      <h1>Welcome to CrytoGull</h1>
      <p>Click on the plus button on a new line to see the floating menu</p>
      <p>Select the content to see the bubble menu</p>
      `);
  const navigate = useNavigate();

  const handleSave = () => {
    console.log('Saving Content',content);
    axios.post('/api/posts/', { content })
      .then(response => {
        navigate(`/posts/${response.data.id}/view`);
      })
      .catch(error => console.error('Error creating post:', error));
  };

  const handlePreview = () => {
    navigate('/posts/preview', { state: { content } });
  };

  return (
    <div className='edit post-content'>
      <h1>Create Post</h1>
      <RichTextEditor onUpdate={setContent} content={content} />
      <button onClick={handleSave}>Save Post</button>
       <button onClick={handlePreview}>Preview Post</button>
    </div>
  );
}

export default PostCreatePage;
