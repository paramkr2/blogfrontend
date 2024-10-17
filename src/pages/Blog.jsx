import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Box, Grid, Card, CardContent, CardMedia, Typography, Pagination, Skeleton,Avatar } from '@mui/material';
import tradingImage  from './trading_default.jpg';
import './styles/Blog.css';

import {formatISODate} from '../utils/formatISODate.js';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchBlogPosts = async (page = 1) => {
    setLoading(true); 
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/?type=published&pageno=${page}`
      );
      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
      setLoading(false); // Set loading to false once data is fetched
      console.log('posts published in blog mange page', response.data)
    } catch (err) {
      setPosts(hardcodedPosts());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="blog-page">
      <Grid container spacing={4}>
        {loading ? (
          // Skeleton loading while waiting for posts
          Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={12} md={12} key={index}>
              <Card sx={{ display: { xs: 'block', md: 'flex' }, height: '100%' }}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ width: { xs: '100%', md: '40%' }, objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} sx={{ width:'50%'}} />
                  <Skeleton variant="text" height={20} sx={{ width:'70%'}} />
                  <Skeleton variant="text" height={20} sx={{ width:'50%'}} />
                  <Skeleton variant="text" height={20} sx={{ width:'90%'}} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          posts.map((post) => (
            <Grid item xs={12} md={12} key={post.id}>
              <Link to={`/blog/${post.slug}--${post.id}`} style={{ textDecoration: 'none' }}>
                <Card sx={{ display: { xs: 'block', md: 'flex' } }}>
                  <CardMedia
                    component="img"
                    height="240px"
                    image={post.image || tradingImage}
                    alt="post image"
                    sx={{ width: { xs: '100%', md: '40%' }, objectFit: 'cover' }}
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '200px', // Match height to CardMedia
                    }}
                  >
                    <Typography variant="h6" 
                       sx={{
                          fontWeight: 'bold', 
                          color: 'black' ,
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal',
                          paddingBottom:'0.8em',
                          lineHeight:1,
                        }}
                      >
                      {post.title}
                     </Typography>

                    {/* Author image, fullname, and date row */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Push date to the right
                        paddingBottom: '0.5em',
                        paddingTop: '0.5em'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={post.author_image_url}
                          alt={post.author_fullname}
                          sx={{ width: 24, height: 24, marginRight: '8px' }}
                        />
                        <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold' }}>
                          {post.author_fullname}
                        </Typography>
                      </Box>

                      <Typography variant="caption" sx={{ color: 'black' }}>
                        {formatISODate(post.created_at)}
                      </Typography>
                    </Box>
                    {/* Wrapping HTML content in a div */}
                    <div
                      style={{
                        position: 'relative',
                        height: '200px', // Adjust the height to match the text area
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: post.truncated_content }}
                        style={{
                          height: '100%',
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%)', // Thicker fade effect
                maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0) 100%)',
                        }}
                      />
                    </div>
                     
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </div>
    </div>
  );
};

export default Blog;
