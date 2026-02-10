'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BLOGS } from '@/lib/data';

export default function BlogPostPage() {
    const { slug } = useParams();
    const blog = BLOGS.find(b => b.slug === slug);

    if (!blog) {
        return (
            <div className="page-top" style={{ textAlign: 'center', padding: 'var(--space-4xl)' }}>
                <div className="container">
                    <h1>Blog not found</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-md) 0' }}>The blog post you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/blog" className="btn btn-primary">← Back to Blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-top">
            <article className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)', transition: 'color 0.2s' }}>
                        ← Back to Blog
                    </Link>

                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <span className={`badge ${blog.category === 'Tutorials' ? 'badge-primary' :
                                blog.category === 'Tech News' ? 'badge-purple' :
                                    'badge-accent'
                            }`} style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}>
                            {blog.category}
                        </span>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>
                            {blog.title}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>
                            {blog.excerpt}
                        </p>
                    </div>

                    <div className="blog-meta glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                            <span style={{ fontSize: '2rem' }}>{blog.authorAvatar}</span>
                            <div>
                                <div style={{ fontWeight: 600 }}>{blog.author}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                            <span>📖 {blog.readTime}</span>
                        </div>
                    </div>

                    <div className="blog-body" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 2 }}>
                        <p>{blog.content}</p>
                        <br />
                        <p>
                            This is a preview of the full blog post. In the production version, this would contain the complete
                            article with rich formatting, code blocks, images, and more.
                        </p>
                        <br />
                        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)', background: 'rgba(66, 102, 245, 0.05)', borderColor: 'rgba(66, 102, 245, 0.15)' }}>
                            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.1rem' }}>💡 Key Takeaways</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                                    <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>→</span>
                                    Understanding the fundamentals is crucial for building advanced systems
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                                    <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>→</span>
                                    Practice with real-world projects to solidify your knowledge
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                                    <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>→</span>
                                    Stay updated with the latest developments in the field
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-2xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--border-color)' }}>
                        {blog.tags.map(tag => (
                            <span key={tag} style={{ padding: '0.3rem 0.8rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}
