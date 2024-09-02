// src/pages/PostViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PostViewPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  

  return (
    
  )
}

export default PostViewPage;
