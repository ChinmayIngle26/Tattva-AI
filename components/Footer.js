import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                            <span style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'white', fontWeight: 900 }}>T</span>
                            Tattv <span className="text-gradient">AI</span>
                        </Link>
                        <p>A student-driven technical club fostering innovation in AI, Web Development, and Android. Building the next generation of tech leaders.</p>
                        <div className="footer-socials" style={{ marginTop: '1rem' }}>
                            <a href="#" aria-label="GitHub">⌨</a>
                            <a href="#" aria-label="LinkedIn">🔗</a>
                            <a href="#" aria-label="Twitter">✕</a>
                            <a href="#" aria-label="Instagram">📷</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Quick Links</h4>
                        <div className="footer-links">
                            <Link href="/">Home</Link>
                            <Link href="/about">About</Link>
                            <Link href="/domains">Domains</Link>
                            <Link href="/blog">Blog</Link>
                            <Link href="/events">Events</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Domains</h4>
                        <div className="footer-links">
                            <Link href="/domains#ai-ml">AI / Machine Learning</Link>
                            <Link href="/domains#web-dev">Web Development</Link>
                            <Link href="/domains#android-dev">Android Development</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Get Involved</h4>
                        <div className="footer-links">
                            <Link href="/join">Join the Club</Link>
                            <Link href="/events">Upcoming Events</Link>
                            <Link href="/blog">Read Blogs</Link>
                            <Link href="/login">Member Login</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Tattv AI. All rights reserved.</p>
                    <p>Built with 💜 by the Tattv Web Dev Team</p>
                </div>
            </div>
        </footer>
    );
}
