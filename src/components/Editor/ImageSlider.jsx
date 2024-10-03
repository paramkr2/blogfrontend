import React, { useState, useEffect, useRef } from "react";

const ImageSlider = ({ editor }) => {
  const [imageWidth, setImageWidth] = useState(100); // Default width
  const sliderRef = useRef(null);

  const handleWidthChange = (event) => {
    const newValue = event.target.value;
    setImageWidth(newValue);
    editor.chain().focus().updateAttributes('image', { width: `${newValue}%` }).run();
  };

  useEffect(() => {
    if (!editor) return;

    const { node } = editor.state.selection;
    if (node && node.type.name === 'image') { // Ensure node is an image
      setImageWidth(parseInt(node.attrs.width) || 100); // Default to 100% if undefined
    }
  }, [editor]); // Add editor as a dependency

  const handleTouchStart = (event) => {
    event.preventDefault(); // Prevent default behavior
    console.log('Touch start event triggered:', event);
  };

  return (
    <div>
      <input
        type="range"
        min="30"
        max="100"
        value={imageWidth}
        onChange={handleWidthChange}
        onTouchStart={handleTouchStart} // Prevent focus on touch start
        // Set the width of the slider
      />
      <span>{imageWidth}%</span> {/* Display the current width percentage */}
    </div>
  );
};

export default ImageSlider;
