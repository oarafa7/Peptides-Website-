import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>
          We collect the information you provide when creating an account or placing an
          order — name, email, shipping address, and order history. Payment details are
          processed directly by Stripe and are never stored on our servers.
        </p>
        <p>
          We use your information solely to fulfill orders, provide customer support, and
          send order-related communications. We do not sell your personal information to
          third parties.
        </p>
        <p>
          You may request a copy of your data or ask us to delete your account at any time
          by contacting us.
        </p>
      </div>
    </div>
  );
}
