"use client";
import { useEffect, useState } from "react";

type CommentBoxProps = {
  trackId?: string;
  title?: string;
};

export default function CommentBox({ trackId, title }: CommentBoxProps) {
  const [comments, setComments] = useState<string[]>([]);
  const [text, setText] = useState("");

  // optional: load or store by track id later
  useEffect(() => {
    setComments([]); // reset when track changes
  }, [trackId]);

  return (
    <div style={{
      marginTop: 24,
      background:"#15151B",
      border:"1px solid #2A2A33",
      borderRadius:16,
      padding:16,
      maxWidth:360
    }}>
      <h3 style={{ marginBottom:12, fontWeight:700 }}>
        Comments {title ? `— ${title}` : ""}
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Leave a comment…"
        rows={3}
        style={{
          width:"100%",
          borderRadius:8,
          border:"1px solid #2A2A33",
          background:"#0F0F14",
          color:"#E6EAF0",
          padding:8,
          resize:"none"
        }}
      />
      <button
        onClick={() => {
          if (!text.trim()) return;
          setComments([...comments, text.trim()]);
          setText("");
        }}
        style={{
          marginTop:8, padding:"6px 10px",
          borderRadius:6, border:"none",
          background:"#00FFE0", color:"#0B0B0F", fontWeight:700
        }}
      >
        Post
      </button>

      <ul style={{ marginTop:12, listStyle:"none", padding:0 }}>
        {comments.map((c, i) => (
          <li key={i} style={{
            background:"#0F0F14",
            borderRadius:8,
            padding:"6px 8px",
            marginBottom:6,
            fontSize:13
          }}>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
