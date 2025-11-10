import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showError } from "../../utils/toast";

const ContactUsAdmin = ({ isCollapsed }) => {
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        try {
            const res = await api.get("/contacts");
            if (res.data.success) setContacts(res.data.data);
            else showError(res.data.message || "Failed to fetch contacts");
        } catch (err) {
            showError("Server error: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    return (
        <div style={{ marginLeft: isCollapsed ? '80px' : '250px', padding: '20px', transition: 'margin-left 0.3s ease', overflow: 'hidden' }}>
            <style>{` table tbody tr:hover { background-color: #f0f5ff;cursor: pointer;transform: scale(1,1.03);transition: transform 0.2s ease, background-color 0.2s ease;}`}</style>
            <div className="container my-5">
                <h2 className="text-center mb-4">Contact Messages</h2>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Sno</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No messages found.</td>
                                </tr>
                            ) : contacts.map((contact, index) => (
                                <tr key={contact._id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.subject}</td>
                                    <td>{contact.message}</td>
                                    <td className="text-center">{new Date(contact.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactUsAdmin;
