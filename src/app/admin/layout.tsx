import AdminTabs from "./AdminTabs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl">
        {/* AdminTabs bar */}
        <AdminTabs />
        {/* White content box for admin page content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-8 min-h-[300px]">
          {children}
        </div>
      </div>
    </div>
  );
}
