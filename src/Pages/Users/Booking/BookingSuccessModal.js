import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCheckCircle, 
    faMotorcycle, 
    faHome,
    faEye,
    faCreditCard,
    faMoneyBillWave,
    faTimes,
    faCalendarAlt,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import "./booking-success-modal.css";

const BookingSuccessModal = ({ isOpen, onClose, bookingData, bookingId }) => {
    const navigate = useNavigate();

    if (!isOpen || !bookingData || !bookingId) return null;

    const totalAmount = Math.round((bookingData.price + (bookingData.pickupDrop === "yes" ? 50 : 0)) * 1.18);

    const handleTrackBooking = () => {
        onClose();
        navigate("/tracking");
    };

    const handleGoHome = () => {
        onClose();
        navigate("/userhomepage");
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="booking-modal-overlay" onClick={handleBackdropClick}>
            <div className="booking-modal">
                
                {/* Close Button */}
                <button className="modal-close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {/* Success Header */}
                <div className="modal-header">
                    <div className="success-animation">
                        <div className="success-icon">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div className="success-ripple"></div>
                        <div className="success-ripple delay-1"></div>
                    </div>
                    <h2 className="modal-title">Booking Confirmed!</h2>
                    {/* <p className="modal-subtitle">Your service has been successfully booked</p> */}
                    <div className="booking-id-badge">
                        <span className="booking-label">Booking ID</span>
                        <span className="booking-number">#{bookingId.slice(-8).toUpperCase()}</span>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="modal-body">
                    <div className="booking-summary">
                        
                        {/* Vehicle & Service Info */}
                        <div className="summary-section">
                            <h4 className="section-title">
                                <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                                Booking Summary
                            </h4>
                            
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="label">Vehicle</span>
                                    <span className="value">{bookingData.bikeCompany} {bookingData.bikeModel}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Number Plate</span>
                                    <span className="value highlight">{bookingData.bikeNumPlate}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Service Type</span>
                                    <span className="value">{bookingData.bikeService}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Service Date</span>
                                    <span className="value">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                        {new Date(bookingData.date).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="summary-section">
                            <h4 className="section-title">
                                <FontAwesomeIcon 
                                    icon={bookingData.paymentMethod === "cash" ? faMoneyBillWave : faCreditCard} 
                                    className="me-2" 
                                />
                                Payment Details
                            </h4>
                            
                            <div className="payment-summary">
                                <div className="payment-method">
                                    <span className="payment-badge">
                                        {bookingData.paymentMethod === "cash" ? "Cash on Service" : "Online Payment"}
                                    </span>
                                    <span className={`payment-status ${bookingData.paymentStatus}`}>
                                        {bookingData.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                                    </span>
                                </div>
                                <div className="total-amount">
                                    <span>Total Amount: </span>
                                    <span className="amount">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="summary-section">
                            <h4 className="section-title">What's Next?</h4>
                            <div className="next-steps">
                                <div className="step-item">
                                    <FontAwesomeIcon icon={faPhone} className="step-icon" />
                                    <span>Confirmation call within 2 hours</span>
                                </div>
                                <div className="step-item">
                                    <FontAwesomeIcon icon={faMotorcycle} className="step-icon" />
                                    <span>Mechanic assignment & service completion</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleTrackBooking}>
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        Track Booking
                    </button>
                    <button className="btn btn-outline" onClick={handleGoHome}>
                        <FontAwesomeIcon icon={faHome} className="me-2" />
                        Go to Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingSuccessModal;