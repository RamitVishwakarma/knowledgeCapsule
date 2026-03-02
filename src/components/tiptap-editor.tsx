"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Heading2 } from "lucide-react";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  minHeight?: string;
}

export function TiptapEditor({
  content,
  onChange,
  editable = true,
  minHeight = "120px",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none prose prose-sm max-w-none text-foreground/90",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync content when it changes externally (e.g. after summary generation)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {editable && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-accent transition-colors ${
              editor.isActive("bold")
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-accent transition-colors ${
              editor.isActive("italic")
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded hover:bg-accent transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            title="Heading"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-accent transition-colors ${
              editor.isActive("bulletList")
                ? "bg-accent text-foreground"
                : "text-muted-foreground"
            }`}
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="px-3 py-2.5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
