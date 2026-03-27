// TermsOfService.js
const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: March 20, 2026</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              Welcome to YYC Track. These Terms of Service ("Terms") govern your access to and use of our 
              website and services (collectively, the "Service"). By using the Service, you agree to be bound 
              by these Terms. If you do not agree to these Terms, do not use the Service.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By creating an account or using YYC Track, you confirm that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>You are at least 13 years old</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will comply with all applicable laws and regulations</li>
              <li>All information you provide is accurate and truthful</li>
            </ul>
          </div>

          {/* Description of Service */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              YYC Track is a community-driven platform that allows Calgary Transit commuters to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Rate and review CTrain stations</li>
              <li>Share feedback about station conditions</li>
              <li>View real-time transit information</li>
              <li>Access aggregated community ratings</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              The Service is provided for informational purposes only. YYC Track is not affiliated with, 
              endorsed by, or connected to Calgary Transit or the City of Calgary.
            </p>
          </div>

          {/* User Accounts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security and confidentiality of your password</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Not share your account credentials with others</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Responsibility</h3>
            <p className="text-gray-600 leading-relaxed">
              You are solely responsible for all activities that occur under your account. We are not liable 
              for any loss or damage arising from unauthorized use of your account.
            </p>
          </div>

          {/* User Conduct and Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct and Content</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Guidelines</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              When submitting ratings, feedback, or comments ("User Content"), you agree that your content:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Is based on your genuine, personal experience</li>
              <li>Is truthful and not misleading</li>
              <li>Does not violate any laws or regulations</li>
              <li>Does not infringe on intellectual property rights</li>
              <li>Does not contain personal information of others without consent</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Content</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              You may not post content that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Is hateful, threatening, abusive, or harassing</li>
              <li>Contains profanity or vulgar language</li>
              <li>Is sexually explicit or pornographic</li>
              <li>Promotes violence or illegal activities</li>
              <li>Contains spam, advertising, or promotional material</li>
              <li>Impersonates another person or entity</li>
              <li>Contains viruses, malware, or harmful code</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Content License</h3>
            <p className="text-gray-600 leading-relaxed">
              By submitting User Content, you grant YYC Track a worldwide, non-exclusive, royalty-free license 
              to use, display, reproduce, and distribute your content on the Service. You retain all ownership 
              rights to your content.
            </p>
          </div>

          {/* Prohibited Activities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the Service or systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Collect or harvest user information without consent</li>
              <li>Create fake accounts or manipulate ratings</li>
              <li>Circumvent security measures or access controls</li>
              <li>Upload viruses or malicious code</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          {/* Content Moderation */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Moderation</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Monitor, review, and moderate User Content</li>
              <li>Remove or edit content that violates these Terms</li>
              <li>Suspend or terminate accounts for violations</li>
              <li>Use automated tools (e.g., Azure Content Safety) to filter content</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              However, we are not obligated to monitor content and do not assume responsibility for content 
              posted by users.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service, including its design, features, graphics, and code, is owned by YYC Track and 
              protected by copyright, trademark, and other intellectual property laws. You may not copy, 
              modify, distribute, or create derivative works without our permission.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All trademarks, logos, and service marks displayed on the Service are the property of their 
              respective owners.
            </p>
          </div>

          {/* Third-Party Links */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links and Services</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service may contain links to third-party websites or services. We are not responsible for 
              the content, privacy policies, or practices of third-party sites. Your use of third-party 
              services is at your own risk.
            </p>
          </div>

          {/* Disclaimers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Provided "As Is"</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Accuracy, completeness, or reliability of content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security or freedom from viruses</li>
              <li>Fitness for a particular purpose</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">User Content Disclaimer</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ratings, reviews, and feedback represent user opinions only. We do not endorse, verify, or 
              guarantee the accuracy of User Content. Use discretion when relying on user-generated information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, YYC Track and its operators shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits or 
              revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
              intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of the Service</li>
              <li>Any bugs, viruses, or harmful code</li>
              <li>User Content or conduct of third parties</li>
            </ul>
          </div>

          {/* Indemnification */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless YYC Track and its operators from any claims, 
              liabilities, damages, losses, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Your use of the Service</li>
              <li>Your User Content</li>
            </ul>
          </div>

          {/* Termination */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">By You</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may delete your account at any time through your Account Settings. Upon deletion, your 
              personal information will be removed from our systems within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">By Us</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              We reserve the right to suspend or terminate your account and access to the Service at any time, 
              with or without notice, for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Violation of these Terms</li>
              <li>Illegal or fraudulent activity</li>
              <li>Harmful conduct toward other users</li>
              <li>Extended inactivity</li>
              <li>Any other reason at our discretion</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Effect of Termination</h3>
            <p className="text-gray-600 leading-relaxed">
              Upon termination, your right to use the Service will immediately cease. Provisions that by their 
              nature should survive termination (including disclaimers, limitations of liability, and 
              indemnification) will continue to apply.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to These Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may modify these Terms at any time. When we make changes, we will:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Update the "Last updated" date at the top of this page</li>
              <li>Notify you via email for significant changes</li>
              <li>Display a notice on the Service</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Your continued use of the Service after changes become effective constitutes your acceptance of 
              the new Terms. If you do not agree to the modified Terms, you must stop using the Service.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms are governed by the laws of the Province of Alberta and the federal laws of Canada 
              applicable therein, without regard to conflict of law provisions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Any disputes arising from these Terms or the Service shall be resolved in the courts of Calgary, 
              Alberta, Canada.
            </p>
          </div>

          {/* Severability */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
              will remain in full force and effect. The invalid provision will be replaced with a valid 
              provision that most closely matches the intent of the original.
            </p>
          </div>

          {/* Entire Agreement */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              YYC Track regarding the Service and supersede all prior agreements and understandings.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have questions or concerns about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-none text-gray-600 space-y-2">
                <li><strong>Email:</strong> support@yyctrack.com</li>
                <li><strong>Legal Email:</strong> legal@yyctrack.com</li>
                <li><strong>Address:</strong> Calgary, AB, Canada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a href="/" className="text-red-600 font-medium hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;