// 'use client';

// export default function APIPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
//       {/* Hero Section */}
//       <section className="relative px-6 py-20 overflow-hidden">
//         {/* Starry background */}
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute inset-0" style={{
//             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
//             backgroundSize: '50px 50px'
//           }}></div>
//         </div>
        
//         {/* Purple-blue glow */}
//         <div 
//           className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl -z-0"
//           style={{
//             background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)'
//           }}
//         ></div>
        
//         <div className="max-w-7xl mx-auto relative z-10">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//               API <span className="text-white">Documentation</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
//               Integrate GlobalVote into your applications with our RESTful API.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
//               <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg transition font-semibold hover:from-blue-500 hover:to-purple-500">
//                 Get API Key
//               </button>
//               <button className="px-6 py-3 border border-white/20 rounded-lg transition font-semibold hover:bg-white/10">
//                 View on GitHub
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Start Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold mb-8 text-center">Quick Start</h2>
//           <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-semibold mb-3 text-white">Base URL</h3>
//                 <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                   <code className="text-blue-300">https://api.globalvote.com/v1</code>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold mb-3 text-white">Authentication</h3>
//                 <p className="text-gray-300 mb-3">
//                   All API requests require authentication using an API key. Include your API key in the request headers:
//                 </p>
//                 <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                   <pre className="text-sm text-gray-300">
// {`Authorization: Bearer YOUR_API_KEY
// Content-Type: application/json`}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* API Endpoints Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold mb-8 text-center">API Endpoints</h2>
          
