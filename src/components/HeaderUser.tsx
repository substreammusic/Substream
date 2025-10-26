"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/superbaseClient";

type Profile = { username: string | null; display_name: string | null };

export default function HeaderUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      const user = sess.user ?? null;
      setUserId(user?.id ?? null);
      setEmail(user?.email ?? null);

      if (user?.id) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("username, display_name")
          .eq("id", user.id)
          .maybeSingle();
        setProfile(prof ?? { username: null, display_name: null });
      }
      setLoading(false);
    })();
  }, []);

  // right side button styles
  const btn = (solid = false): React.CSSProperties => ({
    color: solid ? "#0B0B0F" : "#00FFE0",
    textDecoration: "none",
    fontWeight: 700,
    border: solid ? "none" : "1px solid #00FFE0",
    background: solid ? "#00FFE0" : "transparent",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  });

  if (loading) {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ opacity: 0.6 }}>…</div>
      </div>
    );
  }

  // Not signed in → show Sign in / Sign up
  if (!userId) {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <a href="/sign-in" style={btn(false)}>Sign in</a>
        <a href="/sign-up" style={btn(true)}>Sign up</a>
      </div>
    );
  }

  // Signed in → show greeting + links + sign out
  const tag = profile?.username ? `@${profile.username}` : (email ?? "you");
  const publicHref = profile?.username ? `/u/${profile.username}` : "/profile/edit";

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ opacity: 0.85, fontWeight: 700 }}>Hi, {profile?.display_name || tag}</span>
      <a href={publicHref} style={btn(false)}>
        {profile?.username ? "Profile" : "Set username"}
      </a>
      <a href="/profile/edit" style={btn(false)}>Edit</a>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/sign-in");
        }}
        style={btn(true)}
      >
        Sign out
      </button>
    </div>
  );
}
