import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section footer-brand">
                        <Link to="/" className="footer-logo">LUNO</Link>
                        <p className="footer-tagline">
                            Edge-AI Voice Capture
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Product</h4>
                        <ul className="footer-links">
                            <li><Link to="/modes">Modes</Link></li>
                            <li><Link to="/device">Device</Link></li>
                            <li><Link to="/buy">Shop</Link></li>
                            <li><Link to="/sessions">Sessions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Press</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">GDPR</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Contact</h4>
                        <ul className="footer-links">
                            <li><a href="mailto:hello@luno.app">hello@luno.app</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} LUNO. All rights reserved.
                    </p>
                    <p className="footer-note">
                        Built with privacy in mind.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
