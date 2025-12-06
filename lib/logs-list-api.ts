export async function fetchLogsList() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/proxy/logs-list', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log('Fetched Logs List:', data); // Console log the response

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch logs');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Fetch Logs Error:', error); // Console log any errors
    return { success: false, error: error.message };
  }
}