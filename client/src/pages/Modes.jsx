import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Modes.css';

const modes = [
    {
        id: 'sync',
        name: 'LUNO Sync',
        description: 'Shared understanding, alignment, action points',
        context: 'Meetings & team discussions',
        tone: 'Neutral, structured',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)'
    },
    {
        id: 'scholar',
        name: 'LUNO Scholar',
        description: 'Concepts, definitions, structured notes',
        context: 'Lectures, classes, learning sessions',
        tone: 'Educational, hierarchical',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)'
    },
    {
        id: 'probe',
        name: 'LUNO Probe',
        description: 'Intent, hidden signals, depth',
        context: 'Interviews, research, questioning',
        tone: 'Analytical, investigative',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
    },
    {
        id: 'reflect',
        name: 'LUNO Reflect',
        description: 'Meaning, emotions, patterns',
        context: 'Personal thinking, journaling',
        tone: 'Calm, introspective',
        color: '#14b8a6',
        gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)'
    },
    {
        id: 'care',
        name: 'LUNO Care',
        description: 'Empathy, safety, clarity',
        context: 'Therapy, support, sensitive conversations',
        tone: 'Gentle, supportive',
        color: '#f43f5e',
        gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)'
    },
    {
        id: 'verdict',
        name: 'LUNO Verdict',
        description: 'Trade-offs, conclusions, summaries',
        context: 'Decision-making, reviews, evaluations',
        tone: 'Objective, decisive',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
    },
    {
        id: 'spark',
        name: 'LUNO Spark',
        description: 'Ideas, connections, expansion',
        context: 'Brainstorming, creativity',
        tone: 'Energetic, exploratory',
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)'
    }
];

// Abstract geometric icons for each mode
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

    return <div className="mode-icon">{icons[mode]}</div>;
};

function Modes() {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Trigger slide-in animation
        setTimeout(() => setLoaded(true), 50);
    }, []);

    const handleModeSelect = (mode) => {
        setSelectedMode(mode.id);
        // Navigate to mode detail page
        navigate(`/modes/${mode.id}`);
    };

    const handleKeyDown = (e, mode, index) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleModeSelect(mode);
        } else if (e.key === 'ArrowRight' && index < modes.length - 1) {
            e.preventDefault();
            document.getElementById(`mode-${modes[index + 1].id}`)?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            document.getElementById(`mode-${modes[index - 1].id}`)?.focus();
        }
    };

    return (
        <div className="modes-page">
            <Navbar />

            <main className="modes-main">
                {/* Page Header */}
                <header className={`modes-header ${loaded ? 'loaded' : ''}`}>
                    <h1 className="modes-title">Modes</h1>
                    <p className="modes-subtitle">
                        Each mode adapts LUNO's listening, structuring, and memory behavior.
                    </p>
                </header>

                {/* Horizontal Scroll Rail */}
                <div className="modes-rail-container">
                    <div className={`modes-rail ${loaded ? 'loaded' : ''}`}>
                        {modes.map((mode, index) => (
                            <div
                                key={mode.id}
                                id={`mode-${mode.id}`}
                                className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                                style={{
                                    '--mode-color': mode.color,
                                    '--mode-gradient': mode.gradient,
                                    '--card-index': index
                                }}
                                onClick={() => handleModeSelect(mode)}
                                onKeyDown={(e) => handleKeyDown(e, mode, index)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selectedMode === mode.id}
                                aria-label={`${mode.name}: ${mode.description}`}
                            >
                                <div className="mode-card-inner">
                                    <ModeIcon mode={mode.id} color={mode.color} />

                                    <div className="mode-content">
                                        <span className="mode-context">{mode.context}</span>
                                        <h3 className="mode-name">{mode.name}</h3>
                                        <p className="mode-description">{mode.description}</p>
                                    </div>

                                    <div className="mode-hover-hint">
                                        <span>Start session</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Selection glow effect */}
                                <div className="mode-glow"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Mode Indicator */}
                {selectedMode && (
                    <div className="mode-active-indicator">
                        <span className="active-dot" style={{ background: modes.find(m => m.id === selectedMode)?.color }}></span>
                        <span className="active-label">
                            Active: {modes.find(m => m.id === selectedMode)?.name}
                        </span>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Modes;
