

// "use client"

// import { useEffect, useState } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { db } from "@/lib/firebase"
// import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
// import { Modal } from "@/components/ui/modal"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Search, Filter, X, User, Hash, DollarSign, Mail, Package, FileText } from "lucide-react"

// const platforms = [
//   "Instagram",
//   "Twitter/X",
//   "TikTok",
//   "Facebook",
//   "Snapchat",
//   "YouTube",
//   "LinkedIn",
//   "Telegram",
//   "VPN",
//   "Google Voice",
//   "Email",
//   "Other",
// ]

// type UploadLog = {
//   id: string
//   platform: string
//   account: string
//   followers: number
//   mailIncluded: boolean
//   logs: number
//   bulkLogs?: string[]
//   price: number
//   status: "Available" | "Sold"
//   subcategory?: string
//   description?: string
//   vpnType?: string
//   createdAt: any
// }

// export function UploadLogsTable() {
//   const [uploads, setUploads] = useState<UploadLog[]>([])
//   const [filteredUploads, setFilteredUploads] = useState<UploadLog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingLog, setEditingLog] = useState<UploadLog | null>(null)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [viewLog, setViewLog] = useState<UploadLog | null>(null)
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [updating, setUpdating] = useState(false)
  
//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedPlatform, setSelectedPlatform] = useState<string>("all")

//   useEffect(() => {
//     const q = query(collection(db, "uploads"), orderBy("createdAt", "desc"))
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const uploadData: UploadLog[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           platform: doc.data().platform,
//           account: doc.data().account,
//           followers: doc.data().followers || 0,
//           mailIncluded: doc.data().mailIncluded,
//           logs: doc.data().logs,
//           bulkLogs: doc.data().bulkLogs || [],
//           price: doc.data().price,
//           status: doc.data().status || "Available",
//           subcategory: doc.data().subcategory || "",
//           description: doc.data().description || "",
//           vpnType: doc.data().vpnType || "",
//           createdAt: doc.data().createdAt,
//         }))
//         setUploads(uploadData)
//         setLoading(false)
//       },
//       (error) => {
//         console.error("Error fetching uploads:", error)
//         setLoading(false)
//       }
//     )

//     return () => unsubscribe()
//   }, [])

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = uploads

//     // Filter by platform
//     if (selectedPlatform !== "all") {
//       filtered = filtered.filter(
//         (upload) => upload.platform.toLowerCase() === selectedPlatform.toLowerCase()
//       )
//     }

//     // Search by account name, platform, status, or subcategory
//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (upload) =>
//           upload.account.toLowerCase().includes(query) ||
//           upload.platform.toLowerCase().includes(query) ||
//           upload.status.toLowerCase().includes(query) ||
//           (upload.subcategory && upload.subcategory.toLowerCase().includes(query)) ||
//           (upload.description && upload.description.toLowerCase().includes(query))
//       )
//     }

//     setFilteredUploads(filtered)
//   }, [uploads, searchQuery, selectedPlatform])

//   const handleEdit = (log: UploadLog) => {
//     setEditingLog({ ...log })
//     setShowEditModal(true)
//   }

//   const handleUpdate = async () => {
//     if (!editingLog) return
//     setUpdating(true)

//     try {
//       const docRef = doc(db, "uploads", editingLog.id)
//       await updateDoc(docRef, {
//         platform: editingLog.platform,
//         account: editingLog.account,
//         followers: Number(editingLog.followers),
//         logs: Number(editingLog.logs),
//         bulkLogs: editingLog.bulkLogs || [],
//         price: Number(editingLog.price),
//         mailIncluded: editingLog.mailIncluded,
//         status: editingLog.status,
//         subcategory: editingLog.subcategory || "",
//         description: editingLog.description || "",
//         vpnType: editingLog.vpnType || "",
//       })
//       setShowEditModal(false)
//       setEditingLog(null)
//     } catch (error) {
//       console.error("Error updating document:", error)
//       alert("Failed to update log. Please try again.")
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, "uploads", id))
//       setShowDeleteModal(false)
//       setDeleteId(null)
//     } catch (error) {
//       console.error("Error deleting document:", error)
//       alert("Failed to delete log. Please try again.")
//     }
//   }

//   const clearFilters = () => {
//     setSearchQuery("")
//     setSelectedPlatform("all")
//   }

//   const hasActiveFilters = searchQuery !== "" || selectedPlatform !== "all"

//   // Check if platform needs VPN type field
//   const needsVpnType = (platform: string) => {
//     return platform === "vpn" || platform === "google voice" || platform === "email"
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Uploads</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* Search and Filter Bar */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-6">
//             {/* Search Input */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search by account, platform, subcategory, or status..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-10"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Platform Filter */}
//             <div className="flex gap-2 items-center">
//               <Filter className="text-gray-400 w-4 h-4" />
//               <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Platforms" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Platforms</SelectItem>
//                   {platforms.map((platform) => (
//                     <SelectItem key={platform} value={platform.toLowerCase()}>
//                       {platform}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Clear Filters Button */}
//             {hasActiveFilters && (
//               <Button variant="outline" size="sm" onClick={clearFilters}>
//                 Clear Filters
//               </Button>
//             )}
//           </div>

