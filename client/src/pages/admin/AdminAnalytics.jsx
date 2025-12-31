import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminAnalytics() {
    const [analytics, setAnalytics] = useState({
        modeUsage: [],
        totalRecordingTime: 0,
        averageSessionLength: 0
    });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
        loadLogs();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await api.get('/admin/analytics');
            setAnalytics(data);
        } catch (err) {
            // Demo data
            setAnalytics({
                modeUsage: [
                    { mode: 'Sync', count: 145, avgDuration: 1800 },
                    { mode: 'Scholar', count: 89, avgDuration: 2700 },
                    { mode: 'Probe', count: 56, avgDuration: 3600 },
                    { mode: 'Reflect', count: 34, avgDuration: 900 }
                ],
                totalRecordingTime: 432000,
                averageSessionLength: 1800
            });
        } finally {
            setLoading(false);
        }
    };

    const loadLogs = async () => {
        try {
            const data = await api.get('/admin/logs?limit=10');
            setLogs(data);
        } catch (err) {
            // Demo logs
            setLogs([
                { id: '1', type: 'info', category: 'auth', message: 'User logged in', createdAt: new Date().toISOString() },
                { id: '2', type: 'info', category: 'session', message: 'Recording completed', createdAt: new Date().toISOString() },
            ]);
        }
    };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const maxCount = Math.max(...analytics.modeUsage.map(m => m.count), 1);

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Analytics & Logs</h1>
                <p className="admin-header-subtitle">Usage insights and system activity</p>
            </header>

            <div className="admin-content">
                {/* Summary Stats */}
                <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Total Recording Time</span>
                            <div className="admin-stat-icon">⏱️</div>
                        </div>
                        <div className="admin-stat-value">{formatDuration(analytics.totalRecordingTime)}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Avg Session Length</span>
                            <div className="admin-stat-icon">📊</div>
                        </div>
                        <div className="admin-stat-value">{formatDuration(analytics.averageSessionLength)}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                    {/* Mode Usage Chart */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Mode Usage</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {analytics.modeUsage.map((mode, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        <span style={{ fontWeight: 500 }}>{mode.mode}</span>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{mode.count} sessions</span>
                                    </div>
                                    <div style={{ height: 8, background: 'var(--color-surface)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${(mode.count / maxCount) * 100}%`,
                                            height: '100%',
                                            background: '#5DD62C',
                                            borderRadius: 4
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Logs */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Recent Activity</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {logs.length === 0 ? (
                                <div className="admin-empty">No recent activity</div>
                            ) : logs.map(log => (
                                <div key={log.id} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                                    padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)'
                                }}>
                                    <span className={`status-badge ${log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : 'info'}`}>
                                        {log.type}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 'var(--font-size-sm)' }}>{log.message}</div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminAnalytics;
