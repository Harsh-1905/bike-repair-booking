import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faTimes, 
    faCheck, 
    faWrench, 
    faShoppingCart, 
    faUser,
    faCheckDouble,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import api from '../Api/axios';
import './notifications.css';

const Notifications = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.userType === 'user') {
            fetchNotifications();
            fetchUnreadCount();
            
            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread-count');
            if (response.data.success) {
                setUnreadCount(response.data.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId 
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'mechanic_assigned':
            case 'booking_confirmed':
            case 'booking_in_progress':
            case 'booking_completed':
                return faWrench;
            case 'order_confirmed':
            case 'order_processing':
            case 'order_shipped':
            case 'order_delivered':
                return faShoppingCart;
            default:
                return faBell;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'mechanic_assigned':
                return '#17a2b8';
            case 'booking_confirmed':
                return '#28a745';
            case 'booking_in_progress':
                return '#007bff';
            case 'booking_completed':
                return '#28a745';
            case 'order_confirmed':
                return '#28a745';
            case 'order_processing':
                return '#ffc107';
            case 'order_shipped':
                return '#007bff';
            case 'order_delivered':
                return '#28a745';
            default:
                return '#6c757d';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    // Don't render for admin users or if user is not logged in
    if (!user || user.userType !== 'user') {
        return null;
    }

    return (
        <div className="notifications-container">
            <div 
                className="notification-bell"
                onClick={() => {
                    setShowDropdown(!showDropdown);
                    if (!showDropdown) {
                        fetchNotifications();
                    }
                }}
            >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </div>

            {showDropdown && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h4>Notifications</h4>
                        <div className="header-actions">
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-read-btn"
                                    onClick={markAllAsRead}
                                    title="Mark all as read"
                                >
                                    <FontAwesomeIcon icon={faCheckDouble} />
                                </button>
                            )}
                            <button 
                                className="close-dropdown-btn"
                                onClick={() => setShowDropdown(false)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>

                    <div className="notifications-list">
                        {loading ? (
                            <div className="loading-notifications">
                                <FontAwesomeIcon icon={faClock} spin />
                                <span>Loading notifications...</span>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification._id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => {
                                        if (!notification.isRead) {
                                            markAsRead(notification._id);
                                        }
                                    }}
                                >
                                    <div 
                                        className="notification-icon"
                                        style={{ color: getNotificationColor(notification.type) }}
                                    >
                                        <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                            {!notification.isRead && <span className="unread-dot"></span>}
                                        </div>
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatTime(notification.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                <FontAwesomeIcon icon={faBell} />
                                <span>No notifications yet</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;