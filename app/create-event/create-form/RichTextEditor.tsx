"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] rounded-lg bg-slate-800 border border-white/10 animate-pulse flex items-center justify-center text-gray-500">
      Loading editor…
    </div>
  ),
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  // Quill 2 uses a single "list" format for ordered/bullet variants
  "list",
  "color",
  "background",
  "link",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
}: RichTextEditorProps) {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-slate-800 rounded-lg border border-white/10 [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:bg-slate-800 [&_.ql-toolbar]:border-white/10 [&_.ql-container]:rounded-b-lg [&_.ql-container]:bg-slate-800 [&_.ql-container]:border-white/10 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:bg-slate-800 [&_.ql-editor]:text-white [&_.ql-editor.ql-blank::before]:text-gray-500 [&_.ql-stroke]:border-white/20 [&_.ql-fill]:fill-gray-400 [&_.ql-picker]:text-gray-300 [&_.ql-toolbar_button:hover]:bg-slate-700"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          background-color: rgb(30 41 59) !important;
        }
        .rich-text-editor .ql-editor {
          background-color: rgb(30 41 59) !important;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
