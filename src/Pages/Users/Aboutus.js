import React from "react";

const AboutUs = () => {
    return (
        <div className="about-us-page">

            {/* Hero Section */}
            <header className="text-center py-5" style={{ backgroundColor: "#E43636", color: "#FFF" }}>
                <div className="container">
                    <h1 className="display-4">About BikeCare</h1>
                    <p className="lead">Passionate about keeping your bike in perfect condition</p>
                </div>
            </header>

            {/* Mission & Vision Section */}
            <section className="py-5" style={{ backgroundColor: "#FFF" }}>
                <div className="container">
                    <h2 className="text-center mb-4" style={{ color: "#E43636" }}>Our Mission & Vision</h2>
                    <div className="row g-4 align-items-center">
                        <div className="col-md-6">
                            <img src="/images/mission.png" alt="Mission" className="img-fluid rounded" />
                        </div>
                        <div className="col-md-6">
                            <h4>Our Mission</h4>
                            <p>
                                To provide fast, reliable, and professional bike repair services to every customer,
                                ensuring their bike performs at its best while keeping safety a top priority.
                            </p>
                            <h4>Our Vision</h4>
                            <p>
                                To become the most trusted bike repair service in the region,
                                known for quality workmanship, experienced mechanics, and customer satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-5 text-center" style={{ backgroundColor: "#FFF" }}>
                <div className="container">
                    <h2 className="mb-4" style={{ color: "#E43636" }}>Want to Experience Our Services?</h2>
                    <p className="mb-4">Book your bike repair easily and experience the quality!</p>
                    <a href="/service" className="btn btn-lg" style={{ backgroundColor: "#E43636", color: "#FFF" }}>Book Now</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-4" style={{ backgroundColor: "#000", color: "#FFF" }}>
                <div className="container">
                    <p className="mb-0">&copy; 2025 BikeCare. All Rights Reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default AboutUs;
