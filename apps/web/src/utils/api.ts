const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// M2M token for backend API authentication
const M2M_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVjOjJkOjY4OmM0OjkyOjkxOjA5OjRmOjE0OmQ2OmRjOmNiOjAwOjAwOjZiOjFkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9ob3JzZXNoYXJpbmcua2luZGUuY29tL2FwaSJdLCJhenAiOiI0ZGRhMTkyZGUzMWY0NDFlODZmMWE4NjdhYThiMGFjZiIsImV4cCI6MTc1NzE2NTk3MCwiZ3R5IjpbImNsaWVudF9jcmVkZW50aWFscyJdLCJpYXQiOjE3NTcwNzk1NzAsImlzcyI6Imh0dHBzOi8vaG9yc2VzaGFyaW5nLmtpbmRlLmNvbSIsImp0aSI6IjIwYTk2NTk4LTM5MWEtNDIyNy1hYmUwLWI1ODcxZDgyNzNkNSIsInNjb3BlIjoiY3JlYXRlOm9yZ2FuaXphdGlvbl91c2VyX2FwaV9zY29wZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl91c2VyX3Blcm1pc3Npb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fdXNlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX3VzZXJzIGNyZWF0ZTpyb2xlcyBjcmVhdGU6dXNlcnMgcmVhZDpyb2xlcyByZWFkOnN1YnNjcmliZXJzIHJlYWQ6dGltZXpvbmVzIHJlYWQ6dXNlcnMgcmVhZDp3ZWJob29rcyB1cGRhdGU6YXBpX2tleXMgdXBkYXRlOmFwaXMgdXBkYXRlOm9yZ2FuaXphdGlvbl91c2VycyB1cGRhdGU6cGVybWlzc2lvbnMgdXBkYXRlOnJvbGVzIHVwZGF0ZTp1c2VyX2ZlYXR1cmVfZmxhZ3MgdXBkYXRlOnVzZXJfcGFzc3dvcmRzIHVwZGF0ZTp1c2VyX3Byb3BlcnRpZXMiLCJzY3AiOltdLCJ2IjoiMiJ9.Bzs_GbqpVOHUC61vtOWP_ecKRtrttPq50feF7GKwSKX153ltD4QtqupaqM1PJgFvgvnjMAZeW3VPO1apeO8oMtLy6a0vVs5ngpOEXbx8KZdHA-A_u-iPZQarR4xItaZPeeR5zQl0za302ukp4gsHoTLPqxUyQ6fA6lAOKsPKjiqgb3fqkSqrombqeL0sLgxmTZl_4QZNnDK7a7mh_ugxiFJ_oVgouoqPVOYao0JafHomQGwowrA1Ugiikbhs9Qx9CYJ_5cc3SqrPuw9LgP4kgV_tqjuvaGlOfoT3XDETbRiI7OaIo_AymZ2jCyvEnjQ7KnIjjyk_75kQnKXre3HO7w';

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

  async createUser(userData: { role: string; phone?: string; is_minor: boolean }) {
    console.log('Creating user with M2M token');
    console.log('User data:', userData);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${M2M_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create user error response:', response.status, errorText);
      throw new Error(`Failed to create user: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async getUserProfile(token: string) {
    console.log('Getting user profile with token:', token === 'placeholder-token' ? 'placeholder' : 'real token');
    
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
      const errorText = await response.text();
      console.error('Get user profile error response:', response.status, errorText);
      throw new Error(`Failed to get user profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  // Rider Profile API calls - flexible structure for easy finetuning
  async createRiderProfile(userToken: string, profileData: any) {
    console.log('Creating rider profile with user token');
    console.log('Profile data:', profileData);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/rider/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create rider profile error:', response.status, errorText);
      throw new Error(`Failed to create rider profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async getRiderProfile(userToken: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/rider/`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 404) {
      return null; // Profile doesn't exist
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get rider profile error:', response.status, errorText);
      throw new Error(`Failed to get rider profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  // Owner Profile API calls - flexible structure for easy finetuning
  async createOwnerProfile(userToken: string, profileData: any) {
    console.log('Creating owner profile with user token');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/owner/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create owner profile error:', response.status, errorText);
      throw new Error(`Failed to create owner profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async updateRiderProfile(userToken: string, profileData: any) {
    console.log('Updating rider profile with user token');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/rider/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update rider profile error:', response.status, errorText);
      throw new Error(`Failed to update rider profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async updateOwnerProfile(userToken: string, profileData: any) {
    console.log('Updating owner profile with user token');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/owner/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update owner profile error:', response.status, errorText);
      throw new Error(`Failed to update owner profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async getOwnerProfile(userToken: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/profiles/owner/`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 404) {
      return null; // Profile doesn't exist
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get owner profile error:', response.status, errorText);
      throw new Error(`Failed to get owner profile: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  // Matching API calls
  async getMatchCandidates(userToken: string, limit: number = 10) {
    console.log('Getting match candidates with user token');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/matching/candidates?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get match candidates error:', response.status, errorText);
      throw new Error(`Failed to get match candidates: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async likeListing(userToken: string, listingId: number) {
    console.log('Liking listing:', listingId);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/matching/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listing_id: listingId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Like listing error:', response.status, errorText);
      throw new Error(`Failed to like listing: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },

  async getMutualMatches(userToken: string) {
    console.log('Getting mutual matches with user token');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/matching/matches`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get mutual matches error:', response.status, errorText);
      throw new Error(`Failed to get mutual matches: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },
};
