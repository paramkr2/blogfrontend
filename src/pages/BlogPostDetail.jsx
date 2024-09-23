import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import { formatISODate } from '../utils/formatISODate.js';
import { Twitter, Instagram, Facebook } from '@mui/icons-material';
import { IconButton, Box } from '@mui/material';

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

  const openPopup = (url) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    window.open(url, 'Share', `width=${width},height=${height},top=${top},left=${left}`);
  };
  
  if (error) {
    return <div>{error}</div>;
  }



  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-content">
          <Skeleton variant="text" height={40} width="100%" sx={{ marginBottom: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" height="60vh" width="90%" animation="wave" sx={{ marginBottom: 2 }} />
          </div>
          <Skeleton variant="text" height={20} width="100%" animation="wave" />
          <Skeleton variant="text" height={20} width="90%" animation="wave" />
          <Skeleton variant="text" height={20} width="80%" animation="wave" />
          <Skeleton variant="text" height={20} width="80%" animation="wave" />
          <Skeleton variant="text" height={20} width="90%" animation="wave" />
          <Skeleton variant="text" height={20} width="100%" animation="wave" />
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail editor-box post-content">
      <h1 className=" post-heading">{post.title}</h1>
      <p  style={{ marginTop: '-30px', fontSize: '1em', color: 'slategrey' }}>
        {formatISODate(post.created_at)}
      </p>

      {/* Social media share icons */}
      <Box sx={{ 
        borderTop: '1px solid lightgrey', 
        borderBottom: '1px solid lightgrey', 
        padding: '5px 0', 
        display: 'flex', 
        justifyContent: 'right' ,
        maxWidth:'100%',
      }}>
        <IconButton sx={{ color: 'grey' }} onClick={() => openPopup(`https://twitter.com/share?url=${window.location.href}`, '_blank')}>
          <Twitter />
        </IconButton>
        <IconButton sx={{ color: 'grey' }} onClick={() => openPopup(`https://www.instagram.com/?url=${window.location.href}`, '_blank')}>
          <Instagram />
        </IconButton>
        <IconButton sx={{ color: 'grey' }} onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
          <Facebook />
        </IconButton>
      </Box>

      <div
        
        dangerouslySetInnerHTML={{ __html: post.content }}  // Render HTML content safely
      ></div>
    </div>
  );
};

export default BlogPostDetail;
