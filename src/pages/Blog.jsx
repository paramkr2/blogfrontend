import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Method to fetch posts from API
  const fetchBlogPosts = async () => {
    const token = localStorage.getItem('token'); // Get token from local storage
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        }
      ); // Your actual API endpoint
      //const newPosts = response.data.results.map(posts => { posts.is_published==true?posts:null} );
      setPosts(response.data.results);
      console.log('posts set',response.data.results)
    } catch (err) {
      console.error("API call failed, falling back to hardcoded posts:", err);
      setError('Failed to fetch posts from API');
      setPosts(hardcodedPosts()); // Fall back to hardcoded posts
    }
  };

  // Method to return 5 hardcoded posts as a fallback
  const hardcodedPosts = () => {
    return [
      {
        id: 1,
        title: 'Understanding React Lifecycle',
        brief: 'React Lifecycle methods explained in detail...',
      },
      {
        id: 2,
        title: 'Introduction to Tailwind CSS',
        brief: 'Tailwind CSS is a utility-first CSS framework...',
      },
      {
        id: 3,
        title: 'Getting Started with Node.js',
        brief: 'This article explains how to set up a Node.js project...',
      },
      {
        id: 4,
        title: 'Understanding JWT Tokens',
        brief: 'JWT tokens are widely used for authentication...',
      },
      {
        id: 5,
        title: 'Async/Await in JavaScript',
        brief: 'This post dives deep into async/await in JavaScript...',
      },
    ];
  };

  // useEffect to fetch blog posts when the component mounts
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <div className="blog-page">
      <h1>Latest Blog Posts</h1>
      {error && <p className="error">{error}</p>}
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="blog-item">
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p> {/* Truncate content */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
