import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../all.css";

function HeroSection() {

    console.log("Homepage loaede");
    const navigate = useNavigate();
    const url = "http://localhost:5275/api/Brand";
    const [data, setData] = useState([]);
    const [contactForm, setContactForm] = useState({
        name: "",
        number: "",
        subject: "",
        email: "",
        message: "",
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [status, setStatus] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactForm({ ...contactForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📤 Sending data to Google Sheets:", contactForm);

        try {
            await fetch(
                "https://script.google.com/macros/s/AKfycbwC28OzGsJLP_28ZZPRhxHIgYRfYi3mIhy9v-NcvMYzSzAkIRQdzIfzGrwKy4zc4oyW/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contactForm),
                }
            );

            console.log("✅ Data sent successfully to Google Sheets!");
            setStatus("✅ Message sent successfully!");
            setFormSubmitted(true);

            // Reset form
            setContactForm({
                name: "",
                number: "",
                subject: "",
                email: "",
                message: "",
            });

            // Hide message after 3 seconds
            setTimeout(() => setFormSubmitted(false), 3000);
        } catch (error) {
            console.error("❌ Error sending data:", error);
            setStatus("❌ Failed to send message. Try again!");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url);
                const json = await res.json();
                console.log("Fetched Data:", json); // ✅ check console
                setData(json);
            } catch (error) {
                console.error("Error fetching brand data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>

            <section className="hero-section-new text-center mt-5">
                <div className="hero-bg-pattern"></div>
                <div className="container position-relative">
                    <div className="row align-items-center min-vh-100">
                        <div className="col-lg-6">
                            <div className="hero-content-left">
                                <div className="hero-badge mb-4">
                                    <span className="badge bg-warning text-dark">
                                        <i className="fas fa-star me-2"></i>Premium Bike Dealer
                                    </span>
                                </div>
                                <h1 className="hero-title-new fw-bold mb-4">
                                    Your Journey to the Perfect
                                    <span className="text-gradient"> Bike Starts Here</span>
                                </h1>
                                <p className="hero-subtitle-new lead mb-4">
                                    Discover quality used bikes at unbeatable prices.
                                    We make buying and selling bikes simple, secure, and satisfying.
                                </p>
                                <div className="hero-stats mb-5">
                                    <div className="row g-4">
                                        <div className="col-4">
                                            <div className="stat-item">
                                                <h3 className="stat-number">500+</h3>
                                                <p className="stat-label">Bikes Sold</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="stat-item">
                                                <h3 className="stat-number">98%</h3>
                                                <p className="stat-label">Satisfaction</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="stat-item">
                                                <h3 className="stat-number">24/7</h3>
                                                <p className="stat-label">Support</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-buttons-new">
                                    <a href="/product" className="btn btn-gradient btn-lg me-3 mb-3">
                                        <i className="fas fa-motorcycle me-2"></i>Explore Bikes
                                    </a>
                                    <a href="#contact" className="btn btn-outline-custom btn-lg mb-3">
                                        <i className="fas fa-phone me-2"></i>Get Quote
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-image-container">
                                <div className="hero-image">
                                    <img
                                        src="https://imgs.search.brave.com/4Oa2_2MMxmnlfoDIfiyO0JV8CJleSh4Xsy6HQZI-TmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/MTE4NzI2Mi9waG90/by9wb3J0cmFpdC1v/Zi1jdXN0b21lci1j/aG9vc2luZy1uZXct/bW90b3JiaWtlLWlu/LXdvcmtzaG9wLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1L/bjFYdC1jTFFFdkk5/ZFFSZHl3cEUtaXZP/Z1E1WndfVXhUTlha/NWlsVUxRPQ"
                                        alt="Motorcycle Workshop"
                                        className="img-fluid rounded-4 shadow-lg"
                                    />
                                </div>
                                <div className="floating-card card-1">
                                    <i className="fas fa-check-circle text-success"></i>
                                    <span>Quality Assured</span>
                                </div>
                                <div className="floating-card card-2">
                                    <i className="fas fa-dollar-sign text-warning"></i>
                                    <span>Best Price</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <h2 className="section-title">Who We Are</h2>
                            <p className="lead">At Maa Bhagwati Bikes, we're passionate about two-wheelers.</p>
                            <p>We specialize in buying and selling used bikes at fair prices. With years of experience, we offer well-maintained, inspected bikes for customers who want both value and reliability. Whether you're selling your old ride or looking for a budget-friendly one, we've got your back!</p>
                            <ul className="list-unstyled">
                                <li className="mb-3"><i className="fas fa-tools text-primary me-2"></i>Trusted bike inspection</li>
                                <li className="mb-3"><i className="fas fa-money-bill-wave text-primary me-2"></i>Instant deals for sellers</li>
                                <li className="mb-3"><i className="fas fa-smile text-primary me-2"></i>100% customer satisfaction</li>
                            </ul>
                        </div>

                        <div className="col-md-6">
                            <img
                                src="https://imgs.search.brave.com/4Oa2_2MMxmnlfoDIfiyO0JV8CJleSh4Xsy6HQZI-TmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/MTE4NzI2Mi9waG90/by9wb3J0cmFpdC1v/Zi1jdXN0b21lci1j/aG9vc2luZy1uZXct/bW90b3JiaWtlLWlu/LXdvcmtzaG9wLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1L/bjFYdC1jTFFFdkk5/ZFFSZHl3cEUtaXZP/Z1E1WndfVXhUTlha/NWlsVUxRPQ"
                                alt="About Maa Bhagwati Bikes"
                                className="img-fluid rounded shadow-lg"
                                style={{ width: "100%", maxWidth: "500px", height: "auto" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title fw-bold">Popular Bike Brands</h2>
                        <p className="lead text-muted">Choose from top brands for quality and reliability</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {data?.length > 0 ? (
                            data?.map((brand, index) => (
                                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                                    <div
                                        className="brand-card text-center p-3 h-100"
                                        onClick={() => navigate(`/product?brandId=${brand.brandId}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="brand-image-container mb-3">
                                            <img

                                                src={`http://localhost:5275/${brand.brandImage}`}
                                                className="brand-image"
                                                alt={brand?.brandName}
                                            />
                                        </div>
                                        <h6 className="brand-name fw-semibold mb-0">{brand?.brandName}</h6>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="text-center py-5">
                                    <i className="fas fa-bicycle fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No brands available at the moment.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* Service Section */}
            <section id="services" className="py-5">
                <div className="container position-relative">
                    <h2 className="text-center section-title">Our Services</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                        {/* Buy Old Bikes */}
                        <div className="col">
                            <div className="service-card h-100">
                                <img src="https://imgs.search.brave.com/4Oa2_2MMxmnlfoDIfiyO0JV8CJleSh4Xsy6HQZI-TmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/MTE4NzI2Mi9waG90/by9wb3J0cmFpdC1v/Zi1jdXN0b21lci1j/aG9vc2luZy1uZXct/bW90b3JiaWtlLWlu/LXdvcmtzaG9wLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1L/bjFYdC1jTFFFdkk5/ZFFSZHl3cEUtaXZP/Z1E1WndfVXhUTlha/NWlsVUxRPQ"
                                    className="card-img-top" alt="Buy Bikes" />
                                <div className="card-img-overlay"></div>
                                <div className="service-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Buy Old Bikes</h5>
                                    <p className="card-text">Find your perfect ride from our collection of well-maintained used bikes at unbeatable prices.</p>
                                    <a href="#" className="btn-service">Learn More</a>
                                </div>
                            </div>
                        </div>

                        {/* Sell Your Bike */}
                        <div className="col">
                            <div className="service-card h-100">
                                <img src="https://imgs.search.brave.com/bkB6FlzMVv9A2yMMkOauxOD67UfAmn-Ij2GD0N5bFKk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC94Z3I3eWh2/cW4yMG4vMlg1bHVQ/cVNhTDhuV2xQdHp0/TVlxUS9iYzRjZWE1/NjM2N2Q1MmRlNjVl/NDNiYjMzOGViZDNm/Ny9EQUNFLWhlcm8t/cmMtaG93LXRvLXNl/bGwtbW90b3JjeWNs/ZS1sYXJnZS5qcGc_/Zm09cG5n"
                                    className="card-img-top" alt="Sell Bikes" />
                                <div className="card-img-overlay"></div>
                                <div className="service-icon">
                                    <i className="fas fa-money-bill-wave"></i>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Sell Your Bike</h5>
                                    <p className="card-text">Get the best value for your bike with our instant valuation and quick payment process.</p>
                                    <a href="#" className="btn-service">Learn More</a>
                                </div>
                            </div>
                        </div>

                        {/* Bike Exchange */}
                        <div className="col">
                            <div className="service-card h-100">
                                <img src="https://imgs.search.brave.com/HaAW7mj2LcbGSAzEfcCeD3n7HhpKN3vBnZ9b-iENzvM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9leHRl/cm5hbC1wcmV2aWV3/LnJlZGQuaXQvTVpT/dS1qRnNlMjQyR2Iz/eGptTWpSdkFUZVJa/NlRtZWhHN2RVMElV/SXk5VS5qcGc_d2lk/dGg9NjQwJmNyb3A9/c21hcnQmYXV0bz13/ZWJwJnM9ODc4MDY5/M2ZhMzkyOGM5ZGJi/OTk0MGI1NThiODZh/YWIyOTQ2MDk1NQ"
                                    className="card-img-top" alt="Exchange" />
                                <div className="card-img-overlay"></div>
                                <div className="service-icon">
                                    <i className="fas fa-exchange-alt"></i>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Bike Exchange</h5>
                                    <p className="card-text">Upgrade your ride with our hassle-free bike exchange program and get the best deals.</p>
                                    <a href="#" className="btn-service">Learn More</a>
                                </div>
                            </div>
                        </div>

                        {/* Bike Finance */}
                        <div className="col">
                            <div className="service-card h-100">
                                <img src="https://imgs.search.brave.com/tHudOH3ZsWRo_iefLuYkvIqkxLV8N50A9qTP2wW5nfQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTAv/MzQzLzA1OC9zbWFs/bC90aGUtZmluYW5j/ZS13b3JkLW9uLXdv/b2QtY3ViZS1idXNp/bmVzcy1jb250ZW50/LWltYWdlLXBob3Rv/LmpwZw"
                                    className="card-img-top" alt="Finance" />
                                <div className="card-img-overlay"></div>
                                <div className="service-icon">
                                    <i className="fas fa-hand-holding-usd"></i>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Bike Finance</h5>
                                    <p className="card-text">Easy financing options with competitive interest rates and flexible payment terms.</p>
                                    <a href="#" className="btn-service">Learn More</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <section id="contact" className="contact-section py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="contact-header text-center mb-5">
                                <h2 className="contact-title">Get In Touch</h2>
                                <p className="contact-subtitle">Ready to find your perfect bike? Contact us today!</p>
                            </div>

                            <div className="row g-5">
                                {/* Contact Information */}
                                <div className="col-lg-4">
                                    <div className="contact-info">
                                        <h4 className="info-title mb-4">Contact Information</h4>

                                        <div className="info-item mb-4">
                                            <div className="info-icon">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div className="info-content">
                                                <h6>Address</h6>
                                                <p>123 Bike Street, Motorcycle City<br />MC 12345, India</p>
                                            </div>
                                        </div>

                                        <div className="info-item mb-4">
                                            <div className="info-icon">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                            <div className="info-content">
                                                <h6>Phone</h6>
                                                <p>+91 98765 43210<br />+91 98765 43211</p>
                                            </div>
                                        </div>

                                        <div className="info-item mb-4">
                                            <div className="info-icon">
                                                <i className="fas fa-envelope"></i>
                                            </div>
                                            <div className="info-content">
                                                <h6>Email</h6>
                                                <p>info@maabhagwatibikes.com</p>
                                            </div>
                                        </div>

                                        <div className="info-item">
                                            <div className="info-icon">
                                                <i className="fas fa-clock"></i>
                                            </div>
                                            <div className="info-content">
                                                <h6>Business Hours</h6>
                                                <p>Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="col-lg-8">
                                    <div className="contact-form-container">
                                        <h4 className="form-title mb-4">Send us a Message</h4>
                                        <form className="contact-form" onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <i className="fas fa-user"></i> Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={contactForm.name}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            placeholder="Enter your full name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <i className="fas fa-phone"></i> Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            name="number"
                                                            value={contactForm.number}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            placeholder="Enter your phone number"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <i className="fas fa-envelope"></i> Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={contactForm.email}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            placeholder="Enter your email address"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <i className="fas fa-tag"></i> Subject
                                                        </label>
                                                        <select
                                                            name="subject"
                                                            value={contactForm.subject}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                        >
                                                            <option value="">Select a subject</option>
                                                            <option>Buy a Bike</option>
                                                            <option>Sell a Bike</option>
                                                            <option>Bike Exchange</option>
                                                            <option>Bike Finance</option>
                                                            <option>General Inquiry</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            <i className="fas fa-comment"></i> Message
                                                        </label>
                                                        <textarea
                                                            name="message"
                                                            value={contactForm.message}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            rows="5"
                                                            placeholder="Tell us how we can help you..."
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-contact">
                                                        <i className="fas fa-paper-plane me-2"></i>Send Message
                                                    </button>
                                                </div>

                                                {formSubmitted && (
                                                    <p className="mt-3 text-success fw-bold">{status}</p>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HeroSection;
