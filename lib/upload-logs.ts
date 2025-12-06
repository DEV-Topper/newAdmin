export type UploadLogsPayload = {
  platform: string;
  account: string;
  followers: number;
  logs: number;
  price: number;
  files: FileList | null;  // Make files optional
  mailIncluded: boolean;
};

export async function uploadLogs(payload: UploadLogsPayload): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append('platform', payload.platform);
  formData.append('account', payload.account);
  formData.append('followers', String(payload.followers));
  formData.append('logs', String(payload.logs));
  formData.append('price', String(payload.price));
  formData.append('mailIncluded', String(payload.mailIncluded));

  // Only append files if they exist
  if (payload.files) {
    for (let i = 0; i < payload.files.length; i++) {
      formData.append('files', payload.files[i]);
    }
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/proxy/upload-logs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to upload logs');
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Add this new function after the existing uploadLogs function
export async function fetchItems() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('https://amapi-uz5a.onrender.com/api/v1/items', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log('Fetched Items:', data); // Console log the response

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch items');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Fetch Error:', error); // Console log any errors
    return { success: false, error: error.message };
  }
}