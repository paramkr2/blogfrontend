import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, CardMedia, Typography, Pagination, Skeleton } from '@mui/material';
import tradingImage  from './trading_default.jpg';
import './styles/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchBlogPosts = async (page = 1) => {
    setLoading(true); // Set loading to true while fetching
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/?type=published&pageno=${page}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
      setLoading(false); // Set loading to false once data is fetched
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
              <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                <Card sx={{ display: { xs: 'block', md: 'flex' }, height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image || tradingImage}
                    alt={'image'}
                    sx={{ width: { xs: '100%', md: '40%' }, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h5">{post.title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: { xs: 5, md: 3 },
                        marginTop: '10px',
                      }}
                    >
                      {post.truncated_content}
                    </Typography>
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
