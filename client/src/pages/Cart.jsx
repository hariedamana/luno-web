import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Cart.css';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/payment/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems,
                    customerEmail: '',
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-page">
            <Navbar />

            <main className="cart-main">
                <div className="container">
                    <div className="cart-header">
                        <h1 className="cart-title">Your Cart</h1>
                        <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added any items yet.</p>
                            <Link to="/buy" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-content">
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item glass-card">
                                        <div className="cart-item-image">
                                            <div className="cart-item-placeholder">
                                                {item.icon || '📦'}
                                            </div>
                                        </div>
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-description">{item.description}</p>
                                        </div>
                                        <div className="cart-item-quantity">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="cart-item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary glass-card">
                                <h2 className="summary-title">Order Summary</h2>

                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free-shipping">FREE</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax</span>
                                    <span>Calculated at checkout</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row summary-total">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    {loading ? 'Processing...' : 'Buy Now'}
                                </button>

                                <button
                                    className="btn btn-ghost clear-cart-btn"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>

                                <div className="summary-features">
                                    <div className="summary-feature">
                                        <span className="feature-icon">🔒</span>
                                        <span>Secure Checkout</span>
                                    </div>
                                    <div className="summary-feature">
                                        <span className="feature-icon">🚚</span>
                                        <span>Free Worldwide Shipping</span>
                                    </div>
                                    <div className="summary-feature">
                                        <span className="feature-icon">↩️</span>
                                        <span>30-Day Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Cart;
