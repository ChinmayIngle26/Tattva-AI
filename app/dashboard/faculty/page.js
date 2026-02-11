'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { MEMBERS, DOMAINS, EVENTS, ANNOUNCEMENTS, TASKS, BLOGS, PROJECTS, ROLES } from '@/lib/data';

export default function FacultyDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.FACULTY) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.FACULTY) return null;
    const totalMembers = MEMBERS.length;
    const totalTasks = TASKS.length;
    const completedTasks = TASKS.filter(t => t.status === 'completed').length;
    const upcomingEvents = EVENTS.filter(e => e.status === 'upcoming');
    const pastEvents = EVENTS.filter(e => e.status === 'past');
    const allAnnouncements = ANNOUNCEMENTS;

    const tabs = ['overview', 'domains', 'members', 'events', 'announcements', 'reports'];

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #06d6a0, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem' }}>
                        {user?.name?.charAt(0) || 'F'}
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{user?.name || 'Faculty'}</h4>
                    <span className="badge badge-accent" style={{ marginTop: 'var(--space-xs)' }}>Faculty</span>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-heading">Views</div>
                    {tabs.map(tab => (
                        <div key={tab} className={`sidebar-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                            <span className="link-icon">{
                                { overview: '📊', domains: '🏛️', members: '👥', events: '📅', announcements: '📢', reports: '📈' }[tab]
                            }</span>
                            {tab}
                        </div>
                    ))}
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(6,214,160,0.05)', border: '1px solid rgba(6,214,160,0.15)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>👁 View-Only Access</span>
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header">
                    <h1>Faculty Dashboard 🏫</h1>
                    <p>Supervisory overview of all club activities</p>
                </div>

                {/* ========== OVERVIEW ========== */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stat-grid">
                            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{totalMembers}</div><div className="stat-label">Total Members</div></div>
                            <div className="stat-card"><div className="stat-icon">🏛️</div><div className="stat-value">{DOMAINS.length}</div><div className="stat-label">Active Domains</div></div>
                            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{completedTasks}/{totalTasks}</div><div className="stat-label">Tasks Done</div></div>
                            <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value">{upcomingEvents.length}</div><div className="stat-label">Upcoming Events</div></div>
                        </div>

                        <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>🏛️ Domain Overview</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
                                {DOMAINS.map(d => {
                                    const count = MEMBERS.filter(m => m.domain === d.id).length;
                                    const domTasks = TASKS.filter(t => t.domain === d.id);
                                    const domCompleted = domTasks.filter(t => t.status === 'completed').length;
                                    return (
                                        <div key={d.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', borderTop: `3px solid ${d.color}` }}>
                                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>{d.icon}</div>
                                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{d.shortName}</h4>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <div>👥 {count} members</div>
                                                <div>✅ {domCompleted}/{domTasks.length} tasks</div>
                                                <div style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Lead: {d.lead.name}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📅 Upcoming Events</h3>
                                {upcomingEvents.map(ev => (
                                    <div key={ev.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ev.title}</span>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>
                                            📅 {new Date(ev.date).toLocaleDateString()} • 👥 {ev.registeredCount}/{ev.maxCapacity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📢 Recent Announcements</h3>
                                {allAnnouncements.slice(0, 3).map(ann => (
                                    <div key={ann.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ann.title}</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>{ann.message.slice(0, 80)}...</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ========== DOMAINS ========== */}
                {activeTab === 'domains' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>🏛️ All Domains ({DOMAINS.length})</h3>
                        {DOMAINS.map(d => {
                            const domMembers = MEMBERS.filter(m => m.domain === d.id);
                            const domTasks = TASKS.filter(t => t.domain === d.id);
                            const domCompleted = domTasks.filter(t => t.status === 'completed').length;
                            const domProjects = PROJECTS.filter(p => p.domain === d.id);
                            const domBlogs = BLOGS.filter(b => b.domain === d.id);
                            const avgProgress = domMembers.length > 0
                                ? Math.round(domMembers.reduce((a, m) => a + (m.totalTasks > 0 ? (m.tasksCompleted / m.totalTasks) * 100 : 0), 0) / domMembers.length)
                                : 0;
                            return (
                                <div key={d.id} className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)', borderLeft: `4px solid ${d.color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
                                                <h4 style={{ fontSize: '1.1rem' }}>{d.name}</h4>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.description}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>Lead: {d.lead.name}</p>
                                        </div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: d.color }}>{avgProgress}%</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                        {[['👥 Members', domMembers.length], ['✅ Tasks', `${domCompleted}/${domTasks.length}`], ['🚀 Projects', domProjects.length], ['📝 Blogs', domBlogs.length]].map(([label, val]) => (
                                            <div key={label} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{label}</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: 2 }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${avgProgress}%`, background: d.color, borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ========== MEMBERS ========== */}
                {activeTab === 'members' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>👥 All Members ({totalMembers})</h3>
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Domain</th><th>Year</th><th>Branch</th><th>Tasks</th><th>Progress</th></tr></thead>
                            <tbody>
                                {MEMBERS.map(m => {
                                    const d = DOMAINS.find(dm => dm.id === m.domain);
                                    const mp = m.totalTasks > 0 ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0;
                                    return (
                                        <tr key={m.id}>
                                            <td style={{ fontWeight: 500 }}>{m.name}</td>
                                            <td><span style={{ color: d?.color, fontSize: '0.85rem' }}>{d?.icon} {d?.shortName}</span></td>
                                            <td>{m.year}</td>
                                            <td>{m.branch}</td>
                                            <td>{m.tasksCompleted}/{m.totalTasks}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                                    <div style={{ width: 60, height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${mp}%`, background: mp >= 75 ? 'var(--accent-cyan)' : mp >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)', borderRadius: 'var(--radius-full)' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{mp}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ========== EVENTS ========== */}
                {activeTab === 'events' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📅 All Events ({EVENTS.length})</h3>
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
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.description}</p>
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
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 'var(--space-xl) 0 var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past Events ({pastEvents.length})</h4>
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

                {/* ========== ANNOUNCEMENTS ========== */}
                {activeTab === 'announcements' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📢 All Announcements ({allAnnouncements.length})</h3>
                        {allAnnouncements.map(a => (
                            <div key={a.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '1px solid var(--border-color)', borderLeft: `3px solid ${a.priority === 'high' ? 'var(--accent-red)' : 'var(--primary-400)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-xs)' }}>{a.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.message}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <span className={`badge ${a.type === 'global' ? 'badge-amber' : 'badge-primary'}`}>{a.type}</span>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>{a.priority}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-sm)' }}>{a.date} • By {a.author}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ========== REPORTS ========== */}
                {activeTab === 'reports' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📈 Club Analytics Report</h3>

                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            {[
                                ['Total Members', totalMembers, 'var(--primary-400)'],
                                ['Active Domains', DOMAINS.length, 'var(--accent-purple)'],
                                ['Total Tasks', totalTasks, 'var(--accent-amber)'],
                                ['Completion Rate', `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`, 'var(--accent-cyan)']
                            ].map(([label, val, color]) => (
                                <div key={label} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color }}>{val}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-xs)' }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Domain Performance */}
                        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-lg)' }}>🏛️ Domain Performance</h4>
                            {DOMAINS.map(d => {
                                const domMembers = MEMBERS.filter(m => m.domain === d.id);
                                const domTasks = TASKS.filter(t => t.domain === d.id);
                                const domCompleted = domTasks.filter(t => t.status === 'completed').length;
                                const taskRate = domTasks.length > 0 ? Math.round((domCompleted / domTasks.length) * 100) : 0;
                                const domProjects = PROJECTS.filter(p => p.domain === d.id);
                                return (
                                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                            <span>{d.icon}</span>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{d.shortName}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${taskRate}%`, background: d.color, borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                            </div>
                                        </div>
                                        <div style={{ minWidth: 150, display: 'flex', gap: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            <span>👥 {domMembers.length}</span>
                                            <span>✅ {taskRate}%</span>
                                            <span>🚀 {domProjects.length}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Member Distribution */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-lg)' }}>👥 Members per Domain</h4>
                                {DOMAINS.map(d => {
                                    const count = MEMBERS.filter(m => m.domain === d.id).length;
                                    return (
                                        <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0' }}>
                                            <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>{d.icon} {d.shortName}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                                <div style={{ width: 80, height: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(count / totalMembers) * 100}%`, background: d.color, borderRadius: 'var(--radius-full)' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-lg)' }}>📊 Activity Summary</h4>
                                {[
                                    ['Total Blog Posts', BLOGS.length, '📝'],
                                    ['Total Events', EVENTS.length, '📅'],
                                    ['Active Projects', PROJECTS.filter(p => p.status === 'in-progress').length, '🚀'],
                                    ['Announcements', ANNOUNCEMENTS.length, '📢'],
                                    ['Upcoming Events', upcomingEvents.length, '🗓️']
                                ].map(([label, val, icon]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{icon} {label}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
