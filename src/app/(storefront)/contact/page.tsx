import type { Metadata } from "next";

import { ContactForm } from "@/components/storefront/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-page max-w-xl py-16">
      <h1 className="font-display text-3xl font-semibold">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions about an order or a product? Send us a message and we&apos;ll respond within
        one business day.
      </p>
      <ContactForm />
    </div>
  );
}
