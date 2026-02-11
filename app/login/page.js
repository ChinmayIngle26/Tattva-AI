'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ROLES, ROLE_LABELS, DEMO_USERS } from '@/lib/data';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginAsRole } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        // Block non-DEV logins when loginDisabled
        if (settings.loginDisabled) {
            const found = DEMO_USERS.find(u => u.email === email && u.password === password);
            if (!found || found.role !== ROLES.DEV) {
                setError('All logins are currently disabled by the administrator. Only DEV accounts can access the system.');
                return;
            }
        }
        const result = login(email, password);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleQuickLogin = (role) => {
        if (settings.loginDisabled) {
            setError('All logins are currently disabled by the administrator.');
            return;
        }
        const result = loginAsRole(role);
        if (result.success) router.push('/dashboard');
    };

    const visibleRoles = [ROLES.LEAD, ROLES.MENTOR, ROLES.MEMBER, ROLES.FACULTY];

    return (
        <div className="page-top">
            <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="container" style={{ maxWidth: 480 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Welcome <span className="text-gradient">Back</span></h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your dashboard</p>
                    </div>

                    {settings.loginDisabled && (
                        <div style={{ padding: 'var(--space-md) var(--space-lg)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>🔒</span>
                            <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', fontWeight: 600, marginTop: 'var(--space-xs)' }}>Logins Currently Disabled</p>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Only DEV accounts can sign in</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
                        {error && (
                            <div style={{ padding: 'var(--space-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                                {error}
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@tattv.ai" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-lg)' }}>Sign In →</button>

                        <div style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-lg) 0' }}>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border-color)' }} />
                            <span style={{ position: 'relative', background: 'var(--bg-card)', padding: '0 var(--space-md)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Quick Demo Login</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', opacity: settings.loginDisabled ? 0.4 : 1, pointerEvents: settings.loginDisabled ? 'none' : 'auto' }}>
                            {visibleRoles.map(role => (
                                <button key={role} type="button" className="btn btn-secondary btn-sm" onClick={() => handleQuickLogin(role)}>
                                    {ROLE_LABELS[role]}
                                </button>
                            ))}
                        </div>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                            Demo credentials: <code style={{ color: 'var(--text-secondary)', background: 'var(--bg-glass)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>role@tattv.ai / role123</code>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
