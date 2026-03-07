import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faThumbsUp,
    faCommentDots,
    faCheckCircle,
    faSearch,
    faBars
} from '@fortawesome/free-solid-svg-icons';

import api from '../../Api/axios';

const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="col-md-3 col-sm-6 mb-4">
        <div className="card shadow-sm p-3 border-0 rounded-4"
            style={{ backgroundColor: bgColor }}>
            <div className="d-flex align-items-center">
                <div className="me-3">
                    <FontAwesomeIcon icon={icon} size="2x" color="white" />
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
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const openWidth = "250px";
    const collapsedWidth = "80px";

    const mainContentStyle = {
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        marginLeft: isCollapsed ? collapsedWidth : openWidth,
        transition: "margin-left 0.3s ease"
    };

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const res = await api.get("/bookings");

                if (res.data.success) {
                    setBookings(res.data.data);
                    setFilteredBookings(res.data.data);
                }

            } catch (err) {
                console.error(err);
            }

        };

        fetchBookings();

    }, []);

    useEffect(() => {

        if (searchTerm.trim() === "") {

            setFilteredBookings(bookings);

        } else {

            setFilteredBookings(
                bookings.filter(b =>
                    (b.bikeCompany &&
                        b.bikeCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||

                    (b.bikeNumPlate &&
                        b.bikeNumPlate.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );

        }

    }, [searchTerm, bookings]);

    const getStatusClass = (status) => {

        switch (status) {

            case "Pending":
                return "badge bg-warning text-dark";

            case "Confirmed":
                return "badge bg-primary";

            case "In Progress":
                return "badge bg-info";

            case "Completed":
                return "badge bg-success";

            case "Cancelled":
                return "badge bg-danger";

            default:
                return "badge bg-secondary";

        }

    };

    return (

        <div style={mainContentStyle}>

            {/* Navbar */}

            <nav className="navbar navbar-light bg-white shadow-sm">

                <div className="container-fluid">

                    <button
                        className="navbar-toggler d-lg-none"
                        onClick={toggleSidebar}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    <span className="navbar-brand fw-bold">
                        Search For Bike
                    </span>

                    <div className="d-flex mx-auto" style={{ maxWidth: "400px", width: "100%" }}>

                        <input
                            className="form-control rounded-pill"
                            placeholder="Search by bike company or number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button className="btn">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>

                    </div>

                </div>

            </nav>

            <div className="container-fluid mt-4 px-4">

                {/* Stats */}

                <div className="row">

                    <StatCard
                        title="Total Bookings"
                        value={bookings.length}
                        icon={faEye}
                        bgColor="#E43636"
                    />

                    <StatCard
                        title="Active Customers"
                        value="10+"
                        icon={faThumbsUp}
                        bgColor="#E43636"
                    />

                    <StatCard
                        title="Trained Mechanics"
                        value="5"
                        icon={faCommentDots}
                        bgColor="#E43636"
                    />

                    <StatCard
                        title="Years Experience"
                        value="20+"
                        icon={faCheckCircle}
                        bgColor="#E43636"
                    />

                </div>


                {/* Booking Table */}

                <div className="card shadow-sm rounded-4 mt-4">

                    <div className="card-header bg-transparent border-0">
                        <h5 className="fw-bold">Bookings</h5>
                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover mb-0">

                            <thead className="table-light">

                                <tr>
                                    <th>S.no</th>
                                    <th>User</th>
                                    <th>Bike</th>
                                    <th>Number Plate</th>
                                    <th>Service</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredBookings.length === 0 ? (

                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No bookings found
                                        </td>
                                    </tr>

                                ) : (

                                    filteredBookings.map((b, index) => (

                                        <tr key={b._id}>

                                            <td>{index + 1}</td>

                                            <td>
                                                {b.user_id
                                                    ? `${b.user_id.firstName} ${b.user_id.lastName}`
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                {b.bikeCompany} {b.bikeModel}
                                            </td>

                                            <td>
                                                {b.bikeNumPlate}
                                            </td>

                                            <td>
                                                {b.selectedServices?.length > 0
                                                    ? b.selectedServices.join(", ")
                                                    : b.bikeService}
                                            </td>


                                            <td>
                                                ₹{b.price}
                                            </td>

                                            <td>
                                                {new Date(b.date).toLocaleDateString()}
                                            </td>

                                            <td>

                                                <span className={getStatusClass(b.status)}>
                                                    {b.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AdminDashboard;