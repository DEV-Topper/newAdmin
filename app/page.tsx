"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  //   if (token) {
  //     // If already logged in, send straight to dashboard
  //     router.replace("/dashboard");
  //   }
  // }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-6">
      <LoginForm />
    </div>
  );
}
