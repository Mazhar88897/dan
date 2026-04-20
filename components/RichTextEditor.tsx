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
  className?: string;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
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
  "link",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your description…",
  className = "",
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-slate-800 rounded-lg border border-white/10 [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:bg-slate-800 [&_.ql-toolbar]:border-white/10 [&_.ql-container]:rounded-b-lg [&_.ql-container]:border-white/10 [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-white [&_.ql-editor.ql-blank::before]:text-gray-500 [&_.ql-stroke]:border-white/20 [&_.ql-fill]:fill-gray-400 [&_.ql-picker]:text-gray-300"
      />
    </div>
  );
}
