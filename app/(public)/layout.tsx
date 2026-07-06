import { PublicNavbar } from '@/components/shared/public-navbar';
import { PublicFooter } from '@/components/shared/public-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="pt-20">{children}</main>
      <PublicFooter />
    </>
  );
}
