import React, { useEffect, useState } from "react";
import "./user.css";
import api from "../../Api/axios";

const UserTable = ({ isCollapsed }) => {
    const [users, setUsers] = useState([]);
    const fetchUsers = () => {
        api.get("/users")
            .then((res) => {
                if (res.data.success) setUsers(res.data.users);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => { fetchUsers(); }, []);
    return (
        <div style={{ marginLeft: isCollapsed ? '80px' : '250px', padding: '20px', transition: 'margin-left 0.3s ease' }}>
            <style>{`table tbody tr:hover { background-color: #f0f5ff;cursor: pointer;transform: scale(1.01);transition: transform 0.2s ease, background-color 0.2s ease;}`}</style>
            <div className="userTable container my-4">
                <h2 className="text-center mb-4">User Details</h2>
                <table className="table table-bordered table-hover">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>S.no</th>
                            <th>First Name</th>
                            <th>Middle Name</th>
                            <th>Last Name</th>
                            <th>Contact Number</th>
                            <th>Address</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((user, index) => (
                            <tr key={user._id}>
                                <td className="text-center">{index + 1}</td>
                                <td>{user.firstName}</td>
                                <td>{user.middleName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.contactNumber}</td>
                                <td>{user.address}</td>
                                <td>{user.email}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
