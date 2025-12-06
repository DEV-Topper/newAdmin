// "use client"
// import { useEffect, useState } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { db } from "@/lib/firebase"
// import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore"

// const mockData = [
//   {
//     name: "John Doe",
//     email: "john@example.com"
//     totalSpent: "₦150",
//     accountsPurchased: 3,
//     joinedDate: "2024-12-01",
//     status: "Active",
//   },
//   {
//     name: "Jane Smith",
//     email: "jane@example.com",
//     totalSpent: "₦85",
//     accountsPurchased: 2,
//     joinedDate: "2024-12-15",
//     status: "Active",
//   },
// ]

// type UserEntry = {
//   id: string
//   username: string
//   email: string
//   purchasedAccounts: number
//   walletBalance: number
//   createdAt?: string
// }

// export function UsersTable() {
//   const [users, setUsers] = useState<UserEntry[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [txnSums, setTxnSums] = useState<Record<string, number>>({})

//   // 🧩 Fetch users
//   useEffect(() => {
//     const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const mapped: UserEntry[] = snapshot.docs.map((doc) => {
//           const d: any = doc.data()
//           let createdAtStr = ""
//           try {
//             createdAtStr = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : d.createdAt || ""
//           } catch {
//             createdAtStr = String(d.createdAt || "")
//           }
//           return {
//             id: doc.id,
//             username: d.username || d.name || "—",
//             email: d.email || "—",
//             purchasedAccounts: typeof d.purchasedAccounts === "number" ? d.purchasedAccounts : (d.purchased_accounts ?? 0),
//             walletBalance: typeof d.walletBalance === "number" ? d.walletBalance : (d.wallet_balance ?? 0),
//             createdAt: createdAtStr,
//           }
//         })
//         setUsers(mapped)
//         setLoading(false)
//       },
//       (error) => {
//         console.error("Error fetching users:", error)
//         setLoading(false)
//       }
//     )
//     return () => unsubscribe()
//   }, [])

//   // 💰 Fetch transactions
//   useEffect(() => {
//     const q = query(collection(db, "transactions"), orderBy("date", "desc"))
//     const unsub = onSnapshot(
//       q,
//       (snapshot) => {
//         const sums: Record<string, number> = {}
//         snapshot.docs.forEach((d) => {
//           const data: any = d.data()
//           const uid = data.userUUID ?? data.accountId ?? null
//           if (!uid) return
//           const amt = Number(data.amount) || 0
//           sums[uid] = (sums[uid] || 0) + amt
//         })
//         setTxnSums(sums)
//       },
//       (err) => {
//         console.error("Failed to fetch transactions:", err)
//       }
//     )
//     return () => unsub()
//   }, [])

//   // 🗑️ Delete user
//   async function handleRemove(id?: string) {
//     if (!id) return
//     const ok = confirm("Delete this user? This action cannot be undone.")
//     if (!ok) return

//     try {
//       await deleteDoc(doc(db, "users", id))
//       console.log("User deleted:", id)
//     } catch (err) {
//       console.error("Failed to delete user:", err)
//       alert("Failed to delete user. See console for details.")
//     }
//   }

//   // 🧮 Combine with transaction totals
//   const rowsToRender = users.length > 0
//     ? users.map((u) => {
//         const spent = txnSums[u.id] ?? u.walletBalance ?? 0
//         return {
//           name: u.username,
//           email: u.email,
//           totalSpent: `₦${Number(spent).toLocaleString()}`,
//           accountsPurchased: u.purchasedAccounts,
//           joinedDate: u.createdAt || "—",
//           status: "Active",
//           id: u.id,
//         }
//       })
//     : mockData

//   // 🔍 Filter users by search
//   const filteredRows = rowsToRender.filter((row) =>
//     `${row.name} ${row.email}`.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // 🔢 Reverse numbering so first joined user = #1
//   const totalCount = filteredRows.length

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         {/* 🔎 Search Bar */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Users</h2>
//           <Input
//             type="text"
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="max-w-sm"
//           />
//         </div>

//         {/* 🧩 Table */}
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[80px]">User ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Total Spent</TableHead>
//               <TableHead>Joined Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-4">
//                   Loading users...
//                 </TableCell>
//               </TableRow>
//             ) : filteredRows.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-4">
//                   No matching users found..
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredRows.map((row, index) => {
//                 const id = row.id || users[index]?.id
//                 const reversedIndex = totalCount - index // 👈 Reverse numbering so oldest = 1
//                 return (
//                   <TableRow key={index}>
//                     <TableCell className="font-semibold">{reversedIndex}</TableCell> {/* ✅ Reversed ID */}
//                     <TableCell className="font-medium">{row.name}</TableCell>
//                     <TableCell>{row.email}</TableCell>
//                     <TableCell>{row.totalSpent}</TableCell>
//                     <TableCell>{row.joinedDate}</TableCell>
//                     <TableCell>
//                       <Badge>{row.status}</Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           View
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => id ? handleRemove(id) : alert("Cannot delete mock user")}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )
//               })
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }





