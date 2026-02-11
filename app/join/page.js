'use client';

import { useState } from 'react';
import { DOMAINS } from '@/lib/data';
import { useSettings } from '@/lib/settings';
import { useContent } from '@/lib/contentContext';

export default function JoinPage() {
    const [form, setForm] = useState({ name: '', email: '', branch: '', year: '', domain: '', motivation: '' });
    const [submitted, setSubmitted] = useState(false);
    const { settings } = useSettings();
    const { addJoinRequest } = useContent();

    const isDisabled = !settings.registrationsEnabled || !settings.joinRequestsEnabled;

    if (isDisabled) {
        return (
            <div className="page-top">
                <section className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
                    <div className="container">
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🔒</div>
                        <h1 style={{ marginBottom: 'var(--space-md)' }}>Registrations <span className="text-gradient">Closed</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto var(--space-xl)' }}>
                            {!settings.registrationsEnabled
                                ? 'New registrations are currently disabled by the administrator. Please check back later.'
                                : 'Join requests are currently paused. Please check back later.'}
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addJoinRequest(form);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="page-top">
                <section className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
                    <div className="container">
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎉</div>
                        <h1 style={{ marginBottom: 'var(--space-md)' }}>Application Submitted!</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto var(--space-xl)' }}>
                            Thank you for your interest in Tattv AI! Our team will review your application and get back to you soon.
                        </p>
                        <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', branch: '', year: '', domain: '', motivation: '' }); }}>
                            Submit Another
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-top">
            <section className="section">
                <div className="container" style={{ maxWidth: 700 }}>
                    <div className="section-header">
                        <span className="section-label">Get Started</span>
                        <h1>Join <span className="text-gradient">Tattv AI</span></h1>
                        <p>Fill out the form below and take the first step towards building the future.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Branch *</label>
                                <select className="form-select" required value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                                    <option value="">Select branch</option>
                                    <option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option><option>MECH</option><option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Year *</label>
                                <select className="form-select" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                                    <option value="">Select year</option>
                                    <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preferred Domain *</label>
                            <select className="form-select" required value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })}>
                                <option value="">Select domain</option>
                                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Why do you want to join? *</label>
                            <textarea className="form-textarea" required value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })} placeholder="Tell us about your motivation and what you hope to learn..." rows={4} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Submit Application →</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
