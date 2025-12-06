// "use client"
// import { useState, useEffect } from "react"
// import { db } from "@/lib/firebase"
// import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Users, UploadCloud, DollarSign, CreditCard, TrendingUp, ShoppingCart } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// // react-icons for platform icons
// import { SiInstagram, SiFacebook, SiX, SiTiktok, SiSnapchat, SiYoutube, SiLinkedin, SiTelegram } from "react-icons/si"
// import { FaGlobe } from "react-icons/fa"

// // Helper function to check if date is today
// function isToday(date: Date) {
//   const today = new Date()
//   return (
//     date.getDate() === today.getDate() &&
//     date.getMonth() === today.getMonth() &&
//     date.getFullYear() === today.getFullYear()
//   )
// }

// function timeAgo(date: Date) {
//   const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
//   if (seconds < 60) return `${seconds} sec ago`
//   const mins = Math.floor(seconds / 60)
//   if (mins < 60) return `${mins} min ago`
//   const hours = Math.floor(mins / 60)
//   if (hours < 24) return `${hours} hr ago`
//   const days = Math.floor(hours / 24)
//   return `${days} day${days > 1 ? "s" : ""} ago`
// }

// function PlatformIcon({ platform }: { platform: string }) {
//   const p = (platform || "").toLowerCase()
//   if (p.includes("instagram")) return <SiInstagram className="h-5 w-5 text-primary" />
//   if (p.includes("facebook")) return <SiFacebook className="h-5 w-5 text-primary" />
//   if (p.includes("twitter") || p.includes("x")) return <SiX className="h-5 w-5 text-primary" />
//   if (p.includes("tiktok")) return <SiTiktok className="h-5 w-5 text-primary" />
//   if (p.includes("snapchat")) return <SiSnapchat className="h-5 w-5 text-primary" />
//   if (p.includes("youtube")) return <SiYoutube className="h-5 w-5 text-primary" />
//   if (p.includes("linkedin")) return <SiLinkedin className="h-5 w-5 text-primary" />
//   if (p.includes("telegram")) return <SiTelegram className="h-5 w-5 text-primary" />
//   return <FaGlobe className="h-5 w-5 text-primary" />
// }

// export default function DashboardPage() {
//   const [recentLogs, setRecentLogs] = useState<
//     { id: string; platform: string; user: string; price: string; status: string; time: string }[]
//   >([])
//   const [loading, setLoading] = useState(true)
//   const [statsData, setStatsData] = useState({
//     totalUsers: 0,
//     totalUploads: 0
//   })
//   const [recentTransactions, setRecentTransactions] = useState<any[]>([])
//   const [totalRevenue, setTotalRevenue] = useState<number>(0)
//   const [userCount, setUserCount] = useState(0)
//   const [logsCount, setLogsCount] = useState(0)
//   const [transactionsCount, setTransactionsCount] = useState(0)
//   // Add states for today's data
//   const [todayStats, setTodayStats] = useState({
//     ordersRevenue: 0,
//     logsDeposited: 0,
//     accountsSold: 0,
//     newMembers: 0,
//     todayDeposits: 0
//   })

//   useEffect(() => {
//     // Fetch users count
//     const usersQuery = query(collection(db, "users"))
//     const uploadsQuery = query(collection(db, "uploads"))
//     const transactionsSumQuery = query(collection(db, "transactions"))

//     const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
//       const userCount = snapshot.size
//       setStatsData(prev => ({ ...prev, totalUsers: userCount }))
//       setUserCount(userCount)
//     }, (error) => {
//       console.error("Error fetching users count:", error)
//     })

//     const unsubUploads = onSnapshot(uploadsQuery, (snapshot) => {
//       const uploadsCount = snapshot.size
//       setStatsData(prev => ({ ...prev, totalUploads: uploadsCount }))
//     })

//     // subscribe and sum all transactions amounts (only purchases marked completed)
//     const unsubSum = onSnapshot(
//       transactionsSumQuery,
//       (snapshot) => {
//         const sum = snapshot.docs.reduce((acc, d) => {
//           const data = d.data() as any
//           const amt = Number(data.amount) || 0
//           // include only purchase transactions that are completed
//           if (data.type === "purchase" && data.status === "completed") {
//             return acc + amt
//           }
//           return acc
//         }, 0)
//         setTotalRevenue(sum)
//       },
//       (err) => {
//         console.error("Failed to compute total revenue:", err)
//       }
//     )

