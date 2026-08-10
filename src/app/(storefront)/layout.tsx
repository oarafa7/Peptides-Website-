import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CartDrawer } from "@/components/shared/cart-drawer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
