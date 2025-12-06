import { TransactionsTable } from "@/components/transactions-table"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Monitor all payment activities</p>
      </div>

      <TransactionsTable />
    </div>
  )
}
