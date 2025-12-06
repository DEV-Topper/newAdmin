import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage admin account and system preferences</p>
      </div>

      <SettingsForm />
    </div>
  )
}
