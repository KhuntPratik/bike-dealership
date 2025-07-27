const Register = () => {
    return (
        <section id="contact" className="mt-5">
            <div className="container" data-aos="fade-up">
                <h2 className="text-center section-title text-white mb-5">Register</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form>
                            <div className="mb-4">
                                <label className="form-label text-white">
                                    <i className="fas fa-user me-2"></i>Full Name
                                </label>
                                <input type="text" className="form-control" placeholder="User Name" />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-white">
                                    <i className="fas fa-envelope me-2"></i>Email
                                </label>
                                <input type="email" className="form-control" placeholder="Email" />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-white">
                                    <i className="fas fa-phone me-2"></i>Phone Number
                                </label>
                                <input type="number" className="form-control" placeholder="Phone Number" />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-white">
                                    <i className="fas fa-calendar me-2"></i>Date of Birth
                                </label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="mb-4">


                                <label className="form-label text-white">
                                    <i className="fas fa-calendar me-2"></i>Gender
                                </label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                    <label class="form-check-label text-white" for="flexRadioDefault1">
                                        Male
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                    <label class="form-check-label text-white" for="flexRadioDefault2">
                                        Female
                                    </label>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-white">
                                    <i className="fas fa-lock me-2"></i>Password
                                </label>
                                <input type="password" className="form-control" placeholder="Password" />
                            </div>

                            <div className="d-flex justify-content-center mb-3">
                                <button type="submit" className="btn btn-custom">
                                    <i className="fas fa-user-plus me-2"></i>Register
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="text-white">Already have an account? </span>
                                <a href="/login" className="text-warning fw-bold">Login</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
