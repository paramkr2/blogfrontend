import React from 'react';
import {FloatingMenu,useEditor} from '@tiptap/react'
import { Image as ImageIcon, List as ListIcon, Film as FilmIcon} from 'react-bootstrap-icons'; // Using Bootstrap Icons
import { motion } from "framer-motion";
import { Image as ImageLucide, List, ListOrdered, Minus } from "lucide-react";
import classNames from "classnames";
import Image from '@tiptap/extension-image';
import {useRef} from "react";
import { useOutsideClick } from "../hooks/use_outside_clicks.jsx";
import PlusButton from './Buttons/PlusButton.jsx'
//import Video from '@tiptap/extension-video';
//import CodeBlock from '@tiptap/extension-code-block';

export default function FloatingMenuBar({editor,showPlusButton,showFloatingMenu,setShowFloatingMenu}){

	const shouldFloatingMenuShow = (
		editor
		) => {
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
	      name: "bulletList",
	      isActive: () => editor.isActive("bulletList"),
	      command: () => editor.chain().focus().toggleBulletList().run(),
	      icon: <List style={{ fontSize: '20px', color: '#1a8917' }}  strokeWidth={1} />,
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
	  });

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

				{showFloatingMenu && (
				  <div
				    style={{
				      position: 'absolute',
				      left: '50px',
				      top: '0px',
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
				        transition={{ duration: 0.2, delay: index * 0.01 }}  // Appear in quick succession
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