'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { TASKS, ANNOUNCEMENTS, EVENTS, RESOURCES, MEMBERS, DOMAINS, BLOGS, ROLES } from '@/lib/data';

export default function MemberDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.MEMBER) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.MEMBER) return null;
    const memberData = MEMBERS.find(m => m.name === user?.name) || MEMBERS[0];
    const domain = DOMAINS.find(d => d.id === (user?.domain || memberData.domain));
    const myTasks = TASKS.filter(t => t.domain === memberData.domain);
    const myAnnouncements = ANNOUNCEMENTS.filter(a => a.type === 'global' || a.domain === memberData.domain);
    const upcomingEvents = EVENTS.filter(e => e.status === 'upcoming');
    const pastEvents = EVENTS.filter(e => e.status === 'past');
    const myResources = RESOURCES.filter(r => r.domain === memberData.domain);
    const domainBlogs = BLOGS.filter(b => b.domain === memberData.domain);
    const progress = memberData.totalTasks > 0 ? Math.round((memberData.tasksCompleted / memberData.totalTasks) * 100) : 0;

    // Interactive state
    const [taskActions, setTaskActions] = useState({});
    const [eventRegistrations, setEventRegistrations] = useState({});
    const [actionFeedback, setActionFeedback] = useState('');

    const showFeedback = (msg) => { setActionFeedback(msg); setTimeout(() => setActionFeedback(''), 3000); };

    const handleTaskSubmit = (taskId) => {
        if (settings.dashboardsFrozen) return;
        setTaskActions(prev => ({ ...prev, [taskId]: 'submitted' }));
        showFeedback('Task submission uploaded!');
    };

    const handleEventRegister = (eventId) => {
        setEventRegistrations(prev => ({ ...prev, [eventId]: !prev[eventId] }));
        showFeedback(eventRegistrations[eventId] ? 'Registration cancelled' : 'Registered for event!');
    };

    const tabs = ['overview', 'my tasks', 'announcements', 'events', 'resources', 'progress'];

    return (
        <div className="dashboard-layout">
            {actionFeedback && (
                <div style={{ position: 'fixed', top: 'var(--space-xl)', right: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--primary-500), var(--accent-purple))', color: '#fff', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, fontSize: '0.9rem', fontWeight: 600, animation: 'slideUp 0.3s ease' }}>
                    ✅ {actionFeedback}
                </div>
            )}

            <aside className="dashboard-sidebar">
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem' }}>
                        {memberData.name?.charAt(0) || 'M'}
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{user?.name || 'Member'}</h4>
                    <span className="badge badge-primary" style={{ marginTop: 'var(--space-xs)' }}>Member</span>
                    <div style={{ fontSize: '0.75rem', color: domain?.color, marginTop: 'var(--space-xs)' }}>{domain?.icon} {domain?.name}</div>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-heading">Navigation</div>
                    {tabs.map(tab => (
                        <div key={tab} className={`sidebar-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                            <span className="link-icon">{
                                { overview: '📊', 'my tasks': '✅', announcements: '📢', events: '📅', resources: '📚', progress: '📈' }[tab]
                            }</span>
                            {tab}
                        </div>
                    ))}
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header">
                    <h1>Welcome, {user?.name?.split(' ')[0] || 'Member'} 👋</h1>
                    <p>Domain: <strong style={{ color: domain?.color }}>{domain?.name || 'Not assigned'}</strong></p>
                </div>

                {/* ========== OVERVIEW ========== */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stat-grid">
                            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{memberData.tasksCompleted}</div><div className="stat-label">Tasks Completed</div></div>
                            <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{memberData.totalTasks - memberData.tasksCompleted}</div><div className="stat-label">Pending Tasks</div></div>
                            <div className="stat-card"><div className="stat-icon">📈</div><div className="stat-value">{progress}%</div><div className="stat-label">Progress</div></div>
                            <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value">{upcomingEvents.length}</div><div className="stat-label">Upcoming Events</div></div>
                        </div>

                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Overall Progress</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{memberData.tasksCompleted}/{memberData.totalTasks} tasks</span>
                            </div>
                            <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📋 Active Tasks</h3>
                                {myTasks.filter(t => t.status !== 'completed').map(task => (
                                    <div key={task.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{task.title}</span>
                                            <span className={`badge ${task.priority === 'high' ? 'badge-pink' : 'badge-amber'}`}>{task.priority}</span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📢 Announcements</h3>
                                {myAnnouncements.slice(0, 3).map(ann => (
                                    <div key={ann.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)', border: '1px solid var(--border-color)', borderLeft: `3px solid ${ann.priority === 'high' ? 'var(--accent-pink)' : 'var(--primary-500)'}` }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 'var(--space-xs)' }}>{ann.title}</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ann.message.slice(0, 80)}...</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ========== MY TASKS ========== */}
                {activeTab === 'my tasks' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>✅ My Tasks ({myTasks.length})</h3>
                        {myTasks.map(task => {
                            const submitted = taskActions[task.id] === 'submitted';
                            return (
                                <div key={task.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: `1px solid ${submitted ? 'rgba(6,214,160,0.3)' : 'var(--border-color)'}`, transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{task.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                            <span className={`badge ${task.priority === 'high' ? 'badge-pink' : 'badge-amber'}`}>{task.priority}</span>
                                            <span className={`badge ${task.status === 'completed' || submitted ? 'badge-accent' : 'badge-primary'}`}>{submitted ? 'submitted' : task.status}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                            <span>👥 {task.assignedTo.length} assigned</span>
                                            <span>📤 {task.submissions.length} submissions</span>
                                        </div>
                                        {task.status !== 'completed' && !submitted && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleTaskSubmit(task.id)} disabled={settings.dashboardsFrozen}>
                                                📤 Submit Work
                                            </button>
                                        )}
                                        {submitted && <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>✅ Submitted</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ========== ANNOUNCEMENTS ========== */}
                {activeTab === 'announcements' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📢 All Announcements ({myAnnouncements.length})</h3>
                        {myAnnouncements.map(ann => (
                            <div key={ann.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '1px solid var(--border-color)', borderLeft: `3px solid ${ann.priority === 'high' ? 'var(--accent-red)' : 'var(--primary-400)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{ann.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ann.message}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <span className={`badge ${ann.type === 'global' ? 'badge-amber' : 'badge-primary'}`}>{ann.type}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-sm)' }}>
                                    {ann.date} • By {ann.author}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ========== EVENTS ========== */}
                {activeTab === 'events' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📅 Events</h3>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming ({upcomingEvents.length})</h4>
                        {upcomingEvents.map(e => (
                            <div key={e.id} className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)', display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
                                <div style={{ textAlign: 'center', minWidth: 60 }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-400)' }}>{new Date(e.date).getDate()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                                        <span className="badge badge-primary">{e.type}</span>
                                        <span className="badge badge-amber">{e.status}</span>
                                    </div>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{e.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.description.slice(0, 100)}...</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        <span>🕐 {e.time}</span>
                                        <span>📍 {e.location}</span>
                                        <span>👥 {e.registeredCount + (eventRegistrations[e.id] ? 1 : 0)}/{e.maxCapacity}</span>
                                    </div>
                                </div>
                                <button className={`btn ${eventRegistrations[e.id] ? 'btn-secondary' : 'btn-primary'} btn-sm`} onClick={() => handleEventRegister(e.id)}>
                                    {eventRegistrations[e.id] ? '✕ Cancel' : '✓ Register'}
                                </button>
                            </div>
                        ))}
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)', marginTop: 'var(--space-xl)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past Events ({pastEvents.length})</h4>
                        {pastEvents.map(e => (
                            <div key={e.id} className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)', opacity: 0.7 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem' }}>{e.title}</h4>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>{new Date(e.date).toLocaleDateString()} • {e.location} • {e.registeredCount} attended</div>
                                    </div>
                                    <span className="badge badge-accent">Completed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ========== RESOURCES ========== */}
                {activeTab === 'resources' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📚 Learning Resources ({myResources.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                            {myResources.map(res => (
                                <div key={res.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'all 0.3s ease' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{res.type}</span>
                                    <h4 style={{ fontSize: '0.95rem', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>{res.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Added by {res.addedBy}</span>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Open →</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== PROGRESS ========== */}
                {activeTab === 'progress' && (
                    <div>
                        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-sm)' }}>{progress}%</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overall Task Completion</p>
                            <div style={{ height: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 'var(--space-lg)', maxWidth: 400, margin: 'var(--space-lg) auto 0' }}>
                                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{memberData.tasksCompleted}</div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Completed</p>
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{memberData.totalTasks - memberData.tasksCompleted}</div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>In Progress</p>
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-400)' }}>{memberData.totalTasks}</div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Total Assigned</p>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📊 Task Breakdown</h3>
                            {myTasks.map(t => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.title}</span>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Due: {new Date(t.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`badge ${t.status === 'completed' || taskActions[t.id] === 'submitted' ? 'badge-accent' : 'badge-primary'}`}>
                                        {taskActions[t.id] === 'submitted' ? 'submitted' : t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
