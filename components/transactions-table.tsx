// "use client"

// import { useEffect, useState } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { db } from "@/lib/firebase"
// import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"

// type TransactionDoc = {
//   accountId?: string
//   amount?: number
//   date?: any
//   paystackReference?: string
//   platform?: string
//   purchaseId?: string
//   quantity?: number
//   status?: string
//   type?: string
//   userUUID?: string
//   [key: string]: any
// }

// type TransactionRow = {
//   id: string
//   transactionId: string
//   userDisplay: string
//   platform: string
//   amount: string
//   status: string
//   dateDisplay: string
// }

// export function TransactionsTable() {
//   const [rows, setRows] = useState<TransactionRow[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     setLoading(true)
//     const q = query(collection(db, "transactions"), orderBy("date", "desc"))
//     const unsubscribe = onSnapshot(
//       q,
//       async (snapshot) => {
//         try {
//           const docs = snapshot.docs
//           if (docs.length === 0) {
//             setRows([])
//             setLoading(false)
//             return
//           }

//           // build transactions and collect unique userUUIDs
//           const txs: { id: string; data: TransactionDoc }[] = docs.map((d) => ({
//             id: d.id,
//             data: d.data() as TransactionDoc,
//           }))

//           // collect unique userUUIDs (ensure they are strings)
//           const uniqueUuids = Array.from(
//             new Set(
//               txs
//                 .map((t) => t.data.userUUID)
//                 .filter((v): v is string => typeof v === "string" && v.trim() !== "")
//             )
//           )

//           // fetch user docs in parallel
//           const usersMap: Record<string, { email?: string; displayName?: string }> = {}
//           await Promise.all(
//             uniqueUuids.map(async (uuid) => {
//               try {
//                 const uDoc = await getDoc(doc(db, "users", uuid))
//                 if (uDoc.exists()) {
//                   const ud = uDoc.data() as any
//                   usersMap[uuid] = {
//                     email: ud.email ?? ud.userEmail ?? "",
//                     displayName: ud.displayName ?? ud.name ?? "",
//                   }
//                 } else {
//                   usersMap[uuid] = { email: "", displayName: "" }
//                 }
//               } catch (e) {
//                 usersMap[uuid] = { email: "", displayName: "" }
//               }
//             })
//           )

//           // map to UI rows
//           const mapped: TransactionRow[] = txs.map(({ id, data }) => {
//             // safely pick user data only if userUUID exists and was fetched
//             const user =
//               typeof data.userUUID === "string" && data.userUUID.trim() !== ""
//                 ? usersMap[data.userUUID] ?? {}
//                 : {}
//             const userDisplay = user.email || user.displayName || data.accountId || data.userUUID || "Unknown"
//             const dateDisplay =
//               data.date && typeof data.date.toDate === "function"
//                 ? data.date.toDate().toLocaleString()
//                 : data.date
//                 ? String(data.date)
//                 : ""
//             const amountDisplay = typeof data.amount === "number" ? `₦${data.amount}` : String(data.amount ?? "")
//             const platform = data.platform ? capitalizePlatform(String(data.platform)) : ""
//             const status = data.status ? String(data.status) : ""

//             return {
//               id,
//               transactionId: data.purchaseId ?? data.paystackReference ?? id,
//               userDisplay,
//               platform,
//               amount: amountDisplay,
//               status,
//               dateDisplay,
//             }
//           })

//           setRows(mapped)
//         } catch (err) {
//           console.error("Error loading transactions:", err)
//           setRows([])
//         } finally {
//           setLoading(false)
//         }
//       },
//       (err) => {
//         console.error("Transactions onSnapshot error:", err)
//         setLoading(false)
//       }
//     )

//     return () => unsubscribe()
//   }, [])

//   const badgeVariant = (status: string) => {
//     const s = (status || "").toLowerCase()
//     if (s === "completed" || s === "paid") return "default"
//     if (s === "pending") return "secondary"
//     return "destructive"
//   }

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Transaction ID</TableHead>
//               <TableHead>User</TableHead>
//               <TableHead>Platform</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Date</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   Loading transactions...
//                 </TableCell>
//               </TableRow>
//             ) : rows.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   No transactions found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               rows.map((row) => (
//                 <TableRow key={row.id}>
//                   <TableCell className="font-medium">{row.transactionId}</TableCell>
//                   <TableCell>{row.userDisplay}</TableCell>
//                   <TableCell>{row.platform}</TableCell>
//                   <TableCell>{row.amount}</TableCell>
//                   <TableCell>
//                     <Badge variant={badgeVariant(row.status)}>{capitalize(row.status)}</Badge>
//                   </TableCell>
//                   <TableCell>{row.dateDisplay}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }

// // small helpers
// function capitalize(s?: string) {
//   if (!s) return ""
//   return s.charAt(0).toUpperCase() + s.slice(1)
// }

