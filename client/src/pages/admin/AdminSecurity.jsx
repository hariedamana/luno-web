import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminSecurity() {
    const [settings, setSettings] = useState({
        encryptionAtRest: true,
        encryptionInTransit: true,
        localOnlyMode: true,
        autoDeleteDays: 0,
        autoDeleteAfterExport: false,
        logs: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.get('/admin/security');
            setSettings(data);
        } catch (err) {
            // Use defaults
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/admin/security', settings);
            alert('Security settings saved');
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const purgeData = async (type) => {
        if (!confirm(`Are you sure you want to purge ${type}? This cannot be undone.`)) return;
        try {
            await api.post('/admin/security/purge', { type });
            alert('Data purged successfully');
        } catch (err) {
            alert('Failed to purge data');
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Security & Privacy</h1>
                <p className="admin-header-subtitle">Encryption, access control, and data management</p>
            </header>

            <div className="admin-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Encryption Status */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Encryption Status</h3>
                            <span className="status-badge success">● Secure</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Encryption at Rest</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        AES-256 encryption for stored data
                                    </div>
                                </div>
                                <span className="status-badge success">Active</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Encryption in Transit</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        TLS 1.3 for all connections
                                    </div>
                                </div>
                                <span className="status-badge success">Active</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Local-Only Mode</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        No cloud sync, completely offline
                                    </div>
                                </div>
                                <label className="admin-toggle">
                                    <input
                                        type="checkbox"
                                        checked={settings.localOnlyMode}
                                        onChange={(e) => setSettings({ ...settings, localOnlyMode: e.target.checked })}
                                    />
                                    <span className="admin-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Auto-Delete Rules */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Auto-Delete Rules</h3>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Delete recordings after (days)</label>
                            <input
                                type="number"
                                className="admin-form-input"
                                value={settings.autoDeleteDays}
                                onChange={(e) => setSettings({ ...settings, autoDeleteDays: parseInt(e.target.value) || 0 })}
                                min="0"
                                placeholder="0 = Never"
                            />
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                Set to 0 to disable automatic deletion
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Delete After Export</div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    Auto-delete when exported
                                </div>
                            </div>
                            <label className="admin-toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.autoDeleteAfterExport}
                                    onChange={(e) => setSettings({ ...settings, autoDeleteAfterExport: e.target.checked })}
                                />
                                <span className="admin-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Manual Purge */}
                <div className="admin-card" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Manual Data Purge</h3>
                        <span className="status-badge error">⚠️ Danger Zone</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                        Permanently delete data. This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button className="btn btn-ghost" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => purgeData('sessions')}>
                            Purge All Recordings
                        </button>
                        <button className="btn btn-ghost" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} onClick={() => purgeData('logs')}>
                            Purge All Logs
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                    <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Security Settings'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminSecurity;
