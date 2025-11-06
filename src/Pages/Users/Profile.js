import Avatar from 'react-avatar';
import { showError, showSuccess } from "../../utils/toast";
import { useEffect, useState } from 'react';
import api from '../../Api/axios';

const Profile = () => {
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
                setUserData(res.data.user);
                setFormData(res.data.user);
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
                setUserData(formData);
                setIsEditing(false);
                localStorage.setItem("user", JSON.stringify(formData));
            } else {
                showError(res.data.message || "Failed to update profile");
            }
        } catch (err) {
            showError(err.message);
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="container">
            <div className="row min-vh-100 d-flex align-items-stretch">

                {/* Left Card */}
                <div className="col-md-4 p-3">
                    <div className="card text-center h-100 shadow-lg">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center gap-4">
                            <Avatar
                                name={`${userData.firstName} ${userData.lastName}`}
                                round
                                size={150}
                                color='#E43636'
                            />
                            <h5 className="card-title">{userData.firstName} {userData.middleName} {userData.lastName}</h5>
                        </div>
                    </div>
                </div>

                {/* Right Info */}
                <div className="col-md-8 p-3">
                    <div className="card h-100 shadow-lg">
                        <div className="card-body d-flex flex-column justify-content-center">
                            {["firstName", "middleName", "lastName", "email", "contactNumber", "address"].map((field) => (
                                <ProfileField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    name={field}
                                    value={formData[field]}
                                    isEditing={isEditing}
                                    handleChange={handleChange}
                                    type={field === "address" ? "textarea" : "text"}
                                />
                            ))}

                            <div className="text-end mt-4 text-center">
                                {isEditing ? (
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-success" style={{ width: "120px" }} onClick={handleSave}>Save</button>
                                        <button className="btn btn-secondary" style={{ width: "120px" }} onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                ) : (
                                    <button className="btn" style={{ background: '#E43636', color: '#FFF', width: '250px' }} onClick={() => setIsEditing(true)}>Edit</button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

// Reusable field component
const ProfileField = ({ label, name, value, isEditing, handleChange, type = "text" }) => (
    <div className="row mb-2">
        <div className="col-sm-3"><h6>{label}</h6></div>
        <div className="col-sm-9">
            {isEditing ? (
                type === "textarea" ? (
                    <textarea name={name} className="form-control" rows="3" value={value || ""} onChange={handleChange} />
                ) : (
                    <input type={type} name={name} className="form-control" value={value || ""} onChange={handleChange} />
                )
            ) : (
                <div className="text-secondary">{value}</div>
            )}
        </div>
        <hr />
    </div>
);
