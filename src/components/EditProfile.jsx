import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton, Avatar, Skeleton } from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { Edit as EditIcon } from '@mui/icons-material';

import axios from 'axios';

const EditProfile = ({ open, handleClose, onProfileUpdate }) => {
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // To handle loading state for profile data

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { fullname, image_url } = response.data;
        setFullName(fullname || '');
        setImagePreview(image_url || '');
      } catch (error) {
        console.error('Error fetching profile data:', error.response ? error.response.data : error.message);
      } finally {
        setLoadingData(false); // Set loading to false after fetching
      }
    };
    fetchProfileData();
  }, []);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile)); // Preview the image locally
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare form data for the update request
      const formData = new FormData();
      formData.append('full_name', fullName);
      if (image) {
        formData.append('image', image); // Add the raw image
      }

      // Send full name and image to update the profile
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile/`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          maxWidth:'70%',
          bgcolor: 'rgba(255, 255, 255, 0.8)', // Translucent background
          boxShadow: 24,
          p: 4,
          borderRadius: '10px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Circular Image Preview or Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 , position: 'relative' }}>
            {loadingData ? (
              <Skeleton variant="circular" width={100} height={100} />
            ) : (
            <>
            <Avatar src={imagePreview} alt="Profile Image" sx={{ width: 100, height: 100 }} />
              <Button
                component="label"
                sx={{
                  mb: 1,
                  backgroundColor: 'transparent',
                  color: 'green',
                  '&:hover': {
                    color: 'black',
                    backgroundColor: 'transparent',
                  },
                  position:'absolute',
                  right:0,
                  bottom:0,
                }}
              >
                <EditIcon/>
                <input type="file" hidden onChange={handleImageChange} /> 
              </Button>
          </>
          )}
        </Box>
        { loadingData ? (
          <Skeleton variant="rectangular" width="100%" height={40} />
          ):(
          <TextField
          fullWidth
          label="Full Name"
          value={fullName}
          onChange={handleFullNameChange}
          sx={{ mb: 2 }}
        /> )}
        
        
          
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{
            backgroundColor: 'transparent',
            color: 'green',
            '&:hover': {
              color: 'black',
              backgroundColor: 'transparent',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Modal>
  );
};

export default EditProfile;
