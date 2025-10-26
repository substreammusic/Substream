"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/superbaseClient";

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getUser();
      const me = sess.user?.id;
      if (!me || me === targetUserId) { setLoading(false); return; }
      const { data } = await supabase.from("follows")
        .select("*")
        .eq("follower_id", me)
        .eq("followee_id", targetUserId)
        .maybeSingle();
      setFollowing(!!data);
      setLoading(false);
    })();
  }, [targetUserId]);

  if (loading) return null;

  return (
    <button
      onClick={async () => {
        const { data: sess } = await supabase.auth.getUser();
        const me = sess.user?.id;
        if (!me) return location.assign("/sign-in");
        if (following) {
          await supabase.from("follows").delete().eq("follower_id", me).eq("followee_id", targetUserId);
          setFollowing(false);
        } else {
          await supabase.from("follows").insert({ follower_id: me, followee_id: targetUserId });
          setFollowing(true);
        }
      }}
      style={{
        border:"1px solid #00FFE0", color: following ? "#0B0B0F" : "#00FFE0",
        background: following ? "#00FFE0" : "transparent",
        padding:"8px 12px", borderRadius:10, fontWeight:800, cursor:"pointer"
      }}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
