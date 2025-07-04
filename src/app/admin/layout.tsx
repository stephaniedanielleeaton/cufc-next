import AdminTabs from "./AdminTabs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <AdminTabs />
      <main className="w-full max-w-2xl bg-white rounded-lg shadow p-6">{children}</main>
    </div>
  );
}
