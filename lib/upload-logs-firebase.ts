import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// export type UploadLogsPayload = {
//   platform: string;
//   account: string;
//   followers: number;
//   logs: number;
//   price: number;
//   files: FileList | null;
//   mailIncluded: boolean;
// };

export type UploadLogsPayload = {
  platform: string;
  account: string;
  followers: number;
  vpnType?: string; // ✅ new optional field added
  logs: number;
  price: number;
  files: FileList | null;
  subcategory?: string;
  mailIncluded: boolean;
  bulkLogs?: string[]; 
  descriptionHeader?: string;
 description?: string;
};

/** Convert a File to base64 data URL */
function fileToBase64(file: File): Promise<{ name: string; type: string; size: number; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: String(reader.result),
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload payload to Firestore (files as base64).
 * This is a frontend helper — ensure firebase is installed and initialized.
 */
export async function uploadLogsFirebase(payload: UploadLogsPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const filesArray = [];
    
    if (payload.files) {
      for (let i = 0; i < payload.files.length; i++) {
        const file = payload.files.item(i);
        if (file) {
          filesArray.push({
            name: file.name,
            type: file.type,
            size: file.size,
          });
        }
      }
    }

    // Use the imported db instance
    const uploadsRef = collection(db, "uploads");
    // const docRef = await addDoc(uploadsRef, {
    //   platform: payload.platform,
    //   account: payload.account,
    //   followers: payload.followers,
    //   logs: payload.logs,
    //   price: payload.price,
    //   mailIncluded: payload.mailIncluded,
    //   files: filesArray,
    //   status: "Available",
    //   createdAt: serverTimestamp(),
    // });

    // const docRef = await addDoc(uploadsRef, {
    //       platform: payload.platform,
    //       account: payload.account,
    //       followers: payload.followers,
    //       logs: payload.logs,                // keep your numeric log count
    //       bulkLogs: payload.bulkLogs || null, // ✅ new field for bulk logs (optional)
    //       price: payload.price,
    //       mailIncluded: payload.mailIncluded,
    //       subcategory:payload.subcategory,
    //       files: filesArray,
    //       status: "Available",
    //       createdAt: serverTimestamp(),
    //     });

     const docRef = await addDoc(uploadsRef, {
  platform: payload.platform,
  account: payload.account,
  followers: payload.followers,
  vpnType: payload.vpnType , // ✅ Add this - VPN type field
  logs: payload.logs,
  bulkLogs: payload.bulkLogs ,
  price: payload.price,
  mailIncluded: payload.mailIncluded,
  description: payload.description,
  subcategory: payload.subcategory,
  descriptionHeader: payload.descriptionHeader,
  files: filesArray,
  status: "Available",
  createdAt: serverTimestamp(),
});

    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error("Upload error:", err);
    return { success: false, error: err?.message ?? String(err) };
  }
}