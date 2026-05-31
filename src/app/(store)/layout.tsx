import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { StoreProviders } from "@/components/store/store-providers";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProviders>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </StoreProviders>
  );
}
