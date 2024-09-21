
import React, { useEffect, useState } from 'react';
import {jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isLoggedIn , setIsLoggedIn} = useAuth();


  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("servies");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("contact");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode (token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token'); // Token expired
          setIsLoggedIn(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">CryptoGull</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/Blog">Blog</a></li>
          <li><a href="#servies" onClick={scrollToAbout}>Servies</a></li>
          <li><a href="#contact" onClick={scrollToContact}>Contact</a></li>
          {isLoggedIn && <li><a href="/admin">Admin</a></li>}
          {!isLoggedIn && <li><a href="/login">Login</a></li>}
        </ul>
      </div>
    </nav>
  );
}
