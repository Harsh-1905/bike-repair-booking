import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const History = () => {

    const [bookings, setBookings] = useState([]);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchBookings = () => {

        api.get(`/booking/user/${user._id}`)
            .then(res => {
                if (res.data.success) {
                    setBookings(res.data.data);
                }
            })
            .catch(err => console.error(err));

    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleEdit = (booking) => {
        setEditingBooking(booking._id);
        setEditData({ ...booking });
    };

    const saveEdit = () => {

        api.put(`/booking/${editingBooking}`, editData)
            .then(res => {

                if (res.data.success) {

                    showSuccess("Booking updated successfully!");
                    setEditingBooking(null);
                    fetchBookings();

                } else {
                    showError(res.data.message);
                }

            })
            .catch(err => showError(err.response?.data?.message || err.message));

    };

    const handleDelete = (id) => {

        if (window.confirm("Are you sure you want to delete this booking?")) {

            api.delete(`/booking/${id}`)
                .then(res => {

                    if (res.data.success) {

                        showSuccess("Booking deleted successfully!");
                        setBookings(bookings.filter(b => b._id !== id));

                    } else {
                        showError(res.data.message);
                    }

                })
                .catch(err => showError(err.response?.data?.message || err.message));

        }

    };

    return (

        <div className="container">

            <style>{`tr {text-align:center;}`}</style>

            <h2 className="mt-4 mb-3">Booking History</h2>

            <table className="table">

                <thead className="table-dark text-center">

                    <tr>
                        <th>Bike Company</th>
                        <th>Bike Model</th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {bookings.length > 0 ? bookings.map(b => (

                        <tr key={b._id}>

                            <td>{b.bikeCompany}</td>

                            <td>{b.bikeModel}</td>

                            <td>{b.bikeService}</td>

                            <td>₹{b.price}</td>

                            <td>
                                {new Date(b.date).toLocaleDateString("en-GB")}
                            </td>

                            <td>{b.status}</td>

                            <td>

                                <button
                                    className="btn btn-info me-2"
                                    onClick={() => handleEdit(b)}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(b._id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                            </td>

                        </tr>

                    )) : (

                        <tr>
                            <td colSpan="7" className="text-center">
                                No booking history found.
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

            {editingBooking && (

                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

                    <div className="modal-dialog">

                        <div className="modal-content p-3">

                            <h5>Edit Booking</h5>

                            <input
                                className="form-control mb-2"
                                value={editData.bikeCompany}
                                onChange={(e) =>
                                    setEditData({ ...editData, bikeCompany: e.target.value })
                                }
                            />

                            <input
                                className="form-control mb-2"
                                value={editData.bikeModel}
                                onChange={(e) =>
                                    setEditData({ ...editData, bikeModel: e.target.value })
                                }
                            />

                            <input
                                type="date"
                                className="form-control mb-2"
                                value={editData.date?.slice(0, 10)}
                                onChange={(e) =>
                                    setEditData({ ...editData, date: e.target.value })
                                }
                            />

                            <div className="d-flex justify-content-end gap-2 mt-2">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditingBooking(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={saveEdit}
                                >
                                    Save
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default History;