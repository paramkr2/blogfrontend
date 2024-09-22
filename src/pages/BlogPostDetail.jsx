import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '@mui/material';

const BlogPostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`);
        console.log(response.data);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post.');
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return (
      <div className="post-detail">
      <div className="post-content">
        <Skeleton variant="text" height={40} width="100%" sx={{ marginBottom: 2 }} />
        
        {/* Center the image skeleton */}
        <div style={{ display: 'flex', justifyContent: 'center'  }}>
          <Skeleton variant="rectangular" height="60vh" width="90%" animation="wave" sx={{ marginBottom: 2 }} />
        </div>
        
        {/* Text skeletons */}
        <Skeleton variant="text" height={20} width="100%" animation="wave" />
        <Skeleton variant="text" height={20}  width="90%" animation="wave" />
        <Skeleton variant="text" height={20}  width="80%" animation="wave" />
        <Skeleton variant="text" height={20} width="80%" animation="wave" />
        <Skeleton variant="text" height={20} width="90%" animation="wave" />
        <Skeleton variant="text" height={20}  width="100%" animation="wave" />
      </div>
    </div>

    );
  }

  return (
    <div className="post-detail">
      <h1 className="post-content post-heading">{post.title}</h1>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}  // Render HTML content safely
      ></div>
    </div>
  );
};

export default BlogPostDetail;
