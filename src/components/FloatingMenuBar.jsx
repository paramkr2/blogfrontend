import React,{useRef} from 'react';
import {FloatingMenu,useEditor} from '@tiptap/react'

import { Image as ImageIcon, List as ListIcon, Film as FilmIcon} from 'react-bootstrap-icons'; // Using Bootstrap Icons
import { ListOrdered, Minus } from "lucide-react";
import { motion } from "framer-motion";

import classNames from "classnames";

import PlusButton from './Buttons/PlusButton.jsx'

import { useOutsideClick } from "../hooks/use_outside_clicks.jsx";
import { convertFileToBase64 } from "../utils/convert-file-to-base64.js";
import { extractVideoId, generateEmbedUrl } from '../utils/video.js';
import axios from 'axios';


export default function FloatingMenuBar({editor,showPlusButton,showFloatingMenu,setShowFloatingMenu}){
	
	const hiddenFileInput = useRef() ;
	const shouldFloatingMenuShow = (editor) => {
	    const { selection } = editor.state;
	    // If the selection is not empty, do not show the floating menu.
	    // If depth is 1, it means the selection is in the top level of the document.
	    // ol, ul depth will not be 1, so we need to check if the selection is in the top level.
	    if (!selection.empty || selection.$head.parent.content.size > 0 || selection.$head.depth !== 1) {
	      return false;
	    }
	    return true;
	};

	const items = [
		{
	      name: 'video',
	      isActive:()=>editor.isActive("video"),
	      command: () => {
	        const url = prompt('Enter the video URL');
	        const videoData = extractVideoId(url);
	        if (videoData) {
	          const embedUrl = generateEmbedUrl(videoData.platform, videoData.id);
	          if (embedUrl) {
	            editor.chain().focus().insertContent(`<iframe src="${embedUrl}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`).run();
	        }
	        } else {
	          alert('Invalid video URL');
	        }
	      },
	      icon: <FilmIcon style={{ fontSize: '20px', color: '#1a8917' }} />,
	    },
		{
	      name: "image",
	      isActive: () => editor.isActive("image"),
	      command: () => {
	        hiddenFileInput.current.click();
	      },
	      icon: <ImageIcon style={{fontSize:'20px',color:'#1a8917'}} />,
	    },
		{
	      name: "bulletList",
	      isActive: () => editor.isActive("bulletList"),
	      command: () => editor.chain().focus().toggleBulletList().run(),
	      icon: <ListIcon style={{ fontSize: '20px', color: '#1a8917' }}  strokeWidth={1} />,
	    },
	    {
	      name: "orderedList",
	      isActive: () => editor.isActive("orderedList"),
	      command: () => editor.chain().focus().toggleOrderedList().run(),
	      icon: <ListOrdered style={{ fontSize: '20px', color: '#1a8917' }}  strokeWidth={1} />,
	    },
	    {
	      name: "horizontalRule",
	      isActive: () => editor.isActive("horizontalRule"),
	      command: () => editor.chain().focus().setHorizontalRule().run(),
	      icon: <Minus style={{ fontSize: '20px', color: '#1a8917' }}  strokeWidth={1} />,
	    }
	]

	const ref = useOutsideClick(() => {
	    setShowFloatingMenu(false);
	    console.log('this')
	  });

	const addImage = async (e) => {
	    const file = (e.target).files?.[0];
	    if (!file) return;
	    const base64 = await convertFileToBase64(file);

	    if (base64) {
	      editor?.chain().focus().setImage({ src: base64 }).run();
	    }
	  };

	 const uploadImage = async (e) => {
	 	const file = (e.target).files?.[0];
	    const formData = new FormData();
	    formData.append('image', file);

	    const token = localStorage.getItem('token');
	    const response = await axios.post(
	        `${import.meta.env.VITE_API_URL}/api/images/`,
	        formData,
	        {
	            headers: {
	                'Authorization': `Bearer ${token}`,
	                'Content-Type': 'multipart/form-data'
	            }
	        }
	    );
	    console.log(response.data)
	    if (response.data) {
	      editor?.chain().focus().setImage({ src: response.data.image }).run();
	    }
	};

	return (
			<FloatingMenu 
				className={classNames({
			    	flex: showPlusButton,  // Will add the 'flex' class when showPlusButton is true
			    	hidden: !showPlusButton,  // Will add the 'hidden' class when showPlusButton is false
			    	relative: true,  // Always adds the 'relative' class
			  	})} 
			  	shouldShow={() => shouldFloatingMenuShow(editor)}
				tippyOptions={{ duration: 100 }} 
				editor={editor}
			>
				<PlusButton
			        ref={ref}
			        showFloatingMenu={showFloatingMenu}
			        setShowFloatingMenu={setShowFloatingMenu}
			    />

			    <input
			        ref={hiddenFileInput}
			        hidden
			        accept="image/png, image/jpeg, image/jpg"
			        type="file"
			        onInput={(e) => {
			          uploadImage(e);
			        }}
			      />

				{showFloatingMenu && (
				  <div
				    style={{
				      position: 'absolute',
				      left: '-20px',
				      top: '-25px',
				      zIndex: 9999,
				      display: 'flex',
				      height: '40px',
				      alignItems: 'center',
				      padding: '2px 4px',
				      borderRadius:'20%'
				    }}
				  >
				    {items.map((item, index) => (
				      <motion.button
				        key={item.name}
				        initial={{ opacity: 0 }}  // Start as invisible
				        animate={{ opacity: 1 }}  // Become fully visible
				        exit={{ opacity: 0 }}     // Become invisible on exit
				        transition={{ duration: 0.5, delay: index * 0.1 }}  // Appear in quick succession
				        style={{
				          border: '1px solid #1a8917',
				          borderRadius: '80%',
				          width: '32px',
				          height: '32px',
				          display: 'flex',
				          alignItems: 'center',
				          justifyContent: 'center',
				          color: item.isActive() ? 'rgb(75, 85, 99)' : 'rgb(156, 163, 175)',  // gray-600 or gray-400
				        }}
				        onClick={item.command}
				      >
				        {item.icon}
				      </motion.button>
				    ))}
				  </div>
				)}

		      
	      	</FloatingMenu>
		
	)
}