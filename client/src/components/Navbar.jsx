import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const navLinks = isAuthenticated
        ? [
            { to: '/home', label: 'Home' },
            { to: '/modes', label: 'Modes' },
            { to: '/sessions', label: 'Sessions' },
            { to: '/device', label: 'Device' },
            { to: '/buy', label: 'Shop' }
        ]
        : [
            { to: '/home', label: 'Home' },
            { to: '/modes', label: 'Modes' },
            { to: '/buy', label: 'Shop' }
        ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/home" className="navbar-logo">
                    LUNO
                </Link>

                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`navbar-link ${isActive(link.to) ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <button className="btn btn-ghost btn-sm" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
