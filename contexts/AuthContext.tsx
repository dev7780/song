import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User interface
interface User {
  username: string;
  password: string;
  type: 'admin' | 'user';
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  stats: {
    songsPlayed: number;
    hoursListened: number;
    likedSongs: number;
    playlists: number;
  };
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Demo users database
const DEMO_USERS: Record<string, User> = {
  admin: {
    username: 'admin',
    password: 'admin123',
    type: 'admin',
    name: 'Admin User',
    email: 'admin@soundwave.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: 'January 2023',
    stats: {
      songsPlayed: 2847,
      hoursListened: 312,
      likedSongs: 156,
      playlists: 24,
    },
  },
  user: {
    username: 'user',
    password: 'user123',
    type: 'user',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: 'March 2024',
    stats: {
      songsPlayed: 1247,
      hoursListened: 156,
      likedSongs: 89,
      playlists: 12,
    },
  },
  demo: {
    username: 'demo',
    password: 'demo123',
    type: 'user',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: 'December 2024',
    stats: {
      songsPlayed: 567,
      hoursListened: 78,
      likedSongs: 45,
      playlists: 8,
    },
  },
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Find user in demo database
      const foundUser = Object.values(DEMO_USERS).find(
        (u) => u.username === username.trim() && u.password === password.trim()
      );

      if (foundUser) {
        // Store user in state and AsyncStorage
        setUser(foundUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}