"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Quote, Minus
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

type FormatCommand =
  | "bold" | "italic" | "underline"
  | "insertUnorderedList" | "insertOrderedList"
  | "formatBlock";

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez votre contenu...",
  minHeight = 320,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // Track whether the external value update should be reflected
  const isInternalUpdate = useRef(false);

  // Sync external value → DOM (only on mount or external reset)
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const exec = useCallback((command: FormatCommand, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    // Propagate after command
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = window.prompt("URL du lien :");
    if (url) exec("insertUnorderedList" as FormatCommand); // placeholder — override below
    if (url) {
      editorRef.current?.focus();
      document.execCommand("createLink", false, url);
      if (editorRef.current) {
        isInternalUpdate.current = true;
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [onChange]);

  const insertHr = useCallback(() => {
    editorRef.current?.focus();
    document.execCommand("insertHorizontalRule", false);
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#E85D26]/30 focus-within:border-[#E85D26]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolbarBtn onClick={() => exec("bold")} title="Gras (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Italique (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("underline")} title="Souligné (Ctrl+U)">
          <Underline className="h-4 w-4" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarBtn onClick={() => exec("formatBlock", "h2")} title="Titre section (H2)">
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "h3")} title="Sous-titre (H3)">
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "p")} title="Paragraphe">
          <span className="text-xs font-bold px-0.5">P</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("formatBlock", "blockquote")} title="Citation">
          <Quote className="h-4 w-4" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Liste à puces">
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Liste numérotée">
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarBtn onClick={insertLink} title="Insérer un lien">
          <LinkIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertHr} title="Ligne de séparation">
          <Minus className="h-4 w-4" />
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-3 left-4 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          style={{ minHeight }}
          className="px-4 py-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5
            [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#E85D26] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-3
            [&_a]:text-[#E85D26] [&_a]:underline
            [&_hr]:border-gray-200 [&_hr]:my-4"
        />
      </div>
    </div>
  );
}
