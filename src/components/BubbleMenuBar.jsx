import React , {useState} from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";

export const BubbleMenuBar = ({ editor }) => {
  const [linkUrl, setLinkUrl] = useState(''); // State to handle the link URL input
  const [showLinkInput, setShowLinkInput] = useState(false); // State to toggle the link input field

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl(''); // Reset the input field
      setShowLinkInput(false); // Hide the link input
    }
  };
  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };


  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      >
        justify
      </button>
      
       <button
        onClick={() => setShowLinkInput(!showLinkInput)}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        Link
      </button>

      {showLinkInput && (
        <div className="link-input">
          <input
            type="text"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <button onClick={addLink}>Add Link</button>
          <button onClick={removeLink}>Remove Link</button>
        </div>
      )}
    </BubbleMenu>
  );

}

