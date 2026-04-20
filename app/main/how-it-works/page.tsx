'use client';

import Image from 'next/image';

export default function HowItWorksPage() {
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
              How It <span className="text-white">Works</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in three simple steps. Join millions of users participating in global democracy.
            </p>
          </div>
        </div>
      </section>

      {/* Main Steps Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                title: 'Verify Your Identity', 
                subtitle: 'KYC Process',
                description: 'Complete a quick and secure identity verification process. We use industry-standard KYC (Know Your Customer) protocols to ensure every vote is authentic and from a verified individual.',
                icon: '/verified.png',
                step: '01',
                features: [
                  'Secure document upload',
                  'Real-time verification',
                  'Privacy-protected process',
                  'Takes less than 5 minutes'
                ]
              },
              { 
                title: 'Vote on Global Events', 
                subtitle: 'Cast Your Ballot',
                description: 'Browse through active voting events from around the world. Select an event, review the details, and cast your vote. Your opinion is recorded securely and anonymously.',
                icon: '/vote.png',
                step: '02',
                features: [
                  'Browse active events',
                  'View event details',
                  'Cast your vote securely',
                  'See real-time results'
                ]
              },
              { 
                title: 'Explore Country Insights', 
                subtitle: 'See Results',
                description: 'Discover how different countries and regions are voting. Explore detailed analytics, visual breakdowns, and understand global perspectives on important issues.',
                icon: '/countries.png',
                step: '03',
                features: [
                  'Country-wise breakdown',
                  'Visual data analytics',
                  'Trend analysis',
                  'Historical comparisons'
                ]
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl font-bold z-10">
                  {step.step}
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition h-full">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 flex items-center justify-center mb-4">
                      <Image src={step.icon} alt={step.title} width={100} height={100} className="object-contain" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-purple-300 font-semibold mb-4">{step.subtitle}</p>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Process Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The Complete Process</h2>
          
          <div className="space-y-8">
            {/* Step 1 Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Image src="/verified.png" alt="Verify Identity" width={100} height={100} className="object-contain" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Step 1</span>
                    <h3 className="text-2xl font-bold">Identity Verification</h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Your security and the integrity of our platform start with identity verification. We use advanced KYC technology to verify your identity while protecting your privacy.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Document Upload</p>
                        <p className="text-sm text-gray-400">Upload a government-issued ID</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Face Verification</p>
                        <p className="text-sm text-gray-400">Quick selfie verification</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Instant Approval</p>
                        <p className="text-sm text-gray-400">Most verifications complete in minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Privacy Protected</p>
                        <p className="text-sm text-gray-400">Your data is encrypted and secure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Step 2</span>
                    <h3 className="text-2xl font-bold">Vote on Events</h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Browse through active voting events from around the world. Each event includes detailed information, context, and real-time voting statistics.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Browse Events</p>
                        <p className="text-sm text-gray-400">Explore active and upcoming votes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Read Details</p>
                        <p className="text-sm text-gray-400">Understand the context and options</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Cast Your Vote</p>
                        <p className="text-sm text-gray-400">Select your choice securely</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">View Results</p>
                        <p className="text-sm text-gray-400">See how others are voting</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 order-1 md:order-2">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Image src="/vote.png" alt="Vote on Events" width={100} height={100} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:bg-white/15 transition">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Image src="/countries.png" alt="Explore Insights" width={100} height={100} className="object-contain" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Step 3</span>
                    <h3 className="text-2xl font-bold">Explore Insights</h3>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Dive deep into voting analytics and see how different countries and regions are responding. Understand global trends and perspectives through interactive visualizations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Country Breakdown</p>
                        <p className="text-sm text-gray-400">See results by country</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Visual Analytics</p>
                        <p className="text-sm text-gray-400">Interactive charts and graphs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Trend Analysis</p>
                        <p className="text-sm text-gray-400">Track voting patterns over time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold text-white">Historical Data</p>
                        <p className="text-sm text-gray-400">Compare with past events</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Security & Privacy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'End-to-End Encryption', 
                description: 'All votes and personal data are encrypted using military-grade encryption protocols.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              { 
                title: 'Anonymous Voting', 
                description: 'Your individual votes are never linked to your identity. Only aggregate results are visible.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                title: 'Transparent Results', 
                description: 'All voting results are publicly verifiable while maintaining voter privacy.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'How long does identity verification take?',
                answer: 'Most identity verifications are completed within 5 minutes. In some cases, manual review may take up to 24 hours.'
              },
              {
                question: 'Is my vote anonymous?',
                answer: 'Yes, your individual votes are completely anonymous. Only aggregate results are displayed publicly.'
              },
              {
                question: 'Can I change my vote after submitting?',
                answer: 'Once a vote is submitted, it cannot be changed to maintain the integrity of the voting process.'
              },
              {
                question: 'What countries are supported?',
                answer: 'GlobalVote supports users from over 190 countries worldwide. We continuously expand our coverage.'
              },
              {
                question: 'How are results calculated?',
                answer: 'Results are calculated in real-time using verified votes only. All calculations are transparent and publicly verifiable.'
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Join millions of users participating in global democracy. Verify your identity and start voting today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg transition font-semibold hover:from-blue-500 hover:to-purple-500">
                Verify Identity
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
