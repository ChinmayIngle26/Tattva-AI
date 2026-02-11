'use client';

import Link from 'next/link';
import { useContent } from '@/lib/contentContext';

const ACHIEVEMENTS = [
    { icon: '🏆', title: 'Hackathon Winners', desc: 'Multiple teams placing in inter-college hackathons' },
    { icon: '📊', title: 'Research Publications', desc: 'Student-led papers published in AI and ML conferences' },
    { icon: '🚀', title: '10+ Projects', desc: 'Real-world projects from chatbots to mobile apps' },
    { icon: '🎓', title: 'Industry Placements', desc: 'Members placed at top tech companies' },
];

const TIMELINE = [
    { year: '2024', title: 'Club Founded', desc: 'Tattv.AI was established with a vision to democratize tech education on campus.' },
    { year: '2024', title: 'First Workshop Series', desc: 'Launched our inaugural "Introduction to AI" workshop series with 40+ participants.' },
    { year: '2025', title: 'Three Domains Established', desc: 'Expanded to cover AI/ML, Web Development, and Android Development domains.' },
    { year: '2025', title: 'First Hackathon', desc: 'Organized Tattv Hackathon with 50+ participants and 12 competing teams.' },
    { year: '2026', title: 'Growing Community', desc: '50+ active members, mentorship programs, and regular industry collaborations.' },
];

export default function AboutPage() {
    const { siteContent, loading } = useContent();

    if (loading) return <div className="page-top" style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;

    return (
        <div className="page-top">
            {/* Header */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">About Us</span>
                        <h1>The Story of <span className="text-gradient">Tattv.AI</span></h1>
                        <p>From a small group of tech enthusiasts to a thriving community of innovators — here&apos;s our journey.</p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="about-story">
                        <div className="story-content glass-card" style={{ padding: 'var(--space-2xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Our Story</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                                {siteContent.aboutUs}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Our Goals</span>
                        <h2>What We <span className="text-gradient">Strive For</span></h2>
                    </div>
                    <div className="objectives-grid">
                        {[
                            { icon: '📚', title: 'Continuous Learning', desc: 'Create an environment of ongoing technical education through workshops, bootcamps, and peer learning sessions.' },
                            { icon: '🔨', title: 'Hands-On Building', desc: 'Focus on practical, project-based learning — because the best way to learn technology is by building with it.' },
                            { icon: '🤝', title: 'Community & Mentorship', desc: 'Foster a supportive community where experienced members guide newcomers through structured mentorship.' },
                            { icon: '🌍', title: 'Industry Readiness', desc: 'Bridge the gap between academic knowledge and industry demands through real-world projects and collaborations.' },
                        ].map((obj, i) => (
                            <div key={i} className="objective-card glass-card" style={{ padding: 'var(--space-xl)' }}>
                                <span style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)', display: 'block' }}>{obj.icon}</span>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-sm)' }}>{obj.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{obj.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Our Journey</span>
                        <h2>Club <span className="text-gradient">Timeline</span></h2>
                    </div>
                    <div className="timeline">
                        {TIMELINE.map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-marker">
                                    <div className="timeline-dot" />
                                    {i < TIMELINE.length - 1 && <div className="timeline-line" />}
                                </div>
                                <div className="timeline-content glass-card" style={{ padding: 'var(--space-lg)' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: 'var(--space-sm)' }}>{item.year}</span>
                                    <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-xs)' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Milestones</span>
                        <h2>Our <span className="text-gradient">Achievements</span></h2>
                    </div>
                    <div className="grid-4">
                        {ACHIEVEMENTS.map((a, i) => (
                            <div key={i} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-sm)' }}>{a.icon}</span>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-xs)' }}>{a.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: 'var(--space-md)' }}>Want to be part of our story?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem' }}>
                        Join Tattv.AI and help us write the next chapter.
                    </p>
                    <Link href="/join" className="btn btn-primary btn-lg">Join Tattv.AI →</Link>
                </div>
            </section>

            <style jsx>{`
        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-xl);
        }
        .timeline {
          max-width: 700px;
          margin: 0 auto;
        }
        .timeline-item {
          display: flex;
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
        }
        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .timeline-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--gradient-primary);
          box-shadow: 0 0 12px rgba(66, 102, 245, 0.4);
          flex-shrink: 0;
          margin-top: 6px;
        }
        .timeline-line {
          width: 2px;
          flex: 1;
          background: var(--border-color);
          margin-top: var(--space-sm);
        }
        .timeline-content {
          flex: 1;
        }
        @media (max-width: 768px) {
          .objectives-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}
