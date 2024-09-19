// src/pages/PostPreviewPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/PostEditPage.css'; // Reuse the CSS from PostCreatePage for consistent styling

function PostPreviewPage() {
  const query = new URLSearchParams(window.location.search);
  const title = query.get('title') || '';
  const content = query.get('content') || '';

  return (
    <div className="post-detail">
      <h1 className="post-content " >{title}</h1>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}  // Render HTML content safely
      ></div>
    </div>
  );
}

export default PostPreviewPage;
