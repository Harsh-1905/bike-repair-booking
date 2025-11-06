import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn, faUserPlus, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const UserNavBar = ({ user, handleLogout }) => {
    const navigate = useNavigate();

    // Wrap the passed handleLogout to also redirect
    const logoutAndRedirect = async () => {
        if (handleLogout) {
            await handleLogout(); // call parent logout
            navigate("/");        // redirect to homepage
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbarColor">
            <div className="container-fluid">
                <Link className="navbar-brand navlinktexts" to="/">Bike Care</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link navlinktexts text-white" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link navlinktexts text-white" aria-current="page" to="/service">Booking</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link navlinktexts text-white" to="/profile">Profile</Link>
                        </li>

                        {/* Dropdown for auth links */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle navlinktexts text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUser} />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end navbarColor px-2">

                                {!user ? (
                                    <>
                                        <div className='d-flex flex-row align-items-center'>
                                            <FontAwesomeIcon icon={faSignIn} className='IconColor' />
                                            <li>
                                                <Link className="dropdown-item navlinktexts" to="/signin">Sign In</Link>
                                            </li>
                                        </div>
                                        <div className='d-flex flex-row align-items-center'>
                                            <FontAwesomeIcon icon={faUserPlus} className='IconColor' />
                                            <li>
                                                <Link className="dropdown-item navlinktexts" to="/signup">Sign Up</Link>
                                            </li>
                                        </div>
                                    </>
                                ) : (
                                    <div className='d-flex flex-row align-items-center'>
                                        <FontAwesomeIcon icon={faSignOutAlt} className='IconColor' />
                                        <li>
                                            <button
                                                className="dropdown-item navlinktexts"
                                                style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
                                                onClick={logoutAndRedirect}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </div>
                                )}

                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default UserNavBar;
