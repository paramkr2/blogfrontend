import React from 'react';
import axios from 'axios';
import PostEditCreateForm from '../components/PostEditCreateForm';
import { useNavigate } from 'react-router-dom';
import './styles/PostEditPage.css'; // Reuse the CSS from PostCreatePage for consistent styling

function PostCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (title, content, isDraft) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/posts/`,
      { title, content, is_published: !isDraft },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if( !isDraft){
      navigate(`/blog/${response.data.slug}--${response.data.id}`);
    }else{
      navigate(`/blog/${response.data.id}/edit/`)
    }
  };

  return <PostEditCreateForm initialContent="<h1></h1><p></p>" onSubmit={handleSubmit} />;
}

export default PostCreatePage;
