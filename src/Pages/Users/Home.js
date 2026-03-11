
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMotorcycle, faTools, faShieldAlt, faClock, 
    faUserTie, faWrench, faCheckCircle, faArrowRight 
} from "@fortawesome/free-solid-svg-icons";
import "./public-pages.css";

const Home = () => {
    return (
        <div className="public-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="hero-text">
                                <h1 className="hero-title">
                                    Professional Bike Care & Repair Services
                                </h1>
                                <p className="hero-subtitle">
                                    Fast, reliable, and professional bike service with expert mechanics and quality parts. Get your bike back on the road in no time!
                                </p>
                                <div className="hero-buttons">
                                    <Link to="/signup" className="btn btn-primary">
                                        <FontAwesomeIcon icon={faMotorcycle} /> Get Started
                                    </Link>
                                    <Link to="/ourservices" className="btn btn-outline">
                                        Our Services <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="hero-showcase">
                                <div className="hero-stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon">
                                            <FontAwesomeIcon icon={faMotorcycle} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">500+</span>
                                            <span className="stat-label">Bikes Serviced</span>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-card">
                                        <div className="stat-icon">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">10+</span>
                                            <span className="stat-label">Expert Mechanics</span>
                                        </div>
                                    </div>
                                    
                                     <div className="stat-card">
                                        <div className="stat-icon">
                                            <FontAwesomeIcon icon={faTools} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-label">Professional Equipment</span>
                                        </div>
                                    </div> 
                                    
                                    <div className="stat-card">
                                        <div className="stat-icon">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">100%</span>
                                            <span className="stat-label">Satisfaction Rate</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Why Choose BikeCare?</h2>
                                <p className="section-subtitle">We provide the best bike repair and maintenance services in the city</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faTools} />
                                </div>
                                <h4>Fully Equipped Workshop</h4>
                                <p>Our workshop has all the modern tools and machines for any repair job, ensuring quality service every time.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faUserTie} />
                                </div>
                                <h4>Expert Mechanics</h4>
                                <p>Certified mechanics with years of experience ensure your bike is in safe hands and gets the best care.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                </div>
                                <h4>Quality Parts</h4>
                                <p>We use only high-quality, genuine parts to make your bike perform like new and last longer.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faClock} />
                                </div>
                                <h4>Quick Service</h4>
                                <p>Fast turnaround times without compromising on quality. Get your bike back when you need it.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faMotorcycle} />
                                </div>
                                <h4>All Bike Types</h4>
                                <p>We service all types of bikes - motorcycles, scooters, and mopeds from all major brands.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h4>Guaranteed Work</h4>
                                <p>All our work comes with a guarantee. We stand behind our service and your satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="services-preview">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Our Services</h2>
                                <p className="section-subtitle">Comprehensive bike care solutions for all your needs</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="service-card">
                                <div className="service-icon">
                                    <FontAwesomeIcon icon={faWrench} />
                                </div>
                                <h4>General Service</h4>
                                <p>Complete bike checkup including oil change, brake adjustment, and basic maintenance.</p>
                                <div className="service-price">Starting at ₹499</div>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="service-card">
                                <div className="service-icon">
                                    <FontAwesomeIcon icon={faTools} />
                                </div>
                                <h4>Premium Service</h4>
                                <p>Comprehensive service with engine tuning, full inspection, and premium parts replacement.</p>
                                <div className="service-price">Starting at ₹999</div>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="service-card">
                                <div className="service-icon">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h4>Custom Service</h4>
                                <p>Choose exactly what your bike needs with our customizable service options.</p>
                                <div className="service-price">Custom Pricing</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-12 text-center mt-5">
                            <Link to="/ourservices" className="btn btn-primary">
                                View All Services <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
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
                                <h2>Ready to Get Your Bike Serviced?</h2>
                                <p>Book your bike service online in just a few clicks and get back on the road!</p>
                                <div className="cta-buttons">
                                    <Link to="/signup" className="btn btn-primary">
                                        Book Service Now
                                    </Link>
                                    <Link to="/contactus" className="btn btn-outline">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
