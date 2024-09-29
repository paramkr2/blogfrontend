import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Grid, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';


const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact-us/`, formData);  // Adjust API URL if necessary
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {success ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(211, 211, 211, 0.5)',
            padding: '2rem',
            borderRadius: '10px',
          }}
        >
          <CheckCircleOutline sx={{ fontSize: 60, color: 'green' }} />
          <Typography variant="h5" gutterBottom sx={{ marginTop: '1rem', color: 'green' }}>
            Your message has been submitted successfully!
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            We'd love to hear from you. Please use the form below to email us, and we will respond within 24 hours.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: 'transparent',
                  border: '1px solid',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  },
                }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default ContactForm;
