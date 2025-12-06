// import { PurchasesTable } from "/purchases-table"
import { PurchasesTable } from "./purchases-table"

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
        <p className="text-muted-foreground">Review all account purchases made by users.</p>
      </div>
      <PurchasesTable />
    </div>
  )
}
