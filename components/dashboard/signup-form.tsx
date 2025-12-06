"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, Check, User } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirm?: string }>(
    {}
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!username || username.trim().length < 3) e.username = "Username must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSuccess(null);
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      const auth = getAuth();
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = credential.user;

      // set display name
      try {
        await updateProfile(user, { displayName: username.trim() });
      } catch {
        // non-fatal
      }

      // create user doc in Firestore with role admin
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        username: username.trim(),
        email: email.trim(),
        role: "admin",
        createdAt: serverTimestamp(),
      });

      setSuccess(`Admin "${username}" created.`);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Signup error:", err);
      // map common Firebase errors to friendly messages
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setServerError("Email is already in use.");
      } else if (code === "auth/invalid-email") {
        setServerError("Invalid email address.");
      } else if (code === "auth/weak-password") {
        setServerError("Password is too weak.");
      } else {
        setServerError(err?.message || "Failed to create admin.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-lg w-full mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border overflow-hidden">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900">
              <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Create Admin</h2>
              <p className="text-sm text-muted-foreground">Add a new administrator for the dashboard.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignup} className="p-6 space-y-4">
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 text-green-800">
              <Check className="w-5 h-5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {serverError && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-800">
              <span className="text-sm">{serverError}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={validate}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                placeholder="johndoe"
                required
              />
              <div className="absolute left-3 top-2.5 text-neutral-400">
                <User className="w-5 h-5" />
              </div>
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validate}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                placeholder="admin@example.com"
                required
              />
              <div className="absolute left-3 top-2.5 text-neutral-400">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validate}
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                placeholder="Minimum 8 characters"
                required
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
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validate}
                className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-neutral-800 dark:border-neutral-700"
                placeholder="Re-type password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-2.5 text-neutral-500 hover:text-neutral-700"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                submitting ? "opacity-70 cursor-wait" : "hover:shadow-md"
              } bg-primary text-primary-foreground dark:bg-indigo-600 dark:text-white`}
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? "Creating…" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}