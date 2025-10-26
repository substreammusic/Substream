"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/superbaseClient";

export default function SignInPage() {
  const router = useRouter();

  // if already signed in, bounce to home
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  return (
    <main
      style={{
        background: "#0B0B0F",
        color: "#E6EAF0",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <AuthCard
        title="Welcome back"
        subtitle="Jump back into the underground."
        cta="Sign in"
        altText="No account? Create one"
        altHref="/sign-up"
        onSubmit={async ({ email, password }) => {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            // Surface nice errors in the red box inside AuthCard
            // Common ones: "Invalid login credentials" or "Email not confirmed"
            throw new Error(error.message);
          }

          // success → home
          router.push("/");
        }}
      />
    </main>
  );
}
