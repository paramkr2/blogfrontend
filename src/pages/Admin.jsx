import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Skeleton, Grid, Pagination , Typography , Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon , Edit as EditIcon } from '@mui/icons-material';
import PostList from '../components/PostList.jsx'; 

function AdminPage() {
  const { isLoggedIn , setIsLoggedIn} = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishedPage, setPublishedPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateNew = () => {
    navigate('/create'); // Route to create new post page
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');

    navigate('/login');
  };

  const refreshPostList = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts?type=published&pagno=${publishedPage}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setPublishedPosts(response.data.results || []);
        setPublishedCount(response.data.count || 0);
      })
      .catch((error) => {
        console.error('Error fetching published posts:', error);
      });

    // Fetch draft posts
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts?type=draft&pagno=${draftPage}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setDraftPosts(response.data.results || []);
        setDraftCount(response.data.count || 0);
      })
      .catch((error) => {
        console.error('Error fetching draft posts:', error);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    refreshPostList();
    // Fetch published posts
  }, [publishedPage, draftPage]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePublishedPageChange = (event, value) => {
    setPublishedPage(value);
  };

  const handleDraftPageChange = (event, value) => {
    setDraftPage(value);
  };

  const handleDelete = (postId) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }

      axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(() => {
          // Trigger a refresh of the data
          //setRefreshData(prev => !prev); // Toggle to trigger useEffect
          refreshPostList();
        })
        .catch(error => console.error('Error deleting post:', error));
    };


  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <Button variant="contained" color="success" onClick={handleCreateNew} sx={{ marginRight: '10px' }}>
            Create New Post
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Box>

    <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label="Published Posts" />
      <Tab label="Drafts" />
    </Tabs>

    <Box sx={{ marginTop: '20px' }}>
      {tabValue === 0 && (
        <>
          <PostList 
            posts={publishedPosts} 
            loading={loading} 
            onEdit={(id) => navigate(`/blog/${id}/edit`)} 
            onDelete={handleDelete} 
            onPreview={(id) => navigate(`/blog/${id}`)} 
          />
          <Pagination
            count={Math.ceil(publishedCount / 5)} 
            page={publishedPage}
            onChange={handlePublishedPageChange}
            sx={{ marginTop: '20px' }}
          />
        </>
      )}
      {tabValue === 1 && (
        <>
          <PostList 
            posts={draftPosts} 
            loading={loading} 
            onEdit={(id) => navigate(`/blog/${id}/edit`)} 
            onDelete={handleDelete} 
            onPreview={(id) => navigate(`/blog/${id}`)} 
          />
          <Pagination
            count={Math.ceil(draftCount / 5)} 
            page={draftPage}
            onChange={handleDraftPageChange}
            sx={{ marginTop: '20px' }}
          />
        </>
      )}
    </Box>
  </Box>
);
}

export default AdminPage;
