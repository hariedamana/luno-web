import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Device.css';

function Device() {
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDevice();
    }, []);

    const loadDevice = async () => {
        try {
            const data = await api.getDevice();
            setDevice(data);
        } catch (err) {
            setError(err.message);
            // Fallback device state
            setDevice({
                name: 'LUNO Edge Device',
                status: 'disconnected',
                firmware: '1.0.0',
                battery: 100,
                lastSync: null
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            const data = await api.connectDevice();
            setDevice(data.device);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDisconnect = async () => {
        try {
            const data = await api.disconnectDevice();
            setDevice(data.device);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSync = async () => {
        if (device?.status !== 'connected') return;

        setSyncing(true);
        try {
            const data = await api.syncDevice();
            setDevice(data.device);
        } catch (err) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isConnected = device?.status === 'connected';

    return (
        <div className="device-page">
            <Navbar />

            <main className="page">
                <div className="container">
                    <header className="page-header">
                        <h1 className="page-title">Device</h1>
                        <p className="page-description">
                            Manage your LUNO Edge hardware device connection and sync
                        </p>
                    </header>

                    {error && (
                        <div className="device-error">
                            {error}
                            <button className="btn btn-ghost btn-sm" onClick={() => setError(null)}>Dismiss</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center" style={{ padding: 'var(--space-16)' }}>
                            <div className="spinner-lg"></div>
                        </div>
                    ) : (
                        <div className="device-content">
                            {/* Device Status Card */}
                            <div className="device-status-card glass-card-static">
                                <div className="device-visual">
                                    <div className={`device-icon ${isConnected ? 'connected' : ''}`}>
                                        <svg viewBox="0 0 60 60" className="mic-svg" xmlns="http://www.w3.org/2000/svg">
                                            {/* Microphone */}
                                            <rect x="22" y="10" width="16" height="28" rx="8" fill="#202020" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="2" />
                                            {/* Mic grille */}
                                            <line x1="26" y1="18" x2="34" y2="18" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="1" opacity="0.5" />
                                            <line x1="26" y1="22" x2="34" y2="22" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="1" opacity="0.5" />
                                            <line x1="26" y1="26" x2="34" y2="26" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="1" opacity="0.5" />
                                            {/* Stand */}
                                            <path d="M18 32 Q18 44 30 44 Q42 44 42 32" fill="none" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="2" />
                                            <line x1="30" y1="44" x2="30" y2="52" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="2" />
                                            <line x1="22" y1="52" x2="38" y2="52" stroke={isConnected ? "#5DD62C" : "#666"} strokeWidth="2" />
                                            {/* Sound waves when connected */}
                                            {isConnected && (
                                                <>
                                                    <path d="M8 20 Q4 30 8 40" fill="none" stroke="#5DD62C" strokeWidth="1.5" className="sound-wave-left" />
                                                    <path d="M52 20 Q56 30 52 40" fill="none" stroke="#5DD62C" strokeWidth="1.5" className="sound-wave-right" />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                    <div className={`device-status-indicator ${isConnected ? 'connected' : ''}`}></div>
                                </div>

                                <div className="device-info">
                                    <h2 className="device-name">{device?.name || 'LUNO Edge Device'}</h2>
                                    <span className={`badge ${isConnected ? 'badge-success' : ''}`}>
                                        {isConnected ? '● Connected' : '○ Disconnected'}
                                    </span>
                                </div>

                                <div className="device-details">
                                    <div className="device-detail">
                                        <span className="detail-label">Firmware</span>
                                        <span className="detail-value">v{device?.firmware || '1.0.0'}</span>
                                    </div>
                                    <div className="device-detail">
                                        <span className="detail-label">Battery</span>
                                        <span className="detail-value">
                                            <span className="battery-indicator">
                                                <span
                                                    className="battery-level"
                                                    style={{ width: `${device?.battery || 100}%` }}
                                                ></span>
                                            </span>
                                            {device?.battery || 100}%
                                        </span>
                                    </div>
                                    <div className="device-detail">
                                        <span className="detail-label">Last Sync</span>
                                        <span className="detail-value">{formatDate(device?.lastSync)}</span>
                                    </div>
                                </div>

                                <div className="device-actions">
                                    {isConnected ? (
                                        <>
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleSync}
                                                disabled={syncing}
                                            >
                                                {syncing ? <span className="spinner"></span> : '↻'} Sync Now
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handleDisconnect}
                                            >
                                                Disconnect
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleConnect}
                                        >
                                            Connect Device
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Setup Steps */}
                            <div className="device-setup">
                                <h3>Device Setup</h3>
                                <div className="setup-steps">
                                    <div className="setup-step">
                                        <div className="step-number">1</div>
                                        <div className="step-content">
                                            <h4>Power On</h4>
                                            <p>Press and hold the power button for 3 seconds until the LED turns blue.</p>
                                        </div>
                                    </div>
                                    <div className="setup-step">
                                        <div className="step-number">2</div>
                                        <div className="step-content">
                                            <h4>Enable Pairing</h4>
                                            <p>Double-press the sync button to enter pairing mode. LED will flash rapidly.</p>
                                        </div>
                                    </div>
                                    <div className="setup-step">
                                        <div className="step-number">3</div>
                                        <div className="step-content">
                                            <h4>Connect</h4>
                                            <p>Click the Connect button above to establish the connection.</p>
                                        </div>
                                    </div>
                                    <div className="setup-step">
                                        <div className="step-number">4</div>
                                        <div className="step-content">
                                            <h4>Ready</h4>
                                            <p>Once connected, your sessions will automatically sync to LUNO.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hardware Overview */}
                            <div className="device-hardware glass-card-static">
                                <h3>Hardware Overview</h3>
                                <div className="hardware-specs">
                                    <div className="spec-item">
                                        <span className="spec-icon">🎤</span>
                                        <div className="spec-info">
                                            <span className="spec-name">Microphone Array</span>
                                            <span className="spec-value">6-element MEMS, 360° capture</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-icon">🧠</span>
                                        <div className="spec-info">
                                            <span className="spec-name">Edge Processor</span>
                                            <span className="spec-value">Neural Engine, 4 TOPS</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-icon">💾</span>
                                        <div className="spec-info">
                                            <span className="spec-name">Storage</span>
                                            <span className="spec-value">32GB encrypted local storage</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-icon">🔋</span>
                                        <div className="spec-info">
                                            <span className="spec-name">Battery</span>
                                            <span className="spec-value">12+ hours continuous recording</span>
                                        </div>
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

export default Device;
