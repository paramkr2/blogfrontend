// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostCreatePage() {
  const [content, setContent] = useState(`
        <h3 style="text-align:center">
          Devs Just Want to Have Fun by Cyndi Lauper
        </h3>
        <p style="text-align:center">
          I come home in the morning light<br>
          My mother says, <mark>“When you gonna live your life right?”</mark><br>
          Oh mother dear we’re not the fortunate ones<br>
          And devs, they wanna have fun<br>
          Oh devs just want to have fun</p>
        <p style="text-align:center">
          The phone rings in the middle of the night<br>
          My father yells, "What you gonna do with your life?"<br>
          Oh daddy dear, you know you’re still number one<br>
          But <s>girls</s>devs, they wanna have fun<br>
          Oh devs just want to have
        </p>
        <p style="text-align:center">
          That’s all they really want<br>
          Some fun<br>
          When the working day is done<br>
          Oh devs, they wanna have fun<br>
          Oh devs just wanna have fun<br>
          (devs, they wanna, wanna have fun, devs wanna have)
        </p>
      `);
  const navigate = useNavigate();

  const handleSave = () => {
    console.log('Saving Content',content);
    axios.post('/api/posts/', { content })
      .then(response => {
        navigate(`/posts/${response.data.id}/view`);
      })
      .catch(error => console.error('Error creating post:', error));
  };

  const handlePreview = () => {
    navigate('/posts/preview', { state: { content } });
  };

  return (
    <div>
      <h1>Create Post</h1>
      <RichTextEditor onUpdate={setContent} content={content} />
      <button onClick={handleSave}>Save Post</button>
       <button onClick={handlePreview}>Preview Post</button>
    </div>
  );
}

export default PostCreatePage;
