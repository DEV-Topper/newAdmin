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

"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Modal } from "@/components/ui/modal";

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
];

type UserEntry = {
  id: string;
  username: string;
  email: string;
  purchasedAccounts: number;
  walletBalance: number;
  balance: number;
  status?: string;
  createdAt?: string;
};

export function UsersTable() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [txnSums, setTxnSums] = useState<Record<string, number>>({});

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundTarget, setFundTarget] = useState<{
    id: string;
    name: string;
    currentBalance: number;
  } | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundError, setFundError] = useState<string | null>(null);
  const [fundSubmitting, setFundSubmitting] = useState(false);

  const [debitModalOpen, setDebitModalOpen] = useState(false);
  const [debitTarget, setDebitTarget] = useState<{
    id: string;
    name: string;
    currentBalance: number;
  } | null>(null);
  const [debitAmount, setDebitAmount] = useState("");
  const [debitError, setDebitError] = useState<string | null>(null);
  const [debitSubmitting, setDebitSubmitting] = useState(false);

  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // 🧩 Fetch userss
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped: UserEntry[] = snapshot.docs.map((doc) => {
          const d: any = doc.data();
          let createdAtStr = "";
          try {
            createdAtStr = d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleString()
              : d.createdAt || "";
          } catch {
            createdAtStr = String(d.createdAt || "");
          }
          return {
            id: doc.id,
            username: d.username || d.name || "—",
            email: d.email || "—",
            purchasedAccounts:
              typeof d.purchasedAccounts === "number"
                ? d.purchasedAccounts
                : d.purchased_accounts ?? 0,
            walletBalance:
              typeof d.walletBalance === "number"
                ? d.walletBalance
                : d.wallet_balance ?? 0,
            balance: typeof d.balance === "number" ? d.balance : 0,
            status: typeof d.status === "string" ? d.status : "Active",
            createdAt: createdAtStr,
          };
        });
        setUsers(mapped);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 💰 Fetch transactions
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const sums: Record<string, number> = {};
        snapshot.docs.forEach((d) => {
          const data: any = d.data();
          const uid = data.userUUID ?? data.accountId ?? null;
          if (!uid) return;
          const amt = Number(data.amount) || 0;
          sums[uid] = (sums[uid] || 0) + amt;
        });
        setTxnSums(sums);
      },
      (err) => {
        console.error("Failed to fetch transactions:", err);
      }
    );
    return () => unsub();
  }, []);

  // 🗑️ Delete user
  async function handleRemove(id?: string) {
    if (!id) return;
    const ok = confirm("Delete this user? This action cannot be undone.");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "users", id));
      console.log("User deleted:", id);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user. See console for details.");
    }
  }

  function openFundModal(row: any) {
    setFundTarget({
      id: row.id,
      name: row.name,
      currentBalance: typeof row.rawBalance === "number" ? row.rawBalance : 0,
    });
    setFundAmount("");
    setFundError(null);
    setFundModalOpen(true);
  }

  function openDebitModal(row: any) {
    setDebitTarget({
      id: row.id,
      name: row.name,
      currentBalance: typeof row.rawBalance === "number" ? row.rawBalance : 0,
    });
    setDebitAmount("");
    setDebitError(null);
    setDebitModalOpen(true);
  }

  async function handleFundSubmit(e: any) {
    e.preventDefault();
    if (!fundTarget) return;

    const amountNumber = Number(fundAmount);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      setFundError("Enter a valid amount greater than zero.");
      return;
    }

    setFundSubmitting(true);
    try {
      const userRef = doc(db, "users", fundTarget.id);
      const newBalance = (fundTarget.currentBalance || 0) + amountNumber;

      await updateDoc(userRef, {
        balance: newBalance,
      });

      await addDoc(collection(db, "transactionNotifications"), {
        userId: fundTarget.id,
        amount: amountNumber,
        type: "deposit",
        source: "admin",
        timestamp: serverTimestamp(),
      });

      setFundModalOpen(false);
      setFundTarget(null);
      setFundError(null);
    } catch (err) {
      console.error("Failed to fund user:", err);
      setFundError("Failed to fund user. Please try again.");
    } finally {
      setFundSubmitting(false);
    }
  }

  async function handleDebitSubmit(e: any) {
    e.preventDefault();
    if (!debitTarget) return;

    const amountNumber = Number(debitAmount);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      setDebitError("Enter a valid amount greater than zero.");
      return;
    }

    if (amountNumber > debitTarget.currentBalance) {
      setDebitError("Debit amount cannot exceed current balance.");
      return;
    }

    setDebitSubmitting(true);
    try {
      const userRef = doc(db, "users", debitTarget.id);
      const newBalance = (debitTarget.currentBalance || 0) - amountNumber;

      await updateDoc(userRef, {
        balance: newBalance,
      });

      await addDoc(collection(db, "transactionNotifications"), {
        userId: debitTarget.id,
        amount: amountNumber,
        type: "withdrawal",
        source: "admin",
        timestamp: serverTimestamp(),
      });

      setDebitModalOpen(false);
      setDebitTarget(null);
      setDebitError(null);
    } catch (err) {
      console.error("Failed to debit user:", err);
      setDebitError("Failed to debit user. Please try again.");
    } finally {
      setDebitSubmitting(false);
    }
  }

  async function handleToggleSuspend(id?: string, currentStatus?: string) {
    if (!id) return;
    const nextStatus = currentStatus === "Suspended" ? "Active" : "Suspended";

    const actionLabel = nextStatus === "Suspended" ? "unsuspend" : "suspend";
    const ok = confirm(`Are you sure you want to ${actionLabel} this user?`);
    if (!ok) return;

    setStatusSubmitting(true);
    try {
      await updateDoc(doc(db, "users", id), { status: nextStatus });
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Failed to update user status. See console for details.");
    } finally {
      setStatusSubmitting(false);
    }
  }

  // 🧮 Combine with transaction totals
  const rowsToRender =
    users.length > 0
      ? users.map((u) => {
          const spent = txnSums[u.id] ?? u.walletBalance ?? 0;
          return {
            id: u.id,
            name: u.username,
            email: u.email,
            rawBalance: Number(u.balance) || 0,
            balance: `₦${Number(u.balance).toLocaleString()}`,
            totalSpent: `₦${Number(spent).toLocaleString()}`,
            accountsPurchased: u.purchasedAccounts,
            joinedDate: u.createdAt || "—",
            status: u.status || "Active",
          };
        })
      : mockData;

  // 🔍 Filter users by search
  const filteredRows = rowsToRender.filter((row) =>
    `${row.name} ${row.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔢 Reverse numbering so first joined user = #1
  const totalCount = filteredRows.length;

  return (
    <>
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
                filteredRows.map((row: any, index) => {
                  const id = row.id || users[index]?.id;
                  const reversedIndex = totalCount - index; // 👈 Reverse numbering so oldest = 1
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">
                        {reversedIndex}
                      </TableCell>{" "}
                      {/* ✅ Reversed ID */}
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {row.balance}
                      </TableCell>
                      <TableCell>{row.totalSpent}</TableCell>
                      <TableCell>{row.joinedDate}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "Suspended" ? "destructive" : "default"}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFundModal(row)}
                          >
                            Fund
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDebitModal(row)}
                          >
                            Debit
                          </Button>
                          <Button
                            variant={
                              row.status === "Suspended"
                                ? "default"
                                : "destructive"
                            }
                            size="sm"
                            disabled={statusSubmitting}
                            onClick={() =>
                              id
                                ? handleToggleSuspend(id, row.status)
                                : alert("Cannot update mock user")
                            }
                          >
                            {row.status === "Suspended"
                              ? "Unsuspend"
                              : "Suspend"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              id
                                ? handleRemove(id)
                                : alert("Cannot delete mock user")
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        isOpen={fundModalOpen}
        onClose={() => {
          setFundModalOpen(false);
          setFundTarget(null);
          setFundError(null);
        }}
        title="Fund User Wallet"
      >
        <form className="space-y-4" onSubmit={handleFundSubmit}>
          <p className="text-sm text-gray-700">
            {fundTarget
              ? `Add funds to ${
                  fundTarget.name
                }'s balance. Current balance: ₦${fundTarget.currentBalance.toLocaleString()}.`
              : "No user selected."}
          </p>
          <div className="space-y-2">
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Amount in ₦"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
            />
            {fundError && <p className="text-sm text-red-600">{fundError}</p>}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFundModalOpen(false);
                setFundTarget(null);
                setFundError(null);
              }}
              disabled={fundSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={fundSubmitting || !fundTarget}>
              {fundSubmitting ? "Funding..." : "Confirm Funding"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={debitModalOpen}
        onClose={() => {
          setDebitModalOpen(false);
          setDebitTarget(null);
          setDebitError(null);
        }}
        title="Debit User Wallet"
      >
        <form className="space-y-4" onSubmit={handleDebitSubmit}>
          <p className="text-sm text-gray-700">
            {debitTarget
              ? `Debit funds from ${
                  debitTarget.name
                }'s balance. Current balance: ₦${debitTarget.currentBalance.toLocaleString()}.`
              : "No user selected."}
          </p>
          <div className="space-y-2">
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="Amount in ₦"
              value={debitAmount}
              onChange={(e) => setDebitAmount(e.target.value)}
            />
            {debitError && <p className="text-sm text-red-600">{debitError}</p>}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDebitModalOpen(false);
                setDebitTarget(null);
                setDebitError(null);
              }}
              disabled={debitSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={debitSubmitting || !debitTarget}>
              {debitSubmitting ? "Debiting..." : "Confirm Debit"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}