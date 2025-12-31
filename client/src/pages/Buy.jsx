import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Buy.css';

function Buy() {
    const navigate = useNavigate();
    const { addToCart, cartCount } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    // Product definition
    const product = {
        id: 'luno-edge-pro',
        name: 'LUNO Edge Pro',
        description: 'Complete voice capture solution with edge AI processing, military-grade encryption, and seamless sync capabilities.',
        price: 60,
        icon: '🎙️'
    };

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/cart');
    };

    const reviews = [
        {
            id: 1,
            name: 'Dr. Sarah Chen',
            role: 'Medical Director',
            text: 'LUNO has transformed how we document patient consultations. The edge processing means complete HIPAA compliance with zero cloud risk.',
            rating: 5
        },
        {
            id: 2,
            name: 'Prof. James Miller',
            role: 'University Lecturer',
            text: 'My students love having searchable transcripts of every lecture. The Scholar mode captures everything, even in noisy auditoriums.',
            rating: 5
        },
        {
            id: 3,
            name: 'Lisa Rodriguez',
            role: 'Journalist',
            text: 'For sensitive interviews, LUNO is indispensable. Knowing my sources\' voices never touch the cloud gives everyone peace of mind.',
            rating: 5
        }
    ];

    const features = [
        { icon: '🎤', title: '6-Mic Array', description: '360° voice capture' },
        { icon: '🧠', title: 'Edge AI', description: 'On-device processing' },
        { icon: '🔒', title: 'Encrypted', description: 'AES-256 storage' },
        { icon: '🔋', title: '12hr Battery', description: 'All-day recording' },
        { icon: '📡', title: 'Wireless Sync', description: 'BLE 5.0 & WiFi 6' },
        { icon: '💨', title: 'Instant', description: 'Real-time transcription' }
    ];

    const components = [
        { name: 'LUNO Edge Device', description: 'Main capture unit' },
        { name: 'Charging Dock', description: 'USB-C fast charging' },
        { name: 'Carry Case', description: 'Premium protective case' },
        { name: 'Quick Start Guide', description: 'Getting started' },
        { name: 'USB-C Cable', description: 'Braided 1m cable' },
        { name: 'LUNO Pro License', description: '1 year included' }
    ];

    // Hardware specs for flip cards
    const hardwareSpecs = [
        {
            icon: '🎤',
            title: '2-Mic Array',
            subtitle: 'ReSpeaker HAT',
            description: 'ReSpeaker 2-Mic Pi HAT with far-field voice capture, beamforming technology, and onboard LED ring for visual feedback.'
        },
        {
            icon: '💾',
            title: '64GB Storage',
            subtitle: 'Encrypted Storage',
            description: 'Military-grade AES-256 encrypted local storage. Stores up to 500+ hours of compressed audio recordings securely on-device.'
        },
        {
            icon: '🧠',
            title: 'Edge Processor',
            subtitle: 'Neural Engine',
            description: 'Custom 4 TOPS neural processing unit for real-time transcription, speaker diarization, and keyword extraction—all on-device.'
        },
        {
            icon: '🔋',
            title: '18hr Battery',
            subtitle: 'All-Day Power',
            description: 'Li-Po 2000mAh battery with smart power management. Quick charge: 80% in 30 minutes via USB-C PD fast charging.'
        }
    ];

    return (
        <div className="buy-page">
            <Navbar />

            <main className="buy-main">
                {/* Hero Section */}
                <section className="buy-hero">
                    <div className="container">
                        <div className="buy-hero-content">
                            <h1 className="buy-hero-title">
                                <span className="engraved-text">LUNO</span>
                            </h1>
                            <p className="buy-hero-tagline">Edge-AI Voice Capture Device</p>
                            <p className="buy-hero-description">
                                The most advanced privacy-first voice capture hardware.
                                Enterprise-grade AI that never leaves your device.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Banner */}
                <section className="buy-features">
                    <div className="container">
                        <div className="features-banner">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-chip">
                                    <span className="feature-chip-icon">{feature.icon}</span>
                                    <div className="feature-chip-content">
                                        <span className="feature-chip-title">{feature.title}</span>
                                        <span className="feature-chip-desc">{feature.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Hardware Overview - Flip Cards */}
                <section className="buy-hardware">
                    <div className="container">
                        <h2 className="section-title text-center">Hardware Overview</h2>
                        <p className="section-description text-center">
                            Engineering excellence in every component
                        </p>
                        <div className="hardware-grid">
                            {hardwareSpecs.map((spec, index) => (
                                <div key={index} className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <span className="flip-card-icon">{spec.icon}</span>
                                            <h3 className="flip-card-title">{spec.title}</h3>
                                            <span className="flip-card-subtitle">{spec.subtitle}</span>
                                        </div>
                                        <div className="flip-card-back">
                                            <p className="flip-card-description">{spec.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Card - Asymmetric Design */}
                <section className="buy-product">
                    <div className="container">
                        <div className="product-showcase">
                            {/* Cart Icon Button - Top Right */}
                            <Link to="/cart" className="cart-icon-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                <span>CART ({cartCount})</span>
                            </Link>

                            {/* Left side - Product Image on light gradient */}
                            <div className="product-image-area">
                                {/* Curved edge overlay */}
                                <div className="curved-edge"></div>

                                <div className="product-device">
                                    <svg viewBox="0 0 200 200" className="device-svg" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#1a1a1a" />
                                                <stop offset="100%" stopColor="#0a0a0a" />
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <rect x="50" y="30" width="100" height="140" rx="20" fill="url(#deviceGradient)" stroke="#5DD62C" strokeWidth="2" />
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <circle key={i} cx={70 + (i % 3) * 30} cy={60 + Math.floor(i / 3) * 30} r="4" fill="#337418" className="mic-dot" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                        <circle cx="100" cy="130" r="8" fill="#5DD62C" filter="url(#glow)" className="led-pulse" />
                                        <circle cx="100" cy="100" r="60" fill="none" stroke="#5DD62C" strokeWidth="1" opacity="0.2" className="sound-wave" style={{ animationDelay: '0s' }} />
                                        <circle cx="100" cy="100" r="75" fill="none" stroke="#5DD62C" strokeWidth="1" opacity="0.15" className="sound-wave" style={{ animationDelay: '0.3s' }} />
                                        <circle cx="100" cy="100" r="90" fill="none" stroke="#5DD62C" strokeWidth="1" opacity="0.1" className="sound-wave" style={{ animationDelay: '0.6s' }} />
                                    </svg>
                                </div>

                                {/* Product description at bottom */}
                                <p className="product-tagline">
                                    Edge-AI voice capture device. Designed with privacy-first architecture
                                    for secure, on-device processing and military-grade encryption.
                                </p>
                            </div>

                            {/* Right side - Curved Black Panel */}
                            <div className="product-info-panel">
                                <div className="panel-content">
                                    <h2 className="product-title">LUNO<br />EDGE PRO</h2>

                                    <div className="price-block">
                                        <span className="price-value">${product.price}.00</span>
                                        <span className="price-label">USD</span>
                                    </div>
                                    <span className="price-subtitle">FINAL SALE</span>

                                    {/* Details section */}
                                    <div className="product-specs">
                                        <h4>DETAILS</h4>
                                        <ul>
                                            <li>ReSpeaker 2-Mic Pi HAT</li>
                                            <li>64GB encrypted local storage</li>
                                            <li>Edge AI neural processor</li>
                                            <li>18+ hours continuous recording</li>
                                        </ul>
                                    </div>

                                    {/* Circular Add to Cart Button */}
                                    <div className="cart-button-container">
                                        <button
                                            className={`circular-cart-btn ${addedToCart ? 'added' : ''}`}
                                            onClick={handleAddToCart}
                                        >
                                            <span className="cart-plus">{addedToCart ? '✓' : '+'}</span>
                                            <svg className="rotating-text" viewBox="0 0 100 100">
                                                <defs>
                                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                                </defs>
                                                <text>
                                                    <textPath href="#circlePath">
                                                        • ADD TO CART • ADD TO CART • ADD TO CART
                                                    </textPath>
                                                </text>
                                            </svg>
                                        </button>

                                        {cartCount > 0 && (
                                            <Link to="/cart" className="cart-count-badge">
                                                {cartCount}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included */}
                <section className="buy-components">
                    <div className="container">
                        <h2 className="section-title text-center">What's Included</h2>
                        <div className="components-grid">
                            {components.map((component, index) => (
                                <div key={index} className="component-item glass-card">
                                    <span className="component-check">✓</span>
                                    <div className="component-info">
                                        <span className="component-name">{component.name}</span>
                                        <span className="component-desc">{component.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reviews */}
                <section className="buy-reviews">
                    <div className="container">
                        <h2 className="section-title text-center">What Users Say</h2>
                        <div className="reviews-grid">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-card glass-card">
                                    <div className="review-stars">
                                        {'★'.repeat(review.rating)}
                                    </div>
                                    <p className="review-text">"{review.text}"</p>
                                    <div className="review-author">
                                        <span className="review-name">{review.name}</span>
                                        <span className="review-role">{review.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Buy;
