import { WithdrawalRequestsTable } from "@/components/withdrawal-requests-table"

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">Manage and process user withdrawal requests.</p>
      </div>
      <WithdrawalRequestsTable />
    </div>
  )
}
