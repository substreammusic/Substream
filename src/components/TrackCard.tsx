"use client";
export default function TrackCard({
  title, artist, onPlay,
}: { title:string; artist:string; onPlay:()=>void; }) {
  return (
    <div style={{
      background:"#15151B", color:"#E6EAF0",
      border:"1px solid #2A2A33", borderRadius:16,
      overflow:"hidden", width:200
    }}>
      <div style={{ background:"#222", height:120 }} />
      <div style={{ padding:12 }}>
        <div style={{ fontWeight:700, fontSize:14 }}>{title}</div>
        <div style={{ opacity:0.7, fontSize:12 }}>{artist}</div>
        <button onClick={onPlay} style={{
          marginTop:8, background:"#00FFE0", color:"#0B0B0F",
          border:"none", padding:"6px 10px", borderRadius:6, cursor:"pointer"
        }}>▶ Play</button>
      </div>
    </div>
  );
}
