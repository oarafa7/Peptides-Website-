import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            PEPTIDE<span className="text-primary">LAB</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Third-party tested research peptides, shipped cold-chain. For laboratory research
            use only — not for human consumption.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">Shop All</Link></li>
            <li><Link href="/collections/recovery-repair" className="hover:text-foreground">Recovery &amp; Repair</Link></li>
            <li><Link href="/collections/longevity" className="hover:text-foreground">Longevity</Link></li>
            <li><Link href="/collections/metabolic" className="hover:text-foreground">Metabolic</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/account/orders" className="hover:text-foreground">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/policies/shipping" className="hover:text-foreground">Shipping &amp; Returns</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-foreground">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <p className="container-page text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PeptideLab. All rights reserved. Products sold for research purposes only.
        </p>
      </div>
    </footer>
  );
}
