// PrivacyPolicy.js
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: March 20, 2026</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              YYC Track ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>First and last name</li>
              <li>Email address</li>
              <li>Password (encrypted and stored securely)</li>
              <li>Postal code</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Data</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              We automatically collect certain information when you use the Service:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on each page</li>
              <li>Date and time of visits</li>
              <li>Operating system</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">User-Generated Content</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you interact with the Service, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Station ratings and feedback</li>
              <li>Comments and reviews</li>
              <li>Timestamps of submissions</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Create and manage your account</li>
              <li>Provide, operate, and maintain the Service</li>
              <li>Display your feedback and ratings to other users</li>
              <li>Send you account-related emails (verification, password reset)</li>
              <li>Improve and optimize the Service</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Comply with legal obligations</li>
              <li>Respond to your requests and support inquiries</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Share Your Information</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Public Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your name and submitted feedback/ratings are publicly visible to all users of the Service. 
              You can choose to submit anonymous feedback if you prefer not to display your name.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">We Do NOT Sell Your Data</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Sharing</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Service providers:</strong> Third-party companies that help us operate the Service (hosting, email delivery, database management)</li>
              <li><strong>Legal requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Protection of rights:</strong> To protect our rights, property, safety, or the rights of others</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Passwords are encrypted using industry-standard bcrypt hashing</li>
              <li>All data transmission uses secure HTTPS encryption</li>
              <li>Regular security audits and updates</li>
              <li>Access controls limiting employee access to personal data</li>
              <li>Secure database storage with MongoDB Atlas</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>

          {/* Your Privacy Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your account settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from promotional emails (if any)</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              To exercise these rights, visit your Account Settings or contact us at privacy@yyctrack.com
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use the Service</li>
              <li>Improve user experience and functionality</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              the functionality of the Service.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li><strong>Google OAuth:</strong> For Google sign-in (subject to Google's Privacy Policy)</li>
              <li><strong>MongoDB Atlas:</strong> Database hosting and management</li>
              <li><strong>Vercel:</strong> Frontend application hosting</li>
              <li><strong>Azure:</strong> Backend application hosting</li>
              <li><strong>Azure Content Safety:</strong> Content moderation services</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              These services have their own privacy policies. We encourage you to review their policies.
            </p>
          </div>

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We retain your information for the following periods:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li><strong>Account data:</strong> As long as your account is active</li>
              <li><strong>Deleted accounts:</strong> Personal information removed within 30 days of account deletion</li>
              <li><strong>Feedback/ratings:</strong> May be retained in anonymized form for statistical purposes</li>
              <li><strong>Legal compliance:</strong> Certain data may be retained longer if required by law</li>
            </ul>
          </div>

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              YYC Track is not intended for use by individuals under the age of 13. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have collected 
              data from a child under 13, we will take steps to delete that information immediately. If you 
              believe we have collected information from a child under 13, please contact us at privacy@yyctrack.com
            </p>
          </div>

          {/* International Users */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of 
              residence. These countries may have data protection laws that differ from your country. By using 
              the Service, you consent to the transfer of your information to Canada and other countries where 
              we operate.
            </p>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
              <li>Posting the updated policy on this page with a new "Last updated" date</li>
              <li>Sending you an email notification (for significant changes)</li>
              <li>Displaying a notice on the Service</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Your continued use of the Service after changes become effective constitutes your acceptance 
              of the updated Privacy Policy.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-none text-gray-600 space-y-2">
                <li><strong>Email:</strong> privacy@yyctrack.com</li>
                <li><strong>Support Email:</strong> support@yyctrack.com</li>
                <li><strong>Address:</strong> Calgary, AB, Canada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a href="/" className="text-red-600 font-medium hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;