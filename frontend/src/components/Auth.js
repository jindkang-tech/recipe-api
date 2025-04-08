import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { AuthService } from '../services/api';
import './styles.css';

const Auth = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            if (onAuthenticated) {
              onAuthenticated(currentUser);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid auth data
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [onAuthenticated]);

  const handleLogin = (userData) => {
    setUser(userData);
    if (onAuthenticated) {
      onAuthenticated(userData);
    }
    console.log('User logged in:', userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    if (onAuthenticated) {
      onAuthenticated(userData);
    }
    console.log('User registered:', userData);
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (user) {
    return null; // User is authenticated, don't render auth forms
  }

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login 
          onLogin={handleLogin} 
          switchToRegister={switchToRegister} 
        />
      ) : (
        <Register 
          onRegister={handleRegister} 
          switchToLogin={switchToLogin} 
        />
      )}
    </div>
  );
};

export default Auth;
