const posts = [
  {
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&h=300&fit=crop&q=80',
    date: 'May 28, 2026',
    title: '5 Signs Your Water Heater Needs Replacing',
    excerpt: 'Unusual noises, rust-coloured water, and inconsistent temperatures are red flags. Here is what to look for before it fails completely.',
    readTime: '4 min read',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&q=80',
    date: 'May 14, 2026',
    title: 'How to Prevent Burst Pipes in KZN Winter',
    excerpt: 'Cold snaps in the Drakensberg region can cause unexpected pipe bursts. We break down the five steps every homeowner should take in April.',
    readTime: '6 min read',
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=300&fit=crop&q=80',
    date: 'Apr 30, 2026',
    title: 'Understanding Your Plumbing Certificate of Compliance',
    excerpt: 'A COC is legally required when selling property in South Africa. This guide covers what inspectors look for and how to prepare.',
    readTime: '5 min read',
  },
];

export default function OkuBlog() {
  return (
    <section id="blog" style={{ background: 'white', padding: '100px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1e4db3', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Blog
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Latest blog posts.
          </h2>
        </div>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {posts.map((post, i) => (
            <article key={i} style={{
              borderRadius: 20, overflow: 'hidden',
              border: '1.5px solid #f1f5f9',
              display: 'flex', flexDirection: 'column',
              background: 'white',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}>
              {/* Image */}
              <div style={{ position: 'relative', lineHeight: 0 }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 100, padding: '4px 12px',
                  fontSize: 11, fontWeight: 600, color: '#64748b',
                }}>{post.readTime}</div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, margin: '0 0 10px', letterSpacing: '0.04em' }}>
                  {post.date}
                </p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.35, letterSpacing: '-0.02em', flex: 1 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, margin: '0 0 20px' }}>
                  {post.excerpt}
                </p>
                <a href="#" style={{
                  fontSize: 13, fontWeight: 700, color: '#1e4db3',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                  borderBottom: '1.5px solid #f5e85e', paddingBottom: 1, alignSelf: 'flex-start',
                }}>
                  Read more &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


