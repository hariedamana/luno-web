import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            // Demo data
            setUsers([
                { id: '1', email: 'admin@luno.ai', name: 'Admin User', role: 'ADMIN', lastLoginAt: new Date().toISOString(), _count: { sessions: 45, devices: 2 } },
                { id: '2', email: 'user@luno.ai', name: 'Regular User', role: 'USER', lastLoginAt: new Date().toISOString(), _count: { sessions: 12, devices: 1 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingUser(null);
        } catch (err) {
            alert('Failed to update user role');
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const roleColors = {
        ADMIN: 'success',
        MODERATOR: 'warning',
        VIEWER: 'info',
        USER: ''
    };

    return (
        <>
            <header className="admin-header">
                <h1 className="admin-header-title">User Management</h1>
                <p className="admin-header-subtitle">Manage users, roles, and permissions</p>
            </header>

            <div className="admin-content">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Sessions</th>
                                <th>Devices</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="admin-loading"><div className="spinner"></div></td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="6" className="admin-empty">No users found</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: 'var(--color-surface)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 600, color: '#5DD62C'
                                            }}>
                                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{user.name || 'No name'}</div>
                                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {editingUser === user.id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                className="admin-form-input"
                                                style={{ width: 'auto', padding: 'var(--space-2)' }}
                                            >
                                                <option value="USER">User</option>
                                                <option value="VIEWER">Viewer</option>
                                                <option value="MODERATOR">Moderator</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`status-badge ${roleColors[user.role] || ''}`}
                                                onClick={() => setEditingUser(user.id)}
                                                style={{ cursor: 'pointer' }}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td>{user._count?.sessions || 0}</td>
                                    <td>{user._count?.devices || 0}</td>
                                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{formatDate(user.lastLoginAt)}</td>
                                    <td>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => deleteUser(user.id)}
                                            style={{ color: 'var(--color-error)' }}
                                        >
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

export default AdminUsers;
