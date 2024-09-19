// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Skeleton, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    // Fetch both published posts and drafts
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts?type=published`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assuming API returns a structure separating drafts and published
        setPublishedPosts(response.data.results || []);
        
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        
      });
      
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts?type=draft`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assuming API returns a structure separating drafts and published
        setDraftPosts(response.data.results || []);
        
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        
      });
      setLoading(false);
  }, []);

  const handleCreateNew = () => {
    navigate('/create'); // Route to create new post page
  };

  const renderPostList = (posts) => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          {[1, 2, 3].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="rectangular" width="100%" height={80} />
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id} className="post-item">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
              }}
            >
              <div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  sx={{ marginLeft: '10px' }}
                >
                  Edit
                </Button>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateNew}
        >
          Create New Post
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Published Posts" />
        <Tab label="Drafts" />
      </Tabs>

      <Box sx={{ marginTop: '20px' }}>
        {tabValue === 0 && renderPostList(publishedPosts)}
        {tabValue === 1 && renderPostList(draftPosts)}
      </Box>
    </Box>
  );
}

export default AdminPage;
