'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ROLES } from '@/lib/data';
import MemberDashboard from './member/page';
import MentorDashboard from './mentor/page';
import LeadDashboard from './lead/page';
import FacultyDashboard from './faculty/page';
import DevDashboard from './dev/page';
import EditorDashboard from './editor/page';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="page-top" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)', animation: 'float 2s ease-in-out infinite' }}>⚡</div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // Maintenance mode blocks non-DEV users
    if (settings.maintenanceMode && user.role !== ROLES.DEV) {
        return (
            <div className="page-top" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: 500 }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🔧</div>
                    <h1 style={{ marginBottom: 'var(--space-md)' }}>Under <span className="text-gradient">Maintenance</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        The dashboard is temporarily unavailable for maintenance. Please check back shortly.
                    </p>
                </div>
            </div>
        );
    }

    // Frozen dashboards show read-only banner for non-DEV users
    const FrozenBanner = () => settings.dashboardsFrozen && user.role !== ROLES.DEV ? (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-amber)' }}>Dashboard Frozen</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>All actions are temporarily disabled by the administrator. You can still view data.</span>
            </div>
        </div>
    ) : null;

    const renderDashboard = () => {
        switch (user.role) {
            case ROLES.DEV: return <DevDashboard />;
            case ROLES.LEAD: return <LeadDashboard />;
            case ROLES.MENTOR: return <MentorDashboard />;
            case ROLES.EDITOR: return <EditorDashboard />;
            case ROLES.MEMBER: return <MemberDashboard />;
            case ROLES.FACULTY: return <FacultyDashboard />;
            default: return <MemberDashboard />;
        }
    };

    return (
        <>
            {settings.dashboardsFrozen && user.role !== ROLES.DEV && (
                <div style={{ pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 5 }}>
                        <FrozenBanner />
                    </div>
                    {renderDashboard()}
                </div>
            )}
            {(!settings.dashboardsFrozen || user.role === ROLES.DEV) && renderDashboard()}
        </>
    );
}
