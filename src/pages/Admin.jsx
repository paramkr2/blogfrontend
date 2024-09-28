import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button, Skeleton, Grid, Pagination , Typography , Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { Save as SaveIcon, Delete as DeleteIcon, Preview as PreviewIcon , Edit as EditIcon , Logout as LogoutIcon, AccountBox as AccountBoxIcon } from '@mui/icons-material';

import PostList from '../components/PostList.jsx'; 
import EditProfile from '../components/EditProfile.jsx';

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
  const [deletingId, setDeletingId] = useState(0);

  // edit profile buttons
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const handleProfileModalOpen = () => {
    setProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const handleProfileUpdate = () => {
    // Optional: handle any action after the profile is updated
    console.log('Profile updated');
  };


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

  const refreshPostList = async () => {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts?type=published&pageno=${publishedPage}`, 
        {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },}
      );

      if (response.data && response.data.results) {
        setPublishedPosts(response.data.results || []);
        setPublishedCount(response.data.count || 0);
      } else {
        console.error('Failed to fetch published posts:', response.data);
      }

      response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts?type=draft&pageno=${draftPage}`, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data && response.data.results) {
        setDraftPosts(response.data.results || []);
        setDraftCount(response.data.count || 0);
      } else {
        console.error('Failed to fetch draft posts:', response.data);
      }

    } catch (error) {
      console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      console.log('API requests completed.');
    }
  };

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
      setDeletingId(Number(postId));
      axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(async () => {
          await refreshPostList(postId);
        })
        .catch(error => console.error('Error deleting post:', error))
        .finally( ()=> {
          setDeletingId(0);
        })
    };


  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <Button 
            onClick={handleProfileModalOpen} 
            startIcon={<AccountBoxIcon />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: 'transparent',
                color: 'blue',
                '&:hover': {
                  color: 'black', // Change to your preferred hover color
                  backgroundColor: 'transparent',
                },
              }}
          >
            Profile
          </Button>
          <Button
              onClick={handleCreateNew}
              startIcon={<EditIcon />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: 'transparent',
                color: 'green',
                '&:hover': {
                  color: 'black', // Change to your preferred hover color
                  backgroundColor: 'transparent',
                },
              }}
            >
           Create New 
          </Button>
          <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon/>}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: 'transparent',
                color: 'red',
                '&:hover': {
                  color: 'black', // Change to your preferred hover color
                  backgroundColor: 'transparent',
                },
              }}
            >
           logout
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
            deletingId={deletingId} // Pass the deleting state
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
            deletingId={deletingId}
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

    <EditProfile
        open={profileModalOpen}
        handleClose={handleProfileModalClose}
        onProfileUpdate={handleProfileUpdate}
      />
  </Box>
);
}

export default AdminPage;
