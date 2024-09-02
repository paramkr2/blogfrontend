// src/pages/PostPreviewPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PostPreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = location.state || { content: '' };

  return (
    <div>
      <h1>Preview Post</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <button onClick={() => navigate(-1)}>Back to Edit</button>
    </div>
  );
}

export default PostPreviewPage;
