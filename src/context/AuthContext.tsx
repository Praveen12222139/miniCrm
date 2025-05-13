
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Define the structure of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
}

// User profile structure
interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('crm_user');
      }
    }
  }, []);

  // Use real Google OAuth login
  const login = async () => {
    try {
      // Create a form to handle the OAuth redirect
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = 'http://localhost:3001/api/auth/google';
      form.target = '_self';
      
      // Add a hidden input to prevent caching
      const timestamp = document.createElement('input');
      timestamp.type = 'hidden';
      timestamp.name = 'timestamp';
      timestamp.value = Date.now().toString();
      form.appendChild(timestamp);
      
      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Error",
        description: "Failed to initiate login",
        variant: "destructive",
      });
    }
  };

  // Get user data from backend
  const getUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('crm_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  // Function to check authentication
  const checkAuth = async () => {
    try {
      // Check with backend first
      const response = await fetch('http://localhost:3001/api/auth/check-auth', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('crm_user', JSON.stringify(data.user));
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('crm_user');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('crm_user');
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('crm_user');
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for changes in the authentication state
  useEffect(() => {
    const checkAuthInterval = setInterval(() => {
      checkAuth();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkAuthInterval);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('crm_user');
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
