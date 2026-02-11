'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ROLES } from '@/lib/data';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/domains', label: 'Domains' },
    { href: '/blog', label: 'Blog' },
    { href: '/events', label: 'Events' },
    { href: '/join', label: 'Join Us' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Show maintenance page for non-DEV users
    const isMaintenanceBlocked = settings.maintenanceMode && user?.role !== ROLES.DEV && pathname !== '/login';

    return (
        <>
            {settings.maintenanceMode && (
                <div style={{ background: 'linear-gradient(90deg, #ef4444, #f59e0b)', color: '#fff', textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10001 }}>
                    🔴 MAINTENANCE MODE ACTIVE — Site functionality is limited
                    {user?.role === ROLES.DEV && <span style={{ opacity: 0.7, marginLeft: '1rem' }}>(Visible to DEV only)</span>}
                </div>
            )}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={settings.maintenanceMode ? { top: '30px' } : {}}>
                <div className="navbar-inner">
                    <Link href="/" className="navbar-logo">
                        <span className="logo-icon">T</span>
                        <span>Tattv<span className="text-gradient">.AI</span></span>
                    </Link>

                    <div className="navbar-links">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-actions">
                        {user ? (
                            <>
                                <Link href="/dashboard" className="btn btn-secondary btn-sm">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="btn btn-ghost btn-sm">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="btn btn-primary btn-sm">
                                Login
                            </Link>
                        )}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <span style={mobileOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
                            <span style={mobileOpen ? { opacity: 0 } : {}} />
                            <span style={mobileOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                {NAV_LINKS.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
                {user ? (
                    <>
                        <Link href="/dashboard" className="navbar-link">Dashboard</Link>
                        <button onClick={logout} className="navbar-link" style={{ textAlign: 'left' }}>Logout</button>
                    </>
                ) : (
                    <Link href="/login" className="navbar-link">Login</Link>
                )}
            </div>
        </>
    );
}
