import { createContext, useState, useEffect } from 'react';

/**
 * NotificationContext - Global notification system for admin panel
 *
 * Usage example:
 *
 * import { useNotification } from '../../hooks/useNotification';
 *
 * function MyComponent() {
 *   const { addNotification } = useNotification();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       // ... your logic
 *       addNotification('Success!', 'Service group created successfully');
 *     } catch (error) {
 *       addNotification('Error', 'Failed to create service group', { type: 'error' });
 *     }
 *   };
 * }
 */

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // Load notifications from localStorage on init
    const saved = localStorage.getItem('adminNotifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
  }, [notifications]);

  /**
   * Add a new notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {object} options - Optional config { type: 'info'|'success'|'warning'|'error' }
   */
  const addNotification = (title, message, options = {}) => {
    const newNotification = {
      id: Date.now() + Math.random(), // Unique ID
      title,
      message,
      type: options.type || 'info',
      time: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  /**
   * Mark a notification as read
   * @param {number} id - Notification ID
   */
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  /**
   * Clear all notifications
   */
  const clearAll = () => {
    setNotifications([]);
  };

  /**
   * Remove a specific notification
   * @param {number} id - Notification ID
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    unreadCount: notifications.filter(n => !n.isRead).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
