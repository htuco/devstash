export default function DashboardPage() {
  return (
    <div className="flex flex-1">
      <aside className="w-64 border-r border-border p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>
      <main className="flex-1 p-4">
        <h2 className="text-lg font-semibold">Main</h2>
      </main>
    </div>
  );
}
