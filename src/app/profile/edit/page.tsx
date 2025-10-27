"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EditProfile() {
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Load session + profile WITHOUT redirecting
  useEffect(() => {
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getUser();
        const u = sess.user ?? null;
        setAuthed(!!u);
        setUserId(u?.id ?? null);

        if (u?.id) {
          const { data: prof, error } = await supabase
            .from("profiles")
            .select("username, display_name, bio")
            .eq("id", u.id)
            .maybeSingle();

          if (error) setErr(error.message);
          if (prof) {
            setUsername(prof.username || "");
            setDisplayName(prof.display_name || "");
            setBio(prof.bio || "");
          }
        }
      } catch (e: any) {
        setErr(e?.message || "Unexpected error");
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function handleSave() {
    if (!userId) { setErr("Not signed in."); return; }
    setErr(null); setMsg(null);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username,
      display_name: displayName,
      bio,
    });
    if (error) setErr(error.message);
    else setMsg("Profile updated!");
  }

  // Always render *something* visible
  if (!loaded) {
    return (
      <main style={page}>
        <div style={card}>Loading profile…</div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main style={page}>
        <div style={card}>
          <h1>Sign in required</h1>
          <p>You need to sign in to edit your profile.</p>
          <a href="/sign-in" style={link}>Go to Sign in</a>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={card}>
        <h1>Edit Profile</h1>

        {err && <div style={alertErr}>⚠️ {err}</div>}
        {msg && <div style={alertOk}>✅ {msg}</div>}

        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={input}/>

        <label>Display name</label>
        <input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={input}/>

        <label>Bio</label>
        <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} style={{...input, resize:"vertical"}} />

        <button onClick={handleSave} style={button}>Save Changes</button>

        <div style={{opacity:.6, fontSize:12, marginTop:8}}>
          debug: loaded={String(loaded)} · authed={String(authed)} · userId={userId ?? "null"}
        </div>
      </div>
    </main>
  );
}

/* styles */
const page: React.CSSProperties = {
  background:"#0B0B0F", color:"#E6EAF0", minHeight:"100vh",
  display:"grid", placeItems:"center", padding:"2rem",
};
const card: React.CSSProperties = {
  background:"#15151B", border:"1px solid #2A2A33", borderRadius:16,
  padding:24, width:"100%", maxWidth:480, display:"flex", flexDirection:"column", gap:12
};
const input: React.CSSProperties = {
  width:"100%", padding:"10px 12px", borderRadius:10,
  border:"1px solid #2A2A33", background:"#0F0F14", color:"#E6EAF0"
};
const button: React.CSSProperties = {
  padding:"10px 12px", borderRadius:10, border:"none",
  background:"#00FFE0", color:"#0B0B0F", fontWeight:800, cursor:"pointer"
};
const link: React.CSSProperties = { color:"#00FFE0", textDecoration:"none", fontWeight:700 };
const alertErr: React.CSSProperties = { background:"#401010", color:"#ffb3b3", border:"1px solid #663333", borderRadius:8, padding:"6px 10px" };
const alertOk:  React.CSSProperties = { background:"#104010", color:"#b3ffb3", border:"1px solid #336633", borderRadius:8, padding:"6px 10px" };
