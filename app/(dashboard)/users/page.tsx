import { UsersTable } from "@/components/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      <UsersTable />
    </div>
  )
}
