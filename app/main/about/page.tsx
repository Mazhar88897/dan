'use client';

import Image from 'next/image';

export default function AboutPage() {
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
              About <span className="text-white">GlobalVote</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering global democracy through transparent, secure, and accessible voting platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To create a global platform where every voice matters. We believe in democratizing access to voting and opinion-sharing, making it possible for people worldwide to participate in meaningful discussions and decisions that shape our collective future.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                A world where transparent, secure, and accessible voting is the norm. We envision a future where geographical boundaries don't limit participation, and every individual can contribute to global conversations and decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Transparency', 
                description: 'Every vote is verifiable, and every process is open for scrutiny. We believe in complete transparency in how votes are counted and displayed.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              },
              { 
                title: 'Security', 
                description: 'Your identity and vote are protected with state-of-the-art encryption and verification systems. Privacy and security are non-negotiable.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              { 
                title: 'Accessibility', 
                description: 'Voting should be easy and accessible to everyone, regardless of location, device, or technical expertise. We design with inclusivity in mind.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mb-4 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: 'Global Event Voting', 
                description: 'Participate in votes on major global events, elections, and referendums. See real-time results from countries around the world.',
                image: '/vote.png'
              },
              { 
                title: 'Country Insights', 
                description: 'Explore how different countries respond to various topics. Understand global perspectives through visual data and analytics.',
                image: '/countries.png'
              },
              { 
                title: 'Secure Private Voting', 
                description: 'Organizations can create private elections with customizable ballots, secure verification, and identity protection.',
                image: '/verified.png'
              },
              { 
                title: 'Real-Time Analytics', 
                description: 'Track voting trends, see live updates, and explore detailed breakdowns of results by region, demographics, and more.',
                image: '/global.png'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image 
                      src={feature.image} 
                      alt={feature.title} 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose GlobalVote</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Verified Identity', 
                description: 'KYC process ensures every vote is authentic and from a verified individual.',
                stat: '100%'
              },
              { 
                title: 'Global Reach', 
                description: 'Connect with voters and opinions from over 190 countries worldwide.',
                stat: '190+'
              },
              { 
                title: 'Secure Platform', 
                description: 'Enterprise-grade security with end-to-end encryption and privacy protection.',
                stat: '99.9%'
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition text-center">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {benefit.stat}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20">
            <h2 className="text-3xl font-bold mb-4">Join the Global Conversation</h2>
            <p className="text-lg text-gray-300 mb-8">
              Be part of a platform that's shaping the future of global democracy. Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg transition font-semibold hover:from-blue-500 hover:to-purple-500">
                Get Started
              </button>
              <button className="px-8 py-3 border border-white/20 rounded-lg transition font-semibold hover:bg-white/10">
                Learn More
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
