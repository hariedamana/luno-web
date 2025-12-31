import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminModes() {
    const [modes, setModes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMode, setEditingMode] = useState(null);

    useEffect(() => {
        loadModes();
    }, []);

    const loadModes = async () => {
        try {
            const data = await api.get('/admin/modes');
            setModes(data);
        } catch (err) {
            // Demo data
            setModes([
                { id: '1', name: 'Sync', slug: 'sync', description: 'Team meeting mode', icon: '🔄', color: '#5DD62C', isEnabled: true, summaryStyle: 'detailed', keywordExtract: true, autoTitle: true, _count: { sessions: 45 } },
                { id: '2', name: 'Scholar', slug: 'scholar', description: 'Lecture and learning mode', icon: '📚', color: '#3b82f6', isEnabled: true, summaryStyle: 'detailed', keywordExtract: true, autoTitle: true, _count: { sessions: 32 } },
                { id: '3', name: 'Probe', slug: 'probe', description: 'Interview mode', icon: '🎯', color: '#f59e0b', isEnabled: true, summaryStyle: 'concise', keywordExtract: true, autoTitle: true, _count: { sessions: 18 } },
                { id: '4', name: 'Reflect', slug: 'reflect', description: 'Personal journaling', icon: '💭', color: '#8b5cf6', isEnabled: true, summaryStyle: 'minimal', keywordExtract: false, autoTitle: true, _count: { sessions: 12 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const updateMode = async (modeId, updates) => {
        try {
            await api.put(`/admin/modes/${modeId}`, updates);
            setModes(modes.map(m => m.id === modeId ? { ...m, ...updates } : m));
            setEditingMode(null);
        } catch (err) {
            alert('Failed to update mode');
        }
    };

    const toggleMode = (mode) => {
        updateMode(mode.id, { isEnabled: !mode.isEnabled });
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Modes Configuration</h1>
                <p className="admin-header-subtitle">Configure capture modes and their behaviors</p>
            </header>

            <div className="admin-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                    {loading ? (
                        <div className="admin-loading"><div className="spinner"></div></div>
                    ) : modes.map(mode => (
                        <div key={mode.id} className="admin-card" style={{ opacity: mode.isEnabled ? 1 : 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                        background: `${mode.color}20`, color: mode.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        {mode.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{mode.name}</h3>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {mode.description}
                                        </p>
                                    </div>
                                </div>
                                <label className="admin-toggle">
                                    <input
                                        type="checkbox"
                                        checked={mode.isEnabled}
                                        onChange={() => toggleMode(mode)}
                                    />
                                    <span className="admin-toggle-slider"></span>
                                </label>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Sessions</div>
                                    <div style={{ fontWeight: 600 }}>{mode._count?.sessions || 0}</div>
                                </div>
                                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>Summary Style</div>
                                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{mode.summaryStyle}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {mode.keywordExtract && <span className="status-badge info">Keywords</span>}
                                {mode.autoTitle && <span className="status-badge success">Auto-Title</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AdminModes;
