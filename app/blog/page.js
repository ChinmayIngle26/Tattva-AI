'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BLOG_CATEGORIES } from '@/lib/data';
import { useContent } from '@/lib/contentContext';

export default function BlogPage() {
  const { blogs, loading } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) return <div className="page-top" style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;

  // Filter only published blogs for the public page
  const publishedBlogs = blogs.filter(b => b.status === 'published' || !b.status); // Fallback for old data

  const filtered = activeCategory === 'All'
    ? publishedBlogs
    : publishedBlogs.filter(b => b.category === activeCategory);

  return (
    <div className="page-top">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Knowledge Hub</span>
            <h1>Tattva <span className="text-gradient">Blog</span></h1>
            <p>Technical articles, tutorials, club updates, and industry insights from our community.</p>
          </div>

          {/* Category Tabs */}
          <div className="tabs" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: 'var(--space-2xl)' }}>
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="blog-grid">
            {filtered.map((blog, i) => (
              <Link href={`/blog/${blog.slug}`} key={blog.slug} className="blog-item glass-card">
                <div className="blog-item-header">
                  <span className={`badge ${blog.category === 'Tutorials' ? 'badge-primary' :
                    blog.category === 'Tech News' ? 'badge-purple' :
                      blog.category === 'Tattva Capital' ? 'badge-accent' : 'badge-primary'
                    }`}>
                    {blog.category}
                  </span>
                  <span className="blog-item-date">
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="blog-item-title">{blog.title}</h2>
                <p className="blog-item-excerpt">{blog.excerpt}</p>

                <div className="blog-item-tags">
                  {blog.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="blog-tag">#{tag}</span>
                  ))}
                </div>

                <div className="blog-item-footer">
                  <div className="blog-item-author">
                    <span className="author-emoji">{blog.authorAvatar}</span>
                    <span>{blog.author}</span>
                  </div>
                  <span className="blog-item-readtime">{blog.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📝</p>
              <p>No blogs in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-xl);
        }
        .blog-item {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          cursor: pointer;
        }
        .blog-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }
        .blog-item-date {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }
        .blog-item-title {
          font-size: 1.25rem;
          margin-bottom: var(--space-sm);
          line-height: 1.4;
        }
        .blog-item-excerpt {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          flex: 1;
          margin-bottom: var(--space-md);
        }
        .blog-item-tags {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
          margin-bottom: var(--space-md);
        }
        .blog-tag {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          padding: 0.2rem 0.5rem;
          background: var(--bg-glass);
          border-radius: var(--radius-sm);
        }
        .blog-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-color);
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }
        .blog-item-author {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .author-emoji {
          font-size: 1.2rem;
        }
        .blog-item-readtime {
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
