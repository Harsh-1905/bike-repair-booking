import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faWrench, 
    faShoppingCart, 
    faCheckDouble,
    faFilter,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../../Api/axios';
import '../../Components/notifications.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, booking, order, unread

    useEffect(() => {
        fetchNotifications();
    }, []);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredNotifications = notifications.filter(notification => {
        switch (filter) {
            case 'booking':
                return ['mechanic_assigned', 'booking_confirmed', 'booking_in_progress', 'booking_completed'].includes(notification.type);
            case 'order':
                return ['order_confirmed', 'order_processing', 'order_shipped', 'order_delivered'].includes(notification.type);
            case 'unread':
                return !notification.isRead;
            default:
                return true;
        }
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #fff8e1, #ffd6cc, #f97673)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '25px 30px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{ 
                            margin: '0 0 5px 0', 
                            color: '#333',
                            fontSize: '2rem',
                            fontWeight: '700'
                        }}>
                            <FontAwesomeIcon icon={faBell} style={{ marginRight: '15px', color: '#E43636' }} />
                            Notifications
                        </h1>
                        <p style={{ margin: 0, color: '#666' }}>
                            Stay updated with your bookings and orders
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            style={{
                                background: 'linear-gradient(135deg, #E43636, #c72828)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <FontAwesomeIcon icon={faCheckDouble} />
                            Mark All Read
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <FontAwesomeIcon icon={faFilter} style={{ color: '#E43636' }} />
                        <span style={{ fontWeight: '600', color: '#333' }}>Filter:</span>
                        {[
                            { key: 'all', label: `All (${notifications.length})` },
                            { key: 'unread', label: `Unread (${unreadCount})` },
                            { key: 'booking', label: 'Bookings' },
                            { key: 'order', label: 'Orders' }
                        ].map(filterOption => (
                            <button
                                key={filterOption.key}
                                onClick={() => setFilter(filterOption.key)}
                                style={{
                                    background: filter === filterOption.key 
                                        ? 'linear-gradient(135deg, #E43636, #c72828)' 
                                        : 'transparent',
                                    color: filter === filterOption.key ? 'white' : '#666',
                                    border: filter === filterOption.key ? 'none' : '1px solid #ddd',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {filterOption.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{
                            padding: '60px 20px',
                            textAlign: 'center',
                            color: '#666'
                        }}>
                            <FontAwesomeIcon icon={faBell} spin style={{ fontSize: '2rem', marginBottom: '15px' }} />
                            <p>Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => (
                            <div
                                key={notification._id}
                                onClick={() => {
                                    if (!notification.isRead) {
                                        markAsRead(notification._id);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '15px',
                                    padding: '20px',
                                    borderBottom: index < filteredNotifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    cursor: notification.isRead ? 'default' : 'pointer',
                                    background: notification.isRead ? 'transparent' : 'linear-gradient(135deg, #fff8f8, #ffeaea)',
                                    borderLeft: notification.isRead ? 'none' : '4px solid #E43636',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    background: `${getNotificationColor(notification.type)}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: getNotificationColor(notification.type),
                                    fontSize: '1.2rem',
                                    flexShrink: 0
                                }}>
                                    <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '5px'
                                    }}>
                                        <h4 style={{
                                            margin: 0,
                                            color: '#333',
                                            fontSize: '1.1rem',
                                            fontWeight: '600'
                                        }}>
                                            {notification.title}
                                        </h4>
                                        {!notification.isRead && (
                                            <span style={{
                                                width: '8px',
                                                height: '8px',
                                                background: '#E43636',
                                                borderRadius: '50%'
                                            }}></span>
                                        )}
                                    </div>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        color: '#666',
                                        lineHeight: '1.5'
                                    }}>
                                        {notification.message}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        color: '#999',
                                        fontSize: '0.85rem'
                                    }}>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        {formatDate(notification.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            padding: '60px 20px',
                            textAlign: 'center',
                            color: '#999'
                        }}>
                            <FontAwesomeIcon icon={faBell} style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }} />
                            <p style={{ fontSize: '1.1rem' }}>No notifications found</p>
                            <p style={{ fontSize: '0.9rem' }}>
                                {filter === 'all' 
                                    ? "You don't have any notifications yet."
                                    : `No ${filter} notifications found.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;