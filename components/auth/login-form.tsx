"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// removed API login import
// import { loginUser } from "@/lib/auth";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const auth = getAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = credential.user;

      // fetch user doc from Firestore to check role
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // no user doc -> not admin
        await signOut(auth);
        setError("You are not an admin");
        setSubmitting(false);
        return;
      }

      const userData = userSnap.data() as any;
      const role = userData?.role ?? "";

      if (role !== "admin") {
        await signOut(auth);
        setError("You are not an admin");
        setSubmitting(false);
        return;
      }

      // optional remember handling (keeps local flag only)
      if (remember) localStorage.setItem("rememberMe", "1");

      router.push("/dashboard");
      return;
    } catch (err: any) {
      console.error("Login error:", err);
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError(err?.message ?? "Unexpected error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 7a4 4 0 014-4h8a4 4 0 014 4v10a4 4 0 01-4 4H8a4 4 0 01-4-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Admin Login</h1>
                <p className="text-sm opacity-90">Sign in to access the SocialLogs dashboard</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="px-6 py-6 space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                  placeholder="admin@example.com"
                />
                <div className="absolute left-3 top-2.5 text-neutral-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                  placeholder="Your password"
                />
                <div className="absolute left-3 top-2.5 text-neutral-400">
                  <Lock className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2.5 text-neutral-500 hover:text-neutral-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-neutral-600 dark:text-neutral-300">Remember me</span>
              </label>
              <a className="text-indigo-600 hover:underline text-sm" href="#">Forgot password?</a>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition ${
                  submitting ? "opacity-80 cursor-wait bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Don’t have an admin account? <a href="/dashboard/signup" className="text-indigo-600 hover:underline">Create one</a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-600 mt-4">© 2025 SocialLogs</p>
      </div>
    </div>
  );
}