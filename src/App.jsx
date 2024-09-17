// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostListPage from './pages/PostListPage.jsx';
import PostEditPage from './pages/PostEditPage.jsx';
import PostPreviewPage from './pages/PostPreviewPage.jsx'; 
import PostCreatePage from './pages/PostCreatePage.jsx'; 
import HomePage from './pages/HomePage.jsx'; // New HomePage component
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Homepage route */}
        <Route path="/postlist" element={<PostListPage />} />
        <Route path="/:postId/edit" element={<PostEditPage />} />
        <Route path="/posts/preview" element={<PostPreviewPage />} />
        <Route path="/create" element={<PostCreatePage/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
