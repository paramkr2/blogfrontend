// src/pages/HomePage.jsx
import React from 'react';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="section section1">
        <h1>Welcome to My Website</h1>
        <p>Discover amazing content and posts.</p>
        <a href="/postlist" className="cta-button">View Posts</a>
      </div>
      <div className="section section2">
        <h2>About Us</h2>
        <p>Learn more about what we do.</p>
      </div>
      <div className="section section3">
        <h2>Contact Us</h2>
        <p>Get in touch with us for more information.</p>
      </div>
    </div>
  );
}
