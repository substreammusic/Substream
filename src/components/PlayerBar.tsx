"use client";
import { useEffect, useRef } from "react";

export type Track = {
  id: string;
  title: string;
  artist: string;
  videoUrl: string;
  coverUrl?: string;
};

export default function PlayerBar({
  queue, index, playing, onToggle, onPrev, onNext,
}:{
  queue: Track[];
  index: number;
  playing: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const track = queue[index];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, index]);

  if (!track) return null;

  return (
    <div style={{
      position:"fixed", left:0, right:0, bottom:0,
      background:"#15151B", color:"#E6EAF0",
      borderTop:"1px solid #2A2A33", padding:"10px 12px", zIndex:50
    }}>
      <div style={{
        maxWidth:1000, margin:"0 auto",
        display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"center"
      }}>
        {/* Info + controls */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src={track.coverUrl || "/cover-placeholder.png"} alt="cover"
               style={{ width:48, height:48, borderRadius:8, objectFit:"cover" }}/>
          <div style={{ minWidth:0 }}>
            <div style={{
              fontSize:13, fontWeight:700,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"
            }}>{track.title}</div>
            <div style={{ fontSize:11, opacity:.7 }}>{track.artist}</div>
            <div style={{ marginTop:6, display:"flex", gap:8 }}>
              <button onClick={onPrev}>⏮️</button>
              <button onClick={onToggle}>{playing ? "⏸️" : "▶️"}</button>
              <button onClick={onNext}>⏭️</button>
            </div>
          </div>
        </div>

        {/* Video + silent ad bar */}
        <div style={{
          position:"relative", width:480, height:270,
          borderRadius:12, overflow:"hidden", background:"#000"
        }}>
          <video
            ref={videoRef}
            src={track.videoUrl}
            preload="auto"
            playsInline
            controls={false}
            onEnded={onNext}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
          <div style={{
            position:"absolute", left:0, right:0, bottom:0, height:36,
            background:"rgba(21,21,27,0.95)", borderTop:"1px solid #2A2A33",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:12
          }}>
            <span style={{ opacity:.7 }}>Sponsored</span>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer"
               style={{ color:"#00FFE0", textDecoration:"none" }}>
              Your brand here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
