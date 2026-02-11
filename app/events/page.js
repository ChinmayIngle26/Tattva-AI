'use client';

import { useState } from 'react';
import { EVENTS, DOMAINS } from '@/lib/data';

export default function EventsPage() {
    const [filter, setFilter] = useState('upcoming');
    const filtered = EVENTS.filter(e => filter === 'all' ? true : e.status === filter);

    const getTypeColor = (type) => {
        const map = { Workshop: 'badge-primary', Hackathon: 'badge-pink', Bootcamp: 'badge-purple' };
        return map[type] || 'badge-primary';
    };

    const getDomainName = (id) => {
        if (!id) return 'All Domains';
        return DOMAINS.find(d => d.id === id)?.shortName || id;
    };

    return (
        <div className="page-top">
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Stay Updated</span>
                        <h1>Events & <span className="text-gradient">Workshops</span></h1>
                        <p>Workshops, hackathons, bootcamps — always something happening at Tattv AI.</p>
                    </div>
                    <div className="tabs" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: 'var(--space-2xl)' }}>
                        {['upcoming', 'past', 'all'].map(f => (
                            <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: 900, margin: '0 auto' }}>
                        {filtered.map(ev => (
                            <div key={ev.id} className="glass-card" style={{ display: 'flex', gap: 'var(--space-xl)', padding: 'var(--space-xl)', alignItems: 'flex-start' }}>
                                <div style={{ flexShrink: 0, width: 80, textAlign: 'center', padding: 'var(--space-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                    <span className="text-gradient" style={{ display: 'block', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{new Date(ev.date).getDate()}</span>
                                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                                        <span className={`badge ${getTypeColor(ev.type)}`}>{ev.type}</span>
                                        <span className="badge badge-accent">{getDomainName(ev.domain)}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>{ev.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>{ev.description}</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                                        <span>🕐 {ev.time}</span>
                                        <span>📍 {ev.location}</span>
                                        {ev.speaker && <span>🎤 {ev.speaker}</span>}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ maxWidth: 250, flex: 1 }}>
                                            <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 4 }}>
                                                <div style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)', width: `${(ev.registeredCount / ev.maxCapacity) * 100}%` }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{ev.registeredCount}/{ev.maxCapacity} registered</span>
                                        </div>
                                        {ev.status === 'upcoming' && <button className="btn btn-primary btn-sm">Register →</button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
                                <p style={{ fontSize: '2rem' }}>📅</p>
                                <p>No events found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
