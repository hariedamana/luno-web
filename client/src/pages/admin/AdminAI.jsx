import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminAI() {
    const [config, setConfig] = useState({
        languageModel: 'whisper-large',
        noiseSuppressionLevel: 'medium',
        speakerDiarization: true,
        offlineMode: true,
        wordErrorRate: 2.3,
        averageConfidence: 98.5
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await api.get('/admin/ai/config');
            setConfig(data);
        } catch (err) {
            // Use default config
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async () => {
        setSaving(true);
        try {
            await api.put('/admin/ai/config', config);
            alert('AI configuration saved');
        } catch (err) {
            alert('Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">AI Controls</h1>
                <p className="admin-header-subtitle">Configure AI processing and model settings</p>
            </header>

            <div className="admin-content">
                {/* Metrics */}
                <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Word Error Rate</span>
                            <div className="admin-stat-icon">📊</div>
                        </div>
                        <div className="admin-stat-value">{config.wordErrorRate}%</div>
                        <div className="admin-stat-change positive">Below industry avg</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Confidence Score</span>
                            <div className="admin-stat-icon">🎯</div>
                        </div>
                        <div className="admin-stat-value">{config.averageConfidence}%</div>
                        <div className="admin-stat-change positive">Excellent</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
                    {/* Model Configuration */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Model Configuration</h3>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Language Model</label>
                            <select
                                className="admin-form-input"
                                value={config.languageModel}
                                onChange={(e) => setConfig({ ...config, languageModel: e.target.value })}
                            >
                                <option value="whisper-small">Whisper Small (Fast)</option>
                                <option value="whisper-medium">Whisper Medium (Balanced)</option>
                                <option value="whisper-large">Whisper Large (Accurate)</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Noise Suppression</label>
                            <select
                                className="admin-form-input"
                                value={config.noiseSuppressionLevel}
                                onChange={(e) => setConfig({ ...config, noiseSuppressionLevel: e.target.value })}
                            >
                                <option value="off">Off</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Processing Options */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Processing Options</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Speaker Diarization</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Identify and separate speakers
                                    </div>
                                </div>
                                <label className="admin-toggle">
                                    <input
                                        type="checkbox"
                                        checked={config.speakerDiarization}
                                        onChange={(e) => setConfig({ ...config, speakerDiarization: e.target.checked })}
                                    />
                                    <span className="admin-toggle-slider"></span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Offline Mode</div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Process entirely on-device
                                    </div>
                                </div>
                                <label className="admin-toggle">
                                    <input
                                        type="checkbox"
                                        checked={config.offlineMode}
                                        onChange={(e) => setConfig({ ...config, offlineMode: e.target.checked })}
                                    />
                                    <span className="admin-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                    <button className="btn btn-primary" onClick={saveConfig} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminAI;
