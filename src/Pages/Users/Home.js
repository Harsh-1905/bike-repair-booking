
import React from "react";

const Home = () => {
    return (
        <div className="bike-repair-homepage">

            {/* Hero Section */}
            <header className="text-center py-5" style={{ backgroundColor: "#E43636", color: "#FFF" }}>
                <div className="container">
                    <h1 className="display-4"><b>Book Your Bike Repair Today!</b></h1>
                    <p className="lead">Fast, reliable, and professional bike service</p>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-5" style={{ backgroundColor: "#FFF" }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ color: "#E43636" }}>Why Choose Us?</h2>
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4 text-center">
                            <img src="/images/parts (2).png" alt="Fully Equipped Workshop" className="img-fluid rounded mb-3" />
                            <h4>Fully Equipped Workshop</h4>
                            <p>Our workshop has all the modern tools and machines for any repair job.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src="/images/parts (3).png" alt="Trained Mechanics" className="img-fluid rounded mb-3" />
                            <h4>Trained Mechanics</h4>
                            <p>Certified mechanics with years of experience ensure your bike is in safe hands.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src="/images/parts (1).png" alt="Top Quality Parts" className="img-fluid rounded mb-3" />
                            <h4>Top Quality Parts</h4>
                            <p>We use only high-quality parts to make your bike perform like new.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-5" style={{ backgroundColor: "#000", color: "#FFF" }}>
                <div className="container">
                    <h2 className="text-center mb-5" style={{ color: "#FFF" }}>Our Services</h2>
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4 text-center">
                            <div className="p-4 border rounded" style={{ backgroundColor: "#111" }}>
                                <h5>General Tune-Up</h5>
                                <p>Brake adjustments, chain lubrication, and all minor repairs.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 border rounded" style={{ backgroundColor: "#111" }}>
                                <h5>Tire & Puncture Repair</h5>
                                <p>Fast and reliable puncture repair so you can get back on the road.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 border rounded" style={{ backgroundColor: "#111" }}>
                                <h5>Brake & Gear Service</h5>
                                <p>Professional adjustments for optimal safety and performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-5 text-center" style={{ backgroundColor: "#FFF" }}>
                <div className="container">
                    <h2 className="mb-4" style={{ color: "#E43636" }}>Ready to Get Started?</h2>
                    <p className="mb-4">Book your bike service online in just a few clicks!</p>
                    <a href="#book" className="btn btn-lg" style={{ backgroundColor: "#E43636", color: "#FFF" }}>Book Now</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-4" style={{ backgroundColor: "#000", color: "#FFF" }}>
                <div className="container">
                    <p className="mb-0">&copy; 2025 Bike Repair. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
