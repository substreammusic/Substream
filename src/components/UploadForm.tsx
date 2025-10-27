"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      alert("Please add a title and select a file.");
      return;
    }

    setBusy(true);
    setMessage("Uploading...");

    try {
      // 1️⃣ Get the current user
      const { data: sess } = await supabase.auth.getUser();
      const user = sess.user;
      if (!user) {
        alert("You must be signed in to upload.");
        setBusy(false);
        return;
      }

      // 2️⃣ Upload file to Supabase Storage
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("Media") // ✅ your actual bucket name
        .upload(path, file, { upsert: false });

      if (upErr) {
        alert("UPLOAD ERR: " + upErr.message);
        setBusy(false);
        return;
      }

      // 3️⃣ Get a public URL for the file
      const { data: pub } = supabase.storage
        .from("Media")
        .getPublicUrl(path);

      // 4️⃣ Insert track data into database
      const { error: insErr } = await supabase.from("tracks").insert({
        title,
        video_url: pub?.publicUrl,
        user_id: user.id,
      });

      if (insErr) {
        alert("DB INSERT ERR: " + insErr.message);
        setBusy(false);
        return;
      }

      setMessage("✅ Upload complete!");
      setTitle("");
      setFile(null);
      onUploaded(); // refresh track list on success
    } catch (err: any) {
      console.error(err);
      alert("Unexpected error: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        background: "#15151B",
        border: "1px solid #2A2A33",
        borderRadius: 16,
        padding: 16,
        maxWidth: 560,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Upload a track</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%",
          marginBottom: 8,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #2A2A33",
          background: "#0F0F14",
          color: "#E6EAF0",
        }}
      />

      <input
        type="file"
        accept="video/*,audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{
          width: "100%",
          marginBottom: 8,
          padding: "6px 0",
          color: "#E6EAF0",
        }}
      />

      <button
        onClick={handleUpload}
        disabled={busy}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "none",
          background: busy ? "#00d1c0" : "#00FFE0",
          color: "#0B0B0F",
          fontWeight: 800,
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {busy ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: "#00FFE0",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
