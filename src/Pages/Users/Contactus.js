import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPhone, faMotorcycle, faArrowRight,
    faGlobe, faEnvelope, faMapMarkerAlt,faCity,faBuilding,faLocationArrow,faMap
} from "@fortawesome/free-solid-svg-icons";
import "./contactus.css";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clearData = () => {
        setFormData({ fullName: "", email: "", message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, message } = formData;

        if (!fullName || !email || !message) {
            showError("Please fill all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const res = await api.post("/contact", {
                name: fullName,
                email,
                subject: "Contact Form Inquiry",
                message
            });

            if (res.data.success) {
                showSuccess(res.data.message || "Message sent successfully!");
                clearData();
            } else {
                showError(res.data.message || "Failed to submit message");
            }
        } catch (err) {
            showError("Server error: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="public-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h1 className="hero-title">Contact Us</h1>
                            <p className="hero-subtitle">
                                Get in touch with us for any questions, support, or to book your bike service
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="about-content">
                <div className="container">
                    <div className="row g-5">
                        {/* Contact Form */}
                        <div className="col-lg-7 col-md-12">
                            <div className="contact-form">
                                <h3 className="mb-4">Send us a Message</h3>
                                <p className="text-muted mb-4">
                                    Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Message *</label>
                                        <textarea
                                            rows="5"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help you..."
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Send Message <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Info */}
                        {/* <div className="col-lg-5 col-md-12">
                            <div className="contact-info">
                                 <h3 className="mb-4">Get in Touch</h3>
                                <p className="text-muted mb-4">
                                    We're here to help! Reach out to us through any of the following channels.
                                </p> 

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    </div>
                                    <div>
                                        <h5>Address</h5>
                                        <p>Bardoli-Isroli Road<br />Gujarat, India</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div>
                                        <h5>Phone Numbers</h5>
                                        <p>+91 99252 99383<br />+91 76228 99383</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                    <div>
                                        <h5>Email</h5>
                                        <p>bikecare@gmail.com</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <FontAwesomeIcon icon={faClock} />
                                    </div>
                                    <div>
                                        <h5>Working Hours</h5>
                                        <p>Monday - Saturday: 9:00 AM - 7:00 PM<br />Sunday: 10:00 AM - 5:00 PM</p>
                                    </div>
                                </div>
                            </div> 
                        </div>*/}
                    </div>
                </div>
            </section>

            {/* Service Areas */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Service Areas</h2>
                                <p className="section-subtitle">We currently provide services in the following areas</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faBuilding} />
                                </div>
                                <h4>Bardoli</h4>
                                <p>Complete bike service and repair solutions in Bardoli area.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faCity} />
                                </div>
                                <h4>Surat</h4>
                                <p>Professional bike care services available throughout Surat.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faLocationArrow} />
                                </div>
                                <h4>Navsari</h4>
                                <p>Expert bike maintenance and repair services in Navsari.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faMap} />
                                </div>
                                <h4>Vyara</h4>
                                <p>Quality bike service solutions available in Vyara region.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="cta-content text-center">
                                <h2>Ready to Book Your Service?</h2>
                                <p>Don't wait! Get your bike serviced by our expert mechanics today</p>
                                <div className="cta-buttons">
                                    <Link to="/signup" className="btn btn-primary">
                                        Book Service Now
                                    </Link>
                                    <a href="tel:+919925299383" className="btn btn-outline">
                                        Call Now <FontAwesomeIcon icon={faPhone} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="row gy-4">
                        {/* Brand Info */}
                        <div className="col-md-4">
                            <h4 className="footer-logo">BikeCare</h4>
                            <p className="footer-text">
                                Professional bike repair and servicing at your doorstep. 
                                Reliable mechanics. Affordable pricing. Easy booking.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-md-2">
                            <h5 className="footer-heading">Quick Links</h5>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/ourservices">Services</Link></li>
                                <li><Link to="/signup">Book Service</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/signup">Register</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="col-md-3">
                            <h5 className="footer-heading">Our Services</h5>
                            <ul className="footer-links">
                                <li><Link to="/ourservices">General Service</Link></li>
                                <li><Link to="/ourservices">Brake Repair</Link></li>
                                <li><Link to="/ourservices">Chain & Gear</Link></li>
                                <li><Link to="/ourservices">Flat Tyre Repair</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="col-md-3">
                            <h5 className="footer-heading">Contact Us</h5>
                            <p className="footer-contact">
                                📍 Bardoli-Isroli Road, Gujarat, India <br />
                                📞 +91 99252 99383 <br />
                                📞 +91 76228 99383
                            </p>
                            <div className="contact-icons mt-3">
                                <a href="#" aria-label="Website">
                                    <FontAwesomeIcon icon={faGlobe} />
                                </a>
                                <a href="#" aria-label="Email">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </a>
                                <a href="#" aria-label="Phone">
                                    <FontAwesomeIcon icon={faPhone} />
                                </a>
                                <a href="#" aria-label="Location">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom text-center">
                    <p>© 2026 BikeCare. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ContactUs;
