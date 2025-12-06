

// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Modal } from "@/components/ui/modal"

// // Firebase helper (saves record with files as base64)
// import { uploadLogsFirebase } from "@/lib/upload-logs-firebase"

// const platforms = [
//   "Instagram",
//   "Twitter/X",
//   "TikTk",
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

// export function UploadLogsForm() {
//   const [platform, setPlatform] = useState("")
//   const [customPlatform, setCustomPlatform] = useState("")
//   const [account, setAccount] = useState("")
//   const [followers, setFollowers] = useState("")
//   const [vpnType, setVpnType] = useState("")
//   const [logs, setLogs] = useState("")
//   const [bulkLogs, setBulkLogs] = useState("")
//   const [price, setPrice] = useState("")
//   const [subcategory, setSubcategory] = useState("")
//   const [description, setDescription] = useState("")
//   const [files, setFiles] = useState<FileList | null>(null)
//   const [mailIncluded, setMailIncluded] = useState(false)
//   const [uploading, setUploading] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // ✅ Bulk logs textarea is now compulsory
//     if (!platform || !account || !bulkLogs.trim() || !logs || !price) {
//       setError("Please fill all required fields including bulk logs")
//       setShowModal(true)
//       return
//     }

//     // ✅ Check custom platform if "other" is selected
//     if (platform === "other" && !customPlatform.trim()) {
//       setError("Please enter the platform name")
//       setShowModal(true)
//       return
//     }

//     // ✅ Check VPN type - now required for ALL platforms
//     if (platform && !vpnType.trim()) {
//       setError("Please enter the type")
//       setShowModal(true)
//       return
//     }

//     setUploading(true)
//     setError(null)

//     try {
//       // ✅ Parse bulk logs line by line
//       const parsedLogs = bulkLogs
//         .split(/\n+/)
//         .map((line) => line.trim())
//         .filter((line) => line !== "")

//       if (parsedLogs.length === 0) {
//         setError("Please enter at least one log entry in bulk logs")
//         setShowModal(true)
//         setUploading(false)
//         return
//       }

//       const payload = {
//         platform: platform === "other" ? customPlatform : platform,
//         account,
//         followers: ["vpn", "google voice", "email", "other"].includes(platform) ? 0 : Number(followers),
//         vpnType: vpnType, // Always store vpnType for ALL platforms
//         logs: Number(logs),
//         bulkLogs: parsedLogs,
//         price: Number(price),
//         subcategory,
//         description,
//         files,
//         mailIncluded,
//       }

//       console.log("Calling uploadLogsFirebase with payload:", {
//         ...payload,
//         filesCount: files?.length ?? 0,
//       })

//       const result = await uploadLogsFirebase(payload)
//       console.log("uploadLogsFirebase result:", result)

//       if (!result.success) {
//         throw new Error(result.error || "Firebase upload failed")
//       }

//       setShowModal(true)
//       setError(null)

//       // reset fields
//       setPlatform("")
//       setCustomPlatform("")
//       setAccount("")
//       setFollowers("")
//       setVpnType("")
//       setLogs("")
//       setBulkLogs("")
//       setPrice("")
//       setSubcategory("")
//       setDescription("")
//       setFiles(null)
//       setMailIncluded(false)
//     } catch (err: any) {
//       console.error("Upload error:", err)
//       setError(err?.message ?? "Unexpected error")
//       setShowModal(true)
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Upload New Log</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="platform">Select Platform</Label>
//                 <Select value={platform} onValueChange={setPlatform}>
//                   <SelectTrigger id="platform">
//                     <SelectValue placeholder="Choose platform" />
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

//               <div className="space-y-2">
//                 <Label htmlFor="account">Account Name</Label>
//                 <Input
//                   id="account"
//                   value={account}
//                   onChange={(e) => setAccount(e.target.value)}
//                   placeholder="@username"
//                 />
//               </div>

//               {platform === "other" && (
//                 <div className="space-y-2">
//                   <Label htmlFor="customPlatform">Platform Name</Label>
//                   <Input
//                     id="customPlatform"
//                     value={customPlatform}
//                     onChange={(e) => setCustomPlatform(e.target.value)}
//                     placeholder="Enter platform name"
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="subcategory">Subcategory</Label>
//                 <Input
//                   id="subcategory"
//                   value={subcategory}
//                   onChange={(e) => setSubcategory(e.target.value)}
//                   placeholder="e.g. Instagram big boys, USA account"
//                 />
//               </div>

