'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // In a real app, you would fetch this data based on the id
  const blog = {
    id: id,
    title: 'The Future of Digital Democracy: How Online Voting is Changing the World',
    content: `
      <p class="mb-4">The landscape of democratic participation is undergoing a profound transformation. As digital technologies continue to evolve, online voting platforms are emerging as powerful tools that promise to make voting more accessible, transparent, and efficient than ever before.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Rise of Digital Voting</h2>
      <p class="mb-4">Traditional voting methods, while time-tested, face numerous challenges in our increasingly connected world. Long lines at polling stations, limited accessibility for people with disabilities, and the difficulty of voting while traveling or living abroad are just a few of the obstacles that digital voting aims to overcome.</p>
      
      <p class="mb-4">Online voting platforms like GlobalVote are revolutionizing the way we think about democratic participation. By leveraging cutting-edge encryption and identity verification technologies, these platforms ensure that votes are both secure and anonymous, addressing the primary concerns that have historically prevented widespread adoption of digital voting.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Key Benefits of Digital Voting</h2>
      <p class="mb-4">The advantages of digital voting are numerous and compelling:</p>
      
      <ul class="list-disc list-inside mb-4 space-y-2 ml-4">
        <li><strong>Increased Accessibility:</strong> People can vote from anywhere with an internet connection, eliminating geographical barriers.</li>
        <li><strong>Real-Time Results:</strong> Digital platforms can provide instant access to voting results, increasing transparency and engagement.</li>
        <li><strong>Cost Efficiency:</strong> Digital voting reduces the need for physical polling stations and paper ballots, significantly lowering costs.</li>
        <li><strong>Enhanced Security:</strong> Modern encryption and blockchain technologies provide robust protection against fraud and tampering.</li>
        <li><strong>Better Data Analytics:</strong> Digital platforms enable detailed analysis of voting patterns and trends.</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Addressing Security Concerns</h2>
      <p class="mb-4">One of the most significant barriers to the adoption of digital voting has been concerns about security and potential fraud. However, modern platforms are addressing these concerns through:</p>
      
      <ul class="list-disc list-inside mb-4 space-y-2 ml-4">
        <li>End-to-end encryption to protect vote integrity</li>
        <li>Identity verification (KYC) to ensure one vote per person</li>
        <li>Blockchain technology for immutable vote records</li>
        <li>Transparent audit trails that maintain voter anonymity</li>
        <li>Regular security audits and penetration testing</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Global Impact</h2>
      <p class="mb-4">Digital voting is already making a significant impact around the world. Countries and organizations are increasingly turning to digital platforms for elections, referendums, and decision-making processes. The ability to see real-time results from different countries and regions provides unprecedented insights into global opinions and trends.</p>
      
      <p class="mb-4">As we look to the future, digital voting platforms will continue to evolve, incorporating new technologies like artificial intelligence for fraud detection, biometric authentication for enhanced security, and improved user interfaces that make voting even more intuitive and accessible.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
      <p class="mb-4">The future of democracy is digital. While challenges remain, the benefits of digital voting platforms are clear: increased accessibility, enhanced security, real-time transparency, and better engagement with democratic processes. As these technologies continue to mature and gain public trust, we can expect to see digital voting become the norm rather than the exception.</p>
      
      <p class="mb-4">The transformation is already underway, and platforms like GlobalVote are leading the way in making democratic participation more accessible and transparent for everyone, everywhere.</p>
    `,
    author: 'Sarah Johnson',
    authorRole: 'Chief Technology Officer',
    authorBio: 'Sarah is a leading expert in digital democracy and voting technology with over 15 years of experience.',
    date: '2024-01-15',
    category: 'Technology',
    readTime: '5 min read',
    image: '/vote.png',
    tags: ['Digital Democracy', 'Voting Technology', 'Security', 'Accessibility']
  };

  const relatedBlogs = [
    {
      id: '2',
      title: 'Understanding Voting Anonymity: Privacy in the Digital Age',
      category: 'Privacy',
      readTime: '7 min read',
      image: '/verified.png'
    },
    {
      id: '4',
      title: 'Security in Voting Systems: Best Practices and Technologies',
      category: 'Security',
      readTime: '8 min read',
      image: '/global.png'
    },
    {
      id: '5',
      title: 'The Impact of Real-Time Voting Results on Public Engagement',
      category: 'Democracy',
      readTime: '5 min read',
      image: '/vote.png'
    },
  ];

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
          <Link href="/main/blogs" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
              <span className="text-sm text-gray-400">{blog.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 mb-8">
              <div>
                <p className="font-semibold text-white">{blog.author}</p>
                <p className="text-sm">{blog.authorRole}</p>
              </div>
              <span>•</span>
              <span>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="md:col-span-3">
              <div 
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
                style={{
                  '--tw-prose-headings': '#ffffff',
                  '--tw-prose-bold': '#ffffff',
                  '--tw-prose-links': '#60a5fa',
                } as React.CSSProperties}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <span className="text-sm font-bold">f</span>
                  </button>
                  <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="md:col-span-1">
              {/* Author Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8 sticky top-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold">{blog.author.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{blog.author}</h3>
                <p className="text-sm text-gray-400 text-center mb-4">{blog.authorRole}</p>
                <p className="text-sm text-gray-300 text-center">{blog.authorBio}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <Link key={relatedBlog.id} href={`/main/blogs/${relatedBlog.id}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition overflow-hidden cursor-pointer h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full text-xs font-semibold">
                        {relatedBlog.category}
                      </span>
                      <span className="text-xs text-gray-400">{relatedBlog.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2">{relatedBlog.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
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
