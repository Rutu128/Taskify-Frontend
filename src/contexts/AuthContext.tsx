import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/Api';
import { Navigate } from 'react-router-dom';





const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface User {
  _id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

function getCookie(): boolean {
  const arrayb = document.cookie.split(";");
  for (const item of arrayb) {
    if (item.startsWith("token=")) {
      return true;
    }
  }
  return false;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    if (getCookie()) {
      if (!localStorage.getItem('token') || localStorage.getItem('user')) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        <Navigate to="/" />
      }
      setAuthState({
        user: JSON.parse(localStorage.getItem('user') as string),
        token: localStorage.getItem('token'),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      <Navigate to="/" />
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await axios.post(`${baseUrl}/auth`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;
export { AuthContext }
