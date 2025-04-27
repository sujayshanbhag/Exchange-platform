"use client";
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { getUserBalance } from '../utils/httpClient';

interface UserContextType {
  userId: number;
  balance: number;
  updateBalance: () => Promise<void>;
}

const generateRandomUserId = (): number => {
  return Math.floor(Math.random() * 10) + 1; // Generates number between 1 and 10
};

// Generate userId once when the module loads
const userId = generateRandomUserId();

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);

  const updateBalance = useCallback(async () => {
    try {
        const response= await getUserBalance(userId);
        setBalance(response.balance);
        console.log(response.balance)
        return response.balance;
    }
    catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      userId,
      balance,
      updateBalance
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}