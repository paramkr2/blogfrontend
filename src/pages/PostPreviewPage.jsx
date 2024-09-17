// src/pages/PostPreviewPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PostEditPage.css'; // Reuse the CSS from PostCreatePage for consistent styling

function PostPreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = location.state || { content: '' };

  return (
    <div className="edit"> {/* Reuse the 'edit' class for styling */}
      <h1>Preview Post</h1>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="button-group">
        <button onClick={() => navigate(-1)}>Back to Edit</button>
      </div>
    </div>
  );
}

export default PostPreviewPage;
