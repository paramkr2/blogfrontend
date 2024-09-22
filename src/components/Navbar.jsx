import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const scrollToSection = (id) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
    setDrawerOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, [setIsLoggedIn]);

  return (
    <AppBar 
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        color:'black',
      }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CryptoGull
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleDrawer(true)}
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick={() => handleMenuItemClick('/')}>Home</Button>
          <Button color="inherit" onClick={() => handleMenuItemClick('/Blog')}>Blog</Button>
          <Button color="inherit" onClick={() => scrollToSection('servies')}>Servies</Button>
          <Button color="inherit" onClick={() => scrollToSection('contact')}>Contact</Button>
          {isLoggedIn && <Button color="inherit" onClick={() => handleMenuItemClick('/admin')}>Admin</Button>}
          {!isLoggedIn && <Button color="inherit" onClick={() => handleMenuItemClick('/login')}>Login</Button>}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: '250px', bgcolor: 'background.paper' }}>
          <ListItem button onClick={() => handleMenuItemClick('/')}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/Blog')}>
            <ListItemText primary="Blog" />
          </ListItem>
          <ListItem button onClick={() => { scrollToSection('servies'); }}>
            <ListItemText primary="Servies" />
          </ListItem>
          <ListItem button onClick={() => { scrollToSection('contact'); }}>
            <ListItemText primary="Contact" />
          </ListItem>
          {isLoggedIn && (
            <ListItem button onClick={() => handleMenuItemClick('/admin')}>
              <ListItemText primary="Admin" />
            </ListItem>
          )}
          {!isLoggedIn && (
            <ListItem button onClick={() => handleMenuItemClick('/login')}>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