//     // Get last 5 logs ordered by creation date
//     const q = query(
//       collection(db, "uploads"),
//       orderBy("createdAt", "desc"),
//       limit(5)
//     )

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const logs = snapshot.docs.map((doc) => {
//           const data = doc.data()
//           const createdAt = data.createdAt?.toDate?.() || new Date()

//           return {
//             id: doc.id,
//             platform: data.platform || "Unknown",
//             user: data.account || "anonymous",
//             price: `₦${data.price || 0}`,
//             status: data.status || "active",
//             time: timeAgo(createdAt),
//           }
//         })

//         setRecentLogs(logs)
//         setLoading(false)
//       },
//       (error) => {
//         console.error("Error fetching logs:", error)
//         setLoading(false)
//       }
//     )

//     // Fetch recent transactions
//     const transactionsQuery = query(
//       collection(db, "transactions"),
//       orderBy("date", "desc"),
//       limit(5)
//     )

//     const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
//       const transactions = snapshot.docs.map((doc) => {
//         const data = doc.data()
//         return {
//           id: doc.id,
//           transactionId: data.purchaseId || data.paystackReference || doc.id,
//           buyer: data.userUUID || "Unknown",
//           amount: `₦${data.amount || 0}`,
//           logs: data.quantity || 0,
//           time: data.date?.toDate ? timeAgo(data.date.toDate()) : "N/A",
//         }
//       })
//       setRecentTransactions(transactions)
//     })

//     return () => {
//       unsubUsers()
//       unsubUploads()
//       unsubscribe()
//       unsubscribeTransactions()
//       unsubSum()
//     }
//   }, [])

//   useEffect(() => {
//     // Query uploads collection
//     const uploadsQuery = query(collection(db, "uploads"))

//     const unsubUploads = onSnapshot(uploadsQuery, (snapshot) => {
//       setLogsCount(snapshot.size)
//     }, (error) => {
//       console.error("Error fetching uploads count:", error)
//     })

//     return () => unsubUploads()
//   }, [])

//   useEffect(() => {
//     // Query transactions collection - only completed transactions
//     const transactionsQuery = query(
//       collection(db, "transactions"),
//       where("status", "==", "completed")
//     )

//     const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
//       setTransactionsCount(snapshot.size)
//     }, (error) => {
//       console.error("Error fetching transactions count:", error)
//     })

//     return () => unsubTransactions()
//   }, [])

//   useEffect(() => {
//     // Fetch today's logs deposited (uploads)
//     const uploadsQuery = query(collection(db, "uploads"))
//     const unsubUploads = onSnapshot(uploadsQuery, (snapshot) => {
//       const todayUploads = snapshot.docs.filter((doc) => {
//         const createdAt = doc.data().createdAt?.toDate?.()
//         return createdAt && isToday(createdAt)
//       })
//       setTodayStats(prev => ({ ...prev, logsDeposited: todayUploads.length }))
//     })

//     // Fetch today's orders revenue (purchases)
//     const purchasesQuery = query(collection(db, "purchases"))
//     const unsubPurchases = onSnapshot(purchasesQuery, (snapshot) => {
//       let todayRevenue = 0
//       let todayAccountsSold = 0

//       snapshot.docs.forEach((doc) => {
//         const data = doc.data()
//         const purchaseDate = data.purchaseDate?.toDate?.()

//         if (purchaseDate && isToday(purchaseDate)) {
//           // Add to today's revenue
//           todayRevenue += Number(data.totalAmount) || 0

//           // Count accounts sold (credentials array length)
//           if (data.credentials && Array.isArray(data.credentials)) {
//             todayAccountsSold += data.credentials.length
//           }
//         }
//       })

//       setTodayStats(prev => ({
//         ...prev,
//         ordersRevenue: todayRevenue,
//         accountsSold: todayAccountsSold
//       }))
//     })

//     // Fetch today's new members (users)
//     const usersQuery = query(collection(db, "users"))
//     const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
//       const todayUsers = snapshot.docs.filter((doc) => {
//         const createdAt = doc.data().createdAt?.toDate?.()
//         return createdAt && isToday(createdAt)
//       })
//       setTodayStats(prev => ({ ...prev, newMembers: todayUsers.length }))
//     })

//     // Fetch today's deposits (transactionNotifications)
//     const depositsQuery = query(collection(db, "transactionNotifications"))
//     const unsubDeposits = onSnapshot(depositsQuery, (snapshot) => {
//       let todayDepositsAmount = 0

//       snapshot.docs.forEach((doc) => {
//         const data = doc.data()
//         const createdAt = data.createdAt?.toDate?.()

//         if (createdAt && isToday(createdAt)) {
//           todayDepositsAmount += Number(data.amount) || 0
//         }
//       })

//       setTodayStats(prev => ({ ...prev, todayDeposits: todayDepositsAmount }))
//     })

//     return () => {
//       unsubUploads()
//       unsubPurchases()
//       unsubUsers()
//       unsubDeposits()
//     }
//   }, [])

//   const stats = [
//     {
//       title: "Total Revenue",
//       value: `₦${totalRevenue.toLocaleString()}`,
//       change: "+12.5%",
//       trend: "up",
//       icon: DollarSign,
//       description: "vs last month",
//     },
//     {
//       title: "Total Users",
//       value: userCount.toLocaleString(),
//       change: "+8.2%",
//       trend: "up",
//       icon: Users,
//       description: "active users",
//     },
//     {
//       title: "Logs Uploaded",
//       value: logsCount.toLocaleString(),
//       change: "+23.1%",
//       trend: "up",
//       icon: UploadCloud,
//       description: "this month",
//     },
//     {
//       title: "Total Transactions",
//       value: transactionsCount.toLocaleString(),
//       change: "+18.4%",
//       trend: "up",
//       icon: CreditCard,
//       description: "completed",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
//           <p className="text-sm sm:text-base text-muted-foreground">
//             Real-time insights into your Social Media Logs platform
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm">
//             Export Data
//           </Button>
//           <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
//             Upload New Log
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon
//           return (
//             <Card key={stat.title} className="border-border bg-card hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
//                 <Icon className="h-4 w-4 text-primary" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge
//                     variant={stat.trend === "up" ? "default" : "secondary"}
//                     className={stat.trend === "up" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
//                   >
//                     {stat.change}
//                   </Badge>
//                   <p className="text-xs text-muted-foreground">{stat.description}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold text-foreground mb-4">Today's Performance</h2>
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//           <Card className="border-border bg-card hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-card-foreground">Orders Revenue</CardTitle>
//               <ShoppingCart className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">₦{todayStats.ordersRevenue.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground mt-1">From purchases today</p>
//             </CardContent>
//           </Card>

//           <Card className="border-border bg-card hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-card-foreground">Logs Deposited</CardTitle>
//               <UploadCloud className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">{todayStats.logsDeposited.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground mt-1">New logs uploaded</p>
//             </CardContent>
//           </Card>

//           <Card className="border-border bg-card hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-card-foreground">Accounts Sold</CardTitle>
//               <CreditCard className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">{todayStats.accountsSold.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground mt-1">From credentials array</p>
//             </CardContent>
//           </Card>

//           <Card className="border-border bg-card hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-card-foreground">New Members</CardTitle>
//               <Users className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">{todayStats.newMembers.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground mt-1">Registered today</p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="mt-4">
//           <Card className="border-border bg-card hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-base font-medium text-card-foreground">Today's Deposits</CardTitle>
//               <TrendingUp className="h-5 w-5 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-primary">₦{todayStats.todayDeposits.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground mt-2">Total deposits from transaction notifications</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
//         <Card className="border-border bg-card">
//           <CardHeader>
//             <CardTitle className="text-card-foreground">Recent Logs</CardTitle>
//             <CardDescription>Latest log uploads and their status</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {loading ? (
//                 <div className="text-center py-4 text-muted-foreground">Loading logs...</div>
//               ) : recentLogs.length === 0 ? (
//                 <div className="text-center py-4 text-muted-foreground">No logs found</div>
//               ) : (
//                 recentLogs.map((log) => (
//                   <div
//                     key={log.id}
//                     className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                         <PlatformIcon platform={log.platform} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-card-foreground">{log.id}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {log.platform} • {log.user}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold text-card-foreground">{log.price}</p>
//                       <div className="flex items-center gap-2">
//                         <Badge
//                           variant={log.status === "sold" ? "default" : "secondary"}
//                           className="text-xs"
//                         >
//                           {log.status}
//                         </Badge>
//                         <p className="text-xs text-muted-foreground">{log.time}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-border bg-card">
//           <CardHeader>
//             <CardTitle className="text-card-foreground">Recent Transactions</CardTitle>
//             <CardDescription>Latest purchases and sales</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentTransactions.length === 0 ? (
//                 <div className="text-center py-4 text-muted-foreground">No transactions found</div>
//               ) : (
//                 recentTransactions.map((txn) => (
//                   <div
//                     key={txn.id}
//                     className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                         <CreditCard className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-card-foreground">{txn.transactionId}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {txn.buyer} • {txn.logs} logs
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold text-primary">{txn.amount}</p>
//                       <p className="text-xs text-muted-foreground">{txn.time}</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UploadCloud,
  DollarSign,
  CreditCard,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// react-icons for platform icons
import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiTiktok,
  SiSnapchat,
  SiYoutube,
  SiLinkedin,
  SiTelegram,
} from "react-icons/si";
import { FaGlobe } from "react-icons/fa";

// Helper function to check if date is today
function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isWithinLastDays(date: Date, days: number) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < days;
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = (platform || "").toLowerCase();
  if (p.includes("instagram"))
    return <SiInstagram className="h-5 w-5 text-primary" />;
  if (p.includes("facebook"))
    return <SiFacebook className="h-5 w-5 text-primary" />;
  if (p.includes("twitter") || p.includes("x"))
    return <SiX className="h-5 w-5 text-primary" />;
  if (p.includes("tiktok"))
    return <SiTiktok className="h-5 w-5 text-primary" />;
  if (p.includes("snapchat"))
    return <SiSnapchat className="h-5 w-5 text-primary" />;
  if (p.includes("youtube"))
    return <SiYoutube className="h-5 w-5 text-primary" />;
  if (p.includes("linkedin"))
    return <SiLinkedin className="h-5 w-5 text-primary" />;
  if (p.includes("telegram"))
    return <SiTelegram className="h-5 w-5 text-primary" />;
  return <FaGlobe className="h-5 w-5 text-primary" />;
}

