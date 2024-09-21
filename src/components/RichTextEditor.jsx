import React , {useState,useEffect} from "react";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from '@tiptap/extension-underline'
import Document from '@tiptap/extension-document'
import Link from "@tiptap/extension-link";
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'


import {BubbleMenuBar} from './BubbleMenuBar';
import FloatingMenuBar from './FloatingMenuBar';
import './editor.css';

import { Node } from '@tiptap/core';


const lowlight = createLowlight(all)
lowlight.register('js', js)

const CustomDocument = Document.extend({
  content: 'heading block*',
})

const YouTubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 560,
      },
      height: {
        default: 315,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});


export default function Editor({ content, onUpdate }) {
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Underline,
      StarterKit.configure({
        document: false,
      }),
      Link.configure({
        openOnClick: false, // Open the link on click
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image', // Add a custom class for image resizing
        },
      }),
      YouTubeEmbed,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?'
          }

          return 'Write up...'
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content:content ,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "editor-content",  // Apply custom class to editor content, makes focus outline none
      },
    }
  });



  return (
  <div className="editor-box">
    {/* The bubble menu bar for formatting options */}
    <BubbleMenuBar 
      editor={editor} 
      showBubbleMenu={showBubbleMenu} 
      showLinkSelector={showLinkSelector} 
      setShowLinkSelector={setShowLinkSelector} 
    />
    
    {/* The floating menu bar that appears with the plus button */}
    <FloatingMenuBar 
      editor={editor}
      showPlusButton={showPlusButton}
      showFloatingMenu={showFloatingMenu}
      setShowFloatingMenu={setShowFloatingMenu}
    />
    
    {/* The main editor content */}
    <EditorContent editor={editor}  style={{ outline: 'none' }}  />
  </div>
);

}
