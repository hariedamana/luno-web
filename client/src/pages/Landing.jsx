import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import api from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import './Landing.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function Landing() {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const landingRef = useRef(null);
    const heroRef = useRef(null);

    // Typing effect state
    const [typedLine1, setTypedLine1] = useState('');
    const [typedLine2, setTypedLine2] = useState('');
    const [showCursor1, setShowCursor1] = useState(true);
    const [showCursor2, setShowCursor2] = useState(false);

    const line1 = 'Capture Every Word.';
    const line2 = 'Own Every Moment.';

    useEffect(() => {
        console.log("🏠 Landing Page Mounted. Auth State:", { isAuthenticated, authLoading });

        // 1. Check for file_id and mode in URL
        const urlParams = new URLSearchParams(window.location.search);
        let fileId = urlParams.get("file_id");
        let modeSlug = urlParams.get("mode");

        // 2. If it's in the URL, save it to localStorage (in case we need to log in)
        if (fileId) {
            console.log("📥 Found fileId in URL:", fileId, "Mode:", modeSlug);
            localStorage.setItem("pending_luno_file_id", fileId);
            if (modeSlug) localStorage.setItem("pending_luno_mode", modeSlug);

            // Clean up the URL immediately
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 3. Retrieve from localStorage if we have one pending
        const pendingFileId = localStorage.getItem("pending_luno_file_id");
        const pendingModeSlug = localStorage.getItem("pending_luno_mode") || "sync";

        if (pendingFileId) {
            console.log("📝 Pending recording detected in storage:", pendingFileId);

            if (!authLoading) {
                if (isAuthenticated) {
                    console.log("🚀 User is authenticated. Registering recording...");

                    const handleNewRecording = async () => {
                        try {
                            // Get available modes from backend
                            console.log("📡 Fetching modes...");
                            const modes = await api.getModes();
                            console.log("📊 Modes available:", modes.length);

                            // Find the mode that matches our slug
                            const selectedMode = modes.find(m => m.slug === pendingModeSlug) || modes[0];

                            if (!selectedMode) {
                                console.error("❌ No modes found in system!");
                                return;
                            }

                            console.log("🎯 Selected Mode for Session:", selectedMode.name);

                            // Create the session in LUNO database
                            const sessionData = {
                                title: 'Untitled',
                                modeId: selectedMode.id,
                                duration: 0,
                                notes: `Captured via Mobile Recorder. File ID: ${pendingFileId}`,
                            };

                            console.log("📤 Creating session with data:", sessionData);
                            const session = await api.createSession(sessionData);
                            console.log("✅ Session created successfully:", session);

                            alert("🎙️ Record saved to your LUNO dashboard!");

                            // Trigger transcription automatically
                            console.log("🎙️ Triggering automatic transcription...");
                            try {
                                const transcriptResult = await api.transcribeSession(session.id);
                                console.log("✅ Auto-transcription complete:", transcriptResult);
                            } catch (transcriptErr) {
                                console.warn("⚠️ Auto-transcription failed (user can retry manually):", transcriptErr);
                            }

                            // Clear the pending data
                            localStorage.removeItem("pending_luno_file_id");
                            localStorage.removeItem("pending_luno_mode");
                            console.log("🧹 Local storage cleared.");

                            // Redirect to sessions page
                            console.log("↪️ Redirecting to sessions...");
                            navigate('/sessions');
                        } catch (error) {
                            console.error("❌ Failed to register recording:", error);
                            alert("❌ Error saving recording: " + error.message);
                        }
                    };

                    handleNewRecording();
                } else {
                    console.log("👋 User not authenticated. Waiting for login to process recording.");
                }
            } else {
                console.log("⏳ Auth is loading... waiting.");
            }
        }
    }, [isAuthenticated, authLoading, navigate]);


    // Smooth scroll with Lenis
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);

    // GSAP animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero parallax effect
            gsap.to('.hero-content', {
                y: 100,
                opacity: 0.3,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.landing-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            // Background orbs parallax
            gsap.to('.orb-1', {
                y: -200,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.landing',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 2,
                },
            });

            gsap.to('.orb-2', {
                y: -400,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.landing',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 3,
                },
            });

            gsap.to('.orb-3', {
                y: -150,
                x: 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.landing',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                },
            });

            // Staggered reveal for sections
            gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
                gsap.fromTo(elem,
                    { y: 80, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Staggered feature cards
            gsap.utils.toArray('.feature-key').forEach((elem, i) => {
                gsap.fromTo(elem,
                    { y: 60, opacity: 0, scale: 0.9 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Feature items staggered
            gsap.utils.toArray('.feature-item').forEach((elem, i) => {
                gsap.fromTo(elem,
                    { y: 40, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        delay: i * 0.05,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.features-preview',
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

        }, landingRef);

        return () => ctx.revert();
    }, []);

    // Typing effect
    useEffect(() => {
        let index = 0;
        let line2Index = 0;

        // Type first line
        const typeInterval1 = setInterval(() => {
            if (index < line1.length) {
                setTypedLine1(line1.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typeInterval1);
                setShowCursor1(false);
                setShowCursor2(true);

                // Start typing second line after a short delay
                setTimeout(() => {
                    const typeInterval2 = setInterval(() => {
                        if (line2Index < line2.length) {
                            setTypedLine2(line2.slice(0, line2Index + 1));
                            line2Index++;
                        } else {
                            clearInterval(typeInterval2);
                            // Keep cursor blinking at end
                        }
                    }, 60);
                }, 200);
            }
        }, 60);

        return () => {
            clearInterval(typeInterval1);
        };
    }, []);

    return (
        <div className="landing" ref={landingRef}>
            {/* Floating Background Orbs */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
                <div className="orb orb-4"></div>
            </div>

            {/* Hero Section */}
            <section className="landing-hero" ref={heroRef}>
                {/* Video Background */}
                <div className="hero-video-container">
                    <video
                        className="hero-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/video-poster.jpg"
                    >
                        <source src="/hero-bg.mp4" type="video/mp4" />
                        <source src="/hero-bg.webm" type="video/webm" />
                    </video>
                    <div className="hero-video-overlay"></div>
                </div>

                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="typing-text">
                                {typedLine1}
                                {showCursor1 && <span className="typing-cursor">|</span>}
                            </span>
                            <br />
                            <span className="hero-accent typing-text">
                                {typedLine2}
                                {showCursor2 && <span className="typing-cursor">|</span>}
                            </span>
                        </h1>
                        <p className="hero-description animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            LUNO is a privacy-first, edge-AI voice capture platform that processes
                            everything locally. Your data stays yours.
                        </p>
                        <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {isAuthenticated ? (
                                <Link to="/sessions" className="btn btn-primary btn-lg">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-primary btn-lg">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="btn btn-secondary btn-lg">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Keyboard Features Section */}
            <section className="keyboard-features">
                <div className="keyboard-features-container">
                    {/* Left content */}
                    <div className="keyboard-content gsap-reveal">
                        <h2 className="keyboard-heading">
                            It's not about capturing audio.
                        </h2>
                        <p className="keyboard-subheading">
                            It's about owning your voice data completely.
                        </p>
                        <Link to="/buy" className="btn btn-primary btn-lg glow-button" style={{ marginTop: 'var(--space-6)' }}>
                            Get LUNO
                        </Link>
                    </div>

                    {/* Keyboard grid */}
                    <div className="keyboard-grid">
                        {/* Background keyboard keys (decorative) */}
                        <div className="keyboard-backdrop">
                            <div className="key-row">
                                <div className="key small">esc</div>
                                <div className="key small">F1</div>
                                <div className="key small">F2</div>
                            </div>
                            <div className="key-row">
                                <div className="key">§</div>
                                <div className="key">1</div>
                                <div className="key">2</div>
                                <div className="key">3</div>
                            </div>
                            <div className="key-row">
                                <div className="key wide">⇥</div>
                                <div className="key">Q</div>
                                <div className="key">W</div>
                            </div>
                            <div className="key-row">
                                <div className="key">⌃</div>
                                <div className="key">A</div>
                                <div className="key">S</div>
                            </div>
                            <div className="key-row">
                                <div className="key wide">⇧</div>
                                <div className="key">Z</div>
                                <div className="key">X</div>
                            </div>
                        </div>

                        {/* Feature cards overlay */}
                        <div className="feature-keys">
                            <div className="feature-key reveal" data-glow="true">
                                <div className="feature-key-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div className="feature-key-content">
                                    <span className="feature-key-title">Fast.</span>
                                    <span className="feature-key-desc">Think in milliseconds.</span>
                                </div>
                            </div>
                            <div className="feature-key reveal" data-glow="true">
                                <div className="feature-key-icon">⌘</div>
                                <div className="feature-key-content">
                                    <span className="feature-key-title">Edge AI.</span>
                                    <span className="feature-key-desc">On-device processing.</span>
                                </div>
                            </div>
                            <div className="feature-key reveal" data-glow="true">
                                <div className="feature-key-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className="feature-key-content">
                                    <span className="feature-key-title">Private.</span>
                                    <span className="feature-key-desc">Your data stays yours.</span>
                                </div>
                            </div>
                            <div className="feature-key reveal" data-glow="true">
                                <div className="feature-key-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <div className="feature-key-content">
                                    <span className="feature-key-title">Reliable.</span>
                                    <span className="feature-key-desc">99.8% accuracy.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="landing-features">
                <div className="container">
                    <h2 className="section-title text-center gsap-reveal">Intelligent Capture Modes</h2>
                    <p className="section-description text-center gsap-reveal">
                        Context-aware recording that adapts to your situation
                    </p>
                    <div className="features-preview">
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(93, 214, 44, 0.15)', color: '#5DD62C' }}>Sync</span>
                            <span>Team Meetings</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(51, 116, 24, 0.2)', color: '#7BE94D' }}>Scholar</span>
                            <span>Lectures</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(93, 214, 44, 0.12)', color: '#5DD62C' }}>Probe</span>
                            <span>Interviews</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(51, 116, 24, 0.18)', color: '#7BE94D' }}>Reflect</span>
                            <span>Journaling</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(93, 214, 44, 0.1)', color: '#5DD62C' }}>Care</span>
                            <span>Healthcare</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(51, 116, 24, 0.15)', color: '#7BE94D' }}>Verdict</span>
                            <span>Legal</span>
                        </div>
                        <div className="feature-item hover-lift">
                            <span className="feature-badge" style={{ background: 'rgba(93, 214, 44, 0.18)', color: '#5DD62C' }}>Spark</span>
                            <span>Brainstorming</span>
                        </div>
                    </div>
                    <div className="text-center mt-8 gsap-reveal">
                        <Link to="/modes" className="btn btn-secondary glow-button-subtle">
                            Explore All Modes
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="landing-cta">
                <div className="container">
                    <div className="cta-content gsap-reveal">
                        <h2 className="cta-title">Ready to own your voice data?</h2>
                        <p className="cta-description">
                            Join thousands of professionals who trust LUNO for secure, intelligent voice capture.
                        </p>
                        <Link to="/buy" className="btn btn-primary btn-lg glow-button">
                            Get LUNO Device
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Landing;
