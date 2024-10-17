import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostEditCreateForm from '../components/PostEditCreateForm';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import './styles/PostEditPage.css'; // Reuse the CSS from PostCreatePage for consistent styling

function BlogEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {

    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`)
      .then(response => {
        setContent(`<h1>${response.data.title}</h1>${response.data.content}`);
        setIsPublished(response.data.is_published);
        setLoading(false); // Content loaded, stop loading
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [postId]); // Adding postId to dependency array

  const handleSubmit = async (title, content, isDraft) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/`,
      { title, content, is_published: !isDraft },
      { headers: { Authorization: `Bearer ${token}` } }
    );
   

    if( !isDraft){
      // means published 
      navigate(`/blog/${response.data.slug}--${response.data.id}`);
    }else{
      setIsPublished(false);
    }


  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/`, { headers: { Authorization: `Bearer ${token}` } });
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <PostEditCreateForm initialContent={content} onSubmit={handleSubmit} onDelete={handleDelete} isPublished={isPublished} />;
}

export default BlogEditPage;
