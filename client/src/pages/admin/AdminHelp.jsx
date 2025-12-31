import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminHelp() {
    const [diagnostics, setDiagnostics] = useState({
        database: 'healthy',
        devices: 0,
        recentErrors: 0,
        version: { server: '1.0.0', firmware: '1.0.0' },
        uptime: 0,
        memory: { heapUsed: 0, heapTotal: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDiagnostics();
    }, []);

    const loadDiagnostics = async () => {
        try {
            const data = await api.get('/admin/diagnostics');
            setDiagnostics(data);
        } catch (err) {
            // Use defaults
        } finally {
            setLoading(false);
        }
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hrs = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (days > 0) return `${days}d ${hrs}h ${mins}m`;
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const formatBytes = (bytes) => {
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Help & Diagnostics</h1>
                <p className="admin-header-subtitle">System health, version info, and support</p>
            </header>

            <div className="admin-content">
                {/* System Status */}
                <div className="admin-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">System Diagnostics</h3>
                        <button className="btn btn-ghost btn-sm" onClick={loadDiagnostics}>
                            Run Check
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ marginBottom: 'var(--space-2)' }}>
                                <span className={`status-badge ${diagnostics.database === 'healthy' ? 'success' : 'error'}`}>
                                    {diagnostics.database === 'healthy' ? '● Healthy' : '● Error'}
                                </span>
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Database</div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{diagnostics.devices}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Devices</div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)', color: diagnostics.recentErrors > 0 ? 'var(--color-error)' : '#5DD62C' }}>{diagnostics.recentErrors}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Errors (24h)</div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{formatUptime(diagnostics.uptime)}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Uptime</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Version Info */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Version Information</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Server Version</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Backend API</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#5DD62C' }}>v{diagnostics.version?.server}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Firmware Version</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Edge device</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#5DD62C' }}>v{diagnostics.version?.firmware}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Memory Usage</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Heap allocation</div>
                                </div>
                                <span>{formatBytes(diagnostics.memory?.heapUsed || 0)} / {formatBytes(diagnostics.memory?.heapTotal || 0)}</span>
                            </div>
                        </div>

                        <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
                            Check for Updates
                        </button>
                    </div>

                    {/* Support */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Support & Documentation</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <a href="#" style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                padding: 'var(--space-3)', background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit'
                            }}>
                                <span>📖</span>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Documentation</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Admin guides and API reference</div>
                                </div>
                            </a>
                            <a href="#" style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                padding: 'var(--space-3)', background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit'
                            }}>
                                <span>💬</span>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Contact Support</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Get help from our team</div>
                                </div>
                            </a>
                            <a href="#" style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                padding: 'var(--space-3)', background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit'
                            }}>
                                <span>📥</span>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Export Logs</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Download system logs for debugging</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminHelp;
