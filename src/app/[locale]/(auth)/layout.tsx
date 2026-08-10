import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Logo stacked imgClassName="h-20" textClassName="text-xl" className="mb-8" />
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">{children}</div>
    </div>
  );
}
