import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminDevices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const data = await api.get('/admin/devices');
            setDevices(data);
        } catch (err) {
            // Demo data
            setDevices([
                { id: '1', name: 'LUNO Edge Pro #1', status: 'connected', battery: 85, storage: 72, temperature: 32, firmware: '1.2.0', location: 'Conference Room A', user: { name: 'John Doe', email: 'john@example.com' } },
                { id: '2', name: 'LUNO Edge Pro #2', status: 'disconnected', battery: 45, storage: 90, temperature: 28, firmware: '1.1.5', location: 'Lab B', user: { name: 'Jane Smith', email: 'jane@example.com' } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const rebootDevice = async (deviceId) => {
        if (!confirm('Send reboot command to this device?')) return;
        try {
            await api.post(`/admin/devices/${deviceId}/reboot`);
            alert('Reboot command sent');
        } catch (err) {
            alert('Failed to send reboot command');
        }
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">Device Management</h1>
                <p className="admin-header-subtitle">Monitor and control LUNO edge devices</p>
            </header>

            <div className="admin-content">
                <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Online</span>
                            <div className="admin-stat-icon" style={{ background: 'rgba(93, 214, 44, 0.1)' }}>📶</div>
                        </div>
                        <div className="admin-stat-value">{devices.filter(d => d.status === 'connected').length}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Offline</span>
                            <div className="admin-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>📵</div>
                        </div>
                        <div className="admin-stat-value">{devices.filter(d => d.status !== 'connected').length}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Avg Battery</span>
                            <div className="admin-stat-icon">🔋</div>
                        </div>
                        <div className="admin-stat-value">
                            {devices.length > 0 ? Math.round(devices.reduce((a, d) => a + d.battery, 0) / devices.length) : 0}%
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <span className="admin-stat-label">Avg Storage</span>
                            <div className="admin-stat-icon">💾</div>
                        </div>
                        <div className="admin-stat-value">
                            {devices.length > 0 ? Math.round(devices.reduce((a, d) => a + d.storage, 0) / devices.length) : 0}%
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Status</th>
                                <th>Battery</th>
                                <th>Storage</th>
                                <th>Temp</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="admin-loading"><div className="spinner"></div></td></tr>
                            ) : devices.map(device => (
                                <tr key={device.id}>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{device.name}</div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                                {device.location || 'No location'} • v{device.firmware}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${device.status === 'connected' ? 'success' : 'error'}`}>
                                            {device.status === 'connected' ? '● Online' : '○ Offline'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <div style={{
                                                width: 40, height: 8, background: 'var(--color-surface)',
                                                borderRadius: 4, overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${device.battery}%`, height: '100%',
                                                    background: device.battery > 20 ? '#5DD62C' : '#ef4444'
                                                }}></div>
                                            </div>
                                            <span style={{ fontSize: 'var(--font-size-sm)' }}>{device.battery}%</span>
                                        </div>
                                    </td>
                                    <td>{device.storage}%</td>
                                    <td>{device.temperature}°C</td>
                                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{device.user?.name || device.user?.email}</td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm" onClick={() => rebootDevice(device.id)}>
                                            Reboot
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

export default AdminDevices;
