import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-semibold tracking-tight">
        PEPTIDE<span className="text-primary">LAB</span>
      </Link>
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">{children}</div>
    </div>
  );
}
