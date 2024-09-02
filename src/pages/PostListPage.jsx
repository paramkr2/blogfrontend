// src/pages/PostListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PostListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from your API using Axios
    axios.get('/api/posts/') // Update the URL to match your API
      .then(response => setPosts(response.data.results)) // Access data from response
      .catch(error => console.error('Error fetching posts:', error)); // Add error handling
  }, []);

  return (
    <div>
      <h1>Post List</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/${post.id}/view`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/new">Create New Post</Link>
    </div>
  );
}

export default PostListPage;
