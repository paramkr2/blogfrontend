
import React, {  useState,useEffect,useRef } from "react";
import { Slider } from "@mui/material"

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
	
	setImageWidth(parseInt(node.attrs.width) || 77); // Set width based on node attribute
    return ;
  }, []);

  useEffect(() => {
	  const slider = sliderRef.current;

	  const handleTouch = event => {
	    event.preventDefault(); // Prevent the default behavior
	  };

	  if (slider) {
	    // Set the passive option to false
	    slider.addEventListener('touchstart', handleTouch, { passive: false });
	    slider.addEventListener('touchmove', handleTouch, { passive: false });
	  }

	  // Clean up listener on unmount
	  return () => {
	    if (slider) {
	      slider.removeEventListener('touchstart', handleTouch);
	      slider.removeEventListener('touchmove', handleTouch);
	    }
	  };
	}, []);

   const handleMouseDown = (event) => {
    console.log('Mouse down event triggered:', event);
  };

  const handleTouchStart = (event) => {
    console.log('Touch start event triggered:', event);
  };

   const preventFocus = (event) => {
    //event.preventDefault();
    event.stopPropagation();
  };
	return (
		<div >
          <Slider 
            sx={{width:'150px',color:'white'}} 
            value={imageWidth} 
            onChange={handleWidthChange} 
             ref={sliderRef}
              // Prevent focus on mouse down
        	onTouchStart={ preventFocus} // Log touch start events
        	onTouchMove={ preventFocus}
            min={30} 
            max={100} />
        </div>
	)
}

export default ImageSlider;