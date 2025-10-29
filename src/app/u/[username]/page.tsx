"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import  FollowButton  from "@/components/FollowButton";
import  UploadForm  from "@/components/UploadForm";

type Profile = { id: string; username: string; display_name: string | null; bio: string | null; avatar_url: string | null; };
type Track = { id: string; title: string; artist: string; video_url: string; cover_url: string | null; };

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tracks, settracks] = useState<Track[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      if (!prof) return;
      setProfile(prof);

      // owner check
      const { data: session } = await supabase.auth.getSession();
      setIsOwner(session.session?.user?.id === prof.id);

      const { data: usertracks } = await supabase
        .from("tracks")
        .select("*")
        .eq("user_id", prof.id)
        .order("id", { ascending: false });
      settracks(usertracks || []);
    })();
  }, [username]);

  if (!profile) {
    return <main style={{ color:"#E6EAF0", padding:"2rem" }}>Loading…</main>;
  }

  return (
    <main style={{ background:"#0B0B0F", color:"#E6EAF0", minHeight:"100vh", padding:"2rem", paddingBottom:96 }}>
      {/* header */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
        <img src={profile.avatar_url || "/cover-placeholder.png"} style={{ width:72, height:72, borderRadius:16, objectFit:"cover" }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:22, fontWeight:800 }}>{profile.display_name || profile.username}</div>
          <div style={{ opacity:.7 }}>@{profile.username}</div>
        </div>
        <FollowButton targetUserId={profile.id} />
      </div>

      {/* tabs */}
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <a href={`#tracks`} style={{ color:"#00FFE0", textDecoration:"none", fontWeight:700 }}>tracks</a>
        <a href={`#about`} style={{ color:"#00FFE0", textDecoration:"none", fontWeight:700 }}>About</a>
        {isOwner && <a href="/profile/edit" style={{ color:"#00FFE0", textDecoration:"none", fontWeight:700 }}>Edit</a>}
      </div>

      {/* owner-only upload */}
      {isOwner && (
        <div style={{ margin:"12px 0 20px" }}>
          <UploadForm onUploaded={() => location.reload()} />
        </div>
      )}

      {/* tracks grid */}
      <section id="tracks" style={{ marginTop:8 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, 200px)", gap:16 }}>
          {tracks.map(t => (
            <a key={t.id} href="/" style={{ textDecoration:"none" }}>
              <div style={{ background:"#15151B", border:"1px solid #2A2A33", borderRadius:16, overflow:"hidden", width:200 }}>
                <div style={{ background:"#222", height:120 }} />
                <div style={{ padding:12, color:"#E6EAF0" }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{t.title}</div>
                  <div style={{ opacity:.7, fontSize:12 }}>{profile.display_name || "@"+profile.username}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* about */}
      <section id="about" style={{ marginTop:24, maxWidth:640 }}>
        <h3 style={{ marginBottom:8 }}>About</h3>
        <p style={{ opacity:.85, whiteSpace:"pre-wrap" }}>{profile.bio || "No bio yet."}</p>
      </section>
    </main>
  );
}
