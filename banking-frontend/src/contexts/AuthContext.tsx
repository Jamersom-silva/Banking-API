import { createContext } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