//               {/* Type field - now for ALL platforms */}
//               <div className="space-y-2">
//                 <Label htmlFor="vpnType">
//                   {platform === "vpn" 
//                     ? "VPN Type" 
//                     : platform === "google voice" 
//                     ? "Google Voice Type" 
//                     : platform === "email" 
//                     ? "Email Type"
//                     : "Type"}
//                 </Label>
//                 <Input
//                   id="vpnType"
//                   type="text"
//                   value={vpnType}
//                   onChange={(e) => setVpnType(e.target.value)}
//                   placeholder={
//                     platform === "vpn" 
//                       ? "e.g. NordVPN, ExpressVPN" 
//                       : platform === "google voice" 
//                       ? "e.g. US Number, Canada Number" 
//                       : platform === "email"
//                       ? "e.g. Gmail, Outlook"
//                       : platform === "other"
//                       ? "e.g. Premium, Business, etc."
//                       : "e.g. Personal, Business, Verified"
//                   }
//                 />
//               </div>

//               {/* Followers field - only for social platforms */}
//               {platform && !["vpn", "google voice", "email", "other"].includes(platform) && (
//                 <div className="space-y-2">
//                   <Label htmlFor="followers">Follower Count</Label>
//                   <Input
//                     id="followers"
//                     type="number"
//                     value={followers}
//                     onChange={(e) => setFollowers(e.target.value)}
//                     placeholder="Enter number of followers"
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="logs">Number of Logs Uploaded</Label>
//                 <Input
//                   id="logs"
//                   type="number"
//                   value={logs}
//                   onChange={(e) => setLogs(e.target.value)}
//                   placeholder="e.g. 15"
//                 />
//               </div>
//             </div>

//             {/* ✅ Bulk logs textarea - NOW REQUIRED */}
//             <div className="space-y-2">
//               <Label htmlFor="bulkLogs">Bulk Logs (Required)</Label>
//               <textarea
//                 id="bulkLogs"
//                 value={bulkLogs}
//                 onChange={(e) => setBulkLogs(e.target.value)}
//                 placeholder={`username: olaowe password: ehdydf\nusername: test password: abcd1234`}
//                 className="w-full min-h-[120px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
//                 required
//               />
//               <p className="text-xs text-muted-foreground">
//                 You can paste multiple logs here in bulk (username/password format).
//               </p>
//             </div>

//             {/* ✅ Description textarea */}
//             <div className="space-y-2">
//               <Label htmlFor="description">Description (Optional)</Label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Add any additional information about the logs and platform..."
//                 className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
//               />
//               <p className="text-xs text-muted-foreground">
//                 Optional: Describe the logs, account quality, or any special features.
//               </p>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="price">Price</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   placeholder="Enter price (₦)"
//                 />
//               </div>

//               <div className="flex items-center space-x-2 mt-8">
//                 <Switch
//                   id="mail"
//                   checked={mailIncluded}
//                   onCheckedChange={setMailIncluded}
//                 />
//                 <Label htmlFor="mail">Mail Included</Label>
//               </div>
//             </div>

//             {/* <div className="space-y-2">
//               <Label htmlFor="files">Upload Files (Optional)</Label>
//               <Input
//                 id="files"
//                 type="file"
//                 accept=".csv,.txt,.zip"
//                 multiple
//                 onChange={(e) => setFiles(e.target.files)}
//               />
//             </div> */}

//             <Button
//               type="submit"
//               className="w-full md:w-auto"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload Log"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <Modal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false)
//           setError(null)
//         }}
//         title={error ? "Error" : "Success"}
//         variant={error ? "error" : "success"}
//       >
//         <p className="text-sm">{error || "Logs uploaded successfully!"}</p>
//       </Modal>
//     </>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"

// Firebase helper (saves record with files as base64)
import { uploadLogsFirebase } from "@/lib/upload-logs-firebase"

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

