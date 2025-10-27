"use client";
"use client";

export const dynamic = "force-dynamic";


import { useMemo, useState } from "react";
import TrackCard from "@/components/TrackCard";
import PlayerBar, { Track } from "@/components/PlayerBar";
import CommentBox from "@/components/CommentBox";
import HeaderUser from "@/components/HeaderUser"; // ✅ new dynamic header

const MOCK: Track[] = [
  {
    id: "1",
    title: "Basement Echoes",
    artist: "@tiny",
    videoUrl: "/mock/Basement Echoes.mp4",
    coverUrl: "/cover-placeholder.png",
  },
  {
    id: "2",
    title: "Neon Drip",
    artist: "@tiny",
    videoUrl: "/mock/Neon Drip.mp4",
    coverUrl: "/cover-placeholder.png",
  },
];

export default function Page() {
  const [queue, setQueue] = useState<Track[]>(MOCK);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");

  const playAt = (i: number) => {
    setIndex(i);
    setPlaying(true);
  };
  const next = () => setIndex((i) => Math.min(i + 1, queue.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q)
    );
  }, [queue, query]);

  return (
    <main
      style={{
        background: "#0B0B0F",
        color: "#E6EAF0",
        minHeight: "100vh",
        padding: "2rem",
        paddingBottom: 96, // space for sticky player
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* Left side (Logo + title) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/logo.png"
            alt="Substream"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Discover</h1>
        </div>

        {/* Right side (HeaderUser component) */}
        <HeaderUser />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks or artists…"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #2A2A33",
            background: "#15151B",
            color: "#E6EAF0",
          }}
        />
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 20,
          alignItems: "start",
          paddingBottom: 40,
        }}
      >
        {/* Left: Track grid */}
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 200px)",
              gap: 16,
            }}
          >
            {visible.map((t) => (
              <TrackCard
                key={t.id}
                title={t.title}
                artist={t.artist}
                onPlay={() => {
                  const idx = queue.findIndex((x) => x.id === t.id);
                  playAt(idx >= 0 ? idx : 0);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Comments */}
        <CommentBox
          trackId={queue[index]?.id}
          title={queue[index]?.title}
        />
      </div>

      {/* Sticky Player */}
      <PlayerBar
        queue={queue}
        index={index}
        playing={playing}
        onToggle={() => setPlaying((p) => !p)}
        onPrev={prev}
        onNext={next}
      />
    </main>
  );
}
