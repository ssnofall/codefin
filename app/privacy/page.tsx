import type { Metadata } from "next";
import { Card } from "../components/ui/Card";

export const metadata: Metadata = {
  title: "Privacy Policy - Stackd",
  description: "Learn how Stackd collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last updated: February 13, 2026</p>
      </div>

      <Card className="space-y-6 p-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how Stackd collects, uses, and protects your personal information. 
            We are committed to protecting your privacy and being transparent about our data practices.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
          
          <h3 className="font-medium mb-2">From GitHub OAuth</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When you sign in with GitHub, we collect the following information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
            <li>GitHub username</li>
            <li>Email address</li>
            <li>Avatar URL (profile picture)</li>
            <li>Full name (if provided on GitHub)</li>
            <li>Unique user ID</li>
          </ul>

          <h3 className="font-medium mb-2">User-Generated Content</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Content you create and share on the platform:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
            <li>Code posts and snippets</li>
            <li>Post titles and descriptions</li>
            <li>Comments</li>
            <li>Tags and metadata</li>
            <li>Votes (upvotes/downvotes)</li>
          </ul>

          <h3 className="font-medium mb-2">Technical Information</h3>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Automatically collected data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Authentication cookies (for session management)</li>
            <li>Theme preference (stored locally in your browser)</li>
            <li>IP address (processed by our hosting provider)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Authenticate you and maintain your account</li>
            <li>Display your profile and content on the platform</li>
            <li>Calculate and display reputation scores</li>
            <li>Enable social features (voting, commenting)</li>
            <li>Remember your theme preference (light/dark mode)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>
              <strong>Supabase</strong> - For database hosting, authentication, and data storage. 
              Your data is stored on Supabase&apos;s secure servers.
            </li>
            <li>
              <strong>GitHub</strong> - For OAuth authentication. GitHub&apos;s privacy policy applies 
              to data shared during the authentication process.
            </li>
            <li>
              <strong>Vercel</strong> - For hosting the application. Vercel may process request logs 
              including IP addresses.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Data Storage and Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is stored securely using Supabase&apos;s infrastructure. We implement appropriate 
            technical measures to protect your information, including encrypted connections (HTTPS) 
            and secure authentication practices. However, no method of transmission over the internet 
            is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Data Retention and Deletion</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            <strong>Immediate Deletion:</strong> When you delete a post, comment, or your entire account, 
            the data is permanently removed from our database immediately.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            <strong>Account Deletion:</strong> You can delete your account at any time through 
            Settings → Danger Zone. This will permanently delete:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Your profile and account information</li>
            <li>All your code posts and snippets</li>
            <li>All your comments</li>
            <li>Your voting history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Access your personal data</li>
            <li>Delete your account and all associated data</li>
            <li>Delete individual posts and comments</li>
            <li>Contact us with privacy concerns</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong>Note:</strong> Data export functionality is not currently available, but you can 
            view all your content on your profile page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Cookies and Local Storage</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>
              <strong>Authentication cookies</strong> - Required for maintaining your login session. 
              These are managed by Supabase and are essential for the service to function.
            </li>
            <li>
              <strong>localStorage</strong> - Stores your theme preference (light/dark mode). 
              This is stored only on your device and never transmitted to our servers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stackd is not intended for users under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe we have collected information 
            from a child under 13, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify users of significant 
            changes by updating the &quot;Last updated&quot; date at the top of this page. Continued use of 
            Stackd after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions, concerns, or requests regarding this Privacy Policy or your data, please contact:
            <br />
            <a 
              href="mailto:ssnofall@proton.me" 
              className="text-primary hover:underline"
            >
              ssnofall@proton.me
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
