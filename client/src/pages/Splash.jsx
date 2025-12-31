import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

function Splash() {
    const navigate = useNavigate();
    const [showSubtitle, setShowSubtitle] = useState(false);

    useEffect(() => {
        // Show subtitle after 3 seconds
        const subtitleTimer = setTimeout(() => {
            setShowSubtitle(true);
        }, 3000);

        // Auto-navigate after 7 seconds
        const navTimer = setTimeout(() => {
            const hasToken = localStorage.getItem('accessToken');
            navigate(hasToken ? '/home' : '/login');
        }, 7000);

        return () => {
            clearTimeout(subtitleTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className="splash">
            <div className="splash-content">
                <div className="splash-logo-container">
                    <img
                        src="/logo.png"
                        alt="LUNO Logo"
                        className="splash-logo-image"
                    />
                </div>
                <h1 className="splash-logo">LUNO</h1>
                <p className={`splash-subtitle ${showSubtitle ? 'visible' : ''}`}>
                    Edge-AI Voice Intelligence
                </p>
            </div>
        </div>
    );
}

export default Splash;
