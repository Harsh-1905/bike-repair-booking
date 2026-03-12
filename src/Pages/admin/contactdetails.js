import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showError } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faCalendarAlt, faCommentDots, faInbox } from "@fortawesome/free-solid-svg-icons";
import "./admin-tables.css";

const ContactUsAdmin = ({ isCollapsed }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const res = await api.get("/contacts");
            if (res.data.success) {
                setContacts(res.data.data);
            } else {
                showError(res.data.message || "Failed to fetch contacts");
            }
            setLoading(false);
        } catch (err) {
            showError("Server error: " + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    if (loading) {
        return (
            <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
                <div className="admin-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p>Loading contact messages...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
            <div className="admin-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <div className="header-text">
                            <h1>Contact Messages</h1>
                            <p>View and manage customer inquiries</p>
                        </div>
                    </div>
                    <div className="stats-badge">
                        <span className="stats-number">{contacts.length}</span>
                        <span className="stats-label">Total Messages</span>
                    </div>
                </div>

                <div className="simple-table-card">
                    <div className="table-header">
                        <h3>
                            <FontAwesomeIcon icon={faInbox} className="me-2" />
                            Customer Messages
                        </h3>
                    </div>
                    
                    <div className="simple-table-container">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length > 0 ? contacts.map((contact, index) => (
                                    <tr key={contact._id}>
                                        <td>{index + 1}</td>
                                        <td className="name-cell">{contact.name}</td>
                                        <td>{contact.email}</td>
                                        <td className="subject-cell">{contact.subject}</td>
                                        <td className="message-cell">{contact.message}</td>
                                        <td className="date-cell">
                                            <div>
                                                <div className="date-value">
                                                    {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </div>
                                                <div className="time-value">
                                                    {new Date(contact.createdAt).toLocaleTimeString("en-IN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true
                                                    })}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="empty-row">
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faInbox} className="empty-icon" />
                                                <span>No messages found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsAdmin;
