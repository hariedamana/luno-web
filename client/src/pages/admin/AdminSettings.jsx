import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminSettings() {
    const [settings, setSettings] = useState({
        defaultLanguage: 'en',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        namingConvention: '{mode}_{date}_{time}',
        exportFormat: 'json'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.get('/admin/settings');
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
            await api.put('/admin/settings', settings);
            alert('Settings saved successfully');
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">System Settings</h1>
                <p className="admin-header-subtitle">Global configuration and preferences</p>
            </header>

            <div className="admin-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Localization */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Localization</h3>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Default Language</label>
                            <select
                                className="admin-form-input"
                                value={settings.defaultLanguage}
                                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Timezone</label>
                            <select
                                className="admin-form-input"
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                                <option value="Asia/Kolkata">India</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Date Format</label>
                            <select
                                className="admin-form-input"
                                value={settings.dateFormat}
                                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                            >
                                <option value="YYYY-MM-DD">2024-01-18</option>
                                <option value="MM/DD/YYYY">01/18/2024</option>
                                <option value="DD/MM/YYYY">18/01/2024</option>
                                <option value="MMM DD, YYYY">Jan 18, 2024</option>
                            </select>
                        </div>
                    </div>

                    {/* Export Settings */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Export Settings</h3>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Naming Convention</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={settings.namingConvention}
                                onChange={(e) => setSettings({ ...settings, namingConvention: e.target.value })}
                            />
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                                Variables: {'{mode}'}, {'{date}'}, {'{time}'}, {'{user}'}
                            </p>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Default Export Format</label>
                            <select
                                className="admin-form-input"
                                value={settings.exportFormat}
                                onChange={(e) => setSettings({ ...settings, exportFormat: e.target.value })}
                            >
                                <option value="json">JSON</option>
                                <option value="txt">Plain Text</option>
                                <option value="pdf">PDF</option>
                                <option value="docx">Word Document</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                    <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminSettings;
