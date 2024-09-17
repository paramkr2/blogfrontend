// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">CryptoGull</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/Blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/create">CreateBlog</a></li>
          <li><a href="/login">Login</a></li>

        </ul>
      </div>
    </nav>
  );
}
