import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/Api';
import toast from 'react-hot-toast';


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
  logout: () => Promise<boolean>;
  ping: () => Promise<boolean | undefined>;
}


const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
  });


  const login = useCallback(async (email: string, password: string) => {
    try {

      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await axios.post(`${baseUrl}/auth/`, {
        email,
        password,
      }, {
        withCredentials: true,

      });
      console.log("response", response);

      const { token, user } = response.data.data;

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
      toast.error("Login failed. Please try again");
      console.log(error);
      return false;
    }
  }, []);

  const ping = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/ping`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        const user = JSON.parse(localStorage.getItem('user') as string);
        setAuthState({
          user,
          token: localStorage.getItem('token') as string,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.log('Ping error:', error);
   
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/logout`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        toast.success("Logged out successfully");
        return true;
      }
      return false;
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
        ping
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;
export { AuthContext }
