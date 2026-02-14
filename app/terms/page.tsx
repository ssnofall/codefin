import type { Metadata } from "next";
import { Card } from "../components/ui/Card";

export const metadata: Metadata = {
  title: "Terms of Service - Stackd",
  description: "Terms of Service for Stackd - the code sharing platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Last updated: February 13, 2026</p>
      </div>

      <Card className="space-y-6 p-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Stackd, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 13 years old to use Stackd, in compliance with GitHub&apos;s Terms of Service 
            which we use for authentication. By using Stackd, you represent that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stackd uses GitHub OAuth for authentication. You are responsible for maintaining the security 
            of your GitHub account. We reserve the right to suspend or terminate accounts that violate these terms 
            or engage in prohibited activities.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Content Guidelines</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When posting content on Stackd, you agree not to share:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Hate speech, harassment, or discriminatory content</li>
            <li>NSFW (Not Safe For Work) or sexually explicit content</li>
            <li>Spam, scams, or misleading content</li>
            <li>Malware, viruses, or harmful code</li>
            <li>Content that violates any applicable laws</li>
            <li>Personal information of others without consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Your Content</h2>
          <p className="text-muted-foreground leading-relaxed">
            You retain ownership of the code and content you post on Stackd. By posting content, 
            you grant us a non-exclusive license to display, store, and distribute your content 
            on the platform. You can delete your content at any time through your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You agree not to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Attempt to breach security or access unauthorized areas</li>
            <li>Use automated tools to scrape or abuse the service</li>
            <li>Impersonate other users or entities</li>
            <li>Interfere with the proper functioning of the platform</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Data Deletion</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to delete your account and all associated data at any time. 
            Account deletion is immediate and permanent. Navigate to Settings → Danger Zone to delete your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate your access to Stackd at our discretion, 
            particularly for violations of these terms. You may also delete your account at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">9. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stackd is provided &quot;as is&quot; without warranties of any kind, either express or implied. 
            We do not guarantee that the service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">10. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, Stackd and its developer shall not be liable 
            for any indirect, incidental, special, consequential, or punitive damages arising from 
            your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">11. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms of Service from time to time. We will notify users of significant 
            changes by updating the &quot;Last updated&quot; date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">12. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms of Service, please contact: ssnofall@proton.me
          </p>
        </section>
      </Card>
    </div>
  );
}