//           {/* Results Count */}
//           {hasActiveFilters && (
//             <div className="mb-3 text-sm text-gray-600">
//               Showing {filteredUploads.length} of {uploads.length} uploads
//             </div>
//           )}

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Platform</TableHead>
//                 <TableHead>Account Name</TableHead>
//                 <TableHead>Subcategory</TableHead>
//                 <TableHead>Followers</TableHead>
//                 <TableHead>Mail Included</TableHead>
//                 <TableHead>Logs</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-4">
//                     Loading uploads...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredUploads.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-4">
//                     {hasActiveFilters
//                       ? "No uploads match your search or filter criteria"
//                       : "No uploads found"}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUploads.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     className="hover:bg-muted/40 transition cursor-pointer"
//                     onClick={() => {
//                       setViewLog(row)
//                       setShowViewModal(true)
//                     }}
//                   >
//                     <TableCell className="font-medium">{row.platform}</TableCell>
//                     <TableCell>{row.account}</TableCell>
//                     <TableCell className="break-words">{row.subcategory || "N/A"}</TableCell>
//                     <TableCell>
//                       {typeof row.followers === "number"
//                         ? `${row.followers.toLocaleString()}`
//                         : row.followers}
//                     </TableCell>
//                     <TableCell>{row.mailIncluded ? "Yes" : "No"}</TableCell>
//                     <TableCell>{row.logs}</TableCell>
//                     <TableCell>₦{row.price.toLocaleString()}</TableCell>
//                     <TableCell>
//                       <Badge variant={row.status === "Available" ? "default" : "secondary"}>
//                         {row.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEdit(row)
//                           }}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             setDeleteId(row.id)
//                             setShowDeleteModal(true)
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Professional View Modal */}
//       <Modal
//         isOpen={showViewModal}
//         onClose={() => {
//           setShowViewModal(false)
//           setViewLog(null)
//         }}
//         title="Log Details"
//       >
//         {viewLog && (
//           <div className="space-y-6 max-h-[400px] overflow-y-auto">
//             {/* Header Section with Status Badge */}
//             <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">{viewLog.account}</h3>
//                 <p className="text-sm text-gray-500 mt-1 font-medium">{viewLog.platform}</p>
//               </div>
//               <Badge 
//                 variant={viewLog.status === "Available" ? "default" : "secondary"}
//                 className="text-sm px-4 py-1.5 font-semibold"
//               >
//                 {viewLog.status}
//               </Badge>
//             </div>

//             {/* Details Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               {/* Subcategory */}
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Package className="w-4 h-4 text-blue-700" />
//                   <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Subcategory</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.subcategory || "N/A"}</p>
//               </div>

//               {/* Followers or Type */}
//               <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <User className="w-4 h-4 text-purple-700" />
//                   <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
//                     {needsVpnType(viewLog.platform.toLowerCase()) ? "Type" : "Followers"}
//                   </span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {needsVpnType(viewLog.platform.toLowerCase())
//                     ? viewLog.vpnType || "N/A"
//                     : viewLog.followers.toLocaleString()}
//                 </p>
//               </div>

//               {/* Logs Count */}
//               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Hash className="w-4 h-4 text-green-700" />
//                   <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Logs Count</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.logs}</p>
//               </div>

//               {/* Price */}
//               <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <DollarSign className="w-4 h-4 text-amber-700" />
//                   <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Price</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">₦{viewLog.price.toLocaleString()}</p>
//               </div>

//               {/* Mail Included */}
//               <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200 shadow-sm col-span-2">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Mail className="w-4 h-4 text-pink-700" />
//                   <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">Mail Included</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.mailIncluded ? "Yes" : "No"}</p>
//               </div>
//             </div>

//             {/* Description Section */}
//             {viewLog.description && (
//               <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200 shadow-md">
//                 <div className="flex items-center gap-2 mb-3">
//                   <FileText className="w-5 h-5 text-indigo-700" />
//                   <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Description</h4>
//                 </div>
//                 <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
//                   {viewLog.description}
//                 </p>
//               </div>
//             )}

//             {/* Bulk Logs Section */}
//             <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bulk Logs</h4>
//                 <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300 font-semibold">
//                   {viewLog.bulkLogs?.length || 0} entries
//                 </span>
//               </div>
//               <div className="bg-gray-900 rounded-lg p-4 max-h-[300px] overflow-y-auto shadow-inner">
//                 <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
//                   {viewLog.bulkLogs?.length
//                     ? viewLog.bulkLogs.join("\n")
//                     : "No bulk logs available."}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Professional Edit Modal */}
//       <Modal
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false)
//           setEditingLog(null)
//         }}
//         title="Edit Log"
//       >
//         {editingLog && (
//           <div className="max-h-[80vh] overflow-y-auto px-1">
//             <div className="space-y-5 p-6 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-inner">
//               {/* Platform Selection */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Platform *</Label>
//                 <Select
//                   value={editingLog.platform.toLowerCase()}
//                   onValueChange={(value) => setEditingLog({ ...editingLog, platform: value })}
//                 >
//                   <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
//                     <SelectValue>
//                       {editingLog.platform || "Select a platform"}
//                     </SelectValue>
//                   </SelectTrigger>
//                   <SelectContent>
//                     {platforms.map((p) => (
//                       <SelectItem key={p} value={p.toLowerCase()}>
//                         {p}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Account Name */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Account Name *</Label>
//                 <Input
//                   value={editingLog.account}
//                   onChange={(e) => setEditingLog({ ...editingLog, account: e.target.value })}
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   placeholder="Enter account name"
//                 />
//               </div>

