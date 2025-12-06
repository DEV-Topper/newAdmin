import { UploadLogsForm } from "@/components/upload-logs-form"
import { UploadLogsTable } from "@/components/upload-logs-table"

export default function UploadLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Logs</h1>
        <p className="text-muted-foreground">Upload and manage social media logs</p>
      </div>

      <UploadLogsForm />
      <UploadLogsTable />
    </div>
  )
}
