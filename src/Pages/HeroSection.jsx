import { useState, useEffect } from "react";
import "../all.css";

function HeroSection() {

    console.log("Homepage loaede");
    const url = "http://localhost:5275/api/Brand";
    const [data, setData] = useState([]);

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
        
            <section className="hero text-center">
                <div className="container" data-aos="fade-up">
                    <h1 className="fw-bold">Buy & Sell Old Bikes</h1>
                    <p className="lead">Trusted Deals • Best Price • Instant Sale</p>
                    <a href="#contact" className="btn btn-custom mt-3">
                        <i className="fas fa-phone me-2"></i>Contact Us Now
                    </a>
                </div>
            </section>

            <section id="about" className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right">
                            <h2 className="section-title">Who We Are</h2>
                            <p className="lead">At Maa Bhagwati Bikes, we're passionate about two-wheelers.</p>
                            <p>We specialize in buying and selling used bikes at fair prices. With years of experience, we offer well-maintained, inspected bikes for customers who want both value and reliability. Whether you're selling your old ride or looking for a budget-friendly one, we've got your back!</p>
                            <ul className="list-unstyled">
                                <li className="mb-3"><i className="fas fa-tools text-primary me-2"></i>Trusted bike inspection</li>
                                <li className="mb-3"><i className="fas fa-money-bill-wave text-primary me-2"></i>Instant deals for sellers</li>
                                <li className="mb-3"><i className="fas fa-smile text-primary me-2"></i>100% customer satisfaction</li>
                            </ul>
                        </div>
                        <div className="col-md-6" data-aos="fade-left">
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

            {/* Category Section */}
            <section className="container py-5">
                <div className="row g-4 justify-content-center">
                    {data?.length > 0 ? (
                        data?.map((brand, index) => (
                            <div className="col-6 col-sm-4 col-md-3" key={index}>
                                <div className="card shadow-sm border-0 text-center h-100">
                                    <img
                                        src={brand?.brandImage}
                                        className="card-img-top rounded-top"
                                        alt={brand?.BrandName}
                                        style={{ height: "150px" , objectFit: "cover" }}
                                    />
                                      <p className="card-text fw-semibold">{brand?.brandName}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No categories found.</p>
                    )}
                </div>
            </section>


            {/* Service Section */}
            <section id="services" className="py-5">
                <div className="container position-relative">
                    <h2 className="text-center section-title" data-aos="fade-up">Our Services</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                        {/* Buy Old Bikes */}
                        <div className="col" data-aos="zoom-in">
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
                        <div className="col" data-aos="zoom-in" data-aos-delay="100">
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
                        <div className="col" data-aos="zoom-in" data-aos-delay="200">
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
                        <div className="col" data-aos="zoom-in" data-aos-delay="300">
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


            <section id="contact" className="py-5">
                <div className="container" data-aos="fade-up">
                    <h2 className="text-center section-title text-white mb-5">Contact Us</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form>
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        <i className="fas fa-user me-2 text-white"></i>Name
                                    </label>
                                    <input type="text" className="form-control text-white" placeholder="Your Name" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        <i className="fas fa-phone me-2 text-white"></i>Phone
                                    </label>
                                    <input type="tel" className="form-control text-white" placeholder="Your Phone Number" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        <i className="fas fa-envelope me-2 text-white"></i>Message
                                    </label>
                                    <textarea className="form-control text-white" rows="4" placeholder="How can we help?"></textarea>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-custom">
                                        <i className="fas fa-paper-plane me-2"></i>Send Message
                                    </button>
                                </div>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HeroSection;
