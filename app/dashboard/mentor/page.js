'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { MEMBERS, TASKS, RESOURCES, DOMAINS, ANNOUNCEMENTS, EVENTS, ROLES } from '@/lib/data';

export default function MentorDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.MENTOR) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.MENTOR) return null;
    const domain = DOMAINS.find(d => d.id === user?.domain);
    const domainMembers = MEMBERS.filter(m => m.domain === user?.domain);
    const domainTasks = TASKS.filter(t => t.domain === user?.domain);
    const domainResources = RESOURCES.filter(r => r.domain === user?.domain);
    const domainAnnouncements = ANNOUNCEMENTS.filter(a => a.type === 'global' || a.domain === user?.domain);
    const domainEvents = EVENTS.filter(e => e.domain === user?.domain || e.domain === null);
    const allSubmissions = domainTasks.flatMap(t => t.submissions.map(s => ({ ...s, taskTitle: t.title, taskId: t.id })));
    const pendingSubmissions = allSubmissions.filter(s => s.status === 'submitted');

    // Interactive state
    const [reviewActions, setReviewActions] = useState({});
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [memberModal, setMemberModal] = useState(null);
    const [taskModal, setTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', deadline: '' });
    const [createdTasks, setCreatedTasks] = useState([]);
    const [resourceModal, setResourceModal] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', type: 'article', url: '' });
    const [addedResources, setAddedResources] = useState([]);
    const [actionFeedback, setActionFeedback] = useState('');

    const showFeedback = (msg) => { setActionFeedback(msg); setTimeout(() => setActionFeedback(''), 3000); };

    const handleReview = (submissionKey, action) => {
        setReviewActions(prev => ({ ...prev, [submissionKey]: action }));
        showFeedback(`Submission ${action}!`);
    };

    const handleFeedback = (key) => {
        if (!feedbackText.trim()) return;
        setReviewActions(prev => ({ ...prev, [key]: 'feedback' }));
        setFeedbackModal(null);
        setFeedbackText('');
        showFeedback('Feedback sent to member!');
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        setCreatedTasks(prev => [...prev, { ...newTask, id: `mt-${Date.now()}`, domain: user?.domain, assignedTo: domainMembers.map(m => m.id), assignedBy: user?.name, status: 'in-progress', submissions: [] }]);
        setNewTask({ title: '', description: '', priority: 'medium', deadline: '' });
        setTaskModal(false);
        showFeedback('Task created and assigned!');
    };

    const handleAddResource = (e) => {
        e.preventDefault();
        setAddedResources(prev => [...prev, { ...newResource, id: `res-${Date.now()}`, domain: user?.domain, addedBy: user?.name }]);
        setNewResource({ title: '', type: 'article', url: '' });
        setResourceModal(false);
        showFeedback('Resource added!');
    };

    const allTasks = [...domainTasks, ...createdTasks];
    const allResources = [...domainResources, ...addedResources];

    const tabs = ['overview', 'my members', 'tasks', 'reviews', 'resources', 'progress'];

    return (
        <div className="dashboard-layout">
            {actionFeedback && (
                <div style={{ position: 'fixed', top: 'var(--space-xl)', right: 'var(--space-xl)', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: '#fff', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, fontSize: '0.9rem', fontWeight: 600, animation: 'slideUp 0.3s ease' }}>
                    ✅ {actionFeedback}
                </div>
            )}

            <aside className="dashboard-sidebar">
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem' }}>
                        {user?.name?.charAt(0) || 'M'}
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{user?.name || 'Mentor'}</h4>
                    <span className="badge badge-purple" style={{ marginTop: 'var(--space-xs)' }}>Mentor</span>
                    <div style={{ fontSize: '0.75rem', color: domain?.color, marginTop: 'var(--space-xs)' }}>{domain?.icon} {domain?.name}</div>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-heading">Navigation</div>
                    {tabs.map(tab => (
                        <div key={tab} className={`sidebar-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                            <span className="link-icon">{
                                { overview: '📊', 'my members': '👥', tasks: '✅', reviews: '📝', resources: '📚', progress: '📈' }[tab]
                            }</span>
                            {tab}
                            {tab === 'reviews' && pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).length > 0 && (
                                <span style={{ marginLeft: 'auto', background: 'var(--accent-red)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).length}</span>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header">
                    <h1>Mentor Dashboard 🎓</h1>
                    <p>Domain: <strong style={{ color: domain?.color }}>{domain?.name || 'AI/ML'}</strong></p>
                </div>

                {/* ========== OVERVIEW ========== */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stat-grid">
                            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{domainMembers.length}</div><div className="stat-label">Assigned Members</div></div>
                            <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{allTasks.length}</div><div className="stat-label">Total Tasks</div></div>
                            <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-value" style={{ color: pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).length > 0 ? 'var(--accent-amber)' : undefined }}>{pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).length}</div><div className="stat-label">Pending Reviews</div></div>
                            <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{allResources.length}</div><div className="stat-label">Resources</div></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>👥 Assigned Members</h3>
                                {domainMembers.map(m => {
                                    const mp = m.totalTasks > 0 ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0;
                                    return (
                                        <div key={m.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: 'var(--space-sm)', cursor: 'pointer' }} onClick={() => setMemberModal(m)}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                                                <div>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.name}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block' }}>{m.year} • {m.branch}</span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-400)' }}>{mp}%</span>
                                            </div>
                                            <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${mp}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)' }}>📝 Pending Reviews</h3>
                                {pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).length === 0 ? (
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No pending reviews 🎉</p>
                                ) : pendingSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`]).slice(0, 3).map((s, i) => {
                                    const member = MEMBERS.find(m => m.id === s.memberId);
                                    return (
                                        <div key={i} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '3px solid var(--accent-amber)', marginBottom: 'var(--space-sm)' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{s.taskTitle}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>by {member?.name || 'Unknown'} • {s.date}</span>
                                            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                                <button className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={() => handleReview(`${s.taskId}-${s.memberId}`, 'approved')}>✓ Approve</button>
                                                <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={() => { setFeedbackModal(`${s.taskId}-${s.memberId}`); }}>💬 Feedback</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* ========== MY MEMBERS ========== */}
                {activeTab === 'my members' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>👥 Assigned Members ({domainMembers.length})</h3>
                        <table className="data-table">
                            <thead><tr><th>Name</th><th>Year</th><th>Branch</th><th>Tasks</th><th>Progress</th><th>Actions</th></tr></thead>
                            <tbody>
                                {domainMembers.map(m => {
                                    const mp = m.totalTasks > 0 ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0;
                                    return (
                                        <tr key={m.id}>
                                            <td style={{ fontWeight: 500 }}>{m.name}</td>
                                            <td>{m.year}</td>
                                            <td>{m.branch}</td>
                                            <td>{m.tasksCompleted}/{m.totalTasks}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                                    <div style={{ width: 60, height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${mp}%`, background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{mp}%</span>
                                                </div>
                                            </td>
                                            <td><button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => setMemberModal(m)}>View</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

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
                                        {[['Year', memberModal.year], ['Branch', memberModal.branch], ['Tasks Done', `${memberModal.tasksCompleted}/${memberModal.totalTasks}`], ['Joined', new Date(memberModal.joinedAt).toLocaleDateString()]].map(([label, val]) => (
                                            <div key={label} style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{label}</div>
                                                <div style={{ fontWeight: 600 }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== TASKS ========== */}
                {activeTab === 'tasks' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>✅ Task Management ({allTasks.length})</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setTaskModal(true)} disabled={settings.dashboardsFrozen}>+ New Task</button>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>Task</th><th>Priority</th><th>Deadline</th><th>Submissions</th><th>Status</th></tr></thead>
                            <tbody>
                                {allTasks.map(t => (
                                    <tr key={t.id}>
                                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                                        <td><span className={`badge ${t.priority === 'high' ? 'badge-pink' : 'badge-amber'}`}>{t.priority}</span></td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{new Date(t.deadline).toLocaleDateString()}</td>
                                        <td>{t.submissions.length}/{t.assignedTo.length}</td>
                                        <td><span className={`badge ${t.status === 'completed' ? 'badge-accent' : 'badge-primary'}`}>{t.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
                                            <input className="form-input" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Complete ML Assignment" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea className="form-textarea" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Task details..." rows={3} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Priority</label>
                                                <select className="form-select" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
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

                {/* ========== REVIEWS ========== */}
                {activeTab === 'reviews' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📝 Submission Reviews</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <span className="badge badge-amber">{allSubmissions.filter(s => !reviewActions[`${s.taskId}-${s.memberId}`] && s.status === 'submitted').length} pending</span>
                                <span className="badge badge-accent">{Object.values(reviewActions).filter(a => a === 'approved').length} approved</span>
                            </div>
                        </div>
                        {allSubmissions.length === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-2xl)' }}>No submissions yet</p>
                        ) : allSubmissions.map((s, i) => {
                            const key = `${s.taskId}-${s.memberId}`;
                            const action = reviewActions[key];
                            const member = MEMBERS.find(m => m.id === s.memberId);
                            return (
                                <div key={i} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: `1px solid ${action === 'approved' ? 'rgba(6,214,160,0.3)' : action === 'feedback' ? 'rgba(139,92,246,0.3)' : 'var(--border-color)'}`, borderLeft: `3px solid ${action === 'approved' ? 'var(--accent-cyan)' : action === 'feedback' ? 'var(--accent-purple)' : 'var(--accent-amber)'}`, marginBottom: 'var(--space-md)', opacity: action ? 0.7 : 1, transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{s.taskTitle}</h4>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>by {member?.name || 'Unknown'} • Submitted {s.date}</div>
                                        </div>
                                        {action ? (
                                            <span className={`badge ${action === 'approved' ? 'badge-accent' : 'badge-purple'}`}>{action}</span>
                                        ) : (
                                            <span className="badge badge-amber">pending</span>
                                        )}
                                    </div>
                                    {!action && (
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => handleReview(key, 'approved')}>✓ Approve</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setFeedbackModal(key)}>💬 Send Feedback</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {feedbackModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setFeedbackModal(null)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 450, width: '100%' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>💬 Send Feedback</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setFeedbackModal(null)}>✕</button>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Your feedback</label>
                                        <textarea className="form-textarea" value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Provide constructive feedback to the member..." rows={4} />
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleFeedback(feedbackModal)}>Send Feedback</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== RESOURCES ========== */}
                {activeTab === 'resources' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>📚 Learning Resources ({allResources.length})</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setResourceModal(true)} disabled={settings.dashboardsFrozen}>+ Add Resource</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
                            {allResources.map(res => (
                                <div key={res.id} style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{res.type}</span>
                                    <h4 style={{ fontSize: '0.95rem', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>{res.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>by {res.addedBy}</span>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Open →</a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {resourceModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={() => setResourceModal(false)}>
                                <div className="glass-card" style={{ padding: 'var(--space-2xl)', maxWidth: 450, width: '100%' }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                        <h3 style={{ fontSize: '1rem' }}>📚 Add Resource</h3>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setResourceModal(false)}>✕</button>
                                    </div>
                                    <form onSubmit={handleAddResource}>
                                        <div className="form-group">
                                            <label className="form-label">Title *</label>
                                            <input className="form-input" required value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} placeholder="Resource title" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-select" value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
                                                <option value="article">Article</option><option value="video">Video</option><option value="documentation">Documentation</option><option value="tutorial">Tutorial</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">URL *</label>
                                            <input className="form-input" required value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} placeholder="https://..." />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Resource</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== PROGRESS ========== */}
                {activeTab === 'progress' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>📈 Member Progress Overview</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                            {domainMembers.map(m => {
                                const mp = m.totalTasks > 0 ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0;
                                return (
                                    <div key={m.id} className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{m.name.charAt(0)}</div>
                                            <div>
                                                <h4 style={{ fontSize: '0.95rem' }}>{m.name}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{m.year} • {m.branch}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{m.tasksCompleted}/{m.totalTasks} tasks</span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: mp >= 75 ? 'var(--accent-cyan)' : mp >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{mp}%</span>
                                        </div>
                                        <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${mp}%`, background: mp >= 75 ? 'var(--gradient-accent)' : mp >= 50 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'var(--accent-red)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
                            <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>📊 Domain Summary</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-lg)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-400)' }}>{domainMembers.length}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Members</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{domainMembers.reduce((a, m) => a + m.tasksCompleted, 0)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Completed</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{domainMembers.reduce((a, m) => a + (m.totalTasks - m.tasksCompleted), 0)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Pending</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{Math.round(domainMembers.reduce((a, m) => a + (m.totalTasks > 0 ? (m.tasksCompleted / m.totalTasks) * 100 : 0), 0) / (domainMembers.length || 1))}%</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Avg Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
