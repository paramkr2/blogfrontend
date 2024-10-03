import { Editor } from "@tiptap/core";
import { Check, Trash, X } from "lucide-react";
import React, {  useState,useEffect,useRef } from "react";
import { toast } from "sonner";
import { Slider } from "@mui/material"

import styles from './LinkSelector.module.css'; 

const ImageSlider = ({ editor, isImageSelected, setIsImageSelected }) =>{
  const [imageWidth, setImageWidth] = useState(100); // Default width
  const sliderRef = useRef(null);

  const handleWidthChange = (event, newValue) => {
    setImageWidth(newValue);
     editor.chain().focus().updateAttributes('image', { width: `${newValue}%` }).run();
  };

  useEffect(() => {
    if (!editor) 
    	return;
	const { node } = editor.state.selection; 
	console.log(node.attrs)
	setImageWidth(parseInt(node.attrs.width) || 77); // Set width based on node attribute
    return ;
  }, [editor]);

  useEffect(() => {
    const slider = sliderRef.current;

    const handleTouchStart = event => {
      event.preventDefault(); // Prevent the default behavior
    };

    if (slider) {
      slider.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    // Clean up listener on unmount
    return () => {
      if (slider) {
        slider.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, []);
	return (
		<>
          <Slider 
            sx={{width:'150px',color:'white'}} 
            value={imageWidth} 
            onChange={handleWidthChange} 
             ref={sliderRef}
            min={30} 
            max={100} />
        </>
	)
}

export default ImageSlider;