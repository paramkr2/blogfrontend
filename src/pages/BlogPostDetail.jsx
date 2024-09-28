import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, IconButton, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { formatISODate } from '../utils/formatISODate.js';
import { Twitter, Instagram, Facebook, Share } from '@mui/icons-material';

const BlogPostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // State for the share dropdown
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`);
        setPost(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Failed to load post.');
      }
    };

    fetchPostDetails();
  }, [postId]);


  useEffect( ()=>{
    if(post){
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/${post.author}/`);
          setUserDetails(response.data);
          console.log(response.data)
        } catch (err) {
          setError('Failed to load post.');
        }
      };

      fetchUserDetails();
    }
  },[post])

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setAnchorEl(null);
  };

  const openPopup = (url) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    window.open(url, 'Share', `width=${width},height=${height},top=${top},left=${left}`);
    handleCloseShareMenu(); // Close the menu after sharing
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-content">
          <Skeleton variant="text" height={30} width="100%" sx={{ marginBottom: 2 }} />
          <Skeleton variant="text" height={30} width="80%" sx={{ marginBottom: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" height="50vh" width="90%" animation="wave" sx={{ marginBottom: 2 }} />
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
      <h1 className="post-heading">{post.title}</h1>
      <p style={{ marginTop: '-30px', fontSize: '1em', color: 'slategrey' }}>
        {formatISODate(post.created_at)}
      </p>

      {/* User information and social media share icons */}
      <Box sx={{
        borderTop: '1px solid lightgrey',
        borderBottom: '1px solid lightgrey',
        padding: '5px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
        marginBottom: '1em',
      }}>
         
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> 
          {!userDetails ? (
            <Skeleton variant="circular" width={50} height={50} />
          ):(
            <Avatar src={userDetails.image_url} alt={post.user_full_name} sx={{ width: 50, height: 50, marginRight: 1 }} />
          )}

          {!userDetails ? (
            <Skeleton variant="text" width={100} height={20} />
          ):(
            <div style={{ textDecoration: 'none', color: 'black' }}> 
              <span style={{ fontWeight: 'bold' }}>{userDetails.fullname.charAt(0).toUpperCase() + userDetails.fullname.slice(1)}</span>
            </div>
          )}
        </Box>
        
        <Box>
          <IconButton onClick={handleShareClick} sx={{ color: 'grey' }}>
            <Share />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseShareMenu}
            sx={{ display: 'flex' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <MenuItem onClick={() => openPopup(`https://twitter.com/share?url=${window.location.href}`)} sx={{ minWidth: 0 }}>
                <Twitter />
              </MenuItem>
              <MenuItem onClick={() => openPopup(`https://www.instagram.com/?url=${window.location.href}`)} sx={{ minWidth: 0 }}>
                <Instagram />
              </MenuItem>
              <MenuItem onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)} sx={{ minWidth: 0 }}>
                <Facebook />
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Box>

      <div dangerouslySetInnerHTML={{ __html: post.content }} /> {/* Render HTML content safely */}
    </div>
  );
};

export default BlogPostDetail;