//               {/* Subcategory */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Subcategory</Label>
//                 <Input
//                   value={editingLog.subcategory || ""}
//                   onChange={(e) => setEditingLog({ ...editingLog, subcategory: e.target.value })}
//                   placeholder="e.g., Instagram big boys, USA account"
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                 />
//               </div>

//               {/* Conditional: VPN Type OR Followers */}
//               {needsVpnType(editingLog.platform.toLowerCase()) ? (
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">
//                     {editingLog.platform === "vpn" ? "VPN Type" : 
//                      editingLog.platform === "google voice" ? "Google Voice Type" : "Email Type"} *
//                   </Label>
//                   <Input
//                     value={editingLog.vpnType || ""}
//                     onChange={(e) => setEditingLog({ ...editingLog, vpnType: e.target.value })}
//                     placeholder={
//                       editingLog.platform === "vpn" 
//                         ? "e.g. NordVPN, ExpressVPN" 
//                         : editingLog.platform === "google voice" 
//                         ? "e.g. US Number, Canada Number" 
//                         : "e.g. Gmail, Outlook"
//                     }
//                     className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   />
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Followers *</Label>
//                   <Input
//                     type="number"
//                     value={editingLog.followers}
//                     onChange={(e) =>
//                       setEditingLog({ ...editingLog, followers: Number(e.target.value) })
//                     }
//                     className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                     min="0"
//                   />
//                 </div>
//               )}

//               {/* Logs Count */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Logs Count *</Label>
//                 <Input
//                   type="number"
//                   value={editingLog.logs}
//                   onChange={(e) =>
//                     setEditingLog({ ...editingLog, logs: Number(e.target.value) })
//                   }
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   min="0"
//                 />
//               </div>

//               {/* Bulk Logs Textarea */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Bulk Logs</Label>
//                 <textarea
//                   value={editingLog.bulkLogs?.join("\n") || ""}
//                   onChange={(e) =>
//                     setEditingLog({
//                       ...editingLog,
//                       bulkLogs: e.target.value.split("\n"),
//                     })
//                   }
//                   placeholder="Enter each log on a new line...
// username1:password1
// username2:password2"
//                   rows={8}
//                   className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono text-sm p-3 transition-all"
//                 />
//                 <p className="text-xs text-gray-500 font-medium">
//                   Enter one log per line. Lines: {editingLog.bulkLogs?.length || 0}
//                 </p>
//               </div>

//               {/* Description Textarea */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Description</Label>
//                 <textarea
//                   value={editingLog.description || ""}
//                   onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
//                   placeholder="Add any additional information about the logs and platform..."
//                   rows={4}
//                   className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm p-3 transition-all"
//                 />
//                 <p className="text-xs text-gray-500 font-medium">
//                   Optional: Describe the logs, account quality, or any special features.
//                 </p>
//               </div>

//               {/* Price and Mail Included */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Price (₦) *</Label>
//                   <Input
//                     type="number"
//                     value={editingLog.price}
//                     onChange={(e) =>
//                       setEditingLog({ ...editingLog, price: Number(e.target.value) })
//                     }
//                     className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                     min="0"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Mail Included</Label>
//                   <div className="flex items-center gap-3 h-10 px-3 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
//                     <Switch
//                       checked={editingLog.mailIncluded}
//                       onCheckedChange={(checked) =>
//                         setEditingLog({ ...editingLog, mailIncluded: checked })
//                       }
//                     />
//                     <span className="text-sm text-gray-700 font-semibold">
//                       {editingLog.mailIncluded ? "Yes" : "No"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Status */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Status *</Label>
//                 <Select
//                   value={editingLog.status}
//                   onValueChange={(value: "Available" | "Sold") =>
//                     setEditingLog({ ...editingLog, status: value })
//                   }
//                 >
//                   <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Available">Available</SelectItem>
//                     <SelectItem value="Sold">Sold</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
//                 <Button
//                   variant="outline"
//                   className="px-6 border-2 hover:bg-gray-100 transition-all"
//                   onClick={() => {
//                     setShowEditModal(false)
//                     setEditingLog(null)
//                   }}
//                   disabled={updating}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={handleUpdate} 
//                   disabled={updating} 
//                   className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all"
//                 >
//                   {updating ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false)
//           setDeleteId(null)
//         }}
//         title="Confirm Delete"
//         variant="error"
//       >
//         <div className="space-y-4">
//           <p className="text-gray-700">Are you sure you want to delete this log? This action cannot be undone.</p>
//           <div className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowDeleteModal(false)
//                 setDeleteId(null)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => deleteId && handleDelete(deleteId)}
//             >
//               Delete
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   )
// }






