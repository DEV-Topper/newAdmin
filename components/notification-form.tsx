"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase" // Adjust the import based on your Firebase setup
import { collection, addDoc } from "firebase/firestore"
import { Modal } from "@/components/ui/modal" // Import your modal component

export function NotificationForm() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "notification"), {
        title,
        message,
        audience,
        timestamp: new Date(),
      })
      // Clear the form after submission
      setTitle("")
      setMessage("")
      setAudience("all")
      setModalMessage("Notification sent successfully!")
      setModalOpen(true)
    } catch (error) {
      console.error("Error adding document: ", error)
      setModalMessage("Failed to send notification.")
      setModalOpen(true)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message Content</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="specific">Specific User</SelectItem>
                  <SelectItem value="buyers">Platform Buyers Only</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <Button type="submit">Send Notification</Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal for notifications */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Notification Status">
        <div className="p-4">
          <p>{modalMessage}</p>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </>
  )
}
