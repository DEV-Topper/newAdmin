export async function fetchUsersList() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/proxy/users-list', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log('Fetched Users List:', data); // Console log the response

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Fetch Users Error:', error); // Console log any errors
    return { success: false, error: error.message };
  }
}