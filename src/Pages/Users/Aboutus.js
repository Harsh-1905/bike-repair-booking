import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMotorcycle, faUsers, faTools, faClock, 
    faAward, faHandshake, faCheckCircle, faArrowRight,
    faGlobe, faEnvelope, faPhone, faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import "./aboutus.css";

const AboutUs = () => {
    return (
        <div className="public-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h1 className="hero-title">About BikeCare</h1>
                            <p className="hero-subtitle">
                                Passionate about keeping your bike in perfect condition with expert care and professional service
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Content */}
            <section className="about-content">
                <div className="container">
                    <div className="row align-items-center mb-5">
                        <div className="col-lg-6 col-md-12">
                            <h2 className="section-title">Our Story</h2>
                            <p className="about-text">
                                BikeCare was founded with a simple mission: to provide the best bike repair and maintenance 
                                services in the city. With years of experience and a team of skilled mechanics, we've built 
                                a reputation for quality, reliability, and customer satisfaction.
                            </p>
                            <p className="about-text">
                                We understand that your bike is more than just a vehicle - it's your daily companion, 
                                your freedom, and your trusted ride. That's why we treat every bike that comes to our 
                                workshop with the same care and attention we'd give our own.
                            </p>
                        </div>
                        <div className="col-lg-6 col-md-12 text-center">
                            <img src="/images/mission.png" alt="Our Story" className="img-fluid rounded-lg" />
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-6 col-md-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h4>Our Mission</h4>
                                <p>
                                    To provide fast, reliable, and professional bike repair services to every customer,
                                    ensuring their bike performs at its best while keeping safety a top priority.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faAward} />
                                </div>
                                <h4>Our Vision</h4>
                                <p>
                                    To become the most trusted bike repair service in the region,
                                    known for quality workmanship, experienced mechanics, and customer satisfaction.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="stat-item text-center">
                                <span className="stat-number">400+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="stat-item text-center">
                                <span className="stat-number">10+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="stat-item text-center">
                                <span className="stat-number">700+</span>
                                <span className="stat-label">Bikes Serviced</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="stat-item text-center">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">After Sale Service Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Why Choose BikeCare?</h2>
                                <p className="section-subtitle">We're committed to providing the best service experience</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                                <h4>Expert Team</h4>
                                <p>Our certified mechanics have years of experience working with all types of bikes and brands.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faTools} />
                                </div>
                                <h4>Modern Equipment</h4>
                                <p>We use the latest tools and diagnostic equipment to ensure accurate and efficient repairs.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faClock} />
                                </div>
                                <h4>Quick Turnaround</h4>
                                <p>We understand your time is valuable. Most services are completed within the same day.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faHandshake} />
                                </div>
                                <h4>Transparent Pricing</h4>
                                <p>No hidden costs or surprise charges. We provide clear, upfront pricing for all our services.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faAward} />
                                </div>
                                <h4>Quality Guarantee</h4>
                                <p>All our work comes with a warranty. We stand behind our service and your satisfaction.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faMotorcycle} />
                                </div>
                                <h4>All Brands Welcome</h4>
                                <p>We service all major bike brands and models, from motorcycles to scooters and mopeds.</p>
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
                                <h2>Ready to Experience Our Service?</h2>
                                <p>Join hundreds of satisfied customers who trust BikeCare with their bikes</p>
                                <div className="cta-buttons">
                                    <Link to="/signup" className="btn btn-primary">
                                        Book Service Now
                                    </Link>
                                    <Link to="/contactus" className="btn btn-outline">
                                        Contact Us <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
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

export default AboutUs;
