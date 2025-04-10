const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiFetch(path, options = {}) {
  const { token, setToken, ...rest } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });
  if (res.status === 401 && setToken) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}
