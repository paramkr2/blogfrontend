

import React , {useState,useEffect} from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import styles from './BubbleMenu.module.css';
import { BoldIcon, ItalicIcon, Link, Quote, Strikethrough, Type, UnderlineIcon } from "lucide-react";
import LinkSelector from './LinkSelector.jsx'
import ImageSlider from './ImageSlider.jsx'


export const BubbleMenuBar = ({ 
  editor, 
  showBubbleMenu, 
  showLinkSelector, 
  setShowLinkSelector }) => {

  const [isImageSelected, setIsImageSelected] = useState(false);

  const items = [
    {
      name: "bold",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: <BoldIcon style={{ fontSize: '21px' }} />,
    },
    {
      name: "italic",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: <ItalicIcon style={{ fontSize: '21px' }} />,
    },
    {
      name: "underline",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: <UnderlineIcon style={{ fontSize: '21px' }} />,
    },
    {
      name: "strike",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: <Strikethrough style={{ fontSize: '21px' }} />,
    },
    {
      name: "link",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("link"),
      command: () => {
        setShowLinkSelector(!showLinkSelector);
      },
      icon: <Link style={{ fontSize: '21px' }} />,
    },
    {
      name: "heading2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Type style={{ fontSize: '21px' }} />,
    },
    {
      name: "heading3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: <Type style={{ fontSize: '15px' }} />,
    },
    {
      name: "blockquote",
      isActive: () => editor.isActive("blockquote"),
      command: () => editor.chain().focus().toggleBlockquote().run(),
      icon: <Quote style={{ fontSize: '21px' }} />,
    },
  ];
  
  const width = 40 * items.length;


  useEffect(() => {
    const handleSelectionChange = () => {
      setShowLinkSelector(false);
    };

    editor.on('selectionUpdate', handleSelectionChange);

    // Clean up the event listener on component unmount
    return () => {
      editor.off('selectionUpdate', handleSelectionChange);
    };
  }, [editor, setShowLinkSelector]);


  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { node } = editor.state.selection;
      if (node && node.type.name === 'image') {
        setIsImageSelected(true);
        //setImageWidth(parseInt(node.attrs.width) || 77); // Set width based on node attribute
      } else {
        setIsImageSelected(false);
      }
    };

    editor.on('selectionUpdate', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
    };
  }, [editor]);
  
  return (
    <BubbleMenu
      className={`${showBubbleMenu ? styles.bubbleMenu : styles.bubbleMenuHidden}`} // Use module class names
      editor={editor}
      tippyOptions={{
        moveTransition: "transform 0.15s ease-out",
      }}
    >

      {isImageSelected ? (
        // Show image controls when an image is selected
        <ImageSlider 
          editor={editor}
          isImageSelected={isImageSelected}
          setIsImageSelected={setIsImageSelected}
        />
        
      ) : (
        showLinkSelector ? (
          <LinkSelector
            editor={editor}
            showLinkSelector={showLinkSelector}
            setShowLinkSelector={setShowLinkSelector}
          />
        ) : (
          <>
            {items.map((item) => (
              <React.Fragment key={item.name}>
                <button
                  className={`${item.isActive() ? styles.textActive : item.disable?.() ? styles.textDisabled : styles.textDefault}`}
                  disabled={item.disable?.()}
                  onClick={item.command}
                >
                  {item.icon}
                </button>
                {item.name === "link" && <div className={styles.divider} />}
              </React.Fragment>
            ))}
          </>
        )
      )}
    </BubbleMenu>
  );

}

