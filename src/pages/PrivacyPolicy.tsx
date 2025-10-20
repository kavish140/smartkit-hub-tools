import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Last Updated: October 20, 2025
          </p>
          <p className="text-muted-foreground mt-2">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to SmartKit.tech ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our online tools and services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using SmartKit.tech, you agree to the terms outlined in this Privacy Policy. If you do not 
              agree with our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-purple-600">1.</span> Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We may collect personal information that you voluntarily provide when using our services, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Email addresses (when you contact us or subscribe to updates)</li>
                <li>Name and contact details (if provided through contact forms)</li>
                <li>User-generated content (text, files, or data you input into our tools)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-purple-600">2.</span> Usage Data
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>IP address and geographic location</li>
                <li>Browser type and version</li>
                <li>Device information (operating system, screen resolution)</li>
                <li>Pages visited and time spent on each page</li>
                <li>Referring website and exit pages</li>
                <li>Date and time of access</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-purple-600">3.</span> Local Storage Data
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Some of our tools use browser local storage to save your preferences and work in progress. This data 
                remains on your device and is not transmitted to our servers unless you explicitly choose to share it.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our tools and services</li>
              <li><strong>User Experience:</strong> To personalize your experience and remember your preferences</li>
              <li><strong>Analytics:</strong> To analyze usage patterns and optimize website performance</li>
              <li><strong>Communication:</strong> To respond to your inquiries and send important updates</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Advertising:</strong> To display relevant advertisements through Google AdSense</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-600" />
              Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small 
              text files stored on your device that help us recognize you and remember your preferences.
            </p>

            <div>
              <h3 className="font-semibold mb-2">Types of Cookies We Use:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant ads</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> You can control cookie settings through your browser preferences. However, 
                disabling cookies may affect the functionality of certain features on our website.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services that may collect information about you:
            </p>

            <div>
              <h3 className="font-semibold mb-2">Google AdSense</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your 
                prior visits to our website or other websites. You can opt out of personalized advertising by visiting 
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Google Ads Settings
                </a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Analytics Services</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We may use analytics services to collect and analyze usage data to improve our services. These 
                services may collect information such as your IP address, browser type, and pages visited.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">External APIs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Some of our tools may connect to external APIs (e.g., weather data, currency exchange rates). When 
                using these features, you may be subject to the privacy policies of those third-party services.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Secure HTTPS encryption for all data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Client-side processing for sensitive tools (data doesn't leave your device)</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-yellow-900">
                <strong>Important:</strong> While we strive to protect your information, no method of transmission 
                over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-pink-600" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in 
              this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When your information is no longer needed, we will securely delete or anonymize it. Local storage data 
              can be cleared directly from your browser settings at any time.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for children under the age of 13. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us immediately.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If we discover that we have collected personal information from a child under 13, we will take steps 
              to delete that information as quickly as possible.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your state, province, 
              country, or other governmental jurisdiction where data protection laws may differ.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using our services, you consent to the transfer of your information to our facilities and to the 
              third parties with whom we share it as described in this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
              new Privacy Policy on this page with an updated "Last Updated" date.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your 
              information. Your continued use of our services after any changes indicates your acceptance of the 
              updated policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="space-y-2">
                <p className="font-semibold text-lg">SmartKit.tech</p>
                <p className="text-muted-foreground">Website: <a href="https://aismartkit.tech" className="text-blue-600 hover:underline">https://aismartkit.tech</a></p>
                <p className="text-muted-foreground">Email: <a href="mailto:contact@aismartkit.tech" className="text-blue-600 hover:underline">contact@aismartkit.tech</a></p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We will respond to your inquiries as soon as possible, typically within 30 days.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">Your Privacy Matters</h3>
            <p className="opacity-90 max-w-2xl mx-auto">
              We are committed to protecting your privacy and maintaining the security of your personal information. 
              Thank you for trusting SmartKit.tech with your data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
