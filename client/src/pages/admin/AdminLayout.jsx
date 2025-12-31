import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

function AdminLayout() {
    const { user, logout } = useAuth();

    // Redirect if not admin
    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/sessions" replace />;
    }

    const navSections = [
        {
            title: 'Overview',
            items: [
                { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
            ]
        },
        {
            title: 'Management',
            items: [
                { path: '/admin/users', icon: '👥', label: 'Users' },
                { path: '/admin/devices', icon: '📱', label: 'Devices' },
                { path: '/admin/recordings', icon: '🎙️', label: 'Recordings' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { path: '/admin/ai', icon: '🧠', label: 'AI Controls' },
                { path: '/admin/modes', icon: '🎯', label: 'Modes' },
            ]
        },
        {
            title: 'System',
            items: [
                { path: '/admin/security', icon: '🔒', label: 'Security' },
                { path: '/admin/storage', icon: '💾', label: 'Storage' },
                { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
                { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
                { path: '/admin/help', icon: '❓', label: 'Help' },
            ]
        },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <a href="/" className="admin-logo">
                        <div className="admin-logo-icon">L</div>
                        <span className="admin-logo-text">LUNO</span>
                        <span className="admin-logo-badge">Admin</span>
                    </a>
                </div>

                <nav className="admin-nav">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="admin-nav-section">
                            <div className="admin-nav-title">{section.title}</div>
                            <ul className="admin-nav-items">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            end={item.exact}
                                            className={({ isActive }) =>
                                                `admin-nav-link ${isActive ? 'active' : ''}`
                                            }
                                        >
                                            <span className="admin-nav-icon">{item.icon}</span>
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user">
                        <div className="admin-user-avatar">
                            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="admin-user-info">
                            <div className="admin-user-name">{user?.name || user?.email}</div>
                            <div className="admin-user-role">Administrator</div>
                        </div>
                    </div>
                    <button onClick={logout} className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