// function capitalizePlatform(p: string) {
//   // preserve common casing for known platforms
//   const map: Record<string, string> = {
//     "twitter/x": "Twitter/X",
//     twitter: "Twitter/X",
//     instagram: "Instagram",
//     tiktok: "TikTok",
//     facebook: "Facebook",
//     snapchat: "Snapchat",
//     youtube: "YouTube",
//     linkedin: "LinkedIn",
//     telegram: "Telegram",
//   }
//   const key = p.trim().toLowerCase()
//   return map[key] ?? p
// }




"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"

type TransactionDoc = {
  accountId?: string
  amount?: number
  date?: any
  paystackReference?: string
  platform?: string
  purchaseId?: string
  quantity?: number
  status?: string
  type?: string
  userUUID?: string
  [key: string]: any
}

type TransactionRow = {
  id: string
  transactionId: string
  userDisplay: string
  platform: string
  amount: string
  status: string
  dateDisplay: string
}

export function TransactionsTable() {
  const [rows, setRows] = useState<TransactionRow[]>([])
  const [filteredRows, setFilteredRows] = useState<TransactionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, "transactions"), orderBy("date", "desc"))
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const docs = snapshot.docs
          if (docs.length === 0) {
            setRows([])
            setFilteredRows([])
            setLoading(false)
            return
          }

          const txs: { id: string; data: TransactionDoc }[] = docs.map((d) => ({
            id: d.id,
            data: d.data() as TransactionDoc,
          }))

          const uniqueUuids = Array.from(
            new Set(
              txs
                .map((t) => t.data.userUUID)
                .filter((v): v is string => typeof v === "string" && v.trim() !== "")
            )
          )

          const usersMap: Record<string, { email?: string; displayName?: string }> = {}
          await Promise.all(
            uniqueUuids.map(async (uuid) => {
              try {
                const uDoc = await getDoc(doc(db, "users", uuid))
                if (uDoc.exists()) {
                  const ud = uDoc.data() as any
                  usersMap[uuid] = {
                    email: ud.email ?? ud.userEmail ?? "",
                    displayName: ud.displayName ?? ud.name ?? "",
                  }
                } else {
                  usersMap[uuid] = { email: "", displayName: "" }
                }
              } catch (e) {
                usersMap[uuid] = { email: "", displayName: "" }
              }
            })
          )

          const mapped: TransactionRow[] = txs.map(({ id, data }) => {
            const user =
              typeof data.userUUID === "string" && data.userUUID.trim() !== ""
                ? usersMap[data.userUUID] ?? {}
                : {}
            const userDisplay = user.email || user.displayName || data.accountId || data.userUUID || "Unknown"
            const dateDisplay =
              data.date && typeof data.date.toDate === "function"
                ? data.date.toDate().toLocaleString()
                : data.date
                ? String(data.date)
                : ""
            const amountDisplay = typeof data.amount === "number" ? `₦${data.amount}` : String(data.amount ?? "")
            const platform = data.platform ? capitalizePlatform(String(data.platform)) : ""
            const status = data.status ? String(data.status) : ""
            const transactionId = data.purchaseId || data.paystackReference || id

            return {
              id,
              transactionId,
              userDisplay,
              platform,
              amount: amountDisplay,
              status,
              dateDisplay,
            }
          })

          setRows(mapped)
          setFilteredRows(mapped)
        } catch (err) {
          console.error("Error loading transactions:", err)
          setRows([])
          setFilteredRows([])
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error("Transactions onSnapshot error:", err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // 🔍 SEARCH FILTER
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRows(rows)
    } else {
      const lower = search.toLowerCase()
      setFilteredRows(
        rows.filter(
          (r) =>
            r.transactionId.toLowerCase().includes(lower) ||
            r.userDisplay.toLowerCase().includes(lower) ||
            r.platform.toLowerCase().includes(lower) ||
            r.status.toLowerCase().includes(lower) ||
            r.amount.toLowerCase().includes(lower)
        )
      )
    }
  }, [search, rows])

  const badgeVariant = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "completed" || s === "paid") return "default"
    if (s === "pending") return "secondary"
    return "destructive"
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {/* 🔎 Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.transactionId}</TableCell>
                  <TableCell>{row.userDisplay}</TableCell>
                  <TableCell>{row.platform}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(row.status)}>{capitalize(row.status)}</Badge>
                  </TableCell>
                  <TableCell>{row.dateDisplay}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// small helpers
function capitalize(s?: string) {
  if (!s) return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function capitalizePlatform(p: string) {
  const map: Record<string, string> = {
    "twitter/x": "Twitter/X",
    twitter: "Twitter/X",
    instagram: "Instagram",
    tiktok: "TikTok",
    facebook: "Facebook",
    snapchat: "Snapchat",
    youtube: "YouTube",
    linkedin: "LinkedIn",
    telegram: "Telegram",
  }
  const key = p.trim().toLowerCase()
  return map[key] ?? p
}