// "use client"

// import { useEffect, useState } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { db } from "@/lib/firebase"
// import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
// import { Modal } from "@/components/ui/modal"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Search, Filter, X, User, Hash, DollarSign, Mail, Package, FileText, Tag } from "lucide-react"

// const platforms = [
//   "Instagram",
//   "Twitter/X",
//   "TikTok",
//   "Facebook",
//   "Snapchat",
//   "YouTube",
//   "LinkedIn",
//   "Telegram",
//   "VPN",
//   "Google Voice",
//   "Email",
//   "Other",
// ]

// type UploadLog = {
//   id: string
//   platform: string
//   account: string
//   followers: number
//   mailIncluded: boolean
//   logs: number
//   bulkLogs?: string[]
//   price: number
//   status: "Available" | "Sold"
//   subcategory?: string
//   description?: string
//   vpnType?: string
//   createdAt: any
// }

// export function UploadLogsTable() {
//   const [uploads, setUploads] = useState<UploadLog[]>([])
//   const [filteredUploads, setFilteredUploads] = useState<UploadLog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingLog, setEditingLog] = useState<UploadLog | null>(null)
//   const [customPlatform, setCustomPlatform] = useState("")
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [viewLog, setViewLog] = useState<UploadLog | null>(null)
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [updating, setUpdating] = useState(false)
  
//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedPlatform, setSelectedPlatform] = useState<string>("all")

//   useEffect(() => {
//     const q = query(collection(db, "uploads"), orderBy("createdAt", "desc"))
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const uploadData: UploadLog[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           platform: doc.data().platform,
//           account: doc.data().account,
//           followers: doc.data().followers || 0,
//           mailIncluded: doc.data().mailIncluded,
//           logs: doc.data().logs,
//           bulkLogs: doc.data().bulkLogs || [],
//           price: doc.data().price,
//           status: doc.data().status || "Available",
//           subcategory: doc.data().subcategory || "",
//           description: doc.data().description || "",
//           vpnType: doc.data().vpnType || "",
//           createdAt: doc.data().createdAt,
//         }))
//         setUploads(uploadData)
//         setLoading(false)
//       },
//       (error) => {
//         console.error("Error fetching uploads:", error)
//         setLoading(false)
//       }
//     )

//     return () => unsubscribe()
//   }, [])

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = uploads

//     // Filter by platform
//     if (selectedPlatform !== "all") {
//       filtered = filtered.filter(
//         (upload) => upload.platform.toLowerCase() === selectedPlatform.toLowerCase()
//       )
//     }

//     // Search by account name, platform, status, or subcategory
//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (upload) =>
//           upload.account.toLowerCase().includes(query) ||
//           upload.platform.toLowerCase().includes(query) ||
//           upload.status.toLowerCase().includes(query) ||
//           (upload.subcategory && upload.subcategory.toLowerCase().includes(query)) ||
//           (upload.description && upload.description.toLowerCase().includes(query))
//       )
//     }

//     setFilteredUploads(filtered)
//   }, [uploads, searchQuery, selectedPlatform])

//   const handleEdit = (log: UploadLog) => {
//     setEditingLog({ ...log })
//     // Check if platform is custom (not in standard list)
//     const isCustomPlatform = !platforms.map(p => p.toLowerCase()).includes(log.platform.toLowerCase())
//     if (isCustomPlatform) {
//       setCustomPlatform(log.platform)
//     } else {
//       setCustomPlatform("")
//     }
//     setShowEditModal(true)
//   }

//   const handleUpdate = async () => {
//     if (!editingLog) return
//     setUpdating(true)

//     try {
//       const docRef = doc(db, "uploads", editingLog.id)
//       const finalPlatform = editingLog.platform === "other" ? customPlatform : editingLog.platform
      
//       await updateDoc(docRef, {
//         platform: finalPlatform,
//         account: editingLog.account,
//         followers: Number(editingLog.followers),
//         logs: Number(editingLog.logs),
//         bulkLogs: editingLog.bulkLogs || [],
//         price: Number(editingLog.price),
//         mailIncluded: editingLog.mailIncluded,
//         status: editingLog.status,
//         subcategory: editingLog.subcategory || "",
//         description: editingLog.description || "",
//         vpnType: editingLog.vpnType || "",
//       })
//       setShowEditModal(false)
//       setEditingLog(null)
//       setCustomPlatform("")
//     } catch (error) {
//       console.error("Error updating document:", error)
//       alert("Failed to update log. Please try again.")
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, "uploads", id))
//       setShowDeleteModal(false)
//       setDeleteId(null)
//     } catch (error) {
//       console.error("Error deleting document:", error)
//       alert("Failed to delete log. Please try again.")
//     }
//   }

//   const clearFilters = () => {
//     setSearchQuery("")
//     setSelectedPlatform("all")
//   }

