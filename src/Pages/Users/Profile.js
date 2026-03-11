import { showError, showSuccess } from "../../utils/toast";
import { useEffect, useState } from 'react';
import api from '../../Api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './user.css';

const Profile = ({ isCollapsed }) => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        getUserProfileData();
    }, []);

    const getUserProfileData = async () => {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;
        try {
            const res = await api.get(`/user/${userId}`);
            if (res.data.success) {
                const user = res.data.user;
                setUserData(user);
                setFormData(user);
            } else {
                showError(res.data.message || "Something went wrong");
            }
        } catch (err) {
            showError(err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        const userId = userData._id;
        
        try {
            const res = await api.put(`/user/${userId}`, formData);
            if (res.data.success) {
                showSuccess("Profile updated successfully!");
                
                // Update userData and localStorage with the new data
                const updatedUser = res.data.user;
                setUserData(updatedUser);
                setFormData(updatedUser);
                setIsEditing(false);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                showError(res.data.message || "Failed to update profile");
            }
        } catch (err) {
            showError(err.message);
        }
    };

    if (!userData) return (
        <div 
            className="profile-wrapper"
            style={{
                marginLeft: isCollapsed !== undefined ? (isCollapsed ? '80px' : '250px') : '0',
                transition: 'margin-left 0.3s ease'
            }}
        >
            <div className="loading">Loading profile...</div>
        </div>
    );

    return (
        <div 
            className="profile-wrapper"
            style={{
                marginLeft: isCollapsed !== undefined ? (isCollapsed ? '80px' : '250px') : '0',
                transition: 'margin-left 0.3s ease'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    
                    {/* LEFT PROFILE CARD */}
                    <div className="col-lg-4 col-md-5 mb-4">
                        <div className="profile-card shadow">
                            <div className="profile-header"></div>
                            <div className="profile-body text-center">
                                {/* Avatar */}
                                <div className="avatar">
                                    {userData.fullName?.charAt(0)}{userData.fullName?.split(' ')[1]?.charAt(0) || userData.fullName?.charAt(1)}
                                </div>
                                <h4 className="mt-3">
                                    {userData.fullName}
                                </h4>
                                <p className="text-muted">{userData.email}</p>
                                <p className="user-role-badge">
                                    {userData.userType === 'admin' ? 'Administrator' : 'User'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT DETAILS CARD */}
                    <div className="col-lg-7 col-md-7">
                        <div className="card shadow profile-details">
                            <div className="card-body">
                                <h4 className="section-title mb-4">Profile Information</h4>

                                {/* Dynamic Fields */}
                                <div className="profile-row">
                                    <label>Full Name</label>
                                    <div className="value">
                                        {isEditing ? (
                                            <input
                                                className="form-control"
                                                name="fullName"
                                                value={formData.fullName || ""}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <span>{userData.fullName}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-row">
                                    <label>Email</label>
                                    <div className="value">
                                        {isEditing ? (
                                            <input
                                                className="form-control"
                                                name="email"
                                                type="email"
                                                value={formData.email || ""}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <span>{userData.email}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-row">
                                    <label>Mobile Number</label>
                                    <div className="value">
                                        {isEditing ? (
                                            <input
                                                className="form-control"
                                                name="contactNumber"
                                                value={formData.contactNumber || ""}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <span>{userData.contactNumber}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="profile-row">
                                    <label>Address</label>
                                    <div className="value">
                                        {isEditing ? (
                                            <input
                                                className="form-control"
                                                name="address"
                                                value={formData.address || ""}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <span>{userData.address}</span>
                                        )}
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="text-center mt-4">
                                    {isEditing ? (
                                        <>
                                            <button className="btn btn-success me-2 px-4" onClick={handleSave}>
                                                <FontAwesomeIcon icon={faSave} /> Save
                                            </button>
                                            <button className="btn btn-outline-secondary px-4" onClick={() => setIsEditing(false)}>
                                                <FontAwesomeIcon icon={faTimes} /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
                                            <FontAwesomeIcon icon={faEdit} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
