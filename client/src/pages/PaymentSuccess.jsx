import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            fetchSessionData(sessionId);
        } else {
            setLoading(false);
            setError('No session ID found');
        }
    }, [searchParams]);

    const fetchSessionData = async (sessionId) => {
        try {
            const response = await fetch(`http://localhost:5000/payment/session/${sessionId}`);
            if (!response.ok) throw new Error('Failed to fetch session');
            const data = await response.json();
            setSessionData(data);
        } catch (err) {
            setError('Unable to retrieve order details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-page">
            <Navbar />

            <main className="payment-main">
                <div className="container">
                    <div className="payment-card glass-card-static">
                        {loading ? (
                            <div className="payment-loading">
                                <div className="spinner"></div>
                                <p>Loading order details...</p>
                            </div>
                        ) : error ? (
                            <div className="payment-error">
                                <span className="payment-icon error">⚠️</span>
                                <h1>Something went wrong</h1>
                                <p>{error}</p>
                                <Link to="/buy" className="btn btn-primary">
                                    Return to Shop
                                </Link>
                            </div>
                        ) : (
                            <div className="payment-success">
                                <span className="payment-icon success">✓</span>
                                <h1>Payment Successful!</h1>
                                <p className="payment-subtitle">
                                    Thank you for your order. Your LUNO Edge Pro is on its way!
                                </p>

                                <div className="order-details">
                                    <div className="order-row">
                                        <span className="order-label">Product</span>
                                        <span className="order-value">{sessionData?.productName}</span>
                                    </div>
                                    <div className="order-row">
                                        <span className="order-label">Amount</span>
                                        <span className="order-value">
                                            ${(sessionData?.amountTotal / 100).toFixed(2)} {sessionData?.currency?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="order-row">
                                        <span className="order-label">Email</span>
                                        <span className="order-value">{sessionData?.customerEmail}</span>
                                    </div>
                                    <div className="order-row">
                                        <span className="order-label">Status</span>
                                        <span className="order-value status-badge">
                                            {sessionData?.status === 'paid' ? '✓ Paid' : sessionData?.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="next-steps">
                                    <h3>What's Next?</h3>
                                    <ul>
                                        <li>📧 Confirmation email sent to your inbox</li>
                                        <li>📦 Order ships within 2-3 business days</li>
                                        <li>🔗 Track your shipment via the link in your email</li>
                                    </ul>
                                </div>

                                <div className="payment-actions">
                                    <Link to="/home" className="btn btn-primary">
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/device" className="btn btn-secondary">
                                        Setup Device
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default PaymentSuccess;
