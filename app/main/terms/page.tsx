'use client';

export default function TermsPage() {
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
              Terms of <span className="text-white">Service</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms carefully before using GlobalVote.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                Acceptance of Terms
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  By accessing and using GlobalVote ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service constitute a legally binding agreement between you and GlobalVote. Your use of the Service is subject to these terms, our Privacy Policy, and all applicable laws and regulations.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                User Accounts and Registration
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  To use certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate, current, and complete</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept all responsibility for activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Complete identity verification (KYC) as required by the Service</li>
                </ul>
                <p>
                  You must be at least 18 years old to create an account and use the Service. By registering, you represent and warrant that you meet this age requirement.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                Voting Rules and Conduct
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  When using the Service, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cast votes honestly and in accordance with your genuine opinions</li>
                  <li>Not attempt to manipulate, game, or interfere with voting results</li>
                  <li>Not create multiple accounts to vote multiple times on the same event</li>
                  <li>Not use automated systems, bots, or scripts to vote</li>
                  <li>Respect the voting process and other users</li>
                  <li>Not engage in any fraudulent, deceptive, or illegal activities</li>
                </ul>
                <p>
                  Violation of these rules may result in immediate termination of your account and legal action where appropriate.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                Identity Verification and Privacy
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  To ensure the integrity of our voting platform, we require identity verification (KYC) for all users. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate identification documents when requested</li>
                  <li>Consent to identity verification checks</li>
                  <li>Understand that your identity information is encrypted and stored securely</li>
                  <li>Accept that your individual votes remain anonymous while aggregate results are public</li>
                </ul>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                Intellectual Property Rights
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  The Service and its original content, features, and functionality are owned by GlobalVote and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reproduce, distribute, modify, or create derivative works of the Service</li>
                  <li>Use our trademarks, logos, or brand elements without permission</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                  <li>Remove any copyright or proprietary notices from the Service</li>
                </ul>
                <p>
                  You retain ownership of any content you submit to the Service, but grant us a license to use, display, and distribute such content as necessary to operate the Service.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                Prohibited Uses
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  You may not use the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track the personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
                Service Availability and Modifications
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or discontinue the Service at any time without notice</li>
                  <li>Update, change, or remove any part of the Service</li>
                  <li>Perform maintenance that may temporarily interrupt service</li>
                  <li>Refuse service to anyone for any reason at any time</li>
                </ul>
                <p>
                  We do not warrant that the Service will be available at all times or that it will be error-free. We are not liable for any loss or damage resulting from Service unavailability.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
                Disclaimer of Warranties
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The Service will meet your requirements or expectations</li>
                  <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                  <li>The results obtained from using the Service will be accurate or reliable</li>
                  <li>Any errors in the Service will be corrected</li>
                </ul>
                <p>
                  You use the Service at your own risk. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">9</span>
                Limitation of Liability
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  In no event shall GlobalVote, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                  <li>Damages resulting from your use or inability to use the Service</li>
                  <li>Damages resulting from any conduct or content of third parties on the Service</li>
                  <li>Damages resulting from unauthorized access to or alteration of your transmissions or data</li>
                </ul>
                <p>
                  Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid to us, if any, in the twelve (12) months prior to the event giving rise to the liability.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">10</span>
                Indemnification
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  You agree to defend, indemnify, and hold harmless GlobalVote and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use and access of the Service</li>
                  <li>Your violation of any term of these Terms of Service</li>
                  <li>Your violation of any third party right, including without limitation any copyright, property, or privacy right</li>
                  <li>Any claim that your content caused damage to a third party</li>
                </ul>
              </div>
            </div>

            {/* Section 11 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">11</span>
                Termination
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A breach of the Terms of Service</li>
                  <li>Fraudulent, harmful, or illegal activity</li>
                  <li>Failure to pay applicable fees (if any)</li>
                  <li>Extended periods of account inactivity</li>
                </ul>
                <p>
                  Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">12</span>
                Governing Law and Dispute Resolution
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which GlobalVote operates, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration association. You waive any right to a jury trial and agree to resolve disputes on an individual basis.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">13</span>
                Changes to Terms
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
                <p>
                  If you do not agree to the new terms, you must stop using the Service and may delete your account.
                </p>
              </div>
            </div>

            {/* Section 14 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">14</span>
                Contact Information
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>legal@globalvote.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Support:</span>
                    <span>support@globalvote.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Address:</span>
                    <span>GlobalVote Legal Department</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgment Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold mb-4">Acknowledgment</h2>
            <p className="text-gray-300 leading-relaxed">
              By using GlobalVote, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. If you do not agree to these terms, you must not use the Service.
            </p>
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
