'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { DOMAINS, EVENTS, TASKS, BLOGS, ANNOUNCEMENTS, PROJECTS, DEMO_USERS, ROLES, ROLE_LABELS } from '@/lib/data';
import { useContent } from '@/lib/contentContext';

export default function DevDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { settings, toggle: toggleSetting, update: updateSetting, resetAll } = useSettings();
    const { members } = useContent();
    const [activeTab, setActiveTab] = useState('overview');

    // Interactive state — must be declared before any early returns (rules-of-hooks)
    const [actionFeedback, setActionFeedback] = useState('');
    const [userActions, setUserActions] = useState({});
    const [domainActions, setDomainActions] = useState({});
    const [contentActions, setContentActions] = useState({});
    const [backupActions, setBackupActions] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(null);
    const [showEditBlogModal, setShowEditBlogModal] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'member', domain: '' });
    const [newDomain, setNewDomain] = useState({ name: '', shortName: '', icon: '🔬', description: '' });
    const [exportProgress, setExportProgress] = useState(null);
    const [showChangeLeadModal, setShowChangeLeadModal] = useState(null);
    const [selectedLead, setSelectedLead] = useState('');

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.DEV) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.DEV) return null;

    const showFeedback = (msg) => { setActionFeedback(msg); setTimeout(() => setActionFeedback(''), 3000); };

    // User management
    const handleSuspendUser = (email) => {
        setUserActions(prev => ({ ...prev, [email]: prev[email] === 'suspended' ? null : 'suspended' }));
        showFeedback(userActions[email] === 'suspended' ? 'User reactivated!' : 'User suspended!');
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        showFeedback(`User "${newUser.name}" created with role "${newUser.role}"!`);
        setNewUser({ name: '', email: '', password: '', role: 'member', domain: '' });
        setShowUserModal(false);
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        setUserActions(prev => ({ ...prev, [showEditUserModal.email + '_edited']: true }));
        showFeedback(`User "${showEditUserModal.name}" updated!`);
        setShowEditUserModal(null);
    };

    // Domain management
    const handleRemoveDomain = (domainId) => {
        setDomainActions(prev => ({ ...prev, [domainId]: 'removed' }));
        showFeedback('Domain removed!');
        setShowConfirmModal(null);
    };

    const handleCreateDomain = (e) => {
        e.preventDefault();
        showFeedback(`Domain "${newDomain.name}" created!`);
        setNewDomain({ name: '', shortName: '', icon: '🔬', description: '' });
        setShowDomainModal(false);
    };

    const confirmChangeLead = () => {
        if (!selectedLead) return;
        const newLeadUser = DEMO_USERS.find(u => u.email === selectedLead) || members.find(m => m.email === selectedLead);
        setDomainActions(prev => ({
            ...prev,
            [showChangeLeadModal.id + '_lead']: newLeadUser
        }));
        showFeedback(`Domain lead updated to ${newLeadUser.name}!`);
        setShowChangeLeadModal(null);
        setSelectedLead('');
    };

    // Content management
    const handleDeleteBlog = (slug) => {
        setContentActions(prev => ({ ...prev, [slug]: 'deleted' }));
        showFeedback('Blog post deleted!');
        setShowConfirmModal(null);
    };

    const handleEditBlog = (e) => {
        e.preventDefault();
        setContentActions(prev => ({ ...prev, [showEditBlogModal.slug + '_edited']: true }));
        showFeedback(`Blog "${showEditBlogModal.title}" updated!`);
        setShowEditBlogModal(null);
    };

    // Backup operations
    const handleBackupAction = (action, label) => {
        setBackupActions(prev => ({ ...prev, [action]: 'loading' }));
        showFeedback(`${label}: Processing...`);
        setTimeout(() => {
            setBackupActions(prev => ({ ...prev, [action]: 'done' }));
            if (action === 'export') {
                setExportProgress(100);
                showFeedback('Data export complete! File ready for download.');
            } else if (action === 'reset_passwords') {
                showFeedback('All non-DEV user passwords have been reset!');
            } else if (action === 'restore_announcements') {
                showFeedback('Announcements restored from last backup!');
            } else if (action === 'clean_data') {
                showFeedback('Database cleaned — 0 corrupted entries found.');
            }
        }, 1500);
    };

    const handleResetAllSettings = () => {
        resetAll();
        showFeedback('All settings reset to defaults!');
        setShowConfirmModal(null);
    };

    const tabs = [
        { id: 'overview', icon: '📊', label: 'System Overview' },
        { id: 'toggles', icon: '⚙️', label: 'System Toggles' },
        { id: 'roles', icon: '🔐', label: 'Role & Access' },
        { id: 'domains', icon: '🏛️', label: 'Domain Control' },
        { id: 'content', icon: '📝', label: 'Content Control' },
        { id: 'analytics', icon: '📈', label: 'Analytics' },
        { id: 'features', icon: '🧪', label: 'Feature Flags' },
        { id: 'backup', icon: '💾', label: 'Backup & Recovery' },
    ];

    const ToggleRow = ({ label, desc, settingKey, danger }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', background: 'var(--bg-glass)', border: `1px solid ${danger && settings[settingKey] ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)', transition: 'all 0.3s ease' }}>
            <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: danger && settings[settingKey] ? 'var(--accent-red)' : 'var(--text-primary)' }}>{label}</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{desc}</span>
            </div>
            <div className={`toggle-switch ${settings[settingKey] ? 'active' : ''}`} onClick={() => toggleSetting(settingKey)}
                style={danger && settings[settingKey] ? { background: 'var(--accent-red)', borderColor: 'var(--accent-red)' } : {}} />
        </div>
    );

    // Modal overlay component
    const ModalOverlay = ({ children, onClose }) => (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            {actionFeedback && (
                <div style={{ position: 'fixed', top: 'var(--space-xl)', right: 'var(--space-xl)', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', color: '#fff', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, fontSize: '0.9rem', fontWeight: 600, animation: 'slideUp 0.3s ease' }}>
                    ⚡ {actionFeedback}
                </div>
            )}

            <aside className="dashboard-sidebar" style={{ borderRight: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid rgba(239,68,68,0.15)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem', boxShadow: '0 0 25px rgba(239,68,68,0.3)' }}>⚡</div>
                    <h4 style={{ fontSize: '0.95rem' }}>DEV Console</h4>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, marginTop: 'var(--space-xs)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Master Control
                    </span>
                </div>
                <div className="sidebar-section">
                    {tabs.map(tab => (
                        <div key={tab.id} className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)} style={{ cursor: 'pointer' }}>
                            <span className="link-icon">{tab.icon}</span>{tab.label}
                        </div>
                    ))}
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: 600 }}>🔒 ROOT ACCESS</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Hidden from public</div>
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1>DEV Control Panel ⚡</h1>
                            <p>Master system administration — full control over all operations</p>
                        </div>
                        {settings.maintenanceMode && (
                            <span style={{ padding: '0.4rem 1rem', background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, animation: 'pulse-glow 2s infinite' }}>
                                🔴 MAINTENANCE MODE
                            </span>
                        )}
                    </div>
                </div>

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stat-grid">
                            <div className="stat-card" style={{ borderTop: '3px solid var(--primary-500)' }}><div className="stat-icon">👥</div><div className="stat-value">{members.length}</div><div className="stat-label">Total Members</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-purple)' }}><div className="stat-icon">🏛️</div><div className="stat-value">{DOMAINS.length}</div><div className="stat-label">Domains</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-cyan)' }}><div className="stat-icon">📋</div><div className="stat-value">{TASKS.length}</div><div className="stat-label">Total Tasks</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-amber)' }}><div className="stat-icon">📝</div><div className="stat-value">{BLOGS.length}</div><div className="stat-label">Blog Posts</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-pink)' }}><div className="stat-icon">📅</div><div className="stat-value">{EVENTS.length}</div><div className="stat-label">Events</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-red)' }}><div className="stat-icon">🚀</div><div className="stat-value">{PROJECTS.length}</div><div className="stat-label">Projects</div></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>🏛️ Domain Distribution</h3>
                                {DOMAINS.map(d => {
                                    const count = members.filter(m => m.domain === d.id).length;
                                    const pct = members.length > 0 ? Math.round((count / members.length) * 100) : 0;
                                    return (
                                        <div key={d.id} style={{ marginBottom: 'var(--space-md)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                                                <span>{d.icon} {d.shortName}</span><span style={{ color: 'var(--text-tertiary)' }}>{count} ({pct}%)</span>
                                            </div>
                                            <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 'var(--radius-full)' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>⚡ Quick System Status</h3>
                                {[
                                    { label: 'Registrations', key: 'registrationsEnabled' },
                                    { label: 'Blog Posting', key: 'blogPostingEnabled' },
                                    { label: 'Maintenance Mode', key: 'maintenanceMode', invert: true },
                                    { label: 'Login Active', key: 'loginDisabled', invert: true },
                                ].map(item => (
                                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: (item.invert ? !settings[item.key] : settings[item.key]) ? 'var(--accent-cyan)' : 'var(--accent-red)' }}>
                                            {(item.invert ? !settings[item.key] : settings[item.key]) ? '● Active' : '● Disabled'}
                                        </span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>Feature Flags Active</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                                        {['leaderboardEnabled', 'projectSystemEnabled', 'aiFeaturesEnabled', 'certificatesEnabled', 'internalChatEnabled'].filter(k => settings[k]).length}/5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* SYSTEM TOGGLES */}
                {activeTab === 'toggles' && (
                    <div style={{ maxWidth: 700 }}>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>🟢 Core Toggles</h3>
                            <ToggleRow label="Registrations" desc="Allow new user registrations" settingKey="registrationsEnabled" />
                            <ToggleRow label="Join Requests" desc="Accept join request submissions" settingKey="joinRequestsEnabled" />
                            <ToggleRow label="Blog Posting" desc="Allow publishing blog posts" settingKey="blogPostingEnabled" />
                            <ToggleRow label="Event Creation" desc="Allow creating new events" settingKey="eventCreationEnabled" />
                            <ToggleRow label="Task Submissions" desc="Accept task submissions from members" settingKey="taskSubmissionsEnabled" />
                            <ToggleRow label="Announcements" desc="Enable announcement system" settingKey="announcementsEnabled" />
                        </div>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', color: 'var(--accent-red)' }}>🔴 Emergency Controls</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>⚠️ Use with caution. These affect the entire system.</p>
                            <ToggleRow label="Maintenance Mode" desc="Locks entire site for non-DEV users" settingKey="maintenanceMode" danger />
                            <ToggleRow label="Disable All Logins" desc="Block all logins except DEV accounts" settingKey="loginDisabled" danger />
                            <ToggleRow label="Freeze Dashboards" desc="Make all dashboards read-only" settingKey="dashboardsFrozen" danger />
                            <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid rgba(239,68,68,0.2)' }}>
                                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
                                    onClick={() => setShowConfirmModal({ type: 'reset_settings', title: 'Reset All Settings', message: 'All system settings will be reset to their default values. This cannot be undone.' })}>
                                    🔄 Reset All Settings to Default
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ROLE & ACCESS */}
                {activeTab === 'roles' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <h3 style={{ fontSize: '1rem' }}>🔐 All Users & Roles</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowUserModal(true)}>+ Create User</button>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Domain</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {DEMO_USERS.filter(u => u.role !== ROLES.DEV).map((u, i) => (
                                    <tr key={i} style={{ opacity: userActions[u.email] === 'suspended' ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
                                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{u.email}</td>
                                        <td><span className={`badge ${u.role === ROLES.LEAD ? 'badge-amber' :
                                            u.role === ROLES.MENTOR ? 'badge-purple' :
                                                u.role === ROLES.FACULTY ? 'badge-accent' : 'badge-primary'
                                            }`}>{ROLE_LABELS[u.role]}</span></td>
                                        <td>{u.domain ? DOMAINS.find(d => d.id === u.domain)?.shortName || u.domain : '—'}</td>
                                        <td>
                                            <span className={`badge ${userActions[u.email] === 'suspended' ? 'badge-pink' : 'badge-accent'}`}>
                                                {userActions[u.email] === 'suspended' ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                                                <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}
                                                    onClick={() => setShowEditUserModal(u)}>Edit</button>
                                                <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: userActions[u.email] === 'suspended' ? 'var(--accent-cyan)' : 'var(--accent-red)' }}
                                                    onClick={() => handleSuspendUser(u.email)}>
                                                    {userActions[u.email] === 'suspended' ? 'Activate' : 'Suspend'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Create User Modal */}
                        {showUserModal && (
                            <ModalOverlay onClose={() => setShowUserModal(false)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1rem' }}>👤 Create New User</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowUserModal(false)}>✕</button>
                                </div>
                                <form onSubmit={handleCreateUser}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input className="form-input" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input className="form-input" type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@tattv.ai" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Password *</label>
                                        <input className="form-input" type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Role</label>
                                            <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                                <option value="member">Member</option><option value="lead">Lead</option><option value="mentor">Mentor</option><option value="faculty">Faculty</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Domain</label>
                                            <select className="form-select" value={newUser.domain} onChange={e => setNewUser({ ...newUser, domain: e.target.value })}>
                                                <option value="">None</option>
                                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
                                </form>
                            </ModalOverlay>
                        )}

                        {/* Edit User Modal */}
                        {showEditUserModal && (
                            <ModalOverlay onClose={() => setShowEditUserModal(null)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1rem' }}>✏️ Edit User</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowEditUserModal(null)}>✕</button>
                                </div>
                                <form onSubmit={handleEditUser}>
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input className="form-input" defaultValue={showEditUserModal.name} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input className="form-input" defaultValue={showEditUserModal.email} disabled style={{ opacity: 0.5 }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Role</label>
                                            <select className="form-select" defaultValue={showEditUserModal.role}>
                                                <option value="member">Member</option><option value="lead">Lead</option><option value="mentor">Mentor</option><option value="faculty">Faculty</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Domain</label>
                                            <select className="form-select" defaultValue={showEditUserModal.domain || ''}>
                                                <option value="">None</option>
                                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
                                </form>
                            </ModalOverlay>
                        )}
                    </div>
                )}

                {/* DOMAIN CONTROL */}
                {activeTab === 'domains' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>🏛️ Domain Management</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowDomainModal(true)}>+ Create Domain</button>
                        </div>
                        <div className="grid-3">
                            {DOMAINS.filter(d => domainActions[d.id] !== 'removed').map(d => {
                                const currentLead = domainActions[d.id + '_lead'] || d.lead;
                                return (
                                    <div key={d.id} className="glass-card" style={{ padding: 'var(--space-lg)', borderTop: `3px solid ${d.color}`, transition: 'all 0.3s ease' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                                            <div>
                                                <span style={{ fontSize: '2rem' }}>{d.icon}</span>
                                                <h4 style={{ fontSize: '1rem', marginTop: 'var(--space-xs)' }}>{d.name}</h4>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <div>Lead: <strong>{currentLead.name}</strong></div>
                                            <div>{members.filter(m => m.domain === d.id).length} members</div>
                                            <div>{d.mentors.length} mentors</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-md)' }}>
                                            <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}
                                                onClick={() => { setShowChangeLeadModal(d); setSelectedLead(''); }}>
                                                Change Lead
                                            </button>
                                            <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}
                                                onClick={() => setShowConfirmModal({ type: 'remove_domain', id: d.id, title: 'Remove Domain', message: `Are you sure you want to remove "${d.name}"? All members will be unassigned.` })}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Change Lead Modal */}
                        {showChangeLeadModal && (
                            <ModalOverlay onClose={() => setShowChangeLeadModal(null)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1rem' }}>👤 Change Domain Lead</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowChangeLeadModal(null)}>✕</button>
                                </div>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                        Select a new lead for <strong>{showChangeLeadModal.name}</strong> domain.
                                    </p>
                                    <div className="form-group">
                                        <label className="form-label">New Lead</label>
                                        <select className="form-select" value={selectedLead} onChange={e => setSelectedLead(e.target.value)}>
                                            <option value="">Select a user...</option>
                                            {[...DEMO_USERS, ...members].filter(u =>
                                                u.role !== ROLES.DEV &&
                                                (u.role === ROLES.LEAD || u.role === ROLES.MENTOR || u.role === ROLES.FACULTY) &&
                                                u.email !== (domainActions[showChangeLeadModal.id + '_lead']?.email || showChangeLeadModal.lead.email)
                                            ).map(u => (
                                                <option key={u.email} value={u.email}>{u.name} ({ROLE_LABELS[u.role]})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-ghost" onClick={() => setShowChangeLeadModal(null)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={confirmChangeLead} disabled={!selectedLead}>Save Changes</button>
                                </div>
                            </ModalOverlay>
                        )}

                        {/* Create Domain Modal */}
                        {showDomainModal && (
                            <ModalOverlay onClose={() => setShowDomainModal(false)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1rem' }}>🏛️ Create Domain</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowDomainModal(false)}>✕</button>
                                </div>
                                <form onSubmit={handleCreateDomain}>
                                    <div className="form-group">
                                        <label className="form-label">Domain Name *</label>
                                        <input className="form-input" required value={newDomain.name} onChange={e => setNewDomain({ ...newDomain, name: e.target.value })} placeholder="e.g. Cybersecurity" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Short Name *</label>
                                            <input className="form-input" required value={newDomain.shortName} onChange={e => setNewDomain({ ...newDomain, shortName: e.target.value })} placeholder="e.g. CyberSec" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Icon</label>
                                            <input className="form-input" value={newDomain.icon} onChange={e => setNewDomain({ ...newDomain, icon: e.target.value })} placeholder="🔬" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" value={newDomain.description} onChange={e => setNewDomain({ ...newDomain, description: e.target.value })} placeholder="Domain description..." rows={3} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Domain</button>
                                </form>
                            </ModalOverlay>
                        )}
                    </div>
                )}

                {/* CONTENT CONTROL */}
                {activeTab === 'content' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📝 Content Management</h3>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>Blog Posts ({BLOGS.filter(b => contentActions[b.slug] !== 'deleted').length})</h4>
                            <table className="data-table">
                                <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {BLOGS.filter(b => contentActions[b.slug] !== 'deleted').map(b => (
                                        <tr key={b.slug} style={{ opacity: contentActions[b.slug + '_edited'] ? 0.8 : 1 }}>
                                            <td style={{ fontWeight: 500 }}>{b.title}</td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>{b.author}</td>
                                            <td><span className="badge badge-primary">{b.category}</span></td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>{b.date}</td>
                                            <td><span className={`badge ${contentActions[b.slug + '_edited'] ? 'badge-amber' : 'badge-accent'}`}>
                                                {contentActions[b.slug + '_edited'] ? 'Edited' : 'Published'}
                                            </span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                                                    <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}
                                                        onClick={() => setShowEditBlogModal(b)}>Edit</button>
                                                    <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}
                                                        onClick={() => setShowConfirmModal({ type: 'delete_blog', slug: b.slug, title: 'Delete Blog Post', message: `Are you sure you want to delete "${b.title}"? This cannot be undone.` })}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Content Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)' }}>
                            {[
                                ['📢 Announcements', ANNOUNCEMENTS.length, 'var(--primary-400)'],
                                ['📅 Events', EVENTS.length, 'var(--accent-purple)'],
                                ['🚀 Projects', PROJECTS.length, 'var(--accent-cyan)']
                            ].map(([label, val, color]) => (
                                <div key={label} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{val}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Edit Blog Modal */}
                        {showEditBlogModal && (
                            <ModalOverlay onClose={() => setShowEditBlogModal(null)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <h3 style={{ fontSize: '1rem' }}>✏️ Edit Blog Post</h3>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setShowEditBlogModal(null)}>✕</button>
                                </div>
                                <form onSubmit={handleEditBlog}>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" defaultValue={showEditBlogModal.title} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Author</label>
                                            <input className="form-input" defaultValue={showEditBlogModal.author} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <input className="form-input" defaultValue={showEditBlogModal.category} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Excerpt</label>
                                        <textarea className="form-textarea" defaultValue={showEditBlogModal.excerpt} rows={3} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
                                </form>
                            </ModalOverlay>
                        )}
                    </div>
                )}

                {/* ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div>
                        <div className="stat-grid">
                            <div className="stat-card" style={{ borderTop: '3px solid var(--primary-500)' }}><div className="stat-icon">👥</div><div className="stat-value">{members.length}</div><div className="stat-label">Total Members</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-cyan)' }}><div className="stat-icon">✅</div><div className="stat-value">{TASKS.filter(t => t.status === 'completed').length}/{TASKS.length}</div><div className="stat-label">Task Completion</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-purple)' }}><div className="stat-icon">📅</div><div className="stat-value">{EVENTS.reduce((a, e) => a + e.registeredCount, 0)}</div><div className="stat-label">Event Registrations</div></div>
                            <div className="stat-card" style={{ borderTop: '3px solid var(--accent-pink)' }}><div className="stat-icon">📝</div><div className="stat-value">{BLOGS.length}</div><div className="stat-label">Published Blogs</div></div>
                        </div>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📈 Domain Performance</h3>
                            {DOMAINS.map(d => {
                                const dTasks = TASKS.filter(t => t.domain === d.id);
                                const done = dTasks.filter(t => t.status === 'completed').length;
                                const rate = dTasks.length > 0 ? Math.round((done / dTasks.length) * 100) : 0;
                                return (
                                    <div key={d.id} style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                            <span style={{ fontWeight: 600 }}>{d.icon} {d.name}</span>
                                            <span style={{ color: d.color, fontWeight: 600 }}>{rate}% completion</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <div>{members.filter(m => m.domain === d.id).length} members</div>
                                            <div>{dTasks.length} tasks</div>
                                            <div>{BLOGS.filter(b => b.domain === d.id).length} blogs</div>
                                            <div>{PROJECTS.filter(p => p.domain === d.id).length} projects</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* FEATURE FLAGS */}
                {activeTab === 'features' && (
                    <div style={{ maxWidth: 700 }}>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                                <h3 style={{ fontSize: '1rem' }}>🧪 Feature Flags</h3>
                                <span className="badge badge-purple">
                                    {['leaderboardEnabled', 'projectSystemEnabled', 'aiFeaturesEnabled', 'certificatesEnabled', 'internalChatEnabled'].filter(k => settings[k]).length}/5 active
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>Toggle features on/off without code changes. Changes take effect immediately.</p>
                            <ToggleRow label="Leaderboard" desc="Show member leaderboard rankings on dashboards" settingKey="leaderboardEnabled" />
                            <ToggleRow label="Project System" desc="Enable project management features across all dashboards" settingKey="projectSystemEnabled" />
                            <ToggleRow label="AI Features" desc="Enable AI-powered recommendations & smart suggestions" settingKey="aiFeaturesEnabled" />
                            <ToggleRow label="Certificates" desc="Auto-generate completion certificates for members" settingKey="certificatesEnabled" />
                            <ToggleRow label="Internal Chat" desc="Enable in-app messaging between members" settingKey="internalChatEnabled" />
                        </div>

                        {/* Feature Flag Status Summary */}
                        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>📋 Current Flag Status</h4>
                            {[
                                { key: 'leaderboardEnabled', label: 'Leaderboard', icon: '🏆', impact: 'Shows ranking widget on member & lead dashboards' },
                                { key: 'projectSystemEnabled', label: 'Project System', icon: '🚀', impact: 'Enables Projects tab on Lead dashboard' },
                                { key: 'aiFeaturesEnabled', label: 'AI Features', icon: '🤖', impact: 'Adds smart task suggestions & auto-assignments' },
                                { key: 'certificatesEnabled', label: 'Certificates', icon: '📜', impact: 'Generates PDF certificates on task completion' },
                                { key: 'internalChatEnabled', label: 'Internal Chat', icon: '💬', impact: 'Enables messaging panel across all dashboards' },
                            ].map(f => (
                                <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
                                        <div>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.label}</span>
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{f.impact}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: settings[f.key] ? 'var(--accent-cyan)' : 'var(--text-tertiary)', padding: '0.2rem 0.6rem', background: settings[f.key] ? 'rgba(6,214,160,0.1)' : 'var(--bg-glass)', borderRadius: 'var(--radius-full)', border: `1px solid ${settings[f.key] ? 'rgba(6,214,160,0.2)' : 'var(--border-color)'}` }}>
                                        {settings[f.key] ? '● Enabled' : '○ Disabled'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BACKUP & RECOVERY */}
                {activeTab === 'backup' && (
                    <div style={{ maxWidth: 700 }}>
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>💾 Backup & Recovery</h3>
                            {[
                                { icon: '🔑', label: 'Reset User Passwords', desc: 'Force password reset for all non-DEV users', action: 'Execute', key: 'reset_passwords', danger: true },
                                { icon: '📢', label: 'Restore Announcements', desc: 'Recover deleted announcements from last backup', action: 'Restore', key: 'restore_announcements', danger: false },
                                { icon: '🗑️', label: 'Remove Corrupted Data', desc: 'Clean up invalid database entries', action: 'Clean', key: 'clean_data', danger: false },
                                { icon: '📦', label: 'Export All Data', desc: 'Download complete system backup as JSON', action: 'Export', key: 'export', danger: false },
                            ].map((item) => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', background: 'var(--bg-glass)', border: `1px solid ${backupActions[item.key] === 'done' ? 'rgba(6,214,160,0.3)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)', transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{item.label}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.desc}</span>
                                        </div>
                                    </div>
                                    {backupActions[item.key] === 'loading' ? (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>⏳ Processing...</span>
                                    ) : backupActions[item.key] === 'done' ? (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>✅ Done</span>
                                    ) : item.danger ? (
                                        <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
                                            onClick={() => setShowConfirmModal({ type: 'backup_action', key: item.key, label: item.label, title: item.label, message: `This will ${item.desc.toLowerCase()}. Are you sure?` })}>
                                            {item.action}
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary btn-sm"
                                            onClick={() => handleBackupAction(item.key, item.label)}>
                                            {item.action}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Export progress */}
                        {exportProgress !== null && (
                            <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', border: '1px solid rgba(6,214,160,0.2)' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>📦 Export Complete</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                    {[
                                        ['Members', members.length],
                                        ['Tasks', TASKS.length],
                                        ['Blogs', BLOGS.length],
                                        ['Events', EVENTS.length],
                                        ['Projects', PROJECTS.length],
                                        ['Announcements', ANNOUNCEMENTS.length]
                                    ].map(([label, count]) => (
                                        <div key={label} style={{ textAlign: 'center', padding: 'var(--space-sm)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{label}</div>
                                            <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{count}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '100%', background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: 'var(--space-sm)', textAlign: 'center' }}>✅ tattv_backup_{new Date().toISOString().split('T')[0]}.json ready</p>
                            </div>
                        )}

                        {/* System Reset */}
                        <div className="glass-card" style={{ padding: 'var(--space-lg)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)', color: 'var(--accent-red)' }}>⚠️ Danger Zone</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>These actions are destructive and cannot be easily undone.</p>
                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
                                    onClick={() => setShowConfirmModal({ type: 'reset_settings', title: 'Reset All Settings', message: 'All system toggles and feature flags will be reset to their factory default values. This cannot be undone.' })}>
                                    🔄 Reset Settings
                                </button>
                                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.3)' }}
                                    onClick={() => {
                                        setUserActions({});
                                        setDomainActions({});
                                        setContentActions({});
                                        setBackupActions({});
                                        setExportProgress(null);
                                        showFeedback('All session changes cleared!');
                                    }}>
                                    🧹 Clear Session Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <ModalOverlay onClose={() => setShowConfirmModal(null)}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>⚠️</div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-sm)' }}>{showConfirmModal.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>{showConfirmModal.message}</p>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => setShowConfirmModal(null)}>Cancel</button>
                            <button className="btn btn-primary" style={{ background: 'var(--accent-red)' }}
                                onClick={() => {
                                    if (showConfirmModal.type === 'remove_domain') handleRemoveDomain(showConfirmModal.id);
                                    else if (showConfirmModal.type === 'delete_blog') handleDeleteBlog(showConfirmModal.slug);
                                    else if (showConfirmModal.type === 'reset_settings') handleResetAllSettings();
                                    else if (showConfirmModal.type === 'backup_action') { handleBackupAction(showConfirmModal.key, showConfirmModal.label); setShowConfirmModal(null); }
                                }}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}
