import React from "react";
import { BubbleMenu } from "@tiptap/react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { Image as ImageIcon, List as ListIcon, Film as FilmIcon} from 'react-bootstrap-icons'; // Using Bootstrap Icons

const ChangeMenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertEmbed = () => {
    const url = window.prompt("Enter video embed URL");
    if (url) {
      editor.chain().focus().setEmbed({ src: url }).run(); // Assuming you have an extension for embeds
    }
  };

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="change-menu">
        <Tabs defaultActiveKey="paragraph" id="change-menu-tabs">
          <Tab eventKey="paragraph" title="Paragraph">
            <Button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive("paragraph") ? "is-active" : ""}
            >
             para
            </Button>
          </Tab>
          <Tab eventKey="image" title="Image">
            <Button onClick={insertImage}>
              <ImageIcon />
            </Button>
          </Tab>
          <Tab eventKey="video" title="Video">
            <Button onClick={insertEmbed}>
              <FilmIcon />
            </Button>
          </Tab>
          <Tab eventKey="list" title="List">
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <ListIcon />
            </Button>
          </Tab>
        </Tabs>
      </div>
    </BubbleMenu>
  );
};

export default ChangeMenuBar;
