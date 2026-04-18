import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faWrench, faTools, faCog, faBolt, faShieldAlt, 
    faMotorcycle, faBatteryFull, faCheckCircle, faArrowRight,
    faGlobe, faEnvelope, faPhone, faMapMarkerAlt,faBoltLightning,faWater
} from "@fortawesome/free-solid-svg-icons";
import "./ourservices.css";

const Services = () => {
    const services = [
        {
            icon: faWrench,
            title: "General Service",
            price: "₹499",
            description: "Complete bike checkup with basic maintenance and safety inspection.",
            features: [
                "Engine oil change",
                "Brake adjustment", 
                "Chain lubrication",
                "Tyre pressure check",
                "Basic inspection"
            ]
        },
        {
            icon: faTools,
            title: "Premium Service",
            price: "₹999",
            description: "Comprehensive service with advanced diagnostics and premium care.",
            features: [
                "Chain lubrication & adjustment",
                "Battery check & maintenance",
                "Air filter cleaning",
                "Full bike inspection",
                "Performance tuning"
            ]
        },
        {
            icon: faCog,
            title: "Custom Service",
            price: "Custom Pricing",
            description: "Choose exactly what your bike needs with our flexible service options.",
            features: [
                "Select specific services",
                "Tailored to your needs",
                "Flexible pricing",
                "Expert recommendations",
                "Quality guarantee"
            ]
        },
        {
            icon: faBolt,
            title: "Engine Repair",
            price: "₹800+",
            description: "Expert engine diagnostics and repair services for optimal performance.",
            features: [
                "Engine diagnostics",
                "Performance issues",
                "Carburetor cleaning",
                "Fuel system service",
                "Engine tuning"
            ]
        },
        {
            icon: faShieldAlt,
            title: "Brake Service",
            price: "₹300+",
            description: "Complete brake system inspection and repair for your safety.",
            features: [
                "Brake pad inspection",
                "Brake fluid check",
                "Brake adjustment",
                "Safety testing",
                "Emergency repairs"
            ]
        },
        {
            icon: faBatteryFull,
            title: "Electrical Service",
            price: "₹250+",
            description: "Battery, lights, and electrical system maintenance and repair.",
            features: [
                "Battery health check",
                "Charging system test",
                "Light inspection",
                "Wiring diagnostics",
                "Electrical repairs"
            ]
        }
    ];

    return (
        <div className="public-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h1 className="hero-title">Our Services</h1>
                            <p className="hero-subtitle">
                                Professional bike repair & maintenance services with expert care and quality guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-preview">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Complete Bike Care Solutions</h2>
                                <p className="section-subtitle">From basic maintenance to complex repairs, we've got you covered</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        {services.map((service, index) => (
                            <div className="col-lg-6 col-md-12" key={index}>
                                <div className="service-detail-card">
                                    <div className="service-header">
                                        <div className="service-detail-icon">
                                            <FontAwesomeIcon icon={service.icon} />
                                        </div>
                                        <div className="service-info">
                                            <h3>{service.title}</h3>
                                            {/* <div className="price">{service.price}</div> */}
                                        </div>
                                    </div>
                                    
                                    <p>{service.description}</p>
                                    
                                    <ul className="service-features">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                    
                                    <Link to="/signup" className="btn btn-primary">
                                        Book This Service <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Services */}
            <section className="features-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header text-center">
                                <h2 className="section-title">Additional Services</h2>
                                <p className="section-subtitle">Extra services to keep your bike in perfect condition</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faMotorcycle} />
                                </div>
                                <h4>Pickup & Drop</h4>
                                <p>Convenient pickup and drop service for your bike. We'll collect your bike and return it after service.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faBoltLightning} />
                                </div>
                                <h4>Emergency Breakdown Assistance</h4>
                                <p> We provide On-call Support during emergency. Flat tyre Repair , Battery jump start.</p>
                            </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h4>Safety Inspection</h4>
                                <p>Comprehensive safety checks to ensure your bike meets all safety standards and regulations.</p>
                            </div>
                        </div>
                         <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <FontAwesomeIcon icon={faWater} />
                                </div>
                                <h4>Bike Washing and Detailing</h4>
                                <p>The bike washing is very important before service . We wash bikes with skill and precision.</p>
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
                                <p>Choose from our range of services and get your bike serviced by experts</p>
                                <div className="cta-buttons">
                                    <Link to="/signup" className="btn btn-primary">
                                        Book Service Now
                                    </Link>
                                    <Link to="/contactus" className="btn btn-outline">
                                        Get Quote <FontAwesomeIcon icon={faArrowRight} />
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

export default Services;