//   const hasActiveFilters = searchQuery !== "" || selectedPlatform !== "all"

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Uploads</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* Search and Filter Bar */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search by account, platform, subcategory, or status..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-10"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             <div className="flex gap-2 items-center">
//               <Filter className="text-gray-400 w-4 h-4" />
//               <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="All Platforms" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Platforms</SelectItem>
//                   {platforms.map((platform) => (
//                     <SelectItem key={platform} value={platform.toLowerCase()}>
//                       {platform}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {hasActiveFilters && (
//               <Button variant="outline" size="sm" onClick={clearFilters}>
//                 Clear Filters
//               </Button>
//             )}
//           </div>

//           {hasActiveFilters && (
//             <div className="mb-3 text-sm text-gray-600">
//               Showing {filteredUploads.length} of {uploads.length} uploads
//             </div>
//           )}

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Platform</TableHead>
//                 <TableHead>Account Name</TableHead>
//                 <TableHead>Subcategory</TableHead>
//                 <TableHead>Followers</TableHead>
//                 <TableHead>Mail Included</TableHead>
//                 <TableHead>Logs</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-4">
//                     Loading uploads...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredUploads.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-4">
//                     {hasActiveFilters
//                       ? "No uploads match your search or filter criteria"
//                       : "No uploads found"}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredUploads.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     className="hover:bg-muted/40 transition cursor-pointer"
//                     onClick={() => {
//                       setViewLog(row)
//                       setShowViewModal(true)
//                     }}
//                   >
//                     <TableCell className="font-medium">{row.platform}</TableCell>
//                     <TableCell>{row.account}</TableCell>
//                     <TableCell className="break-words">{row.subcategory || "N/A"}</TableCell>
//                     <TableCell>
//                       {typeof row.followers === "number"
//                         ? `${row.followers.toLocaleString()}`
//                         : row.followers}
//                     </TableCell>
//                     <TableCell>{row.mailIncluded ? "Yes" : "No"}</TableCell>
//                     <TableCell>{row.logs}</TableCell>
//                     <TableCell>₦{row.price.toLocaleString()}</TableCell>
//                     <TableCell>
//                       <Badge variant={row.status === "Available" ? "default" : "secondary"}>
//                         {row.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEdit(row)
//                           }}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             setDeleteId(row.id)
//                             setShowDeleteModal(true)
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Professional View Modal */}
//       <Modal
//         isOpen={showViewModal}
//         onClose={() => {
//           setShowViewModal(false)
//           setViewLog(null)
//         }}
//         title="Log Details"
//       >
//         {viewLog && (
//           <div className="space-y-6 max-h-[500px] overflow-y-auto">
//             <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">{viewLog.account}</h3>
//                 <p className="text-sm text-gray-500 mt-1 font-medium">{viewLog.platform}</p>
//               </div>
//               <Badge 
//                 variant={viewLog.status === "Available" ? "default" : "secondary"}
//                 className="text-sm px-4 py-1.5 font-semibold"
//               >
//                 {viewLog.status}
//               </Badge>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Package className="w-4 h-4 text-blue-700" />
//                   <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Subcategory</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.subcategory || "N/A"}</p>
//               </div>

//               {/* Type - NOW ALWAYS SHOWN */}
//               <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Tag className="w-4 h-4 text-purple-700" />
//                   <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Type</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.vpnType || "N/A"}</p>
//               </div>

//               <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <User className="w-4 h-4 text-teal-700" />
//                   <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Followers</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.followers.toLocaleString()}</p>
//               </div>

//               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Hash className="w-4 h-4 text-green-700" />
//                   <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Logs Count</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.logs}</p>
//               </div>

//               <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <DollarSign className="w-4 h-4 text-amber-700" />
//                   <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Price</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">₦{viewLog.price.toLocaleString()}</p>
//               </div>

//               <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Mail className="w-4 h-4 text-pink-700" />
//                   <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">Mail Included</span>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{viewLog.mailIncluded ? "Yes" : "No"}</p>
//               </div>
//             </div>

//             {viewLog.description && (
//               <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200 shadow-md">
//                 <div className="flex items-center gap-2 mb-3">
//                   <FileText className="w-5 h-5 text-indigo-700" />
//                   <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Description</h4>
//                 </div>
//                 <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
//                   {viewLog.description}
//                 </p>
//               </div>
//             )}

//             <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bulk Logs</h4>
//                 <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300 font-semibold">
//                   {viewLog.bulkLogs?.length || 0} entries
//                 </span>
//               </div>
//               <div className="bg-gray-900 rounded-lg p-4 max-h-[300px] overflow-y-auto shadow-inner">
//                 <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
//                   {viewLog.bulkLogs?.length
//                     ? viewLog.bulkLogs.join("\n")
//                     : "No bulk logs available."}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Edit Modal with Custom Platform Support */}
//       <Modal
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false)
//           setEditingLog(null)
//           setCustomPlatform("")
//         }}
//         title="Edit Log"
//       >
//         {editingLog && (
//           <div className="max-h-[80vh] overflow-y-auto px-1">
//             <div className="space-y-5 p-6 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-inner">
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Platform *</Label>
//                 <Select
//                   value={editingLog.platform.toLowerCase()}
//                   onValueChange={(value) => setEditingLog({ ...editingLog, platform: value })}
//                 >
//                   <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
//                     <SelectValue>
//                       {editingLog.platform || "Select a platform"}
//                     </SelectValue>
//                   </SelectTrigger>
//                   <SelectContent>
//                     {platforms.map((p) => (
//                       <SelectItem key={p} value={p.toLowerCase()}>
//                         {p}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {editingLog.platform === "other" && (
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Platform Name *</Label>
//                   <Input
//                     value={customPlatform}
//                     onChange={(e) => setCustomPlatform(e.target.value)}
//                     placeholder="Enter platform name"
//                     className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Account Name *</Label>
//                 <Input
//                   value={editingLog.account}
//                   onChange={(e) => setEditingLog({ ...editingLog, account: e.target.value })}
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   placeholder="Enter account name"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Subcategory</Label>
//                 <Input
//                   value={editingLog.subcategory || ""}
//                   onChange={(e) => setEditingLog({ ...editingLog, subcategory: e.target.value })}
//                   placeholder="e.g., Instagram big boys, USA account"
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                 />
//               </div>

