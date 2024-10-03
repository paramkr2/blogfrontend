import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, CircularProgress, TextField, Snackbar, Alert } from '@mui/material';
import './styles/Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar control
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, {
        username,
        password,
      });

      const token = response.data.access;
      console.log(token);

      // Store JWT token in localStorage
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      // Redirect to /blog
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      setOpenSnackbar(true); // Open the snackbar when there's an error
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <TextField
              label="Username"
              variant="outlined" // Change input variant
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div className="input-group">
            <TextField
              label="Password"
              type="password"
              variant="outlined" // Change input variant
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading} // Disable button when loading
            sx={{ position: 'relative', marginTop: '16px', height: '48px' }} // Set button height
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>

      {/* Snackbar for showing errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
