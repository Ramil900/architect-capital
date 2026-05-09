import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "var(--bg-primary)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
