"use client";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();

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
        title="Join Substream"
        subtitle="Claim your tag. Drop your sound."
        cta="Create account"
        altText="Already have an account? Sign in"
        altHref="/sign-in"
        showName
        onSubmit={async ({ name, email, password }) => {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: name ?? "" },
            },
          });

          if (error) throw new Error(error.message);

          // if email confirmation is enabled, user gets a link
          if (data?.user?.identities?.length === 0) {
            throw new Error("Account already exists. Try signing in.");
          }

          alert("Check your email to confirm your account!");
          router.push("/sign-in");
        }}
      />
    </main>
  );
}
