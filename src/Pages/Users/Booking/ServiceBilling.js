import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowLeft, 
    faMotorcycle, 
    faCreditCard, 
    faMoneyBillWave,
    faCheckCircle,
    faCalendarAlt,
    faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import api from "../../../Api/axios";
import { showSuccess, showError } from "../../../utils/toast";
import BookingSuccessModal from "./BookingSuccessModal";
import "./service-billing.css";

const ServiceBilling = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [bookingData, setBookingData] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        // Get booking data from location state
        if (location.state?.bookingData) {
            setBookingData(location.state.bookingData);
        } else {
            // If no booking data, redirect back to booking
            navigate("/booking");
        }
    }, [location.state, navigate]);

    const handlePayment = async () => {
        if (!bookingData) return;

        setLoading(true);
        
        try {
            let finalBookingData = {
                ...bookingData,
                paymentMethod,
                paymentStatus: paymentMethod === "cash" ? "pending" : "paid"
            };

            console.log("Sending booking data:", finalBookingData);

            // If online payment, simulate payment processing
            if (paymentMethod === "online") {
                // Simulate payment processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // For demo purposes, assume payment is successful
                // In real implementation, integrate with payment gateway like Razorpay, Stripe, etc.
                showSuccess("Payment processed successfully!");
            }

            const res = await api.post("/booking", finalBookingData);

            if (res.data.success) {
                showSuccess("Booking confirmed successfully!");
                
                // Set booking ID and show success modal
                setBookingId(res.data.data._id);
                setShowSuccessModal(true);
            } else {
                showError(res.data.message || "Booking failed");
            }
        } catch (err) {
            console.error("Booking error:", err);
            console.error("Error response:", err.response?.data);
            showError(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="billing-container">
                <div className="container">
                    <div className="text-center p-5">
                        <p>Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const finalCompany = bookingData.bikeCompany;
    const finalModel = bookingData.bikeModel;

    return (
        <div className="billing-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        
                        {/* Header */}
                        <div className="billing-header">
                            <button 
                                className="btn btn-link p-0 me-3"
                                onClick={() => navigate(-1)}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                            </button>
                            <h2 className="mb-0">Complete Your Booking</h2>
                        </div>

                        <div className="row g-4">
                            
                            {/* Booking Summary */}
                            <div className="col-lg-7">
                                <div className="card billing-card">
                                    <div className="card-header">
                                        <h4 className="mb-0">
                                            <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                                            Booking Summary
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        
                                        {/* Bike Details */}
                                        <div className="summary-section">
                                            <h6 className="section-title">Vehicle Details</h6>
                                            <div className="detail-row">
                                                <span className="label">Bike:</span>
                                                <span className="value">{finalCompany} {finalModel}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Type:</span>
                                                <span className="value">{bookingData.bikeType}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Number Plate:</span>
                                                <span className="value">{bookingData.bikeNumPlate}</span>
                                            </div>
                                        </div>

                                        {/* Service Details */}
                                        <div className="summary-section">
                                            <h6 className="section-title">Service Details</h6>
                                            <div className="detail-row">
                                                <span className="label">Service Type:</span>
                                                <span className="value">{bookingData.bikeService}</span>
                                            </div>
                                            
                                            {bookingData.selectedServices && bookingData.selectedServices.length > 0 && (
                                                <div className="detail-row">
                                                    <span className="label">Selected Services:</span>
                                                    <div className="selected-services">
                                                        {bookingData.selectedServices.map((service, index) => (
                                                            <div key={index} className="service-item">
                                                                <span>{service.name}</span>
                                                                <span>₹{service.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="detail-row">
                                                <span className="label">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                                    Service Date:
                                                </span>
                                                <span className="value">
                                                    {new Date(bookingData.date).toLocaleDateString('en-IN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                                                    Pickup & Drop:
                                                </span>
                                                <span className="value">
                                                    {bookingData.pickupDrop === "yes" ? "Yes" : "No"}
                                                </span>
                                            </div>

                                            {bookingData.remarks && (
                                                <div className="detail-row">
                                                    <span className="label">Remarks:</span>
                                                    <span className="value">{bookingData.remarks}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payment Method Selection */}
                                        <div className="summary-section">
                                            <h6 className="section-title">Payment Method</h6>
                                            
                                            <div className="payment-options">
                                                <div 
                                                    className={`payment-option ${paymentMethod === "cash" ? "selected" : ""}`}
                                                    onClick={() => setPaymentMethod("cash")}
                                                >
                                                    <div className="payment-icon">
                                                        <FontAwesomeIcon icon={faMoneyBillWave} />
                                                    </div>
                                                    <div className="payment-details">
                                                        <h6>Cash on Service</h6>
                                                        <p>Pay when the service is completed</p>
                                                    </div>
                                                    <div className="payment-radio">
                                                        <input 
                                                            type="radio" 
                                                            name="payment" 
                                                            checked={paymentMethod === "cash"}
                                                            onChange={() => setPaymentMethod("cash")}
                                                        />
                                                    </div>
                                                </div>

                                                <div 
                                                    className={`payment-option ${paymentMethod === "online" ? "selected" : ""}`}
                                                    onClick={() => setPaymentMethod("online")}
                                                >
                                                    <div className="payment-icon">
                                                        <FontAwesomeIcon icon={faCreditCard} />
                                                    </div>
                                                    <div className="payment-details">
                                                        <h6>Online Payment</h6>
                                                        <p>Pay now using UPI, Card, or Net Banking</p>
                                                    </div>
                                                    <div className="payment-radio">
                                                        <input 
                                                            type="radio" 
                                                            name="payment" 
                                                            checked={paymentMethod === "online"}
                                                            onChange={() => setPaymentMethod("online")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="col-lg-5">
                                <div className="card billing-card sticky-top">
                                    <div className="card-header">
                                        <h5 className="mb-0">Price Summary</h5>
                                    </div>
                                    <div className="card-body">
                                        
                                        <div className="price-row">
                                            <span>Service Charge</span>
                                            <span>₹{bookingData.price}</span>
                                        </div>

                                        {bookingData.pickupDrop === "yes" && (
                                            <div className="price-row">
                                                <span>Pickup & Drop</span>
                                                <span>₹50</span>
                                            </div>
                                        )}

                                        <div className="price-row">
                                            <span>GST (18%)</span>
                                            <span>₹{Math.round((bookingData.price + (bookingData.pickupDrop === "yes" ? 50 : 0)) * 0.18)}</span>
                                        </div>

                                        <hr />

                                        <div className="price-row total">
                                            <span>Total Amount</span>
                                            <span>₹{Math.round((bookingData.price + (bookingData.pickupDrop === "yes" ? 50 : 0)) * 1.18)}</span>
                                        </div>

                                        <div className="payment-info">
                                            {paymentMethod === "cash" ? (
                                                <div className="cash-info">
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                                                    <span>Pay ₹{Math.round((bookingData.price + (bookingData.pickupDrop === "yes" ? 50 : 0)) * 1.18)} when service is completed</span>
                                                </div>
                                            ) : (
                                                <div className="online-info">
                                                    <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                    <span>Secure online payment</span>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            className="btn btn-primary w-100 mt-3"
                                            onClick={handlePayment}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span>
                                                    {paymentMethod === "online" ? "Processing Payment..." : "Confirming Booking..."}
                                                </span>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                                    {paymentMethod === "cash" ? "Confirm Booking" : "Pay Now"}
                                                </>
                                            )}
                                        </button>

                                        <div className="security-note">
                                            <small className="text-muted">
                                                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                                Your booking is secure and protected
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Success Modal */}
            <BookingSuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                bookingData={bookingData}
                bookingId={bookingId}
            />
        </div>
    );
};

export default ServiceBilling;