// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'student'
  }
];

// Mock authentication service
export const authService = {
  // Login function
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create auth token
    const authToken = btoa(JSON.stringify({ id: user.id, email: user.email }));
    
    // Set cookies
    document.cookie = `auth-token=${authToken}; path=/`;
    document.cookie = `first-login=true; path=/`;
    
    return { user: { id: user.id, email: user.email, name: user.name } };
  },

  // Register function
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData
    };
    
    MOCK_USERS.push(newUser);
    
    // Create auth token
    const authToken = btoa(JSON.stringify({ id: newUser.id, email: newUser.email }));
    
    // Set cookies
    document.cookie = `auth-token=${authToken}; path=/`;
    document.cookie = `first-login=true; path=/`;
    
    return { user: { id: newUser.id, email: newUser.email, name: newUser.name } };
  },

  // Social login function
  socialLogin: async (provider) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate social login - in real app, this would handle OAuth flow
    const socialUser = {
      id: MOCK_USERS.length + 1,
      email: `${provider}@example.com`,
      name: `${provider} User`,
    };
    
    // Create auth token
    const authToken = btoa(JSON.stringify({ id: socialUser.id, email: socialUser.email }));
    
    // Set cookies
    document.cookie = `auth-token=${authToken}; path=/`;
    document.cookie = `first-login=true; path=/`;
    
    return { user: socialUser };
  },

  // Set user role
  setUserRole: async (role) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove first-login cookie
    document.cookie = 'first-login=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Set user role cookie
    document.cookie = `user-role=${role}; path=/`;
    
    return { role };
  },

  // Get current user
  getCurrentUser: () => {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
      
    if (!authToken) return null;
    
    try {
      const userData = JSON.parse(atob(authToken));
      const user = MOCK_USERS.find(u => u.id === userData.id);
      return user ? { id: user.id, email: user.email, name: user.name } : null;
    } catch {
      return null;
    }
  },

  // Get user role
  getUserRole: () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('user-role='))
      ?.split('=')[1] || null;
  },

  // Check if first login
  isFirstLogin: () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('first-login='))
      ?.split('=')[1] === 'true';
  },

  // Logout
  logout: () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'first-login=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
}; 