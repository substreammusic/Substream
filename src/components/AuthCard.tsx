"use client";
import { useState } from "react";

export default function AuthCard({
  title,
  subtitle,
  cta,
  altText,
  altHref,
  onSubmit,
  showName = false,
}: {
  title: string;
  subtitle?: string;
  cta: string;
  altText: string;
  altHref: string;
  onSubmit: (values: { name?: string; email: string; password: string }) => void;
  showName?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{
      width: 360,
      background:"#15151B",
      color:"#E6EAF0",
      border:"1px solid #2A2A33",
      borderRadius:16,
      padding:20,
      boxShadow:"0 8px 24px rgba(0,0,0,0.35)"
    }}>
      <div style={{ marginBottom:12 }}>
        <h2 style={{ margin:0, fontSize:22, fontWeight:800 }}>{title}</h2>
        {subtitle && <p style={{ margin:"6px 0 0", opacity:.8, fontSize:13 }}>{subtitle}</p>}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          if (!email.trim() || !password.trim() || (showName && !name.trim())) {
            setError("Fill the form, commander.");
            return;
          }
          try {
            setLoading(true);
            await Promise.resolve(onSubmit({ name: name || undefined, email, password }));
          } catch (e:any) {
            setError(e?.message || "Something went sideways.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {showName && (
          <div style={{ marginBottom:10 }}>
            <label style={{ display:"block", fontSize:12, opacity:.8, marginBottom:6 }}>Artist / Display name</label>
            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="e.g. @tiny"
              style={{
                width:"100%", padding:"10px 12px", borderRadius:10,
                border:"1px solid #2A2A33", background:"#0F0F14", color:"#E6EAF0"
              }}
            />
          </div>
        )}

        <div style={{ marginBottom:10 }}>
          <label style={{ display:"block", fontSize:12, opacity:.8, marginBottom:6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@substream.fm"
            style={{
              width:"100%", padding:"10px 12px", borderRadius:10,
              border:"1px solid #2A2A33", background:"#0F0F14", color:"#E6EAF0"
            }}
          />
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={{ display:"block", fontSize:12, opacity:.8, marginBottom:6 }}>Password</label>
          <div style={{ position:"relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width:"100%", padding:"10px 38px 10px 12px", borderRadius:10,
                border:"1px solid #2A2A33", background:"#0F0F14", color:"#E6EAF0"
              }}
            />
            <button
              type="button"
              onClick={()=>setShowPw(s=>!s)}
              style={{
                position:"absolute", right:8, top:8, padding:"6px 8px",
                border:"1px solid #2A2A33", borderRadius:8, background:"#15151B",
                color:"#E6EAF0", cursor:"pointer", fontSize:12
              }}
              aria-label="Toggle password visibility"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom:10, background:"#2a1212", border:"1px solid #552222",
            color:"#ffb3b3", padding:"8px 10px", borderRadius:8, fontSize:13
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width:"100%", padding:"10px 12px", borderRadius:10,
            border:"none", background: loading ? "#00d1c0" : "#00FFE0",
            color:"#0B0B0F", fontWeight:800, cursor:"pointer"
          }}
        >
          {loading ? "Working…" : cta}
        </button>
      </form>

      <div style={{ marginTop:12, fontSize:13, opacity:.8 }}>
        <a href={altHref} style={{ color:"#00FFE0", textDecoration:"none" }}>{altText}</a>
      </div>

      <div style={{
        marginTop:14, borderTop:"1px solid #2A2A33", paddingTop:12, fontSize:12, opacity:.7
      }}>
        By continuing you agree to Substream’s terms. Don’t be evil. Be loud.
      </div>
    </div>
  );
}
