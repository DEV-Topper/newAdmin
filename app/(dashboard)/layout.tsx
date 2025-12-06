"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TopBar } from "@/components/top-bar"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // not logged in -> redirect to login
        router.replace("/login")
        return
      }

      try {
        // verify role from users collection
        const userRef = doc(db, "users", user.uid)
        const snap = await getDoc(userRef)

        const role = snap.exists() ? (snap.data() as any).role : null

        if (role !== "admin") {
          // not an admin -> sign out and redirect
          await signOut(auth)
          router.replace("/login")
          return
        }

        // authenticated and admin
        setChecking(false)
      } catch (err) {
        console.error("Auth guard error:", err)
        await signOut(auth).catch(() => {})
        router.replace("/login")
      }
    })

    return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // hide entire dashboard (sidebar/topbar/children) while checking
  if (checking) return null

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-secondary/30">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
