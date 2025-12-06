"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { toast } from "sonner"

type WithdrawalRequest = {
  id: string
  accountName: string
  accountNumber: string
  amount: number
  bank: string
  createdAt: any
  email: string
  status: string
  userId: string
}

export function WithdrawalRequestsTable() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const q = query(collection(db, "withdraw_requests"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestsData: WithdrawalRequest[] = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            accountName: data.accountName || "—",
            accountNumber: data.accountNumber || "—",
            amount: data.amount || 0,
            bank: data.bank || "—",
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            email: data.email || "—",
            status: data.status || "pending",
            userId: data.userId || "—",
          }
        })
        setRequests(requestsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching withdrawal requests:", error)
        toast.error("Failed to fetch withdrawal requests.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleMarkAsSuccessful = async (id: string) => {
    const requestDocRef = doc(db, "withdraw_requests", id)
    try {
      await updateDoc(requestDocRef, { status: "successful" })
      toast.success("Request marked as successful!")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update request status.")
    }
  }

  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status.toLowerCase()) {
      case "successful":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "destructive"
    }
  }

  // ✅ Filter requests by search term (email, bank, account name)
  const filteredRequests = requests.filter((req) =>
    [req.email, req.bank, req.accountName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle>Withdrawal Requests</CardTitle>

          {/* ✅ Search Input */}
          <Input
            placeholder="Search by email, bank, or account name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No matching withdrawal requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>₦{req.amount.toLocaleString()}</TableCell>
                  <TableCell>{req.bank}</TableCell>
                  <TableCell>{req.accountName}</TableCell>
                  <TableCell>{req.accountNumber}</TableCell>
                  <TableCell>{req.createdAt.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(req.status)}>{req.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" && (
                      <Button size="sm" onClick={() => handleMarkAsSuccessful(req.id)}>
                        Transfer Made
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
