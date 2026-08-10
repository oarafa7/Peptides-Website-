import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">About PeptideLab</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-muted-foreground">
        <p>
          PeptideLab was founded to give researchers a reliable, transparent source of
          high-purity peptides. Every production batch is independently verified via HPLC
          and mass spectrometry, and a Certificate of Analysis ships with every order.
        </p>
        <p>
          We work exclusively with accredited manufacturing partners and cold-chain logistics
          providers to preserve compound integrity from production to your door.
        </p>
        <p className="font-medium text-foreground">
          All products are sold strictly for laboratory research purposes and are not
          intended for human or veterinary use, diagnosis, treatment, or consumption.
        </p>
      </div>
    </div>
  );
}
