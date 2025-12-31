import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminStorage() {
    const [storage, setStorage] = useState({
        used: 250,
        total: 10000,
        percentage: 2.5,
        devices: [],
        backupEnabled: false,
        lastBackup: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorage();
    }, []);

    const loadStorage = async () => {
        try {
            const data = await api.get('/admin/storage');
            setStorage(data);
        } catch (err) {
            // Use defaults
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (mb) => {
        if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
        return `${mb} MB`;
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Storage & Backup</h1>
                <p className="admin-header-subtitle">Monitor storage usage and manage backups</p>
            </header>

            <div className="admin-content">
                {/* Storage Overview */}
                <div className="admin-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Storage Usage</h3>
                        <span className="status-badge success">{storage.percentage}% used</span>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-2xl)' }}>{formatSize(storage.used)}</span>
                            <span style={{ color: 'var(--color-text-secondary)' }}>of {formatSize(storage.total)}</span>
                        </div>
                        <div style={{
                            height: 12, background: 'var(--color-surface)', borderRadius: 6, overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${storage.percentage}%`, height: '100%',
                                background: storage.percentage > 80 ? '#ef4444' : storage.percentage > 60 ? '#f59e0b' : '#5DD62C',
                                borderRadius: 6,
                                transition: 'width 0.5s ease'
                            }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{formatSize(storage.used)}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Used</div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{formatSize(storage.total - storage.used)}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Available</div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{storage.percentage}%</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Utilization</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Backup Settings */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Backup Configuration</h3>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Automatic Backup</div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    Daily backup to external storage
                                </div>
                            </div>
                            <label className="admin-toggle">
                                <input type="checkbox" checked={storage.backupEnabled} onChange={() => { }} />
                                <span className="admin-toggle-slider"></span>
                            </label>
                        </div>

                        <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>Last Backup</div>
                            <div style={{ fontWeight: 500 }}>{storage.lastBackup ? new Date(storage.lastBackup).toLocaleString() : 'Never'}</div>
                        </div>

                        <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
                            Create Backup Now
                        </button>
                    </div>

                    {/* Cleanup Recommendations */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Cleanup Recommendations</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Old Recordings</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>12 recordings older than 90 days</div>
                                </div>
                                <button className="btn btn-ghost btn-sm">Clean</button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Cache Files</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>45 MB of temporary files</div>
                                </div>
                                <button className="btn btn-ghost btn-sm">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminStorage;
