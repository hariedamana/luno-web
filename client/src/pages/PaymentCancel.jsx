import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

function PaymentCancel() {
    return (
        <div className="payment-page">
            <Navbar />

            <main className="payment-main">
                <div className="container">
                    <div className="payment-card glass-card-static">
                        <div className="payment-cancelled">
                            <span className="payment-icon cancel">✕</span>
                            <h1>Order Cancelled</h1>
                            <p>
                                Your payment was cancelled. Don't worry — no charges were made to your account.
                            </p>

                            <div className="cancel-info">
                                <ul>
                                    <li>💳 No payment was processed</li>
                                    <li>🛒 Your cart is still available</li>
                                    <li>❓ Questions? Contact our support team</li>
                                </ul>
                            </div>

                            <div className="payment-actions">
                                <Link to="/buy" className="btn btn-primary">
                                    Return to Shop
                                </Link>
                                <Link to="/home" className="btn btn-secondary">
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default PaymentCancel;
