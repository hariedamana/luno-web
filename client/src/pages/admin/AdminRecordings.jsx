import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminRecordings() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', modeId: '' });

    useEffect(() => {
        loadSessions();
    }, [filters]);

    const loadSessions = async () => {
        try {
            const params = new URLSearchParams(filters).toString();
            const data = await api.get(`/admin/sessions?${params}`);
            setSessions(data);
        } catch (err) {
            // Demo data
            setSessions([
                { id: '1', title: 'Weekly Team Standup', duration: 1800, status: 'completed', mode: { name: 'Sync', icon: '🔄' }, user: { name: 'John Doe' }, createdAt: new Date().toISOString() },
                { id: '2', title: 'Client Interview', duration: 3600, status: 'completed', mode: { name: 'Probe', icon: '🎯' }, user: { name: 'Jane Smith' }, createdAt: new Date().toISOString() },
                { id: '3', title: 'Lecture Notes', duration: 2700, status: 'pending', mode: { name: 'Scholar', icon: '📚' }, user: { name: 'Bob Johnson' }, createdAt: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const deleteSession = async (sessionId) => {
        if (!confirm('Delete this recording permanently?')) return;
        try {
            await api.delete(`/admin/sessions/${sessionId}`);
            setSessions(sessions.filter(s => s.id !== sessionId));
        } catch (err) {
            alert('Failed to delete recording');
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const hrs = Math.floor(mins / 60);
        if (hrs > 0) return `${hrs}h ${mins % 60}m`;
        return `${mins}m`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const statusColors = {
        completed: 'success',
        pending: 'warning',
        failed: 'error'
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Recordings</h1>
                <p className="admin-header-subtitle">Manage captured recordings and transcripts</p>
            </header>

            <div className="admin-content">
                {/* Filters */}
                <div className="admin-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label className="admin-form-label">Status</label>
                            <select
                                className="admin-form-input"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                style={{ width: 150 }}
                            >
                                <option value="">All</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Recording</th>
                                <th>Mode</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="admin-loading"><div className="spinner"></div></td></tr>
                            ) : sessions.length === 0 ? (
                                <tr><td colSpan="7" className="admin-empty">No recordings found</td></tr>
                            ) : sessions.map(session => (
                                <tr key={session.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{session.title}</div>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span>{session.mode?.icon}</span>
                                            <span>{session.mode?.name}</span>
                                        </span>
                                    </td>
                                    <td>{formatDuration(session.duration)}</td>
                                    <td>
                                        <span className={`status-badge ${statusColors[session.status]}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{session.user?.name}</td>
                                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{formatDate(session.createdAt)}</td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm" onClick={() => deleteSession(session.id)} style={{ color: 'var(--color-error)' }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminRecordings;
