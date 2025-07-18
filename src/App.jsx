// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogEditPage from './pages/BlogEditPage.jsx';
import PostPreviewPage from './pages/PostPreviewPage.jsx'; 
import PostCreatePage from './pages/PostCreatePage.jsx'; 
import HomePage from './pages/HomePage.jsx'; // New HomePage component
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx'
import Blog from './pages/Blog.jsx'
import BlogPostDetail from './pages/BlogPostDetail';
import Dashboard from './pages/Dashboard.jsx'
import Blog2 from './pages/Blog2.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{marginTop:'75px'}}> 
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Homepage route */}
          <Route path="/blog/:postId/edit" element={<BlogEditPage />} />
          <Route path="/posts/preview" element={<PostPreviewPage />} />
          <Route path="/create" element={<PostCreatePage/>} /> 
          <Route path="/login" element={<Login/>} /> 
          <Route path="/blog" element={<Blog/>} /> 
          <Route path="/blog/:slug_postId" element={<BlogPostDetail />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/blog2" element={<Blog2/>} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
