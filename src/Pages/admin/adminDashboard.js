import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers, faCalendarCheck, faRupeeSign,
    faShoppingCart, faArrowUp, faArrowDown,
    faBars, faUser, faChartLine, faClock, faTimes, faCheckCircle, faTools
} from '@fortawesome/free-solid-svg-icons';
import api from '../../Api/axios';
import './modern-dashboard.css';

const StatCard = ({ title, value, icon, bgColor, subtitle, trend }) => (
    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 mb-4">
        <div className="stat-card" style={{ '--card-color': bgColor }}>
            <div className="stat-card-content">
                <div className="stat-icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div className="stat-info">
                    <h3 className="stat-value">{value}</h3>
                    <p className="stat-title">{title}</p>
                    {subtitle && <small className="stat-subtitle">{subtitle}</small>}
                    {trend && (
                        <div className="stat-trend">
                            <FontAwesomeIcon 
                                icon={trend > 0 ? faArrowUp : faArrowDown} 
                                className={trend > 0 ? 'trend-up' : 'trend-down'}
                            />
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const RevenueCard = ({ title, amount, icon, period }) => (
    <div className="revenue-item">
        <div className="revenue-icon">
            <FontAwesomeIcon icon={icon} />
        </div>
        <div className="revenue-info">
            <h4>₹{amount.toLocaleString()}</h4>
            <p>{title}</p>
            {period && <small>{period}</small>}
        </div>
    </div>
);

const ActivityItem = ({ time, message, icon, type }) => (
    <div className="activity-item">
        <div className="activity-icon" data-type={type}>
            <FontAwesomeIcon icon={icon} />
        </div>
        <div className="activity-content">
            <p className="activity-message">{message}</p>
            <small className="activity-time">{time}</small>
        </div>
    </div>
);

const AdminDashboard = ({ isCollapsed, toggleSidebar }) => {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalBookings: 0,
        totalMechanics: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        completedServices: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        recentRegistrations: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [revenueData, setRevenueData] = useState({
        today: 0,
        weekly: 0,
        monthly: 0,
        total: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    const mainContentStyle = {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        marginLeft: isCollapsed ? "80px" : "250px",
        transition: "margin-left 0.3s ease"
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                await fetchDashboardData();
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard loading error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [bookingsRes, usersRes, mechanicsRes, ordersRes] = await Promise.allSettled([
                api.get("/bookings"),
                api.get("/users"),
                api.get("/mechanics"),
                api.get("/orders/all")
            ]);

            // Process bookings data
            if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data.success) {
                const bookings = bookingsRes.value.data.data;
                const pendingCount = bookings.filter(b => b.status === 'Pending').length;
                const completedCount = bookings.filter(b => b.status === 'Completed').length;
                
                setDashboardData(prev => ({
                    ...prev,
                    totalBookings: bookings.length,
                    pendingBookings: pendingCount,
                    completedServices: completedCount
                }));

                // Add recent bookings to activity
                const recentBookings = bookings
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 2)
                    .map(booking => {
                        const customerName = booking.user_id?.fullName || 'Customer';
                        return {
                            time: new Date(booking.createdAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', minute: '2-digit' 
                            }),
                            message: `${booking.bikeService || 'Service'} booking by Customer (${customerName}) - ${booking.bikeCompany} ${booking.bikeModel}`,
                            icon: faCalendarCheck,
                            type: 'booking'
                        };
                    });

                setRecentActivity(prev => [...recentBookings, ...prev.filter(item => item.type !== 'booking').slice(0, 3)]);
            }

            // Process users data
            if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
                const users = usersRes.value.data.users;
                
                // Calculate recent registrations (last 7 days)
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const recentRegistrations = users.filter(user => 
                    user.createdAt && new Date(user.createdAt) >= weekAgo
                ).length;
                
                setDashboardData(prev => ({ 
                    ...prev, 
                    totalUsers: users.length,
                    recentRegistrations 
                }));

                // Add recent user registrations to activity (only users with timestamps)
                const recentUsers = users
                    .filter(user => user.createdAt) // Only include users with timestamps
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 2)
                    .map(user => {
                        const userName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
                        const registrationDate = new Date(user.createdAt);
                        const today = new Date();
                        const isToday = registrationDate.toDateString() === today.toDateString();
                        
                        return {
                            time: isToday 
                                ? registrationDate.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', minute: '2-digit' 
                                })
                                : registrationDate.toLocaleDateString('en-US', { 
                                    month: 'short', day: 'numeric' 
                                }),
                            message: `New customer registered: Customer (${userName}) - ${registrationDate.toLocaleDateString('en-US')}`,
                            icon: faUser,
                            type: 'user'
                        };
                    });

                setRecentActivity(prev => [...prev.filter(item => item.type !== 'user'), ...recentUsers].slice(0, 5));
            }

            // Process mechanics data
            if (mechanicsRes.status === 'fulfilled' && mechanicsRes.value.data && Array.isArray(mechanicsRes.value.data)) {
                setDashboardData(prev => ({ ...prev, totalMechanics: mechanicsRes.value.data.length }));
            }

            // Process orders data
            if (ordersRes.status === 'fulfilled' && ordersRes.value.data && Array.isArray(ordersRes.value.data)) {
                const orders = ordersRes.value.data;
                const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
                const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
                const totalRevenue = orders
                    .filter(o => o.orderStatus !== 'Cancelled')
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                
                setDashboardData(prev => ({
                    ...prev,
                    totalOrders: orders.length,
                    pendingOrders,
                    deliveredOrders,
                    totalRevenue
                }));

                // Calculate revenue breakdown
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

                const todayRevenue = orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate >= today && o.orderStatus !== 'Cancelled';
                }).reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                const weeklyRevenue = orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate >= weekAgo && o.orderStatus !== 'Cancelled';
                }).reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                const monthlyRevenue = orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate >= monthAgo && o.orderStatus !== 'Cancelled';
                }).reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                setRevenueData({
                    today: todayRevenue,
                    weekly: weeklyRevenue,
                    monthly: monthlyRevenue,
                    total: totalRevenue
                });

                const newOrders = orders.filter(o => o.orderStatus === 'Pending').length;
                const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

                // Add recent orders to activity
                const recentOrders = orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map(order => {
                        const userName = order.user_id?.fullName || 
                                       `${order.user_id?.firstName || ''} ${order.user_id?.lastName || ''}`.trim() || 
                                       'Customer';
                        const customerLabel = `Customer (${userName})`;
                        
                        let message, type, icon;
                        switch (order.orderStatus) {
                            case 'Cancelled':
                                message = `Order cancelled by ${customerLabel} - ₹${order.totalAmount}`;
                                type = 'error';
                                icon = faTimes;
                                break;
                            case 'Delivered':
                                message = `Order delivered to ${customerLabel} - ₹${order.totalAmount}`;
                                type = 'success';
                                icon = faCheckCircle;
                                break;
                            default:
                                message = `New product order by ${customerLabel} - ₹${order.totalAmount}`;
                                type = 'order';
                                icon = faShoppingCart;
                        }

                        return {
                            time: new Date(order.createdAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', minute: '2-digit' 
                            }),
                            message,
                            icon,
                            type
                        };
                    });

                setRecentActivity(prev => [...prev.filter(item => !['order', 'error', 'success'].includes(item.type)), ...recentOrders].slice(0, 5));
            } else if (ordersRes.status === 'rejected') {
                console.warn('Orders API failed, skipping order-related data');
                setDashboardData(prev => ({ ...prev, totalOrders: 0, pendingOrders: 0, deliveredOrders: 0 }));
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            throw err;
        }
    };

    return (
        <div style={mainContentStyle}>
            {/* Header */}
            <div className="dashboard-header">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            <h1 className="dashboard-title">Admin Dashboard</h1>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="btn btn-primary me-3"
                                onClick={() => {
                                    setLoading(true);
                                    fetchDashboardData().finally(() => setLoading(false));
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Refreshing...' : 'Refresh Data'}
                            </button>
                            <div className="welcome-text">Welcome back, Admin!</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid dashboard-content">
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading dashboard data...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Statistics Cards */}
                        <div className="section-title">
                            <h2>Dashboard Overview</h2>
                            <p>Monitor your bike service business performance - Real-time data from database</p>
                        </div>

                        <div className="row">
                            <StatCard title="Total Users" value={dashboardData.totalUsers} icon={faUsers} bgColor="#3b82f6" subtitle="Registered customers" trend={12} />
                            <StatCard title="Total Bookings" value={dashboardData.totalBookings} icon={faCalendarCheck} bgColor="#10b981" subtitle="Service bookings" trend={8} />
                            <StatCard title="Total Orders" value={dashboardData.totalOrders} icon={faShoppingCart} bgColor="#8b5cf6" subtitle="Product orders" trend={5} />
                            <StatCard title="Total Mechanics" value={dashboardData.totalMechanics} icon={faTools} bgColor="#f59e0b" />
                        </div>

                        <div className="row mt-5">
                            {/* Revenue Summary */}
                            <div className="col-12 mb-4">
                                <div className="dashboard-card">
                                    <div className="card-header">
                                        <h3>Revenue Summary</h3>
                                        <FontAwesomeIcon icon={faChartLine} className="header-icon" />
                                    </div>
                                    <div className="revenue-grid">
                                        <RevenueCard title="Today's Revenue" amount={revenueData.today} icon={faRupeeSign} period="Last 24 hours" />
                                        <RevenueCard title="Weekly Revenue" amount={revenueData.weekly} icon={faRupeeSign} period="Last 7 days" />
                                        <RevenueCard title="Monthly Revenue" amount={revenueData.monthly} icon={faRupeeSign} period="Last 30 days" />
                                        <RevenueCard title="Total Revenue" amount={revenueData.total} icon={faRupeeSign} period="All time" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard-card">
                                    <div className="card-header">
                                        <h3>Recent Activity</h3>
                                        <FontAwesomeIcon icon={faClock} className="header-icon" />
                                    </div>
                                    <div className="activity-feed">
                                        {recentActivity.map((activity, index) => (
                                            <ActivityItem
                                                key={index}
                                                time={activity.time}
                                                message={activity.message}
                                                icon={activity.icon}
                                                type={activity.type}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;