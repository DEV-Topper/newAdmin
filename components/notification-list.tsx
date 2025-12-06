"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import { Bell, Edit2, Trash2 } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore"

interface NotificationItem {
  id: string
  title?: string
  message?: string
  audience?: string
  timestamp?: any
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  // edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editing, setEditing] = useState<NotificationItem | null>(null)

  // delete confirm modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, "notification"), orderBy("timestamp", "desc"))
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: NotificationItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
        setNotifications(items)
        setLoading(false)
      },
      (err) => {
        console.error("Failed to fetch notifications:", err)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  const openEdit = (item: NotificationItem) => {
    setEditing({
      id: item.id,
      title: item.title || "",
      message: item.message || "",
      audience: item.audience || "all",
      timestamp: item.timestamp,
    })
    setIsEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editing?.id) return
    const ref = doc(db, "notification", editing.id)
    try {
      await updateDoc(ref, {
        title: editing.title || "",
        message: editing.message || "",
        audience: editing.audience || "all",
      })
      setIsEditOpen(false)
      setEditing(null)
    } catch (err) {
      console.error("Failed to update notification:", err)
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  const doDelete = async () => {
    if (!deletingId) return
    try {
      await deleteDoc(doc(db, "notification", deletingId))
      setIsDeleteOpen(false)
      setDeletingId(null)
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  const formatTime = (ts: any) => {
    try {
      const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null
      return d ? d.toLocaleString() : "Unknown"
    } catch {
      return "Unknown"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-4">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 rounded-lg border p-4 justify-between"
                >
                  <div className="flex items-start gap-4">
                    <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{notification.title || "No title"}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(notification)}
                      aria-label="Edit notification"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(notification.id)}
                      aria-label="Delete notification"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Notification">
        <div className="space-y-4 p-4">
          <Input
            value={editing?.title || ""}
            onChange={(e) => setEditing((s) => (s ? { ...s, title: e.target.value } : s))}
            placeholder="Title"
          />
          <Textarea
            value={editing?.message || ""}
            onChange={(e) => setEditing((s) => (s ? { ...s, message: e.target.value } : s))}
            placeholder="Message"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Notification">
        <div className="p-4">
          <p>Are you sure you want to delete this notification?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={doDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
