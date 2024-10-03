import { Editor } from "@tiptap/core";
import { Check, Trash, X } from "lucide-react";
import React, {  useState,useEffect } from "react";
import { toast } from "sonner";
import { Slider } from "@mui/material"

import styles from './LinkSelector.module.css'; 

const ImageSlider = ({ editor, isImageSelected, setIsImageSelected }) =>{
	const [imageWidth, setImageWidth] = useState(100); // Default width


  const handleWidthChange = (event, newValue) => {
    setImageWidth(newValue);
     editor.chain().focus().updateAttributes('image', { width: `${newValue}%` }).run();
  };

  const handleTouchStart = event => {
    event.preventDefault();
    event.stopPropagation(); // Prevent default behavior and focus shifts
  };

  useEffect(() => {
    if (!editor) 
    	return;
	const { node } = editor.state.selection; 
	console.log(node.attrs)
	setImageWidth(parseInt(node.attrs.width) || 77); // Set width based on node attribute
    return ;
  }, [editor]);


	return (
		<>
          <Slider 
            sx={{width:'150px',color:'white'}} 
            value={imageWidth} 
            onChange={handleWidthChange} 
            onTouchStart={handleTouchStart} 
            min={30} 
            max={100} />
        </>
	)
}

export default ImageSlider;