export function UploadLogsForm() {
  const [platform, setPlatform] = useState("")
  const [customPlatform, setCustomPlatform] = useState("")
  const [account, setAccount] = useState("")
  const [followers, setFollowers] = useState("")
  const [vpnType, setVpnType] = useState("")
  const [logs, setLogs] = useState("")
  const [bulkLogs, setBulkLogs] = useState("")
  const [price, setPrice] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [descriptionHeader, setDescriptionHeader] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [mailIncluded, setMailIncluded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Bulk logs textarea is now compulsory
    if (!platform || !account || !bulkLogs.trim() || !logs || !price) {
      setError("Please fill all required fields including bulk logs")
      setShowModal(true)
      return
    }

    // ✅ Check custom platform if "other" is selected
    if (platform === "other" && !customPlatform.trim()) {
      setError("Please enter the platform name")
      setShowModal(true)
      return
    }

    // ✅ Check VPN type - now required for ALL platforms
    if (platform && !vpnType.trim()) {
      setError("Please enter the type")
      setShowModal(true)
      return
    }

    setUploading(true)
    setError(null)

    try {
      // ✅ Parse bulk logs line by line
      const parsedLogs = bulkLogs
        .split(/\n+/)
        .map((line) => line.trim())
        .filter((line) => line !== "")

      if (parsedLogs.length === 0) {
        setError("Please enter at least one log entry in bulk logs")
        setShowModal(true)
        setUploading(false)
        return
      }

      const payload = {
        platform: platform === "other" ? customPlatform : platform,
        account,
        followers: ["vpn", "google voice", "email", "other"].includes(platform) ? 0 : Number(followers),
        vpnType: vpnType, // Always store vpnType for ALL platforms
        logs: Number(logs),
        bulkLogs: parsedLogs,
        price: Number(price),
        subcategory,
        descriptionHeader,
        description,
        files,
        mailIncluded,
      }

      console.log("Calling uploadLogsFirebase with payload:", {
        ...payload,
        filesCount: files?.length ?? 0,
      })

      const result = await uploadLogsFirebase(payload)
      console.log("uploadLogsFirebase result:", result)

      if (!result.success) {
        throw new Error(result.error || "Firebase upload failed")
      }

      setShowModal(true)
      setError(null)

      // reset fields
      setPlatform("")
      setCustomPlatform("")
      setAccount("")
      setFollowers("")
      setVpnType("")
      setLogs("")
      setBulkLogs("")
      setPrice("")
      setSubcategory("")
      setDescriptionHeader("")
      setDescription("")
      setFiles(null)
      setMailIncluded(false)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err?.message ?? "Unexpected error")
      setShowModal(true)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Log</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Select Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Choose platform" />
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

              <div className="space-y-2">
                <Label htmlFor="account">Account Name</Label>
                <Input
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="@username"
                />
              </div>

              {platform === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="customPlatform">Platform Name</Label>
                  <Input
                    id="customPlatform"
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    placeholder="Enter platform name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Instagram big boys, USA account"
                />
              </div>

              {/* Type field - now for ALL platforms */}
              <div className="space-y-2">
                <Label htmlFor="vpnType">
                  {platform === "vpn" 
                    ? "VPN Type" 
                    : platform === "google voice" 
                    ? "Google Voice Type" 
                    : platform === "email" 
                    ? "Email Type"
                    : "Type"}
                </Label>
                <Input
                  id="vpnType"
                  type="text"
                  value={vpnType}
                  onChange={(e) => setVpnType(e.target.value)}
                  placeholder={
                    platform === "vpn" 
                      ? "e.g. NordVPN, ExpressVPN" 
                      : platform === "google voice" 
                      ? "e.g. US Number, Canada Number" 
                      : platform === "email"
                      ? "e.g. Gmail, Outlook"
                      : platform === "other"
                      ? "e.g. Premium, Business, etc."
                      : "e.g. Personal, Business, Verified"
                  }
                />
              </div>

              {/* Followers field - only for social platforms */}
              {platform && !["vpn", "google voice", "email", "other"].includes(platform) && (
                <div className="space-y-2">
                  <Label htmlFor="followers">Follower Count</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="Enter number of followers"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="logs">Number of Logs Uploaded</Label>
                <Input
                  id="logs"
                  type="number"
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                  placeholder="e.g. 15"
                />
              </div>
            </div>

            {/* ✅ Bulk logs textarea - NOW REQUIRED */}
            <div className="space-y-2">
              <Label htmlFor="bulkLogs">Bulk Logs (Required)</Label>
              <textarea
                id="bulkLogs"
                value={bulkLogs}
                onChange={(e) => setBulkLogs(e.target.value)}
                placeholder={`username: olaowe password: ehdydf\nusername: test password: abcd1234`}
                className="w-full min-h-[120px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                required
              />
              <p className="text-xs text-muted-foreground">
                You can paste multiple logs here in bulk (username/password format).
              </p>
            </div>

            {/* ✅ Description header input */}
            <div className="space-y-2">
              <Label htmlFor="descriptionHeader">Description Header (Optional)</Label>
              <Input
                id="descriptionHeader"
                value={descriptionHeader}
                onChange={(e) => setDescriptionHeader(e.target.value)}
                placeholder="e.g. Premium Quality Accounts, USA Based Numbers, etc."
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add a catchy header/title for your log description.
              </p>
            </div>

            {/* ✅ Description textarea */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional information about the logs and platform..."
                className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Describe the logs, account quality, or any special features.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price (₦)"
                />
              </div>

              <div className="flex items-center space-x-2 mt-8">
                <Switch
                  id="mail"
                  checked={mailIncluded}
                  onCheckedChange={setMailIncluded}
                />
                <Label htmlFor="mail">Mail Included</Label>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="files">Upload Files (Optional)</Label>
              <Input
                id="files"
                type="file"
                accept=".csv,.txt,.zip"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div> */}

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Log"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setError(null)
        }}
        title={error ? "Error" : "Success"}
        variant={error ? "error" : "success"}
      >
        <p className="text-sm">{error || "Logs uploaded successfully!"}</p>
      </Modal>
    </>
  )
}