import { NotificationForm } from "@/components/notification-form"
import { NotificationList } from "@/components/notification-list"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Send and view all system notifications</p>
      </div>

      <NotificationForm />
      <NotificationList />
    </div>
  )
}
