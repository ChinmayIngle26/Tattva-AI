'use client';

import { DOMAINS } from '@/lib/data';

export default function DomainsPage() {
    return (
        <div className="page-top">
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Explore</span>
                        <h1>Our <span className="text-gradient">Domains</span></h1>
                        <p>Three specialized tracks, each designed to take you from beginner to industry-ready.</p>
                    </div>

                    <div className="domains-list">
                        {DOMAINS.map((domain, idx) => (
                            <div key={domain.id} id={domain.id} className="domain-detail glass-card">
                                <div className="domain-detail-header" style={{ borderLeftColor: domain.color }}>
                                    <div className="domain-detail-icon" style={{ background: `${domain.color}15`, color: domain.color }}>
                                        {domain.icon}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.6rem' }}>{domain.name}</h2>
                                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                                            Led by <strong style={{ color: domain.color }}>{domain.lead.name}</strong> • {domain.lead.year}
                                        </p>
                                    </div>
                                </div>

                                <p className="domain-detail-desc">{domain.description}</p>

                                <div className="domain-detail-grid">
                                    <div className="domain-detail-section">
                                        <h3>
                                            <span style={{ marginRight: '0.5rem' }}>📖</span>
                                            What You&apos;ll Learn
                                        </h3>
                                        <ul className="learning-list">
                                            {domain.learningOutcomes.map((item, i) => (
                                                <li key={i}>
                                                    <span className="learning-check" style={{ color: domain.color }}>✓</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="domain-detail-section">
                                        <h3>
                                            <span style={{ marginRight: '0.5rem' }}>👥</span>
                                            Mentors
                                        </h3>
                                        <div className="mentors-list">
                                            {domain.mentors.map((mentor, i) => (
                                                <div key={i} className="mentor-chip">
                                                    <span className="mentor-avatar">{mentor.avatar}</span>
                                                    <div>
                                                        <span className="mentor-name">{mentor.name}</span>
                                                        <span className="mentor-specialty">{mentor.specialty}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {idx < DOMAINS.length - 1 && <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 -2rem' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
        .domains-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
          max-width: 900px;
          margin: 0 auto;
        }
        .domain-detail {
          padding: var(--space-2xl);
        }
        .domain-detail-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          padding-left: var(--space-lg);
          border-left: 4px solid;
        }
        .domain-detail-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }
        .domain-detail-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: var(--space-xl);
        }
        .domain-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
        }
        .domain-detail-section h3 {
          font-size: 1.05rem;
          margin-bottom: var(--space-md);
          display: flex;
          align-items: center;
        }
        .learning-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .learning-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .learning-check {
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .mentors-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .mentor-chip {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .mentor-avatar {
          font-size: 1.8rem;
        }
        .mentor-name {
          display: block;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .mentor-specialty {
          display: block;
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }
        @media (max-width: 768px) {
          .domain-detail-grid { grid-template-columns: 1fr; }
          .domain-detail { padding: var(--space-lg); }
        }
      `}</style>
        </div>
    );
}
