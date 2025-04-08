import React, { useState, useEffect } from 'react';
import { RecipeService, CategoryService, AuthService } from '../services/api';
import './styles.css';

// Create a new AdminService for admin-specific operations
const AdminService = {
  // Backup database (simulated)
  backupDatabase: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Database backup completed successfully!' });
      }, 1500);
    });
  },
  
  // Clear system cache (simulated)
  clearCache: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'System cache cleared successfully!' });
      }, 1000);
    });
  },
  
  // System health check (simulated)
  systemHealthCheck: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'System health check completed',
          results: {
            database: 'Healthy',
            api: 'Operational',
            storage: 'Optimized',
            memory: 'Sufficient',
            cpu: 'Normal load'
          }
        });
      }, 2000);
    });
  },
  
  // Toggle user admin status (simulated)
  toggleAdminStatus: async (userId, isAdmin) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `User admin status updated to ${isAdmin ? 'admin' : 'regular user'}` });
      }, 500);
    });
  },
  
  // Delete user (simulated)
  deleteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'User deleted successfully' });
      }, 700);
    });
  }
};

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalCategories: 0,
    totalMealPlans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    backup: false,
    cache: false,
    healthCheck: false
  });
  const [healthCheckResults, setHealthCheckResults] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get recipe count
      const recipes = await RecipeService.getAllRecipes();
      
      // Get category count
      const categories = await CategoryService.getAllCategories();
      
      setStats({
        totalRecipes: recipes.length,
        totalCategories: categories.length,
        totalMealPlans: 0, // We'll update this when we have the data
        totalUsers: users.length
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    try {
      // Use the real API endpoint instead of simulated data
      const fetchedUsers = await AuthService.getAllUsers();
      setUsers(fetchedUsers);
      
      // Update the stats with the correct user count
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: fetchedUsers.length
      }));
    } catch (err) {
      setError('Failed to load users. Make sure you have admin privileges.');
      console.error('Error loading users:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await AdminService.deleteUser(userId);
      if (result.success) {
        setUsers(users.filter(user => user.id !== userId));
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('Failed to delete user', 'error');
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newAdminStatus = !user.is_admin;
      
      const result = await AdminService.toggleAdminStatus(userId, newAdminStatus);
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_admin: newAdminStatus } : user
        ));
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('Failed to update user status', 'error');
      console.error('Error updating user status:', err);
    }
  };
  
  const handleBackupDatabase = async () => {
    try {
      setActionLoading(prev => ({ ...prev, backup: true }));
      const result = await AdminService.backupDatabase();
      if (result.success) {
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('Database backup failed', 'error');
      console.error('Error backing up database:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, backup: false }));
    }
  };
  
  const handleClearCache = async () => {
    try {
      setActionLoading(prev => ({ ...prev, cache: true }));
      const result = await AdminService.clearCache();
      if (result.success) {
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('Failed to clear cache', 'error');
      console.error('Error clearing cache:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, cache: false }));
    }
  };
  
  const handleHealthCheck = async () => {
    try {
      setActionLoading(prev => ({ ...prev, healthCheck: true }));
      setHealthCheckResults(null);
      const result = await AdminService.systemHealthCheck();
      if (result.success) {
        setHealthCheckResults(result.results);
        showNotification(result.message, 'success');
      }
    } catch (err) {
      showNotification('System health check failed', 'error');
      console.error('Error during health check:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, healthCheck: false }));
    }
  };
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <h2 className="admin-panel-title">Admin Panel</h2>
      
      {error && <div className="admin-error">{error}</div>}
      
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          System Settings
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <h3>System Overview</h3>
            
            <div className="admin-stats">
              <div className="stat-card">
                <h4>Total Recipes</h4>
                <div className="stat-value">{stats.totalRecipes}</div>
              </div>
              
              <div className="stat-card">
                <h4>Total Categories</h4>
                <div className="stat-value">{stats.totalCategories}</div>
              </div>
              
              <div className="stat-card">
                <h4>Total Meal Plans</h4>
                <div className="stat-value">{stats.totalMealPlans}</div>
              </div>
              
              <div className="stat-card">
                <h4>Total Users</h4>
                <div className="stat-value">{users.length}</div>
              </div>
            </div>
            
            <div className="admin-actions">
              <h3>Quick Actions</h3>
              <button 
                className="admin-action-button"
                onClick={handleBackupDatabase}
                disabled={actionLoading.backup}
              >
                {actionLoading.backup ? 'Backing up...' : 'Backup Database'}
              </button>
              <button 
                className="admin-action-button"
                onClick={handleClearCache}
                disabled={actionLoading.cache}
              >
                {actionLoading.cache ? 'Clearing...' : 'Clear Cache'}
              </button>
              <button 
                className="admin-action-button"
                onClick={handleHealthCheck}
                disabled={actionLoading.healthCheck}
              >
                {actionLoading.healthCheck ? 'Checking...' : 'System Health Check'}
              </button>
            </div>
            
            {healthCheckResults && (
              <div className="health-check-results">
                <h3>Health Check Results</h3>
                <div className="health-status-grid">
                  {Object.entries(healthCheckResults).map(([key, value]) => (
                    <div className="health-status-item" key={key}>
                      <div className="health-status-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="health-status-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="admin-users">
            <h3>User Management</h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={user.is_admin ? 'status-active' : 'status-inactive'}>
                        {user.is_admin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="admin-actions-cell">
                      <button 
                        className="admin-table-button"
                        onClick={() => handleToggleAdmin(user.id)}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button 
                        className="admin-table-button delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h3>System Settings</h3>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Site Title</label>
                <input type="text" defaultValue="Recipe Management System" />
              </div>
              
              <div className="form-group">
                <label>Items Per Page</label>
                <input type="number" defaultValue="10" />
              </div>
              
              <div className="form-group">
                <label>Enable User Registration</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="registration" defaultChecked />
                  <label htmlFor="registration"></label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Maintenance Mode</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="maintenance" />
                  <label htmlFor="maintenance"></label>
                </div>
              </div>
              
              <button className="admin-submit-button">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