//               {/* Type - NOW FOR ALL PLATFORMS */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Type *</Label>
//                 <Input
//                   value={editingLog.vpnType || ""}
//                   onChange={(e) => setEditingLog({ ...editingLog, vpnType: e.target.value })}
//                   placeholder="e.g. Personal, Business, Verified, Premium"
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Followers</Label>
//                 <Input
//                   type="number"
//                   value={editingLog.followers}
//                   onChange={(e) =>
//                     setEditingLog({ ...editingLog, followers: Number(e.target.value) })
//                   }
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   min="0"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Logs Count *</Label>
//                 <Input
//                   type="number"
//                   value={editingLog.logs}
//                   onChange={(e) =>
//                     setEditingLog({ ...editingLog, logs: Number(e.target.value) })
//                   }
//                   className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                   min="0"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Bulk Logs</Label>
//                 <textarea
//                   value={editingLog.bulkLogs?.join("\n") || ""}
//                   onChange={(e) =>
//                     setEditingLog({
//                       ...editingLog,
//                       bulkLogs: e.target.value.split("\n"),
//                     })
//                   }
//                   placeholder="Enter each log on a new line...
// username1:password1
// username2:password2"
//                   rows={8}
//                   className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono text-sm p-3 transition-all"
//                 />
//                 <p className="text-xs text-gray-500 font-medium">
//                   Enter one log per line. Lines: {editingLog.bulkLogs?.length || 0}
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Description</Label>
//                 <textarea
//                   value={editingLog.description || ""}
//                   onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
//                   placeholder="Add any additional information about the logs and platform..."
//                   rows={4}
//                   className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm p-3 transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Price (₦) *</Label>
//                   <Input
//                     type="number"
//                     value={editingLog.price}
//                     onChange={(e) =>
//                       setEditingLog({ ...editingLog, price: Number(e.target.value) })
//                     }
//                     className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
//                     min="0"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-gray-700">Mail Included</Label>
//                   <div className="flex items-center gap-3 h-10 px-3 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
//                     <Switch
//                       checked={editingLog.mailIncluded}
//                       onCheckedChange={(checked) =>
//                         setEditingLog({ ...editingLog, mailIncluded: checked })
//                       }
//                     />
//                     <span className="text-sm text-gray-700 font-semibold">
//                       {editingLog.mailIncluded ? "Yes" : "No"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-gray-700">Status *</Label>
//                 <Select
//                   value={editingLog.status}
//                   onValueChange={(value: "Available" | "Sold") =>
//                     setEditingLog({ ...editingLog, status: value })
//                   }
//                 >
//                   <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Available">Available</SelectItem>
//                     <SelectItem value="Sold">Sold</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
//                 <Button
//                   variant="outline"
//                   className="px-6 border-2 hover:bg-gray-100 transition-all"
//                   onClick={() => {
//                     setShowEditModal(false)
//                     setEditingLog(null)
//                     setCustomPlatform("")
//                   }}
//                   disabled={updating}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={handleUpdate} 
//                   disabled={updating} 
//                   className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all"
//                 >
//                   {updating ? "Saving..." : "Save Changes"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false)
//           setDeleteId(null)
//         }}
//         title="Confirm Delete"
//         variant="error"
//       >
//         <div className="space-y-4">
//           <p className="text-gray-700">Are you sure you want to delete this log? This action cannot be undone.</p>
//           <div className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowDeleteModal(false)
//                 setDeleteId(null)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => deleteId && handleDelete(deleteId)}
//             >
//               Delete
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Filter, X, User, Hash, DollarSign, Mail, Package, FileText, Tag } from "lucide-react"

const platforms = [
  "Instagram",
  "Twitter/X",
  "TikTok",
  "Facebook",
  "Snapchat",
  "YouTube",
  "LinkedIn",
  "Telegram",
  "VPN",
  "Google Voice",
  "Email",
  "Other",
]

type UploadLog = {
  id: string
  platform: string
  account: string
  followers: number
  mailIncluded: boolean
  logs: number
  bulkLogs?: string[]
  price: number
  status: "Available" | "Sold"
  subcategory?: string
  descriptionHeader?: string
  description?: string
  vpnType?: string
  createdAt: any
}

