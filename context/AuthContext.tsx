import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from '@/hooks/useNetwork';

interface User {
  id: string;
  username: string;
  type: 'guest' | 'account';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isConnected: boolean | null;
  signInAsGuest: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@the_hunt_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useNetwork();

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem(STORAGE_KEY);
      if (authDataSerialized) {
        setUser(JSON.parse(authDataSerialized));
      }
    } catch (error) {
      console.error('Error loading auth data', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInAsGuest(username: string) {
    const newUser: User = {
      id: Math.random().toString(36).substring(7), // Basic ID for guest
      username: username.toUpperCase(),
      type: 'guest',
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }

  async function signOut() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isConnected, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
