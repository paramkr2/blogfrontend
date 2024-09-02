// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PostListPage from './pages/PostListPage.jsx';
import PostEditPage from './pages/PostEditPage';
import PostPreivewPage from './pages/PostPreviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/postlist" element={<PostListPage />} />
        <Route path="/:postId/edit" element={<PostEditPage />} />
        <Route path="/posts/preview" element={<PostPreivewPage/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