"use client"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore"

const mockData = [
  {
    name: "John Doe",
    email: "john@example.com",
    balance: "₦150",
    totalSpent: "₦150",
    accountsPurchased: 3,
    joinedDate: "2024-12-01",
    status: "Active",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    balance: "₦85",
    totalSpent: "₦85",
    accountsPurchased: 2,
    joinedDate: "2024-12-15",
    status: "Active",
  },
]

type UserEntry = {
  id: string
  username: string
  email: string
  purchasedAccounts: number
  walletBalance: number
  balance: number
  createdAt?: string
}

export function UsersTable() {
  const [users, setUsers] = useState<UserEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [txnSums, setTxnSums] = useState<Record<string, number>>({})

  // 🧩 Fetch userss
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped: UserEntry[] = snapshot.docs.map((doc) => {
          const d: any = doc.data()
          let createdAtStr = ""
          try {
            createdAtStr = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : d.createdAt || ""
          } catch {
            createdAtStr = String(d.createdAt || "")
          }
          return {
            id: doc.id,
            username: d.username || d.name || "—",
            email: d.email || "—",
            purchasedAccounts: typeof d.purchasedAccounts === "number" ? d.purchasedAccounts : (d.purchased_accounts ?? 0),
            walletBalance: typeof d.walletBalance === "number" ? d.walletBalance : (d.wallet_balance ?? 0),
            balance: typeof d.balance === "number" ? d.balance : 0,
            createdAt: createdAtStr,
          }
        })
        setUsers(mapped)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  // 💰 Fetch transactions
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"))
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const sums: Record<string, number> = {}
        snapshot.docs.forEach((d) => {
          const data: any = d.data()
          const uid = data.userUUID ?? data.accountId ?? null
          if (!uid) return
          const amt = Number(data.amount) || 0
          sums[uid] = (sums[uid] || 0) + amt
        })
        setTxnSums(sums)
      },
      (err) => {
        console.error("Failed to fetch transactions:", err)
      }
    )
    return () => unsub()
  }, [])

  // 🗑️ Delete user
  async function handleRemove(id?: string) {
    if (!id) return
    const ok = confirm("Delete this user? This action cannot be undone.")
    if (!ok) return

    try {
      await deleteDoc(doc(db, "users", id))
      console.log("User deleted:", id)
    } catch (err) {
      console.error("Failed to delete user:", err)
      alert("Failed to delete user. See console for details.")
    }
  }

  // 🧮 Combine with transaction totals
  const rowsToRender = users.length > 0
    ? users.map((u) => {
        const spent = txnSums[u.id] ?? u.walletBalance ?? 0
        return {
          name: u.username,
          email: u.email,
          balance: `₦${Number(u.balance).toLocaleString()}`,
          totalSpent: `₦${Number(spent).toLocaleString()}`,
          accountsPurchased: u.purchasedAccounts,
          joinedDate: u.createdAt || "—",
          status: "Active",
          id: u.id,
        }
      })
    : mockData

  // 🔍 Filter users by search
  const filteredRows = rowsToRender.filter((row) =>
    `${row.name} ${row.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 🔢 Reverse numbering so first joined user = #1
  const totalCount = filteredRows.length

  return (
    <Card>
      <CardContent className="pt-6">
        {/* 🔎 Search Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* 🧩 Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No matching users found..
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => {
                const id = row.id || users[index]?.id
                const reversedIndex = totalCount - index // 👈 Reverse numbering so oldest = 1
                return (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{reversedIndex}</TableCell> {/* ✅ Reversed ID */}
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell className="font-semibold text-green-600">{row.balance}</TableCell>
                    <TableCell>{row.totalSpent}</TableCell>
                    <TableCell>{row.joinedDate}</TableCell>
                    <TableCell>
                      <Badge>{row.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => id ? handleRemove(id) : alert("Cannot delete mock user")}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}