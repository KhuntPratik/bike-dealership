import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <section id="contact" className="">
                <div className="container" data-aos="fade-up">
                    <h2 className="text-center section-title text-white mb-5">Login</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form>
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        <i className="fas fa-user me-2"></i>User Name
                                    </label>
                                    <input type="text" className="form-control" placeholder="User Name" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-white">
                                        <i className="fas fa-lock me-2"></i>Password
                                    </label>
                                    <input type="password" className="form-control" placeholder="Password" />
                                </div>
                                <div className="d-flex justify-content-center mb-3">
                                    <button type="submit" className="btn btn-custom">
                                        <i className="fas fa-sign-in-alt me-2"></i>Login
                                    </button>
                                </div>
                                <div className="text-center">
                                    <span className="text-white">Don't have an account? </span>
                                    <Link to="/register" className="text-warning fw-bold">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
export default Login;