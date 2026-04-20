'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BlogsPage() {
  const blogs = [
    {
      id: '1',
      title: 'The Future of Digital Democracy: How Online Voting is Changing the World',
      excerpt: 'Explore how digital voting platforms are revolutionizing democratic participation and making voting more accessible than ever before.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      category: 'Technology',
      readTime: '5 min read',
      image: '/vote.png'
    },
    {
      id: '2',
      title: 'Understanding Voting Anonymity: Privacy in the Digital Age',
      excerpt: 'Learn about the importance of anonymous voting and how modern technology ensures your privacy while maintaining transparency.',
      author: 'Michael Chen',
      date: '2024-01-10',
      category: 'Privacy',
      readTime: '7 min read',
      image: '/verified.png'
    },
    {
      id: '3',
      title: 'Global Voting Trends: What Countries Are Leading the Way?',
      excerpt: 'A comprehensive analysis of voting participation rates and trends across different countries and regions worldwide.',
      author: 'Emma Rodriguez',
      date: '2024-01-05',
      category: 'Analysis',
      readTime: '6 min read',
      image: '/countries.png'
    },
    {
      id: '4',
      title: 'Security in Voting Systems: Best Practices and Technologies',
      excerpt: 'Discover the cutting-edge security measures that protect voting integrity and ensure fair, tamper-proof elections.',
      author: 'David Kim',
      date: '2023-12-28',
      category: 'Security',
      readTime: '8 min read',
      image: '/global.png'
    },
    {
      id: '5',
      title: 'The Impact of Real-Time Voting Results on Public Engagement',
      excerpt: 'How instant access to voting results is increasing civic engagement and transparency in democratic processes.',
      author: 'Lisa Anderson',
      date: '2023-12-20',
      category: 'Democracy',
      readTime: '5 min read',
      image: '/vote.png'
    },
    {
      id: '6',
      title: 'Building Trust in Digital Voting: A Guide for Organizations',
      excerpt: 'Learn how organizations can implement secure, transparent voting systems that build trust with their members.',
      author: 'James Wilson',
      date: '2023-12-15',
      category: 'Business',
      readTime: '6 min read',
      image: '/verified.png'
    },
  ];

  const categories = ['All', 'Technology', 'Privacy', 'Analysis', 'Security', 'Democracy', 'Business'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Purple-blue glow */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl -z-0"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)'
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Blog & <span className="text-white">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Stay informed about digital democracy, voting technology, and global trends.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href={`/main/blogs/${blogs[0].id}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition overflow-hidden cursor-pointer">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={blogs[0].image}
                    alt={blogs[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full text-xs font-semibold">
                      {blogs[0].category}
                    </span>
                    <span className="text-sm text-gray-400">{blogs[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{blogs[0].title}</h2>
                  <p className="text-gray-300 mb-4">{blogs[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{blogs[0].author}</span>
                    <span>•</span>
                    <span>{new Date(blogs[0].date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(1).map((blog) => (
              <Link key={blog.id} href={`/main/blogs/${blog.id}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition overflow-hidden cursor-pointer h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full text-xs font-semibold">
                        {blog.category}
                      </span>
                      <span className="text-xs text-gray-400">{blog.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8">
              Get the latest articles, insights, and updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg transition font-semibold hover:from-blue-500 hover:to-purple-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Navigation Links */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <a href="/main/about" className="hover:text-white transition">About</a>
              <span className="text-gray-500">|</span>
              <a href="/main/how-it-works" className="hover:text-white transition">How It Works</a>
              <span className="text-gray-500">|</span>
              <a href="/main/blogs" className="hover:text-white transition">Blog</a>
              <span className="text-gray-500">|</span>
              <a href="/main/support" className="hover:text-white transition">Support</a>
              <span className="text-gray-500">|</span>
              <a href="/main/terms" className="hover:text-white transition">Terms</a>
              <span className="text-gray-500">|</span>
              <a href="/main/privacy" className="hover:text-white transition">Privacy</a>
              <span className="text-gray-500">|</span>
              <a href="/main/api" className="hover:text-white transition">API</a>
            </div>
          </div>
          
          {/* Bottom Section: Copyright and Social Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} GlobalVote</span>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
