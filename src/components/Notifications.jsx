/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Calendar,
  MessageCircle,
  Home,
  User,
  Phone,
  CheckCheck,
} from "lucide-react";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setConnectionError(false);

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setNotifications(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      setConnectionError(true);
      // Set empty notifications on error
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      setConnectionError(false);

      const response = await fetch(
        "http://localhost:5000/api/notifications/unread-count",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUnreadCount(result.count || 0);
      } else {
        throw new Error(result.message || "Failed to fetch unread count");
      }
    } catch (error) {
      console.error("❌ Error fetching unread count:", error);
      setConnectionError(true);
      setUnreadCount(0); // Reset count on error
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, is_read: 1, read_at: new Date().toISOString() }
              : notif
          )
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({
            ...notif,
            is_read: 1,
            read_at: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "visit_reminder":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "new_message":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "new_property":
        return <Home className="w-5 h-5 text-purple-500" />;
      case "client_update":
        return <User className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "visit_reminder":
        return "border-l-blue-500 bg-blue-50";
      case "new_message":
        return "border-l-green-500 bg-green-50";
      case "new_property":
        return "border-l-purple-500 bg-purple-50";
      case "client_update":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Handle navigation based on notification type
    if (notification.data) {
      try {
        const data = JSON.parse(notification.data);

        switch (notification.type) {
          case "visit_reminder":
            if (data.clientId) {
              window.location.href = `/clients/${data.clientId}/visits`;
            }
            break;
          case "new_message":
            window.location.href = "/messages";
            break;
          case "new_property":
            if (data.propertyId) {
              window.location.href = `/property/${data.propertyId}`;
            }
            break;
          case "client_update":
            if (data.clientId) {
              window.location.href = `/clients/${data.clientId}`;
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors relative"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {connectionError && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {connectionError && (
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                    Connection Error
                  </span>
                )}
                {unreadCount > 0 && !connectionError && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {connectionError ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-gray-600 mb-2">Connection Error</p>
                  <p className="text-sm text-gray-500">
                    Unable to connect to notification service
                  </p>
                  <button
                    onClick={() => {
                      setConnectionError(false);
                      fetchNotifications();
                      fetchUnreadCount();
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationColor(
                      notification.type
                    )} ${
                      !notification.is_read ? "bg-opacity-100" : "bg-opacity-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              !notification.is_read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.created_at)}
                          </span>
                          {notification.data &&
                            (() => {
                              try {
                                const data = JSON.parse(notification.data);
                                if (data.phone) {
                                  return (
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                      <Phone className="w-3 h-3" />
                                      <span>{data.phone}</span>
                                    </div>
                                  );
                                }
                              } catch (e) {
                                return null;
                              }
                            })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && !connectionError && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
