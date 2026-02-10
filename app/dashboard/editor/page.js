'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useContent } from '@/lib/contentContext';
import { ROLES, BLOG_CATEGORIES, DOMAINS } from '@/lib/data';

export default function EditorDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const {
        blogs, addBlog, updateBlog, deleteBlog,
        announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
        resources, addResource, deleteResource,
        siteContent, updateSiteContent
    } = useContent();

    const [activeTab, setActiveTab] = useState('blogs');
    const [notification, setNotification] = useState('');

    // Form States
    const [isCreatingBlog, setIsCreatingBlog] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '', category: 'Tutorials', domain: 'ai-ml', readTime: '5 min read', tags: '', featured: false });

    const [isCreatingAnn, setIsCreatingAnn] = useState(false);
    const [newAnn, setNewAnn] = useState({ title: '', message: '', priority: 'normal', type: 'domain', domain: 'ai-ml' });

    const [isAddingRes, setIsAddingRes] = useState(false);
    const [newRes, setNewRes] = useState({ title: '', type: 'Notes', domain: 'ai-ml', url: '#' });

    useEffect(() => {
        if (!loading && user && user.role !== ROLES.EDITOR) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.EDITOR) return null;

    const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };

    // --- BLOG HANDLERS ---
    const handleCreateBlog = (e, status = 'draft') => {
        e.preventDefault();
        const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const blogData = {
            ...newBlog,
            slug,
            author: user.name,
            authorAvatar: '✍️',
            tags: newBlog.tags.split(',').map(t => t.trim()),
            status: status // 'draft' or 'pending' (for approval)
        };
        addBlog(blogData);
        showNotif(`Blog saved as ${status}!`);
        setIsCreatingBlog(false);
        setNewBlog({ title: '', excerpt: '', content: '', category: 'Tutorials', domain: 'ai-ml', readTime: '5 min read', tags: '', featured: false });
    };

    const handleBlogStatus = (slug, status) => {
        updateBlog(slug, { status });
        showNotif(`Blog status updated to ${status}`);
    };

    const handleDeleteBlog = (slug) => {
        if (confirm('Delete this blog post?')) {
            deleteBlog(slug);
            showNotif('Blog deleted');
        }
    };

    // --- ANNOUNCEMENT HANDLERS ---
    const handleCreateAnn = (e, status = 'draft') => {
        e.preventDefault();
        addAnnouncement({ ...newAnn, author: user.name, status });
        showNotif(`Announcement saved as ${status}!`);
        setIsCreatingAnn(false);
        setNewAnn({ title: '', message: '', priority: 'normal', type: 'domain', domain: 'ai-ml' });
    };

    const handleDeleteAnn = (id) => {
        if (confirm('Delete this announcement?')) {
            deleteAnnouncement(id);
            showNotif('Announcement deleted');
        }
    };

    // --- RESOURCE HANDLERS ---
    const handleAddRes = (e) => {
        e.preventDefault();
        addResource({ ...newRes, addedBy: user.name });
        showNotif('Resource added to library');
        setIsAddingRes(false);
        setNewRes({ title: '', type: 'Notes', domain: 'ai-ml', url: '#' });
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-sm)', fontSize: '1.5rem' }}>
                        ✍️
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{user.name}</h4>
                    <span className="badge badge-accent" style={{ marginTop: 'var(--space-xs)' }}>Editor</span>
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-heading">Content Tools</div>
                    <div className={`sidebar-link ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>📝 Blogs</div>
                    <div className={`sidebar-link ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>📢 Announcements</div>
                    <div className={`sidebar-link ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>📚 Resources</div>
                    <div className={`sidebar-link ${activeTab === 'site' ? 'active' : ''}`} onClick={() => setActiveTab('site')}>🌐 Site Content</div>
                </div>
            </aside>

            <div className="dashboard-content">
                <div className="dash-header">
                    <h1>Editor Workspace</h1>
                    <p>Manage content, approvals, and site updates</p>
                </div>

                {notification && (
                    <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--accent-green)', color: 'white', padding: '10px 20px', borderRadius: '8px', zIndex: 1000, animation: 'slideIn 0.3s' }}>
                        ✅ {notification}
                    </div>
                )}

                {/* ============ BLOGS TAB ============ */}
                {activeTab === 'blogs' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>Blog Management</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsCreatingBlog(true)}>+ New Blog</button>
                        </div>

                        {isCreatingBlog ? (
                            <div style={{ background: 'var(--bg-glass)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                                <h4 style={{ marginBottom: 'var(--space-md)' }}>Create New Blog Post</h4>
                                <form>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select className="form-select" value={newBlog.category} onChange={e => setNewBlog({ ...newBlog, category: e.target.value })}>
                                                {BLOG_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Domain</label>
                                            <select className="form-select" value={newBlog.domain} onChange={e => setNewBlog({ ...newBlog, domain: e.target.value })}>
                                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Excerpt</label>
                                        <textarea className="form-textarea" rows={2} value={newBlog.excerpt} onChange={e => setNewBlog({ ...newBlog, excerpt: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Content</label>
                                        <textarea className="form-textarea" rows={6} value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tags</label>
                                        <input className="form-input" value={newBlog.tags} onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <button className="btn btn-secondary" onClick={(e) => handleCreateBlog(e, 'draft')}>Save Draft</button>
                                        <button className="btn btn-primary" onClick={(e) => handleCreateBlog(e, 'pending')}>Submit for Approval</button>
                                        <button className="btn btn-ghost" onClick={() => setIsCreatingBlog(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {blogs.map(b => (
                                        <tr key={b.slug}>
                                            <td style={{ fontWeight: 500 }}>{b.title}</td>
                                            <td>
                                                <span className={`badge ${b.status === 'published' ? 'badge-accent' :
                                                        b.status === 'pending' ? 'badge-amber' :
                                                            b.status === 'rejected' ? 'badge-pink' : 'badge-primary'
                                                    }`}>
                                                    {b.status || 'published'}
                                                </span>
                                            </td>
                                            <td>{b.author}</td>
                                            <td style={{ color: 'var(--text-tertiary)' }}>{b.date}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {b.status === 'draft' && <button className="btn btn-primary btn-sm" onClick={() => handleBlogStatus(b.slug, 'pending')}>Submit</button>}
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteBlog(b.slug)} style={{ color: 'var(--accent-red)' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ============ ANNOUNCEMENTS TAB ============ */}
                {activeTab === 'announcements' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>Announcement Drafts</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsCreatingAnn(true)}>+ New Draft</button>
                        </div>

                        {isCreatingAnn ? (
                            <div style={{ background: 'var(--bg-glass)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                                <form>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" value={newAnn.title} onChange={e => setNewAnn({ ...newAnn, title: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message</label>
                                        <textarea className="form-textarea" rows={3} value={newAnn.message} onChange={e => setNewAnn({ ...newAnn, message: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Priority</label>
                                            <select className="form-select" value={newAnn.priority} onChange={e => setNewAnn({ ...newAnn, priority: e.target.value })}>
                                                <option value="normal">Normal</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Target Domain</label>
                                            <select className="form-select" value={newAnn.domain} onChange={e => setNewAnn({ ...newAnn, domain: e.target.value })}>
                                                <option value={null}>Global (All)</option>
                                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <button className="btn btn-secondary" onClick={(e) => handleCreateAnn(e, 'draft')}>Save Draft</button>
                                        <button className="btn btn-primary" onClick={(e) => handleCreateAnn(e, 'pending')}>Submit for Approval</button>
                                        <button className="btn btn-ghost" onClick={() => setIsCreatingAnn(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead><tr><th>Title</th><th>Status</th><th>Type</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {announcements.map(a => (
                                        <tr key={a.id}>
                                            <td style={{ fontWeight: 500 }}>{a.title}</td>
                                            <td>
                                                <span className={`badge ${a.status === 'published' ? 'badge-accent' :
                                                        a.status === 'pending' ? 'badge-amber' :
                                                            a.status === 'rejected' ? 'badge-pink' : 'badge-primary'
                                                    }`}>
                                                    {a.status || 'published'}
                                                </span>
                                            </td>
                                            <td>{a.domain ? a.domain : 'Global'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {a.status === 'draft' && <button className="btn btn-primary btn-sm" onClick={() => updateAnnouncement(a.id, { status: 'pending' })}>Submit</button>}
                                                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteAnn(a.id)}>✕</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ============ RESOURCES TAB ============ */}
                {activeTab === 'resources' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>Resource Library</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsAddingRes(true)}>+ Add Resource</button>
                        </div>

                        {isAddingRes && (
                            <div style={{ background: 'var(--bg-glass)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                                <form>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" value={newRes.title} onChange={e => setNewRes({ ...newRes, title: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">URL</label>
                                        <input className="form-input" value={newRes.url} onChange={e => setNewRes({ ...newRes, url: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-select" value={newRes.type} onChange={e => setNewRes({ ...newRes, type: e.target.value })}>
                                                {['Notes', 'Video', 'GitHub', 'Article'].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Domain</label>
                                            <select className="form-select" value={newRes.domain} onChange={e => setNewRes({ ...newRes, domain: e.target.value })}>
                                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.shortName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleAddRes}>Add to Library</button>
                                    <button className="btn btn-ghost" onClick={() => setIsAddingRes(false)}>Cancel</button>
                                </form>
                            </div>
                        )}

                        <table className="data-table">
                            <thead><tr><th>Title</th><th>Type</th><th>Domain</th><th>Added By</th><th>Action</th></tr></thead>
                            <tbody>
                                {resources.map(r => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 500 }}>{r.title}</td>
                                        <td><span className="badge badge-secondary">{r.type}</span></td>
                                        <td>{r.domain}</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{r.addedBy}</td>
                                        <td><button className="btn btn-ghost btn-sm" onClick={() => deleteResource(r.id)} style={{ color: 'var(--accent-red)' }}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ============ SITE CONTENT TAB ============ */}
                {activeTab === 'site' && (
                    <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1rem' }}>Manage Site Content</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => showNotif("Changes saved globally!")}>Save All Changes</button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">About Us Page Content</label>
                            <textarea
                                className="form-textarea"
                                rows={4}
                                value={siteContent.aboutUs}
                                onChange={(e) => updateSiteContent('aboutUs', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contact Email</label>
                            <input
                                className="form-input"
                                value={siteContent.contactEmail}
                                onChange={(e) => updateSiteContent('contactEmail', e.target.value)}
                            />
                        </div>

                        <h4 style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>Domain Descriptions</h4>
                        {DOMAINS.map(d => (
                            <div key={d.id} className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label">{d.name}</label>
                                <textarea
                                    className="form-textarea"
                                    rows={2}
                                    value={siteContent.domainDescriptions[d.id] || d.description}
                                    onChange={(e) => updateSiteContent('domainDescriptions', e.target.value, d.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
