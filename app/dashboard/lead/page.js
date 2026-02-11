'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { useContent } from '@/lib/contentContext';
import { TASKS, EVENTS, PROJECTS, DOMAINS, RESOURCES, ROLES } from '@/lib/data';

export default function LeadDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { settings } = useSettings();
    const {
        blogs, addBlog, updateBlog,
        announcements, addAnnouncement, updateAnnouncement,
        joinRequests, updateJoinRequest,
        members
    } = useContent();
    const [activeTab, setActiveTab] = useState('overview');

    // All useState hooks must be above early returns (rules-of-hooks)

    const [taskModal, setTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', deadline: '' });
    const [createdTasks, setCreatedTasks] = useState([]);
    const [blogModal, setBlogModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '', category: 'Tutorials', readTime: '5 min read', tags: '' });
    const [announcementModal, setAnnouncementModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', priority: 'normal' });
    const [createdAnnouncements, setCreatedAnnouncements] = useState([]);
    const [memberModal, setMemberModal] = useState(null);
    const [actionFeedback, setActionFeedback] = useState('');

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.LEAD) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.LEAD) return null;
    const domain = DOMAINS.find(d => d.id === user?.domain);
    const domainMembers = members.filter(m => m.domain === user?.domain);
    const domainTasks = TASKS.filter(t => t.domain === user?.domain);
    const domainBlogs = blogs.filter(b => b.domain === user?.domain);
    const domainEvents = EVENTS.filter(e => e.domain === user?.domain || e.domain === null);
    const domainAnnouncements = announcements.filter(a => a.domain === user?.domain || a.type === 'global');
    const domainProjects = PROJECTS.filter(p => p.domain === user?.domain);
    const allJoins = joinRequests.filter(j => j.domain === user?.domain);
    const pendingJoins = allJoins.filter(j => j.status === 'pending');

    const showFeedback = (msg) => { setActionFeedback(msg); setTimeout(() => setActionFeedback(''), 3000); };

    const handleCreateBlog = (e) => {
        e.preventDefault();
        const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const blogData = {
            ...newBlog,
            slug,
            author: user.name,
            authorAvatar: '🧑‍💻',
            domain: user.domain,
            tags: newBlog.tags.split(',').map(t => t.trim()),
            featured: false,
        };
        addBlog(blogData);
        setBlogModal(false);
        setNewBlog({ title: '', excerpt: '', content: '', category: 'Tutorials', readTime: '5 min read', tags: '' });
        showFeedback('Blog post published!');
    };

    const handleJoinAction = (id, action) => {
        updateJoinRequest(id, { status: action });
        showFeedback(`Join request ${action === 'approved' ? 'approved' : 'rejected'} successfully!`);
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        setCreatedTasks(prev => [...prev, { ...newTask, id: `new-${Date.now()}`, domain: user?.domain, assignedTo: domainMembers.map(m => m.id), assignedBy: user?.name, status: 'in-progress', submissions: [] }]);
        setNewTask({ title: '', description: '', priority: 'medium', deadline: '' });
        setTaskModal(false);
        showFeedback('Task created successfully!');
    };

    const handleCreateAnnouncement = (e) => {
        e.preventDefault();
        setCreatedAnnouncements(prev => [...prev, { ...newAnnouncement, id: `ann-${Date.now()}`, domain: user?.domain, type: 'domain', date: new Date().toISOString().split('T')[0], author: user?.name }]);
        setNewAnnouncement({ title: '', message: '', priority: 'normal' });
        setAnnouncementModal(false);
        showFeedback('Announcement posted!');
    };

    const allTasks = [...domainTasks, ...createdTasks];
    const allAnnouncements = [...domainAnnouncements, ...createdAnnouncements];

    // Filter content for approvals
    const pendingBlogs = blogs.filter(b => b.status === 'pending' && b.domain === user?.domain);
    const pendingAnnouncements = announcements.filter(a => a.status === 'pending' && (a.domain === user?.domain || a.type === 'global')); // Global anns might need lead approval too

    const tabs = ['overview', 'approvals', 'members', 'tasks', 'join requests', 'blogs', 'events', 'announcements', 'projects'];

    const handleBlogApproval = (slug, approved) => {
        updateBlog(slug, { status: approved ? 'published' : 'rejected' });
        showFeedback(`Blog ${approved ? 'approved' : 'rejected'}`);
    };

    const handleAnnApproval = (id, approved) => {
        updateAnnouncement(id, { status: approved ? 'published' : 'rejected' });
        showFeedback(`Announcement ${approved ? 'approved' : 'rejected'}`);
    };

    return (
        <div className="dashboard-layout">
            {/* Feedback Toast */}
            {actionFeedback && (
                <div style={{ position: 'fixed', top: 'var(--space-xl)', right: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--primary-500), var(--accent-purple))', color: '#fff', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, fontSize: '0.9rem', fontWeight: 600, animation: 'slideUp 0.3s ease' }}>
                    ✅ {actionFeedback}
                </div>
            )}

            <aside className="dashboard-sidebar">
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem' }}>
                        {user?.name?.charAt(0) || 'L'}
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{user?.name || 'Lead'}</h4>
                    <span className="badge badge-amber" style={{ marginTop: 'var(--space-xs)' }}>Lead</span>
                    <div style={{ fontSize: '0.75rem', color: domain?.color, marginTop: 'var(--space-xs)' }}>{domain?.icon} {domain?.name}</div>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-heading">Management</div>
                    {tabs.map(tab => (
                        <div key={tab} className={`sidebar-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                            <span className="link-icon">{
                                { overview: '📊', approvals: '⚖️', members: '👥', tasks: '✅', 'join requests': '📩', blogs: '📝', events: '📅', announcements: '📢', projects: '🚀' }[tab]
                            }</span>
                            {tab}
                            {tab === 'join requests' && pendingJoins.length > 0 && (
                                <span style={{ marginLeft: 'auto', background: 'var(--accent-red)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{pendingJoins.length}</span>
                            )}
                            {tab === 'approvals' && (pendingBlogs.length + pendingAnnouncements.length) > 0 && (
                                <span style={{ marginLeft: 'auto', background: 'var(--accent-amber)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{pendingBlogs.length + pendingAnnouncements.length}</span>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header">
                    <h1>Lead Dashboard 🔥</h1>
                    <p>Managing <strong style={{ color: domain?.color }}>{domain?.name || 'Domain'}</strong></p>
                </div>

                {/* ========== OVERVIEW ========== */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stat-grid">
                            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{domainMembers.length}</div><div className="stat-label">Members</div></div>
                            <div className="stat-card"><div className="stat-icon">⚖️</div><div className="stat-value" style={{ color: (pendingBlogs.length + pendingAnnouncements.length) > 0 ? 'var(--accent-amber)' : undefined }}>{pendingBlogs.length + pendingAnnouncements.length}</div><div className="stat-label">Pending Approvals</div></div>
                            <div className="stat-card"><div className="stat-icon">📩</div><div className="stat-value" style={{ color: pendingJoins.length > 0 ? 'var(--accent-amber)' : undefined }}>{pendingJoins.length}</div><div className="stat-label">Pending Joins</div></div>
                            <div className="stat-card"><div className="stat-icon">🚀</div><div className="stat-value">{domainProjects.length}</div><div className="stat-label">Projects</div></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📩 Pending Join Requests</h3>
                                {pendingJoins.length === 0 ? <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No pending requests ✨</p> : pendingJoins.map(j => (
                                    <div key={j.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{j.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{j.branch} • {j.year}</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 'var(--space-xs) 0' }}>{j.motivation.slice(0, 80)}...</p>
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                            <button className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={() => handleJoinAction(j.id, 'approved')}>✓ Approve</button>
                                            <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={() => handleJoinAction(j.id, 'rejected')}>✗ Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>🚀 Projects</h3>
                                {domainProjects.map(p => (
                                    <div key={p.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
                                            <span className={`badge ${p.status === 'in-progress' ? 'badge-primary' : 'badge-amber'}`}>{p.status}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-400)' }}>{p.progress}%</span>
                                        </div>
                                        <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 'var(--space-sm)' }}>
                                            <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ========== APPROVALS ========== */}
                {activeTab === 'approvals' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>⚖️ Pending Content Approvals</h3>

                        {(pendingBlogs.length === 0 && pendingAnnouncements.length === 0) ? (
                            <p style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-tertiary)' }}>No pending approvals! All good. 👍</p>
                        ) : (
                            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                                {pendingBlogs.length > 0 && (
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📝 Blog Posts</h4>
                                        {pendingBlogs.map(b => (
                                            <div key={b.slug} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>By {b.author}</div>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 'var(--space-xs) 0' }}>{b.excerpt}</p>
                                                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleBlogApproval(b.slug, true)}>✓ Approve</button>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleBlogApproval(b.slug, false)}>✗ Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {pendingAnnouncements.length > 0 && (
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📢 Announcements</h4>
                                        {pendingAnnouncements.map(a => (
                                            <div key={a.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>By {a.author}</div>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 'var(--space-xs) 0' }}>{a.message}</p>
                                                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleAnnApproval(a.id, true)}>✓ Approve</button>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleAnnApproval(a.id, false)}>✗ Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ========== MEMBERS ========== */}
                {activeTab === 'members' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <h3 style={{ fontSize: '1rem' }}>👥 Domain Members ({domainMembers.length})</h3>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Year</th><th>Branch</th><th>Tasks</th><th>Progress</th><th>Actions</th></tr></thead>
                            <tbody>
                                {domainMembers.map(m => (
                                    <tr key={m.id}>
                                        <td style={{ fontWeight: 500 }}>{m.name}</td>
                                        <td>{m.year}</td>
                                        <td>{m.branch}</td>
                                        <td>{m.tasksCompleted}/{m.totalTasks}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                                <div style={{ width: 60, height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${m.totalTasks > 0 ? (m.tasksCompleted / m.totalTasks) * 100 : 0}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{m.totalTasks > 0 ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => setMemberModal(m)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Member Detail Modal */}
                        {memberModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setMemberModal(null)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>👤 Member Details</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setMemberModal(null)}>✕</button>
                                    </div>
                                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)', fontSize: '1.5rem', color: '#fff' }}>{memberModal.name.charAt(0)}</div>
                                        <h4>{memberModal.name}</h4>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{memberModal.email}</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', fontSize: '0.85rem' }}>
                                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Year</div>
                                            <div style={{ fontWeight: 600 }}>{memberModal.year}</div>
                                        </div>
                                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Branch</div>
                                            <div style={{ fontWeight: 600 }}>{memberModal.branch}</div>
                                        </div>
                                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Tasks Done</div>
                                            <div style={{ fontWeight: 600 }}>{memberModal.tasksCompleted}/{memberModal.totalTasks}</div>
                                        </div>
                                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Joined</div>
                                            <div style={{ fontWeight: 600 }}>{new Date(memberModal.joinedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 'var(--space-lg)' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)' }}>Progress</div>
                                        <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${memberModal.totalTasks > 0 ? (memberModal.tasksCompleted / memberModal.totalTasks) * 100 : 0}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--primary-400)', fontWeight: 600, marginTop: 2 }}>{memberModal.totalTasks > 0 ? Math.round((memberModal.tasksCompleted / memberModal.totalTasks) * 100) : 0}%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== TASKS ========== */}
                {activeTab === 'tasks' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                            <h3 style={{ fontSize: '1rem' }}>✅ Task Management ({allTasks.length})</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setTaskModal(true)} disabled={settings.dashboardsFrozen}>+ Create Task</button>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>Task</th><th>Assigned To</th><th>Deadline</th><th>Priority</th><th>Status</th></tr></thead>
                            <tbody>
                                {allTasks.map(t => (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                                        <td>{t.assignedTo.length} members</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{new Date(t.deadline).toLocaleDateString()}</td>
                                        <td><span className={`badge ${t.priority === 'high' ? 'badge-pink' : 'badge-amber'}`}>{t.priority}</span></td>
                                        <td><span className={`badge ${t.status === 'completed' ? 'badge-accent' : 'badge-primary'}`}>{t.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Create Task Modal */}
                        {taskModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setTaskModal(false)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>📋 Create New Task</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setTaskModal(false)}>✕</button>
                                    </div>
                                    <form onSubmit={handleCreateTask}>
                                        <div className="form-group">
                                            <label className="form-label">Task Title *</label>
                                            <input className="form-input" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Complete Assignment 3" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea className="form-textarea" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Task details..." rows={3} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Priority</label>
                                                <select className="form-select" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Deadline</label>
                                                <input className="form-input" type="date" required value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>Assigned to all {domainMembers.length} domain members</p>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Task</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== JOIN REQUESTS ========== */}
                {activeTab === 'join requests' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📩 Join Requests</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <span className="badge badge-amber">{allJoins.filter(j => j.status === 'pending').length} pending</span>
                                <span className="badge badge-accent">{allJoins.filter(j => j.status === 'approved').length} approved</span>
                                <span className="badge badge-pink">{allJoins.filter(j => j.status === 'rejected').length} rejected</span>
                            </div>
                        </div>
                        {allJoins.map(j => (
                            <div key={j.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: `1px solid ${j.status === 'approved' ? 'rgba(6,214,160,0.3)' : j.status === 'rejected' ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', opacity: j.status !== 'pending' ? 0.7 : 1, transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{j.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{j.email}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>{j.branch} • {j.year} • Applied {j.date}</div>
                                    </div>
                                    {j.status !== 'pending' ? (
                                        <span className={`badge ${j.status === 'approved' ? 'badge-accent' : 'badge-pink'}`} style={{ textTransform: 'capitalize' }}>{j.status}</span>
                                    ) : (
                                        <span className="badge badge-amber">Pending</span>
                                    )}
                                </div>
                                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)' }}>Motivation:</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{j.motivation}</p>
                                </div>
                                {j.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleJoinAction(j.id, 'approved')}>✓ Approve</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleJoinAction(j.id, 'rejected')}>✗ Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ========== BLOGS ========== */}
                {activeTab === 'blogs' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📝 Domain Blog Posts ({domainBlogs.length})</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                <span className="badge badge-primary">{settings.blogPostingEnabled ? 'Posting Enabled' : '🔒 Posting Disabled'}</span>
                                <button className="btn btn-primary btn-sm" onClick={() => setBlogModal(true)} disabled={!settings.blogPostingEnabled || settings.dashboardsFrozen}>+ New Post</button>
                            </div>
                        </div>
                        {domainBlogs.length === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-2xl)' }}>No blog posts yet. Start writing! ✍️</p>
                        ) : (
                            <table className="data-table">
                                <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Date</th><th>Stats</th></tr></thead>
                                <tbody>
                                    {domainBlogs.map(b => (
                                        <tr key={b.slug}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{b.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{b.excerpt.slice(0, 60)}...</div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{b.author}</td>
                                            <td><span className="badge badge-primary">{b.category}</span></td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>{b.date}</td>
                                            <td style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{b.readTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            💡 Tags across domain: {[...new Set(domainBlogs.flatMap(b => b.tags))].map(t => (
                                <span key={t} style={{ display: 'inline-block', padding: '0.15rem 0.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', marginLeft: 'var(--space-xs)' }}>{t}</span>
                            ))}
                        </div>

                        {/* Create Blog Modal */}
                        {blogModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setBlogModal(false)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>✍️ Write New Blog Post</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setBlogModal(false)}>✕</button>
                                    </div>
                                    <form onSubmit={handleCreateBlog}>
                                        <div className="form-group">
                                            <label className="form-label">Title *</label>
                                            <input className="form-input" required value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="Article title" />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Category</label>
                                                <select className="form-select" value={newBlog.category} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })}>
                                                    {['Tutorials', 'Tech News', 'Tattv Capital'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Read Time</label>
                                                <input className="form-input" value={newBlog.readTime} onChange={e => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="e.g. 5 min read" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Excerpt *</label>
                                            <textarea className="form-textarea" rows={2} required value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} placeholder="Short summary for the card..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Content *</label>
                                            <textarea className="form-textarea" rows={8} required value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="Write your article here..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tags (comma separated)</label>
                                            <input className="form-input" value={newBlog.tags} onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })} placeholder="AI, React, Tutorial" />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Post</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== EVENTS ========== */}
                {activeTab === 'events' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📅 Events ({domainEvents.length})</h3>
                            <span className="badge badge-primary">{settings.eventCreationEnabled ? 'Creation Enabled' : '🔒 Creation Disabled'}</span>
                        </div>
                        {domainEvents.map(e => (
                            <div key={e.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
                                <div style={{ textAlign: 'center', minWidth: 60 }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-400)' }}>{new Date(e.date).getDate()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                                        <span className={`badge ${e.status === 'upcoming' ? 'badge-primary' : 'badge-accent'}`}>{e.type}</span>
                                        <span className={`badge ${e.status === 'upcoming' ? 'badge-amber' : 'badge-accent'}`}>{e.status}</span>
                                    </div>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{e.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.description.slice(0, 100)}...</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        <span>🕐 {e.time}</span>
                                        <span>📍 {e.location}</span>
                                        <span>👥 {e.registeredCount}/{e.maxCapacity}</span>
                                    </div>
                                    <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 'var(--space-sm)', maxWidth: 200 }}>
                                        <div style={{ height: '100%', width: `${(e.registeredCount / e.maxCapacity) * 100}%`, background: e.registeredCount / e.maxCapacity > 0.8 ? 'var(--accent-red)' : 'var(--gradient-primary)', borderRadius: 'var(--radius-full)' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ========== ANNOUNCEMENTS ========== */}
                {activeTab === 'announcements' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📢 Announcements ({allAnnouncements.length})</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setAnnouncementModal(true)} disabled={!settings.announcementsEnabled || settings.dashboardsFrozen}>
                                + New Announcement
                            </button>
                        </div>
                        {allAnnouncements.map(a => (
                            <div key={a.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', borderLeft: `3px solid ${a.priority === 'high' ? 'var(--accent-red)' : 'var(--primary-400)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{a.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.message}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <span className={`badge ${a.type === 'global' ? 'badge-amber' : 'badge-primary'}`}>{a.type}</span>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>{a.date}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-sm)' }}>By {a.author}</div>
                            </div>
                        ))}

                        {/* Announcement Modal */}
                        {announcementModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setAnnouncementModal(false)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>📢 New Announcement</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setAnnouncementModal(false)}>✕</button>
                                    </div>
                                    <form onSubmit={handleCreateAnnouncement}>
                                        <div className="form-group">
                                            <label className="form-label">Title *</label>
                                            <input className="form-input" required value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} placeholder="Announcement title" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Message *</label>
                                            <textarea className="form-textarea" required value={newAnnouncement.message} onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} placeholder="Write your announcement..." rows={4} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Priority</label>
                                            <select className="form-select" value={newAnnouncement.priority} onChange={e => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}>
                                                <option value="normal">Normal</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Announcement</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== PROJECTS ========== */}
                {activeTab === 'projects' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>🚀 Domain Projects ({domainProjects.length})</h3>
                        </div>
                        {domainProjects.map(p => (
                            <div key={p.id} className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-xs)' }}>{p.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.description}</p>
                                    </div>
                                    <span className={`badge ${p.status === 'in-progress' ? 'badge-primary' : p.status === 'planning' ? 'badge-amber' : 'badge-accent'}`}>{p.status}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Progress</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-400)' }}>{p.progress}%</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
                                    <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-xl)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Lead:</span> {p.lead}</div>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Team:</span> {p.members.join(', ')}</div>
                                    <div><span style={{ color: 'var(--text-tertiary)' }}>Started:</span> {new Date(p.startDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
