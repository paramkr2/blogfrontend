// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/PostEditPage.css'

function PostEditPage() {

  // get post id from params 
  const { postId } = useParams(); // Get postId from URL params
  const [title, setTitle] = useState('');  // New state for title
  const [content, setContent] = useState(`
      <p>Click on the plus button on a new line to see the floating menu</p>
      <p>Select the content to see the bubble menu</p>
      `);
  const navigate = useNavigate();

  const handleSave = () => {
    console.log('Saving Content',content);
    const token = localStorage.getItem('token'); // Get token from local storage
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}`, 
      { title,content },
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
    navigate('/posts/preview', { state: { content } });
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
      <button onClick={handleSave}>Save Post</button>
      <button onClick={handlePreview}>Preview Post</button>
    </div>
  );
}

export default PostEditPage;
