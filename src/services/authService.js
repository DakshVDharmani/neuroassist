import { faker } from '@faker-js/faker';

// Mock user database
const mockUsers = {
  'patient@demo.com': {
    id: 'user-1',
    name: 'John Patient',
    email: 'patient@demo.com',
    role: 'patient',
    password: 'patient123',
    avatar: faker.image.avatar(),
  },
  'doctor@demo.com': {
    id: 'user-2',
    name: 'Dr. Sarah Wilson',
    email: 'doctor@demo.com',
    role: 'psychologist',
    password: 'doctor123',
    avatar: faker.image.avatar(),
  },
  'admin@demo.com': {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin',
    password: 'admin123',
    avatar: faker.image.avatar(),
  },
};

// Simulate API latency
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const authService = {
  login: async (email, password) => {
    await delay(500);
    const user = mockUsers[email];
    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      const mockToken = `mock-jwt-token-for-${user.id}`;
      return { user: userWithoutPassword, token: mockToken };
    }
    throw new Error('Invalid email or password');
  },

  signup: async (userData) => {
    await delay(500);
    const { name, email, password, role } = userData;
    if (mockUsers[email]) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `user-${Object.keys(mockUsers).length + 1}`,
      name,
      email,
      role,
      password, // In a real app, this would be hashed
      avatar: faker.image.avatar(),
    };
    mockUsers[email] = newUser;
    const { password: _, ...userWithoutPassword } = newUser;
    const mockToken = `mock-jwt-token-for-${newUser.id}`;
    return { user: userWithoutPassword, token: mockToken };
  },

  logout: async () => {
    await delay(200);
    // In a real app, this might invalidate the token on the server
    return { message: 'Logout successful' };
  },

  getCurrentUser: async () => {
    await delay(300);
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    // In a real app, you'd verify the token with the backend.
    // Here, we'll find the user from our mock DB based on the fake token.
    const userId = token.replace('mock-jwt-token-for-', '');
    const user = Object.values(mockUsers).find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
};
