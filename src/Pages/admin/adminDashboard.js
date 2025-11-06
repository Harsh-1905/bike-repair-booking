import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbsUp, faCommentDots, faCheckCircle, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import api from '../../Api/axios'; // adjust path

// Stats Card component
const StatCard = ({ title, value, icon, bgColor, iconColor }) => (
    <div className="col-md-3 col-sm-6 mb-4">
        <div className={`card shadow-sm p-3 border-0 rounded-4`} style={{ backgroundColor: bgColor || '#6c757d' }}>
            <div className="d-flex align-items-center">
                <div className="me-3">
                    <FontAwesomeIcon icon={icon} size="2x" style={{ color: iconColor || 'white' }} />
                </div>
                <div>
                    <h5 className="mb-0 text-white fw-bold">{value}</h5>
                    <small className="text-white-50">{title}</small>
                </div>
            </div>
        </div>
    </div>
);

const AdminDashboard = ({ isCollapsed, toggleSidebar }) => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);

    // Sidebar widths
    const openWidth = '250px';
    const collapsedWidth = '80px';

    const mainContentStyle = {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        marginLeft: isCollapsed ? collapsedWidth : openWidth,
        transition: 'margin-left 0.3s ease',
    };

    // Fetch all bookings on mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings'); // backend route
                if (res.data.success) {
                    setBookings(res.data.data);
                    setFilteredBookings(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };
        fetchBookings();
    }, []);

    // Update filtered bookings as user types
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(
                bookings.filter(b =>
                    (b.bike_name && b.bike_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (b.bike_numplate && b.bike_numplate.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
    }, [searchTerm, bookings]);

    return (
        <div className="dashboard-wrapper" style={mainContentStyle}>
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                <div className="container-fluid">
                    <button className="navbar-toggler me-3 d-lg-none" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <span className="navbar-brand fw-bold text-dark d-none d-lg-block">Search For Bike Here</span>

                    <form className="d-flex mx-auto position-relative" style={{ maxWidth: '400px', flexGrow: 1 }}>
                        <input
                            className="form-control me-2 border-0 rounded-pill ps-4"
                            type="search"
                            placeholder="Search by bike name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search"
                            style={{ backgroundColor: '#e9ecef' }}
                        />
                        <button className="btn position-absolute end-0 top-50 translate-middle-y me-2" type="button" style={{ color: '#4CAF50' }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>
            </nav>

            <div className="container-fluid mt-4 px-4">
                {/* Stats Cards */}
                <div className="row g-4">
                    <StatCard title="Total Bookings" value={bookings.length} icon={faEye} bgColor="#E43636" iconColor="rgba(255,255,255,0.7)" />
                    <StatCard title="Active Customers" value="85+" icon={faThumbsUp} bgColor="#E43636" iconColor="rgba(255,255,255,0.7)" />
                    <StatCard title="Trained Mechanics" value="5" icon={faCommentDots} bgColor="#E43636" iconColor="rgba(255,255,255,0.7)" />
                    <StatCard title="Years of Experience" value="20+" icon={faCheckCircle} bgColor="#E43636" iconColor="rgba(255,255,255,0.7)" />
                </div>

                {/* Search Results Table */}
                <div className="card shadow-sm rounded-4 mt-4 mb-4">
                    <div className="card-header border-0 bg-transparent pt-3 pb-2">
                        <h5 className="mb-0 fw-bold" style={{ color: '#333' }}>Bookings</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th scope="col" className="text-muted border-0 py-3 ps-4">S.no</th>
                                        <th scope="col" className="text-muted border-0 py-3">User Name</th>
                                        <th scope="col" className="text-muted border-0 py-3">Bike Name</th>
                                        <th scope="col" className="text-muted border-0 py-3">Number Plate</th>
                                        <th scope="col" className="text-muted border-0 py-3">Date & Time</th>
                                        <th scope="col" className="text-muted border-0 py-3">Service</th>
                                        <th scope="col" className="text-muted border-0 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center">No bookings found</td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((booking, index) => (
                                            <tr key={booking._id}>
                                                <td className="ps-4">{index + 1}</td>
                                                <td>{booking.user_id ? `${booking.user_id.firstName} ${booking.user_id.lastName}` : 'N/A'}</td>
                                                <td>{booking.bike_name}</td>
                                                <td>{booking.bike_numplate}</td>
                                                <td>{new Date(booking.date_time).toLocaleString()}</td>
                                                <td>{booking.service_id}</td>
                                                <td>{booking.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
