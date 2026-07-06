import { AdminSidebar } from '@/components/shared/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050816]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