export function UploadLogsTable() {
  const [uploads, setUploads] = useState<UploadLog[]>([])
  const [filteredUploads, setFilteredUploads] = useState<UploadLog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLog, setEditingLog] = useState<UploadLog | null>(null)
  const [customPlatform, setCustomPlatform] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewLog, setViewLog] = useState<UploadLog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")

  useEffect(() => {
    const q = query(collection(db, "uploads"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const uploadData: UploadLog[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          platform: doc.data().platform,
          account: doc.data().account,
          followers: doc.data().followers || 0,
          mailIncluded: doc.data().mailIncluded,
          logs: doc.data().logs,
          bulkLogs: doc.data().bulkLogs || [],
          price: doc.data().price,
          status: doc.data().status || "Available",
          subcategory: doc.data().subcategory || "",
          descriptionHeader: doc.data().descriptionHeader || "",
          description: doc.data().description || "",
          vpnType: doc.data().vpnType || "",
          createdAt: doc.data().createdAt,
        }))
        setUploads(uploadData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching uploads:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = uploads

    // Filter by platform
    if (selectedPlatform !== "all") {
      filtered = filtered.filter(
        (upload) => upload.platform.toLowerCase() === selectedPlatform.toLowerCase()
      )
    }

    // Search by account name, platform, status, or subcategory
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (upload) =>
          upload.account.toLowerCase().includes(query) ||
          upload.platform.toLowerCase().includes(query) ||
          upload.status.toLowerCase().includes(query) ||
          (upload.subcategory && upload.subcategory.toLowerCase().includes(query)) ||
          (upload.descriptionHeader && upload.descriptionHeader.toLowerCase().includes(query)) ||
          (upload.description && upload.description.toLowerCase().includes(query))
      )
    }

    setFilteredUploads(filtered)
  }, [uploads, searchQuery, selectedPlatform])

  const handleEdit = (log: UploadLog) => {
    setEditingLog({ ...log })
    // Check if platform is custom (not in standard list)
    const isCustomPlatform = !platforms.map(p => p.toLowerCase()).includes(log.platform.toLowerCase())
    if (isCustomPlatform) {
      setCustomPlatform(log.platform)
    } else {
      setCustomPlatform("")
    }
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editingLog) return
    setUpdating(true)

    try {
      const docRef = doc(db, "uploads", editingLog.id)
      const finalPlatform = editingLog.platform === "other" ? customPlatform : editingLog.platform
      
      await updateDoc(docRef, {
        platform: finalPlatform,
        account: editingLog.account,
        followers: Number(editingLog.followers),
        logs: Number(editingLog.logs),
        bulkLogs: editingLog.bulkLogs || [],
        price: Number(editingLog.price),
        mailIncluded: editingLog.mailIncluded,
        status: editingLog.status,
        subcategory: editingLog.subcategory || "",
        descriptionHeader: editingLog.descriptionHeader || "",
        description: editingLog.description || "",
        vpnType: editingLog.vpnType || "",
      })
      setShowEditModal(false)
      setEditingLog(null)
      setCustomPlatform("")
    } catch (error) {
      console.error("Error updating document:", error)
      alert("Failed to update log. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "uploads", id))
      setShowDeleteModal(false)
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting document:", error)
      alert("Failed to delete log. Please try again.")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedPlatform("all")
  }

  const hasActiveFilters = searchQuery !== "" || selectedPlatform !== "all"

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by account, platform, subcategory, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <Filter className="text-gray-400 w-4 h-4" />
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform.toLowerCase()}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mb-3 text-sm text-gray-600">
              Showing {filteredUploads.length} of {uploads.length} uploads
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Mail Included</TableHead>
                <TableHead>Logs</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Loading uploads...
                  </TableCell>
                </TableRow>
              ) : filteredUploads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    {hasActiveFilters
                      ? "No uploads match your search or filter criteria"
                      : "No uploads found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUploads.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/40 transition cursor-pointer"
                    onClick={() => {
                      setViewLog(row)
                      setShowViewModal(true)
                    }}
                  >
                    <TableCell className="font-medium">{row.platform}</TableCell>
                    <TableCell>{row.account}</TableCell>
                    <TableCell className="break-words">{row.subcategory || "N/A"}</TableCell>
                    <TableCell>
                      {typeof row.followers === "number"
                        ? `${row.followers.toLocaleString()}`
                        : row.followers}
                    </TableCell>
                    <TableCell>{row.mailIncluded ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.logs}</TableCell>
                    <TableCell>₦{row.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Available" ? "default" : "secondary"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(row)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteId(row.id)
                            setShowDeleteModal(true)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Professional View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setViewLog(null)
        }}
        title="Log Details"
      >
        {viewLog && (
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{viewLog.account}</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">{viewLog.platform}</p>
              </div>
              <Badge 
                variant={viewLog.status === "Available" ? "default" : "secondary"}
                className="text-sm px-4 py-1.5 font-semibold"
              >
                {viewLog.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Subcategory</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{viewLog.subcategory || "N/A"}</p>
              </div>

              {/* Type - NOW ALWAYS SHOWN */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Type</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{viewLog.vpnType || "N/A"}</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Followers</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{viewLog.followers.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-green-700" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Logs Count</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{viewLog.logs}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Price</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">₦{viewLog.price.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-pink-700" />
                  <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">Mail Included</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{viewLog.mailIncluded ? "Yes" : "No"}</p>
              </div>
            </div>

            {(viewLog.descriptionHeader || viewLog.description) && (
              <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-700" />
                  <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Description</h4>
                </div>
                {viewLog.descriptionHeader && (
                  <h5 className="text-base font-bold text-indigo-900 mb-2">
                    {viewLog.descriptionHeader}
                  </h5>
                )}
                {viewLog.description && (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                    {viewLog.description}
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bulk Logs</h4>
                <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300 font-semibold">
                  {viewLog.bulkLogs?.length || 0} entries
                </span>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-[300px] overflow-y-auto shadow-inner">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {viewLog.bulkLogs?.length
                    ? viewLog.bulkLogs.join("\n")
                    : "No bulk logs available."}
                </pre>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal with Custom Platform Support */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingLog(null)
          setCustomPlatform("")
        }}
        title="Edit Log"
      >
        {editingLog && (
          <div className="max-h-[80vh] overflow-y-auto px-1">
            <div className="space-y-5 p-6 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-inner">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Platform *</Label>
                <Select
                  value={editingLog.platform.toLowerCase()}
                  onValueChange={(value) => setEditingLog({ ...editingLog, platform: value })}
                >
                  <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
                    <SelectValue>
                      {editingLog.platform || "Select a platform"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p} value={p.toLowerCase()}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingLog.platform === "other" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Platform Name *</Label>
                  <Input
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    placeholder="Enter platform name"
                    className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Account Name *</Label>
                <Input
                  value={editingLog.account}
                  onChange={(e) => setEditingLog({ ...editingLog, account: e.target.value })}
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  placeholder="Enter account name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Subcategory</Label>
                <Input
                  value={editingLog.subcategory || ""}
                  onChange={(e) => setEditingLog({ ...editingLog, subcategory: e.target.value })}
                  placeholder="e.g., Instagram big boys, USA account"
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              </div>

              {/* Type - NOW FOR ALL PLATFORMS */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Type *</Label>
                <Input
                  value={editingLog.vpnType || ""}
                  onChange={(e) => setEditingLog({ ...editingLog, vpnType: e.target.value })}
                  placeholder="e.g. Personal, Business, Verified, Premium"
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Followers</Label>
                <Input
                  type="number"
                  value={editingLog.followers}
                  onChange={(e) =>
                    setEditingLog({ ...editingLog, followers: Number(e.target.value) })
                  }
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Logs Count *</Label>
                <Input
                  type="number"
                  value={editingLog.logs}
                  onChange={(e) =>
                    setEditingLog({ ...editingLog, logs: Number(e.target.value) })
                  }
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Bulk Logs</Label>
                <textarea
                  value={editingLog.bulkLogs?.join("\n") || ""}
                  onChange={(e) =>
                    setEditingLog({
                      ...editingLog,
                      bulkLogs: e.target.value.split("\n"),
                    })
                  }
                  placeholder="Enter each log on a new line...
username1:password1
username2:password2"
                  rows={8}
                  className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono text-sm p-3 transition-all"
                />
                <p className="text-xs text-gray-500 font-medium">
                  Enter one log per line. Lines: {editingLog.bulkLogs?.length || 0}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Description Header</Label>
                <Input
                  value={editingLog.descriptionHeader || ""}
                  onChange={(e) => setEditingLog({ ...editingLog, descriptionHeader: e.target.value })}
                  placeholder="e.g. Premium Quality Accounts, USA Based Numbers"
                  className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Description</Label>
                <textarea
                  value={editingLog.description || ""}
                  onChange={(e) => setEditingLog({ ...editingLog, description: e.target.value })}
                  placeholder="Add any additional information about the logs and platform..."
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm p-3 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Price (₦) *</Label>
                  <Input
                    type="number"
                    value={editingLog.price}
                    onChange={(e) =>
                      setEditingLog({ ...editingLog, price: Number(e.target.value) })
                    }
                    className="border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Mail Included</Label>
                  <div className="flex items-center gap-3 h-10 px-3 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                    <Switch
                      checked={editingLog.mailIncluded}
                      onCheckedChange={(checked) =>
                        setEditingLog({ ...editingLog, mailIncluded: checked })
                      }
                    />
                    <span className="text-sm text-gray-700 font-semibold">
                      {editingLog.mailIncluded ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Status *</Label>
                <Select
                  value={editingLog.status}
                  onValueChange={(value: "Available" | "Sold") =>
                    setEditingLog({ ...editingLog, status: value })
                  }
                >
                  <SelectTrigger className="border-2 border-gray-200 rounded-lg shadow-sm bg-white hover:border-blue-400 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
                <Button
                  variant="outline"
                  className="px-6 border-2 hover:bg-gray-100 transition-all"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingLog(null)
                    setCustomPlatform("")
                  }}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdate} 
                  disabled={updating} 
                  className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteId(null)
        }}
        title="Confirm Delete"
        variant="error"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this log? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      </>

            )}