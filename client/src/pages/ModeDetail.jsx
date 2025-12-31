import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ModeDetail.css';

// Mode icon components
const ModeIcon = ({ mode, color }) => {
    const icons = {
        sync: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
                <line x1="12" y1="4" x2="12" y2="1" />
                <line x1="12" y1="23" x2="12" y2="20" />
                <line x1="4" y1="12" x2="1" y2="12" />
                <line x1="23" y1="12" x2="20" y2="12" />
            </svg>
        ),
        scholar: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="8" y1="9" x2="16" y2="9" />
                <line x1="8" y1="13" x2="14" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
            </svg>
        ),
        probe: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <line x1="16" y1="16" x2="22" y2="22" />
                <circle cx="11" cy="11" r="3" strokeDasharray="2 2" />
            </svg>
        ),
        reflect: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3 C12 3 8 8 8 12 C8 16 12 21 12 21 C12 21 16 16 16 12 C16 8 12 3 12 3" />
            </svg>
        ),
        care: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <path d="M12 21 C12 21 4 14 4 9 C4 5 7 3 10 3 C11.5 3 12 4 12 4 C12 4 12.5 3 14 3 C17 3 20 5 20 9 C20 14 12 21 12 21" />
            </svg>
        ),
        verdict: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="21" />
                <circle cx="7.5" cy="7.5" r="1.5" fill={color} />
                <circle cx="16.5" cy="16.5" r="1.5" fill={color} />
            </svg>
        ),
        spark: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
            </svg>
        )
    };
    return <div className="mode-detail-icon">{icons[mode] || icons.sync}</div>;
};

// Waveform visualization component
const WaveformVisualizer = ({ color }) => {
    const bars = Array.from({ length: 40 }, (_, i) => ({
        height: 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10
    }));

    return (
        <div className="waveform-container">
            <div className="waveform">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className="waveform-bar"
                        style={{
                            height: `${bar.height}%`,
                            backgroundColor: color,
                            animationDelay: `${i * 0.02}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

function ModeDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modeData, setModeData] = useState(null);
    const [expandedSession, setExpandedSession] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadModeData();
    }, [slug]);

    useEffect(() => {
        if (modeData) {
            setTimeout(() => setLoaded(true), 50);
        }
    }, [modeData]);

    const loadModeData = async () => {
        try {
            setLoading(true);
            const data = await api.getModeWithSessions(slug);
            setModeData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remainMins = mins % 60;
            return `${hours}h ${remainMins}m`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const toggleSession = (sessionId) => {
        setExpandedSession(expandedSession === sessionId ? null : sessionId);
    };

    if (loading) {
        return (
            <div className="mode-detail-page">
                <Navbar />
                <main className="mode-detail-main">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading mode...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !modeData) {
        return (
            <div className="mode-detail-page">
                <Navbar />
                <main className="mode-detail-main">
                    <div className="error-container">
                        <h2>Mode not found</h2>
                        <p>{error || 'The requested mode does not exist.'}</p>
                        <button className="btn btn-primary" onClick={() => navigate('/modes')}>
                            Back to Modes
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { mode, sessions } = modeData;
    const modeColor = mode.color || '#6366f1';

    return (
        <div className="mode-detail-page" style={{ '--mode-color': modeColor }}>
            <Navbar />

            <main className="mode-detail-main">
                {/* Hero Section */}
                <section className={`mode-hero ${loaded ? 'loaded' : ''}`}>
                    <div className="mode-hero-bg">
                        <div className="mode-hero-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${modeColor}30 0%, transparent 70%)` }}></div>
                        <div className="mode-hero-grid"></div>
                    </div>

                    <div className="container">
                        <button className="back-button" onClick={() => navigate('/modes')}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Modes
                        </button>

                        <div className="mode-hero-content">
                            <ModeIcon mode={slug} color={modeColor} />
                            <div className="mode-hero-text">
                                <h1 className="mode-hero-title">{mode.name}</h1>
                                <p className="mode-hero-description">{mode.description}</p>
                            </div>
                            <div className="mode-hero-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{sessions.length}</span>
                                    <span className="stat-label">Sessions</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">
                                        {formatDuration(sessions.reduce((acc, s) => acc + s.duration, 0))}
                                    </span>
                                    <span className="stat-label">Total Time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sessions Section */}
                <section className={`mode-sessions ${loaded ? 'loaded' : ''}`}>
                    <div className="container">
                        <div className="sessions-header">
                            <h2>Sessions</h2>
                            <Link to="/sessions" className="btn btn-primary btn-sm">
                                + New Session
                            </Link>
                        </div>

                        {sessions.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <ModeIcon mode={slug} color={modeColor} />
                                </div>
                                <h3>No sessions yet</h3>
                                <p>Start your first {mode.name} session to capture voice notes and transcripts.</p>
                                <Link to="/sessions" className="btn btn-primary">
                                    Create Session
                                </Link>
                            </div>
                        ) : (
                            <div className="sessions-grid">
                                {sessions.map((session, index) => (
                                    <div
                                        key={session.id}
                                        className={`session-card ${expandedSession === session.id ? 'expanded' : ''}`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="session-card-header" onClick={() => toggleSession(session.id)}>
                                            <div className="session-info">
                                                <h3 className="session-title">{session.title}</h3>
                                                <div className="session-meta">
                                                    <span className="session-duration">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                                                            <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                        </svg>
                                                        {formatDuration(session.duration)}
                                                    </span>
                                                    <span className="session-date">{formatDate(session.createdAt)}</span>
                                                </div>
                                            </div>
                                            <button className="expand-button">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>

                                        {expandedSession === session.id && (
                                            <div className="session-card-content">
                                                {/* Waveform visualization */}
                                                <WaveformVisualizer color={modeColor} />

                                                {/* Transcript */}
                                                {session.transcript && (
                                                    <div className="content-section">
                                                        <h4>
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <path d="M3 4H13M3 8H10M3 12H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                            </svg>
                                                            Transcript
                                                        </h4>
                                                        <p className="transcript-text">{session.transcript}</p>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {session.notes && (
                                                    <div className="content-section">
                                                        <h4>
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                                                                <path d="M5 6H11M5 10H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                            </svg>
                                                            Notes
                                                        </h4>
                                                        <p className="notes-text">{session.notes}</p>
                                                    </div>
                                                )}

                                                {!session.transcript && !session.notes && (
                                                    <div className="no-content">
                                                        <p>No transcript or notes for this session.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ModeDetail;
