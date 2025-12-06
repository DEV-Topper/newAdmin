import { AllLogsTable }  from "@/components/all-logs-table"

export default function AllLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Logss</h1>
        <p className="text-muted-foreground">View all uploaded logs across different social platforms</p>
      </div>

      <AllLogsTable />
    </div>
  )
}
