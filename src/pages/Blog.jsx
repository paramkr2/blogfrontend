import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid, Paper, Typography , Pagination  } from '@mui/material';
import './styles/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0);  // Track total pages


  const fetchBlogPosts = async (page = 1) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/?pageno=${page}`, // Send the page number as a query parameter
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        }
      );
      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5)); // Calculate total pages (assuming 10 posts per page)
    } catch (err) {
      console.error("API call failed:", err);
      setError('Failed to fetch posts from API');
      setPosts(hardcodedPosts()); 
    }
  };

  const hardcodedPosts = () => {
    return [
      {
        id: 1,
        title: 'Understanding React Lifecycle',
        truncated_content: 'React Lifecycle methods explained in detail...',
        image: 'path_to_image1.jpg' // Placeholder image paths
      },
      {
        id: 2,
        title: 'Introduction to Tailwind CSS',
        truncated_content: 'Tailwind CSS is a utility-first CSS framework...',
        image: 'path_to_image2.jpg'
      },
      // Add more posts as needed
    ];
  };

  useEffect(() => {
    fetchBlogPosts(currentPage); // Fetch posts when the component mounts or page changes
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };
  return (
    <div className="blog-page">
      <h1>Latest Blog Posts</h1>
      {error && <p className="error">{error}</p>}
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
            <Paper elevation={0} style={{ marginBottom: '20px', padding: '16px' }}>
              <Grid container spacing={4}> {/* Increased spacing between columns */}
                <Grid item xs={5} style={{padding:'16px'}}> {/* Adjusted width for better balance */}
                  <div style={{ height: '15em', overflow: 'hidden' }}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  </div>
                </Grid>
                <Grid item xs={7} style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                  <Typography variant="h4" gutterBottom>{post.title}</Typography>
                  <Typography variant="body2" style={{  marginBottom: '12px' }}>{post.updated_at}</Typography>
                  <Typography variant="body1" style={{ height: '7em', overflow: 'hidden', lineHeight: '1.5' }}>
                    {post.truncated_content}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Link>
        ))}
      </div>
      {/* Pagination controls using MUI Pagination */}
      <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages} // Total number of pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          color="primary" // Optionally, use primary or secondary color
          shape="rounded" // Rounded shape for pagination
        />
      </div>
    </div>
);




};

export default Blog;
