const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async checkUserExists(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 404) {
        return false; // User doesn't exist
      }
      
      if (!response.ok) {
        throw new Error('Failed to check user');
      }
      
      return true; // User exists
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  },

  async checkUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 404) {
      return null; // User doesn't exist
    }
    
    if (!response.ok) {
      throw new Error('Failed to check user');
    }
    
    return response.json();
  },

  async createUser(token: string, userData: { role: string; phone?: string; is_minor: boolean }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json();
  },
};
