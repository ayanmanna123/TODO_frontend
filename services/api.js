export const API_URL = 'http://localhost:5000/api';

export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

export const fetchUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: authHeader(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};