//           <div className="space-y-8">
//             {/* Get Events */}
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-semibold">GET</span>
//                     <h3 className="text-2xl font-bold">Get Events</h3>
//                   </div>
//                   <p className="text-gray-300">Retrieve a list of voting events</p>
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Endpoint</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <code className="text-blue-300">GET /events</code>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Query Parameters</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-white/10">
//                           <th className="text-left py-2 text-white">Parameter</th>
//                           <th className="text-left py-2 text-white">Type</th>
//                           <th className="text-left py-2 text-white">Description</th>
//                         </tr>
//                       </thead>
//                       <tbody className="text-gray-300">
//                         <tr className="border-b border-white/5">
//                           <td className="py-2"><code className="text-blue-300">status</code></td>
//                           <td className="py-2">string</td>
//                           <td className="py-2">Filter by status: active, upcoming, finished</td>
//                         </tr>
//                         <tr className="border-b border-white/5">
//                           <td className="py-2"><code className="text-blue-300">category</code></td>
//                           <td className="py-2">string</td>
//                           <td className="py-2">Filter by category</td>
//                         </tr>
//                         <tr className="border-b border-white/5">
//                           <td className="py-2"><code className="text-blue-300">limit</code></td>
//                           <td className="py-2">integer</td>
//                           <td className="py-2">Number of results (default: 20, max: 100)</td>
//                         </tr>
//                         <tr>
//                           <td className="py-2"><code className="text-blue-300">offset</code></td>
//                           <td className="py-2">integer</td>
//                           <td className="py-2">Pagination offset</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Example Request</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`curl -X GET "https://api.globalvote.com/v1/events?status=active&limit=10" \\
//   -H "Authorization: Bearer YOUR_API_KEY"`}
//                     </pre>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Example Response</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`{
//   "data": [
//     {
//       "id": "evt_123",
//       "title": "EU Climate Policy Vote",
//       "status": "active",
//       "category": "politics",
//       "startDate": "2024-01-15T00:00:00Z",
//       "endDate": "2024-01-20T23:59:59Z",
//       "totalVotes": 125000,
//       "countries": ["EU", "US", "GB"]
//     }
//   ],
//   "pagination": {
//     "total": 50,
//     "limit": 10,
//     "offset": 0
//   }
// }`}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Get Event Details */}
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-semibold">GET</span>
//                     <h3 className="text-2xl font-bold">Get Event Details</h3>
//                   </div>
//                   <p className="text-gray-300">Retrieve detailed information about a specific event</p>
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Endpoint</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <code className="text-blue-300">GET /events/{'{eventId}'}</code>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Example Request</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`curl -X GET "https://api.globalvote.com/v1/events/evt_123" \\
//   -H "Authorization: Bearer YOUR_API_KEY"`}
//                     </pre>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Example Response</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`{
//   "id": "evt_123",
//   "title": "EU Climate Policy Vote",
//   "description": "Vote on the proposed EU climate policy...",
//   "status": "active",
//   "category": "politics",
//   "startDate": "2024-01-15T00:00:00Z",
//   "endDate": "2024-01-20T23:59:59Z",
//   "options": [
//     {"id": "opt_1", "label": "Support", "votes": 75000},
//     {"id": "opt_2", "label": "Oppose", "votes": 50000}
//   ],
//   "results": {
//     "totalVotes": 125000,
//     "byCountry": {
//       "EU": {"Support": 45000, "Oppose": 30000},
//       "US": {"Support": 20000, "Oppose": 15000}
//     }
//   }
// }`}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Vote */}
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-semibold">POST</span>
//                     <h3 className="text-2xl font-bold">Submit Vote</h3>
//                   </div>
//                   <p className="text-gray-300">Submit a vote for an event (requires authentication)</p>
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Endpoint</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <code className="text-blue-300">POST /events/{'{eventId}'}/vote</code>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Request Body</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`{
//   "optionId": "opt_1",
//   "anonymous": true
// }`}
//                     </pre>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Example Request</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                     <pre className="text-sm text-gray-300">
// {`curl -X POST "https://api.globalvote.com/v1/events/evt_123/vote" \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "optionId": "opt_1",
//     "anonymous": true
//   }'`}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Get Results */}
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-semibold">GET</span>
//                     <h3 className="text-2xl font-bold">Get Results</h3>
//                   </div>
//                   <p className="text-gray-300">Retrieve voting results for an event</p>
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Endpoint</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <code className="text-blue-300">GET /events/{'{eventId}'}/results</code>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-lg font-semibold mb-2 text-white">Query Parameters</h4>
//                   <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-white/10">
//                           <th className="text-left py-2 text-white">Parameter</th>
//                           <th className="text-left py-2 text-white">Type</th>
//                           <th className="text-left py-2 text-white">Description</th>
//                         </tr>
//                       </thead>
//                       <tbody className="text-gray-300">
//                         <tr className="border-b border-white/5">
//                           <td className="py-2"><code className="text-blue-300">breakdown</code></td>
//                           <td className="py-2">string</td>
//                           <td className="py-2">Breakdown type: country, region, demographic</td>
//                         </tr>
//                         <tr>
//                           <td className="py-2"><code className="text-blue-300">format</code></td>
//                           <td className="py-2">string</td>
//                           <td className="py-2">Response format: json, csv (default: json)</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Code Examples Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold mb-8 text-center">Code Examples</h2>
//           <div className="grid md:grid-cols-2 gap-6">
//             {[
//               {
//                 title: 'JavaScript/Node.js',
//                 language: 'javascript',
//                 code: `const fetchEvents = async () => {
//   const response = await fetch(
//     'https://api.globalvote.com/v1/events?status=active',
//     {
//       headers: {
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//       }
//     }
//   );
//   const data = await response.json();
//   return data;
// };`
//               },
//               {
//                 title: 'Python',
//                 language: 'python',
//                 code: `import requests

