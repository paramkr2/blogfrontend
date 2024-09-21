import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogPostDetail = () => {
  const { postId } = useParams();  // Get the postId from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the post details
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`);
        setPost(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError('Failed to load post.');
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-detail">
      <h1 className="post-content post-heading" >{post.title}</h1>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}  // Render HTML content safely
      ></div>
    </div>
  );
};

export default BlogPostDetail;
