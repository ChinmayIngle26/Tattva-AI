'use client';

import Link from 'next/link';
import { DOMAINS, TEAM_LEADS, FACULTY, BLOGS } from '@/lib/data';

export default function HomePage() {
  const featuredBlogs = BLOGS.filter(b => b.featured).slice(0, 3);

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-pattern" />
        </div>
        <div className="container hero-content">
          <div className="animate-fade-in-up">
            <span className="hero-badge">🚀 Student-Driven Technical Club</span>
          </div>
          <h1 className="hero-title animate-fade-in-up delay-1">
            Build the Future with<br />
            <span className="text-gradient">Tattv AI</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up delay-2">
            Explore AI/ML, Web Development, and Android — through workshops,
            projects, mentorship, and a community of passionate tech enthusiasts.
          </p>
          <div className="hero-actions animate-fade-in-up delay-3">
            <Link href="/join" className="btn btn-primary btn-lg">
              Join the Club →
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
          <div className="hero-stats animate-fade-in-up delay-4">
            <div className="hero-stat">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">Members</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">3</span>
              <span className="hero-stat-label">Domains</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">20+</span>
              <span className="hero-stat-label">Events</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">10+</span>
              <span className="hero-stat-label">Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Who We Are</span>
            <h2>About <span className="text-gradient">Tattv AI</span></h2>
            <p>A community of builders, thinkers, and innovators united by a passion for technology.</p>
          </div>
          <div className="about-grid">
            <div className="about-card glass-card">
              <div className="about-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To create a collaborative learning environment where students can explore cutting-edge technologies, build real-world projects, and develop industry-ready skills.</p>
            </div>
            <div className="about-card glass-card">
              <div className="about-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>To become the leading student technical community, producing innovators who push the boundaries of what&apos;s possible with technology.</p>
            </div>
            <div className="about-card glass-card">
              <div className="about-icon">💡</div>
              <h3>Our Approach</h3>
              <p>Hands-on learning through workshops, hackathons, mentorship programs, and collaborative projects — because the best way to learn is by building.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Domains Section ── */}
      <section className="section section-alt" id="domains">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Do</span>
            <h2>Our <span className="text-gradient">Domains</span></h2>
            <p>Three specialized tracks, each led by experienced students and mentors.</p>
          </div>
          <div className="grid-3">
            {DOMAINS.map((domain, i) => (
              <div key={domain.id} className={`domain-card glass-card animate-fade-in-up delay-${i + 1}`}>
                <div className="domain-card-header" style={{ borderColor: domain.color }}>
                  <span className="domain-icon">{domain.icon}</span>
                  <h3>{domain.name}</h3>
                </div>
                <p className="domain-desc">{domain.description.slice(0, 120)}...</p>
                <div className="domain-meta">
                  <span className="badge" style={{ background: `${domain.color}20`, color: domain.color, border: `1px solid ${domain.color}40` }}>
                    {domain.lead.name} — Lead
                  </span>
                </div>
                <Link href={`/domains#${domain.id}`} className="btn btn-ghost" style={{ marginTop: 'auto', color: domain.color }}>
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="section" id="team">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our People</span>
            <h2>Meet the <span className="text-gradient">Team</span></h2>
            <p>The leaders and mentors driving Tattv AI forward.</p>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Domain Leads</h3>
          <div className="grid-3" style={{ marginBottom: 'var(--space-3xl)' }}>
            {TEAM_LEADS.map((lead, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-avatar" style={{ background: `${lead.color}20`, borderColor: lead.color }}>
                  <span>{lead.avatar}</span>
                </div>
                <h4>{lead.name}</h4>
                <p className="team-role">{lead.domain} Lead</p>
                <p className="team-info">{lead.year}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Faculty Coordinators</h3>
          <div className="grid-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {FACULTY.map((f, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-avatar" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' }}>
                  <span>{f.avatar}</span>
                </div>
                <h4>{f.name}</h4>
                <p className="team-role">{f.title}</p>
                <p className="team-info">{f.department}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Blogs ── */}
      <section className="section section-alt" id="blogs">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Knowledge Hub</span>
            <h2>Latest <span className="text-gradient">Blogs</span></h2>
            <p>Technical articles, tutorials, and updates from our community.</p>
          </div>
          <div className="grid-3">
            {featuredBlogs.map((blog, i) => (
              <Link href={`/blog/${blog.slug}`} key={blog.slug} className={`blog-card glass-card animate-fade-in-up delay-${i + 1}`}>
                <div className="blog-card-top">
                  <span className="badge badge-primary">{blog.category}</span>
                  <span className="blog-date">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt.slice(0, 100)}...</p>
                <div className="blog-card-footer">
                  <span className="blog-author">{blog.authorAvatar} {blog.author}</span>
                  <span className="blog-read-time">{blog.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/blog" className="btn btn-secondary">View All Blogs →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2>Ready to Build the Future?</h2>
            <p>Join Tattv AI and be part of a community that&apos;s shaping the next generation of technology.</p>
            <div className="cta-actions">
              <Link href="/join" className="btn btn-primary btn-lg">Apply Now →</Link>
              <Link href="/events" className="btn btn-secondary btn-lg">Explore Events</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding-top: var(--nav-height);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 8s ease-in-out infinite;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          background: rgba(66, 102, 245, 0.12);
          top: 10%; left: 5%;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: rgba(139, 92, 246, 0.1);
          top: 30%; right: 10%;
          animation-delay: -3s;
        }
        .hero-orb-3 {
          width: 350px; height: 350px;
          background: rgba(236, 72, 153, 0.08);
          bottom: 10%; left: 30%;
          animation-delay: -5s;
        }
        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: var(--space-4xl) 0;
        }
        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          background: rgba(66, 102, 245, 0.1);
          border: 1px solid rgba(66, 102, 245, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--primary-300);
          margin-bottom: var(--space-xl);
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: var(--space-xl);
          letter-spacing: -0.03em;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 650px;
          margin: 0 auto var(--space-2xl);
          line-height: 1.7;
        }
        .hero-actions {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: var(--space-3xl);
        }
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: var(--font-display);
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-stat-label {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        /* Section alt bg */
        .section-alt {
          background: var(--bg-secondary);
        }

        /* About */
        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-xl);
        }
        .about-card {
          padding: var(--space-2xl);
          text-align: center;
        }
        .about-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
        }
        .about-card h3 {
          font-size: 1.2rem;
          margin-bottom: var(--space-sm);
        }
        .about-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* Domain cards */
        .domain-card {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          min-height: 300px;
        }
        .domain-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 2px solid;
        }
        .domain-icon {
          font-size: 2rem;
        }
        .domain-card-header h3 {
          font-size: 1.15rem;
        }
        .domain-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: var(--space-md);
          flex: 1;
        }
        .domain-meta {
          margin-bottom: var(--space-sm);
        }

        /* Team cards */
        .team-card {
          padding: var(--space-xl);
          text-align: center;
        }
        .team-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto var(--space-md);
          border: 2px solid;
        }
        .team-card h4 {
          font-size: 1.05rem;
          margin-bottom: var(--space-xs);
        }
        .team-role {
          font-size: 0.85rem;
          color: var(--primary-400);
          font-weight: 500;
        }
        .team-info {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin-top: var(--space-xs);
        }

        /* Blog cards */
        .blog-card {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        .blog-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }
        .blog-date {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }
        .blog-title {
          font-size: 1.15rem;
          margin-bottom: var(--space-sm);
          line-height: 1.4;
        }
        .blog-excerpt {
          font-size: 0.9rem;
          color: var(--text-secondary);
          flex: 1;
          margin-bottom: var(--space-md);
        }
        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-tertiary);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-color);
        }
        .blog-author {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .blog-read-time {
          font-weight: 500;
        }

        /* CTA */
        .cta-section {
          padding: var(--space-4xl) 0;
        }
        .cta-card {
          position: relative;
          text-align: center;
          padding: var(--space-4xl) var(--space-2xl);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(66,102,245,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-card h2 {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          margin-bottom: var(--space-md);
          position: relative;
        }
        .cta-card p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto var(--space-2xl);
          position: relative;
        }
        .cta-actions {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: var(--space-md); }
          .hero-stat-divider { display: none; }
        }
      `}</style>
    </>
  );
}
