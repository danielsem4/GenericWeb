import { useEffect } from 'react';
import { useUserActions, useIsAuthenticated } from '../common/store/UserStore';

// This component will check for stored authentication and restore user data
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUserActions();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const authToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');
    
    if (authToken && storedUser && !isAuthenticated) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, [setUser, isAuthenticated]);

  return <>{children}</>;
};
