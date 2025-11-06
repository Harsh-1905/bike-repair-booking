import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import '../index.css'
const Navbar = () => {
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
                            <Link className="nav-link navlinktexts text-white" to="/aboutus">AboutUs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link navlinktexts text-white" to="/contactus">Contact US</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle navlinktexts text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                                <FontAwesomeIcon icon={faUser} />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end px-2">
                                <div className='d-flex flex-row align-items-center'>
                                    <FontAwesomeIcon icon={faSignIn} className='IconColor' />
                                    <li><Link className="dropdown-item navlinktexts" to="/signin">Sign IN</Link></li>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <FontAwesomeIcon icon={faUserPlus} className='IconColor' />
                                    <li><Link className="dropdown-item navlinktexts" to="/signup">Sign UP</Link></li>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div >
        </nav >

    )
}
export default Navbar;