// def get_events():
//     headers = {
//         'Authorization': 'Bearer YOUR_API_KEY',
//         'Content-Type': 'application/json'
//     }
//     response = requests.get(
//         'https://api.globalvote.com/v1/events?status=active',
//         headers=headers
//     )
//     return response.json()`
//               },
//               {
//                 title: 'cURL',
//                 language: 'bash',
//                 code: `curl -X GET "https://api.globalvote.com/v1/events?status=active" \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json"`
//               },
//               {
//                 title: 'PHP',
//                 language: 'php',
//                 code: `<?php
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_URL, 
//   'https://api.globalvote.com/v1/events?status=active');
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_HTTPHEADER, [
//   'Authorization: Bearer YOUR_API_KEY',
//   'Content-Type: application/json'
// ]);
// $response = curl_exec($ch);
// curl_close($ch);
// $data = json_decode($response, true);
// ?>`
//               },
//             ].map((example, idx) => (
//               <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
//                 <h3 className="text-xl font-semibold mb-4 text-white">{example.title}</h3>
//                 <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
//                   <pre className="text-sm text-gray-300">
//                     <code>{example.code}</code>
//                   </pre>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Rate Limits & Errors Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
//               <div className="space-y-4 text-gray-300">
//                 <p>
//                   API requests are rate-limited to ensure fair usage:
//                 </p>
//                 <ul className="list-disc list-inside space-y-2 ml-4">
//                   <li><strong>Free Tier:</strong> 100 requests per hour</li>
//                   <li><strong>Pro Tier:</strong> 1,000 requests per hour</li>
//                   <li><strong>Enterprise:</strong> Custom limits</li>
//                 </ul>
//                 <p>
//                   Rate limit information is included in response headers:
//                 </p>
//                 <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 mt-4">
//                   <pre className="text-sm text-gray-300">
// {`X-RateLimit-Limit: 100
// X-RateLimit-Remaining: 95
// X-RateLimit-Reset: 1640995200`}
//                   </pre>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
//               <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
//               <div className="space-y-4">
//                 <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b border-white/10">
//                         <th className="text-left py-2 text-white">Code</th>
//                         <th className="text-left py-2 text-white">Description</th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-300">
//                       <tr className="border-b border-white/5">
//                         <td className="py-2"><code className="text-red-400">400</code></td>
//                         <td className="py-2">Bad Request</td>
//                       </tr>
//                       <tr className="border-b border-white/5">
//                         <td className="py-2"><code className="text-red-400">401</code></td>
//                         <td className="py-2">Unauthorized</td>
//                       </tr>
//                       <tr className="border-b border-white/5">
//                         <td className="py-2"><code className="text-red-400">403</code></td>
//                         <td className="py-2">Forbidden</td>
//                       </tr>
//                       <tr className="border-b border-white/5">
//                         <td className="py-2"><code className="text-red-400">404</code></td>
//                         <td className="py-2">Not Found</td>
//                       </tr>
//                       <tr className="border-b border-white/5">
//                         <td className="py-2"><code className="text-red-400">429</code></td>
//                         <td className="py-2">Too Many Requests</td>
//                       </tr>
//                       <tr>
//                         <td className="py-2"><code className="text-red-400">500</code></td>
//                         <td className="py-2">Internal Server Error</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SDKs & Libraries Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold mb-8 text-center">SDKs & Libraries</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               { name: 'JavaScript SDK', language: 'npm', install: 'npm install @globalvote/sdk' },
//               { name: 'Python SDK', language: 'pip', install: 'pip install globalvote' },
//               { name: 'PHP SDK', language: 'composer', install: 'composer require globalvote/sdk' },
//               { name: 'Ruby SDK', language: 'gem', install: 'gem install globalvote' },
//               { name: 'Go SDK', language: 'go', install: 'go get github.com/globalvote/sdk-go' },
//               { name: 'Java SDK', language: 'maven', install: 'mvn install globalvote-sdk' },
//             ].map((sdk, idx) => (
//               <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition">
//                 <h3 className="text-lg font-semibold mb-2 text-white">{sdk.name}</h3>
//                 <p className="text-sm text-gray-400 mb-3">{sdk.language}</p>
//                 <div className="bg-slate-900/50 rounded-lg p-3 border border-white/10">
//                   <code className="text-sm text-blue-300">{sdk.install}</code>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="px-6 py-16">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20">
//             <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
//             <p className="text-lg text-gray-300 mb-8">
//               Get your API key and start integrating GlobalVote into your applications today.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg transition font-semibold hover:from-blue-500 hover:to-purple-500">
//                 Get API Key
//               </button>
//               <button className="px-8 py-3 border border-white/20 rounded-lg transition font-semibold hover:bg-white/10">
//                 View Documentation
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="px-6 py-12 border-t border-white/20">
//         <div className="max-w-7xl mx-auto">
//           {/* Top Section: Navigation Links */}
//           <div className="flex justify-center mb-6">
//             <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
//               <a href="/main/about" className="hover:text-white transition">About</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/how-it-works" className="hover:text-white transition">How It Works</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/blogs" className="hover:text-white transition">Blog</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/support" className="hover:text-white transition">Support</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/terms" className="hover:text-white transition">Terms</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/privacy" className="hover:text-white transition">Privacy</a>
//               <span className="text-gray-500">|</span>
//               <a href="/main/api" className="hover:text-white transition">API</a>
//             </div>
//           </div>
          
//           {/* Bottom Section: Copyright and Social Icons */}
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <span className="text-sm text-gray-400">© {new Date().getFullYear()} GlobalVote</span>
//             <div className="flex gap-4">
//               <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
//                 <span className="text-sm font-bold">f</span>
//               </a>
//               <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
//                 </svg>
//               </a>
//               <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



