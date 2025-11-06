import React, { useEffect, useState } from "react";
import "./user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";

const UserTable = ({ isCollapsed }) => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchUsers = () => {
        api.get("/users")
            .then((res) => {
                if (res.data.success) setUsers(res.data.users);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            api.delete(`/user/${id}`)
                .then((res) => {
                    if (res.data.success) {
                        showSuccess("User deleted successfully!");
                        setUsers(users.filter(u => u._id !== id));
                    } else showError(res.data.message || "Failed to delete user");
                })
                .catch((err) => showError(err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setEditData({ ...user });
    };

    const saveEdit = () => {
        api.put(`/user/${editingUser}`, editData)
            .then((res) => {
                if (res.data.success) {
                    showSuccess("User updated successfully!");
                    setEditingUser(null);
                    fetchUsers();
                } else showError(res.data.message || "Failed to update user");
            })
            .catch((err) => showError(err.response?.data?.message || err.message));
    };

    return (
        <div style={{ marginLeft: isCollapsed ? '80px' : '250px', padding: '20px', transition: 'margin-left 0.3s ease' }}>
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
                            <th>Actions</th>
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
                                <td className="text-center">
                                    <button className="btn btn-info me-2" onClick={() => handleEdit(user)}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {editingUser && (
                    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content p-3">
                                <h5>Edit User</h5>
                                {["firstName", "middleName", "lastName", "contactNumber", "address", "email"].map(field => (
                                    <input
                                        key={field}
                                        type={field === "email" ? "email" : "text"}
                                        className="form-control mb-2"
                                        placeholder={field}
                                        value={editData[field]}
                                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                    />
                                ))}
                                <div className="d-flex justify-content-end gap-2 mt-2">
                                    <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                                    <button className="btn btn-success" onClick={saveEdit}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTable;