export default function DashboardPage() {
  const [recentLogs, setRecentLogs] = useState<
    {
      id: string;
      platform: string;
      user: string;
      price: string;
      status: string;
      time: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalUploads: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [userCount, setUserCount] = useState(0);
  const [logsCount, setLogsCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  // Add states for today's data
  const [todayStats, setTodayStats] = useState({
    ordersRevenue: 0,
    logsDeposited: 0,
    accountsSold: 0,
    newMembers: 0,
    todayDeposits: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState({
    ordersRevenue: 0,
    logsDeposited: 0,
    accountsSold: 0,
    newMembers: 0,
    todayDeposits: 0,
  });

  const [performanceRange, setPerformanceRange] = useState<"today" | "weekly">(
    "today"
  );

  useEffect(() => {
    // Fetch users count
    const usersQuery = query(collection(db, "users"));
    const uploadsQuery = query(collection(db, "uploads"));
    const transactionsSumQuery = query(collection(db, "transactions"));

    const unsubUsers = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userCount = snapshot.size;
        setStatsData((prev) => ({ ...prev, totalUsers: userCount }));
        setUserCount(userCount);
      },
      (error) => {
        console.error("Error fetching users count:", error);
      }
    );

    const unsubUploads = onSnapshot(uploadsQuery, (snapshot) => {
      const uploadsCount = snapshot.size;
      setStatsData((prev) => ({ ...prev, totalUploads: uploadsCount }));
    });

    // subscribe and sum all transactions amounts (only purchases marked completed)
    const unsubSum = onSnapshot(
      transactionsSumQuery,
      (snapshot) => {
        const sum = snapshot.docs.reduce((acc, d) => {
          const data = d.data() as any;
          const amt = Number(data.amount) || 0;
          // include only purchase transactions that are completed
          if (data.type === "purchase" && data.status === "completed") {
            return acc + amt;
          }
          return acc;
        }, 0);
        setTotalRevenue(sum);
      },
      (err) => {
        console.error("Failed to compute total revenue:", err);
      }
    );

    // Get last 5 logs ordered by creation date
    const q = query(
      collection(db, "uploads"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.() || new Date();

          return {
            id: doc.id,
            platform: data.platform || "Unknown",
            user: data.account || "anonymous",
            price: `₦${data.price || 0}`,
            status: data.status || "active",
            time: timeAgo(createdAt),
          };
        });

        setRecentLogs(logs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      }
    );

    // Fetch recent transactions
    const transactionsQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      limit(5)
    );

    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactions = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            transactionId: data.purchaseId || data.paystackReference || doc.id,
            buyer: data.userUUID || "Unknown",
            amount: `₦${data.amount || 0}`,
            logs: data.quantity || 0,
            time: data.date?.toDate ? timeAgo(data.date.toDate()) : "N/A",
          };
        });
        setRecentTransactions(transactions);
      }
    );

    return () => {
      unsubUsers();
      unsubUploads();
      unsubscribe();
      unsubscribeTransactions();
      unsubSum();
    };
  }, []);

  useEffect(() => {
    // Query uploads collection
    const uploadsQuery = query(collection(db, "uploads"));

    const unsubUploads = onSnapshot(
      uploadsQuery,
      (snapshot) => {
        setLogsCount(snapshot.size);
      },
      (error) => {
        console.error("Error fetching uploads count:", error);
      }
    );

    return () => unsubUploads();
  }, []);

  useEffect(() => {
    // Query transactions collection - only completed transactions
    const transactionsQuery = query(
      collection(db, "transactions"),
      where("status", "==", "completed")
    );

    const unsubTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        setTransactionsCount(snapshot.size);
      },
      (error) => {
        console.error("Error fetching transactions count:", error);
      }
    );

    return () => unsubTransactions();
  }, []);

  useEffect(() => {
    // Fetch today's logs deposited (uploads)
    const uploadsQuery = query(collection(db, "uploads"));
    const unsubUploads = onSnapshot(uploadsQuery, (snapshot) => {
      let todayLogsDeposited = 0;
      let weeklyLogsDeposited = 0;

      snapshot.docs.forEach((doc) => {
        const createdAt = doc.data().createdAt?.toDate?.();
        if (!createdAt) return;

        if (isToday(createdAt)) {
          todayLogsDeposited++;
        }

        if (isWithinLastDays(createdAt, 7)) {
          weeklyLogsDeposited++;
        }
      });

      setTodayStats((prev) => ({ ...prev, logsDeposited: todayLogsDeposited }));
      setWeeklyStats((prev) => ({
        ...prev,
        logsDeposited: weeklyLogsDeposited,
      }));
    });
    //
    // Fetch today's orders revenue and accounts sold (purchases)
    const purchasesQuery = query(collection(db, "purchases"));
    const unsubPurchases = onSnapshot(purchasesQuery, (snapshot) => {
      let todayRevenue = 0;
      let todayAccountsSold = 0;
      let weeklyRevenue = 0;
      let weeklyAccountsSold = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const purchaseDate = data.purchaseDate?.toDate?.();

        if (!purchaseDate) return;

        if (isToday(purchaseDate)) {
          // Add to today's revenue from totalAmount
          todayRevenue += Number(data.totalAmount) || 0;

          // Count accounts sold (credentials array length)
          if (data.credentials && Array.isArray(data.credentials)) {
            todayAccountsSold += data.credentials.length;
          }
        }

        if (isWithinLastDays(purchaseDate, 7)) {
          weeklyRevenue += Number(data.totalAmount) || 0;

          if (data.credentials && Array.isArray(data.credentials)) {
            weeklyAccountsSold += data.credentials.length;
          }
        }
      });

      setTodayStats((prev) => ({
        ...prev,
        ordersRevenue: todayRevenue,
        accountsSold: todayAccountsSold,
      }));

      setWeeklyStats((prev) => ({
        ...prev,
        ordersRevenue: weeklyRevenue,
        accountsSold: weeklyAccountsSold,
      }));
    });

    // Fetch today's new members (users)
    const usersQuery = query(collection(db, "users"));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      let todayNewMembers = 0;
      let weeklyNewMembers = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt;

        // Handle both string and timestamp formats
        let createdDate;
        if (typeof createdAt === "string") {
          createdDate = new Date(createdAt);
        } else if (createdAt?.toDate) {
          createdDate = createdAt.toDate();
        }

        if (createdDate) {
          if (isToday(createdDate)) {
            todayNewMembers++;
          }

          if (isWithinLastDays(createdDate, 7)) {
            weeklyNewMembers++;
          }
        }
      });

      setTodayStats((prev) => ({ ...prev, newMembers: todayNewMembers }));
      setWeeklyStats((prev) => ({ ...prev, newMembers: weeklyNewMembers }));
    });

    // Fetch today's deposits (transactionNotifications)
    // Fetch today's deposits (transactionNotifications)
    const depositsQuery = query(collection(db, "transactionNotifications"));

    const unsubDeposits = onSnapshot(depositsQuery, (snapshot) => {
      let todayDepositsAmount = 0;
      let weeklyDepositsAmount = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const { amount, createdAt, timestamp, type } = data;

        if (type !== "deposit") return;

        // ✅ Safely convert to Date
        let depositDate = null;
        if (timestamp?.toDate) {
          depositDate = timestamp.toDate();
        } else if (typeof createdAt === "string") {
          depositDate = new Date(createdAt);
        }

        if (depositDate) {
          if (isToday(depositDate)) {
            todayDepositsAmount += Number(amount) || 0;
          }

          if (isWithinLastDays(depositDate, 7)) {
            weeklyDepositsAmount += Number(amount) || 0;
          }
        }
      });

      setTodayStats((prev) => ({
        ...prev,
        todayDeposits: todayDepositsAmount,
      }));

      setWeeklyStats((prev) => ({
        ...prev,
        todayDeposits: weeklyDepositsAmount,
      }));
    });

    return () => {
      unsubUploads();
      unsubPurchases();
      unsubUsers();
      unsubDeposits();
    };
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Total Users",
      value: userCount.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "active users",
    },
    {
      title: "Logs Uploaded",
      value: logsCount.toLocaleString(),
      change: "+23.1%",
      trend: "up",
      icon: UploadCloud,
      description: "this month",
    },
    {
      title: "Total Transactions",
      value: transactionsCount.toLocaleString(),
      change: "+18.4%",
      trend: "up",
      icon: CreditCard,
      description: "completed",
    },
  ];

  const activeStats = performanceRange === "today" ? todayStats : weeklyStats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Real-time insights into your Social Media Logs platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Upload New Log
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-border bg-card hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className={
                      stat.trend === "up"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : ""
                    }
                  >
                    {stat.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {performanceRange === "today"
              ? "Today's Performance"
              : "Weekly Performance"}
          </h2>
          <Select
            value={performanceRange}
            onValueChange={(value) =>
              setPerformanceRange(value as "today" | "weekly")
            }
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Orders Revenue
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ₦{activeStats.ordersRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {performanceRange === "today"
                  ? "From purchases today"
                  : "From purchases this week"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Logs Deposited
              </CardTitle>
              <UploadCloud className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {activeStats.logsDeposited.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {performanceRange === "today"
                  ? "New logs uploaded"
                  : "Logs uploaded this week"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Accounts Sold
              </CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {activeStats.accountsSold.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From credentials array
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                New Members
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {activeStats.newMembers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {performanceRange === "today"
                  ? "Registered today"
                  : "Registered this week"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-card-foreground">
                {performanceRange === "today"
                  ? "Today's Deposits"
                  : "Weekly Deposits"}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ₦{activeStats.todayDeposits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total deposits from transaction notifications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Logs</CardTitle>
            <CardDescription>
              Latest log uploads and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading logs...
                </div>
              ) : recentLogs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No logs found
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <PlatformIcon platform={log.platform} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {log.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.platform} • {log.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-card-foreground">
                        {log.price}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            log.status === "sold" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest purchases and sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No transactions found
                </div>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {txn.transactionId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {txn.buyer} • {txn.logs} logs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {txn.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {txn.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
