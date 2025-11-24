import { Link, Outlet } from "react-router-dom";
import { Boxes, HardDrive, ImageIcon, BarChart3 } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--txt-primary)]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] p-5 flex flex-col">
        
        <h1 className="text-2xl font-bold mb-8 tracking-wide text-blue-400">
          Dockerite
        </h1>

        <nav className="flex flex-col gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <BarChart3 size={18} />
            Dashboard
          </Link>

          <Link 
            to="/containers" 
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <Boxes size={18} />
            Containers
          </Link>

          <Link 
            to="/images" 
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <ImageIcon size={18} />
            Images
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
