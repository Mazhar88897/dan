'use client';

export default function PrivacyPage() {
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
              Privacy <span className="text-white">Policy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                Introduction
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  GlobalVote ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our voting platform and services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By using our Service, you consent to the data practices described in this policy. If you do not agree with the data practices described in this Privacy Policy, you should not use our Service.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                Information We Collect
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We collect information that you provide directly to us and information that is automatically collected when you use our Service:
                </p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Identity verification documents (government-issued ID, passport, driver's license)</li>
                    <li>Biometric data for identity verification (facial recognition data)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Voting activity and preferences</li>
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Log data (pages visited, time spent on pages, clickstream data)</li>
                    <li>Location data (general geographic location based on IP address)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                How We Use Your Information
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To provide, maintain, and improve our Service</li>
                  <li>To verify your identity and ensure the integrity of our voting platform</li>
                  <li>To process and record your votes securely and anonymously</li>
                  <li>To communicate with you about your account, transactions, and our services</li>
                  <li>To send you technical notices, updates, security alerts, and support messages</li>
                  <li>To respond to your comments, questions, and requests</li>
                  <li>To monitor and analyze trends, usage, and activities in connection with our Service</li>
                  <li>To detect, prevent, and address technical issues, fraud, and security threats</li>
                  <li>To personalize your experience and provide content and features relevant to you</li>
                  <li>To comply with legal obligations and enforce our Terms of Service</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                How We Share Your Information
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Service Providers</h3>
                  <p className="mb-2">
                    We may share your information with third-party service providers who perform services on our behalf, such as:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Identity verification services</li>
                    <li>Payment processing services</li>
                    <li>Cloud hosting and data storage providers</li>
                    <li>Analytics and monitoring services</li>
                    <li>Customer support services</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Legal Requirements</h3>
                  <p>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Business Transfers</h3>
                  <p>
                    If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Aggregate and Anonymized Data</h3>
                  <p>
                    We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to identify you. This includes voting results and statistical data.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                Voting Anonymity
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  Your privacy in voting is paramount. We implement the following measures to ensure your votes remain anonymous:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Individual votes are never linked to your personal identity in public results</li>
                  <li>Vote data is encrypted and stored separately from your personal information</li>
                  <li>Only aggregate voting results are displayed publicly</li>
                  <li>We use cryptographic techniques to ensure vote integrity while maintaining anonymity</li>
                  <li>Even we cannot determine how a specific individual voted after the vote is cast</li>
                </ul>
                <p>
                  Your identity verification is used solely to ensure one vote per verified person, but your individual voting choices remain completely anonymous.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
                Data Security
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for data in transit and at rest</li>
                  <li>Secure socket layer (SSL) technology for all data transmissions</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure data centers with physical and digital safeguards</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
                Cookies and Tracking Technologies
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
                </p>
                <p>
                  Types of cookies we use:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
                  <li><strong>Authentication Cookies:</strong> To keep you logged in and maintain your session</li>
                  <li><strong>Analytics Cookies:</strong> To understand how users interact with our Service</li>
                  <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                </ul>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
                Your Privacy Rights
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing your information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@globalvote.com. We will respond to your request within 30 days.
                </p>
                <p>
                  <strong>Note:</strong> We may retain certain information as required by law or for legitimate business purposes, even after you request deletion.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">9</span>
                Data Retention
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information is retained while your account is active</li>
                  <li>Identity verification documents are retained as required by law and for security purposes</li>
                  <li>Voting data is retained in anonymized form for statistical and historical purposes</li>
                  <li>Transaction records are retained for accounting and legal compliance purposes</li>
                </ul>
                <p>
                  When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it by law or for legitimate business purposes.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">10</span>
                Children's Privacy
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18.
                </p>
                <p>
                  If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information from our servers.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">11</span>
                International Data Transfers
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction.
                </p>
                <p>
                  If you are located outside our jurisdiction and choose to provide information to us, please note that we transfer the data, including personal information, to our facilities and process it there.
                </p>
                <p>
                  By using our Service, you consent to the transfer of your information to our facilities and those third parties with whom we share it as described in this Privacy Policy.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">12</span>
                Changes to This Privacy Policy
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We will let you know via email and/or a prominent notice on our Service prior to the change becoming effective if the changes are material.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">13</span>
                Contact Us
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 ml-11">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>privacy@globalvote.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Support:</span>
                    <span>support@globalvote.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">Address:</span>
                    <span>GlobalVote Privacy Office</span>
                  </li>
                </ul>
                <p>
                  For data protection inquiries, please include "Privacy Inquiry" in the subject line of your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-center">Privacy Summary</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-1">Your votes are anonymous</p>
                  <p className="text-sm text-gray-300">Individual votes are never linked to your identity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-1">Your data is encrypted</p>
                  <p className="text-sm text-gray-300">We use industry-standard encryption to protect your information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-1">You control your data</p>
                  <p className="text-sm text-gray-300">You can access, update, or delete your information at any time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-1">We don't sell your data</p>
                  <p className="text-sm text-gray-300">We never sell or rent your personal information to third parties</p>
                </div>
              </div>
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
