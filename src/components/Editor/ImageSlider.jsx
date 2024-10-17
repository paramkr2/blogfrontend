import React, { useState, useEffect,useRef } from "react";

const ImageSlider = ({ editor }) => {
  const [imageWidth, setImageWidth] = useState(100); // Default width
  const [caption, setCaption] = useState('Default caption'); // Default caption text
  
 
  const handleWidthChange = (event) => {
    const newValue = event.target.value;
    setImageWidth(newValue);
    editor.chain().focus().updateAttributes('image', { width: `${newValue}%` }).run();
  };

  
  useEffect(() => {
    if (!editor) return;

    const { node } = editor.state.selection;
    if (node && node.type.name === 'image') { 
      setImageWidth(parseInt(node.attrs.width) || 100); 
      setCaption(node.attrs.caption || 'Default caption'); 
    }
  }, [editor]); // Add editor as a dependency

  // Handle caption change
  const handleCaptionChange = (event) => {
    const newCaption = event.target.value;
    setCaption(newCaption);
    editor.chain().updateAttributes('image', { caption: newCaption }).run(); // Update caption in the editor
  };



  return (
    <div style={{ color: 'white' }}>
      <input
        type="range"
        min="30"
        max="100"
        value={imageWidth}
        onChange={handleWidthChange}
        style={{ width: '150px', background: 'white' }} // Customize slider appearance
      />
      <span >{imageWidth}%</span> {/* Display the current width percentage */}

      
      
	  
    </div>
  );
};

export default ImageSlider;
