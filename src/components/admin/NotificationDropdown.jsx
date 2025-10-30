import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../hooks/useNotification';

// Helper function to format relative time
const getRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(diffInSeconds / 604800);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-bg-primary transition-colors"
      >
        <BellIcon className="w-6 h-6 text-text-secondary" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-accent text-white text-xs font-body font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-body font-bold text-text-primary">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-body text-accent hover:text-accent/80 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="w-12 h-12 text-text-secondary/50 mx-auto mb-3" />
                <p className="text-text-secondary font-body">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-bg-primary transition-colors border-l-2 ${
                    notification.isRead
                      ? 'border-transparent'
                      : 'border-accent bg-accent/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`font-body ${notification.isRead ? 'text-text-primary' : 'font-bold text-text-primary'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-text-secondary font-body mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-text-secondary/70 font-body mt-1">
                        {getRelativeTime(notification.time)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-border flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 text-center text-sm font-body text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
              <button className="flex-1 text-center text-sm font-body text-accent hover:text-accent/80 transition-colors">
                View all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
