import React , {useState} from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from '@tiptap/extension-image';
import "../styles.css";

import ChangeMenuBar from './ChangeMenuBar'; 
import {BubbleMenuBar} from './BubbleMenuBar';
import FloatingMenuBar from './FloatingMenuBar';

export default function Editor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false, // Open the link on click
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div>
      <BubbleMenuBar editor={editor} />
      <FloatingMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
