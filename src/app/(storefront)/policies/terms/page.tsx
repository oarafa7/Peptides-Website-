import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">Terms of Service</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>
          By purchasing from PeptideLab, you confirm that you are acquiring products
          strictly for laboratory research purposes and agree that they are not for
          human or veterinary use, diagnosis, treatment, cure, or prevention of any
          disease.
        </p>
        <p>
          You must be at least 18 years old and legally permitted to purchase research
          chemicals in your jurisdiction. It is your responsibility to comply with local
          laws and institutional handling requirements.
        </p>
        <p>
          All sales are subject to the shipping and returns policy. PeptideLab reserves
          the right to refuse service to anyone believed to be purchasing for prohibited
          use.
        </p>
      </div>
    </div>
  );
}
