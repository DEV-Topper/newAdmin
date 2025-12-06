"use client"

import { useEffect, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Search, ShoppingBag, Copy, Check, Calendar, Hash, Wallet, Package, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

type Purchase = {
  id: string
  platform: string
  followers: number
  quantity: number
  totalAmount: number
  paymentMethod: string
  mailIncluded: boolean
  purchaseDate: Date
  userUUID: string
  credentials: any[]
  accountId: string
  pricePerLog: number
  username?: string
}

export function PurchasesTable() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, "purchases"), orderBy("purchaseDate", "desc"))

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const purchasesData: Purchase[] = await Promise.all(
          snapshot.docs.map(async (d) => {
            const data = d.data()
            let username = "Unknown User"

            // Fetch username from users collection
            if (data.userUUID) {
              try {
                const userDoc = await getDoc(doc(db, "users", data.userUUID))
                if (userDoc.exists()) {
                  username = userDoc.data()?.username || "Unknown User"
                }
              } catch (error) {
                console.error("Error fetching user:", error)
              }
            }

            return {
              id: d.id,
              platform: data.platform || "—",
              followers: data.followers || 0,
              quantity: data.quantity || 0,
              totalAmount: data.totalAmount || 0,
              paymentMethod: data.paymentMethod || "—",
              mailIncluded: data.mailIncluded || false,
              purchaseDate: data.purchaseDate?.toDate ? data.purchaseDate.toDate() : new Date(),
              userUUID: data.userUUID || "—",
              credentials: data.credentials || [],
              accountId: data.accountId || "—",
              pricePerLog: data.pricePerLog || 0,
              username,
            }
          })
        )
        setPurchases(purchasesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching purchases:", error)
        toast.error("Failed to fetch purchase records.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleRowClick = (purchase: Purchase) => setSelectedPurchase(purchase)
  const handleCloseModal = () => setSelectedPurchase(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filteredPurchases = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    return purchases.filter(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.platform.toLowerCase().includes(term) ||
        p.userUUID.toLowerCase().includes(term) ||
        p.accountId.toLowerCase().includes(term) ||
        p.paymentMethod.toLowerCase().includes(term) ||
        p.username?.toLowerCase().includes(term) ||
        String(p.followers).includes(term) ||
        String(p.quantity).includes(term) ||
        String(p.totalAmount).includes(term)
    )
  }, [purchases, searchTerm])

  return (
    <>
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className=" border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                All Purchases
              </CardTitle>
              <CardDescription className="text-base">
                A comprehensive log of all user account purchases
              </CardDescription>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 border-2"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">User</TableHead>
                  <TableHead className="font-bold">Platform</TableHead>
                  <TableHead className="font-bold">Followers</TableHead>
                  {/* <TableHead className="font-bold">Quantity</TableHead> */}
                  <TableHead className="font-bold">Total Amount</TableHead>
                  {/* <TableHead className="font-bold">Payment</TableHead> */}
                  <TableHead className="font-bold">Purchase ID</TableHead>
                  <TableHead className="font-bold">Purchase Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground font-medium">Loading purchases...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">
                          {searchTerm ? "No purchases match your search" : "No purchases found"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((p) => (
                    <TableRow
                      key={p.id}
                      onClick={() => handleRowClick(p)}
                      className="cursor-pointer hover:bg-primary/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span className="font-semibold">{p.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize font-semibold">
                          {p.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{p.followers.toLocaleString()}</TableCell>
                      {/* <TableCell className="font-medium">{p.quantity}</TableCell> */}
                      <TableCell className="font-bold text-green-600">
                        ₦{p.totalAmount.toLocaleString()}
                      </TableCell>
                      {/* <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {p.paymentMethod}
                        </Badge>
                      </TableCell> */}
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {p.id.slice(0, 8)}...
                        </code>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.purchaseDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={!!selectedPurchase} onClose={handleCloseModal} title="">
        {selectedPurchase && (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 -m-6 mb-6 rounded-t-lg">
              <div className="flex items-center justify-between p-[10px]">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Purchase Details</h2>
                  <p className="text-primary-foreground/90 text-sm">Complete transaction information</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Transaction IDs */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">User Information</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Username</p>
                      <p className="font-bold text-lg">{selectedPurchase.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">User UUID</p>
                      <p className="font-mono text-sm break-all">{selectedPurchase.userUUID}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedPurchase.userUUID, "userUUID")}
                      className="ml-2 shrink-0"
                    >
                      {copiedField === "userUUID" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transaction IDs */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Transaction IDs</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Purchase ID</p>
                      <p className="font-mono text-sm break-all">{selectedPurchase.id}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedPurchase.id, "purchaseId")}
                      className="ml-2 shrink-0"
                    >
                      {copiedField === "purchaseId" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account ID</p>
                      <p className="font-mono text-sm break-all">{selectedPurchase.accountId}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedPurchase.accountId, "accountId")}
                      className="ml-2 shrink-0"
                    >
                      {copiedField === "accountId" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">User UUID</p>
                      <p className="font-mono text-sm break-all">{selectedPurchase.userUUID}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedPurchase.userUUID, "userUUID")}
                      className="ml-2 shrink-0"
                    >
                      {copiedField === "userUUID" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Account Information</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Platform</p>
                      <Badge variant="secondary" className="capitalize font-bold text-sm">
                        {selectedPurchase.platform}
                      </Badge>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Followers</p>
                      <p className="font-bold text-xl text-blue-600">
                        {selectedPurchase.followers.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Quantity</p>
                      <p className="font-bold text-xl">{selectedPurchase.quantity}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Mail Included</p>
                      <Badge variant={selectedPurchase.mailIncluded ? "default" : "secondary"} className="font-bold">
                        {selectedPurchase.mailIncluded ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Payment Details</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Method</p>
                      <Badge variant="outline" className="capitalize font-bold">
                        {selectedPurchase.paymentMethod}
                      </Badge>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Price Per Log</p>
                      <p className="font-bold text-lg">₦{selectedPurchase.pricePerLog.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Total Amount</p>
                      <p className="font-bold text-xl text-green-600">
                        ₦{selectedPurchase.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Date */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Purchase Date</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-bold text-lg">
                      {selectedPurchase.purchaseDate.toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Credentials</h3>
                  </div>
                </div>
                <div className="p-4">
                  {selectedPurchase.credentials.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPurchase.credentials.map((cred, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                            <Badge variant="secondary" className="font-bold">
                              Credential #{index + 1}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(
                                typeof cred === "object" ? JSON.stringify(cred, null, 2) : String(cred),
                                `cred-${index}`
                              )}
                            >
                              {copiedField === `cred-${index}` ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="p-3 bg-muted/50">
                            <pre className="whitespace-pre-wrap break-all text-xs font-mono">
                              {typeof cred === "object" && cred !== null
                                ? JSON.stringify(cred, null, 2)
                                : String(cred)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground font-medium">
                        No credentials available for this purchase
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}