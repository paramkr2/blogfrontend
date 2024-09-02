import React from 'react';
import {FloatingMenu,useEditor} from '@tiptap/react'

import Image from '@tiptap/extension-image';
//import Video from '@tiptap/extension-video';
//import CodeBlock from '@tiptap/extension-code-block';

export default function FloatingMenuBar({editor}){
	
	return (
		<>
			{editor && <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
		      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
	          Paragraph
	        </button>
	        <button
	          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
	          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
	        >
	          H2
	        </button>
	        <button
	          onClick={() => editor.chain().focus().toggleBulletList().run()}
	          className={editor.isActive('bulletList') ? 'is-active' : ''}
	        >
	          Bullet list
	        </button>
	        <button
	        onClick={() => {
	          const url = prompt('Enter image URL');
	          if (url) {
	            editor.chain().focus().setImage({ src: url }).run();
	          }
	        }}
	      >
	        Image
      </button>
	      </FloatingMenu>}
		</> 
	)
}