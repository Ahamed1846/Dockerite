import { Link, Outlet, useLocation } from "react-router-dom";
import { Boxes, ImageIcon, BarChart3, HardDrive,Network } from "lucide-react";

export default function MainLayout() {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: BarChart3 },
    { to: "/containers", label: "Containers", icon: Boxes },
    { to: "/images", label: "Images", icon: ImageIcon },
    { to: "/volumes", label: "Volumes", icon: HardDrive},
    { to: "/networks", label: "Networks", icon: Network}
  ];

  return (
    <div className="flex min-h-screen bg-(--bg-primary) text-(--txt-primary)">
      {/* Sidebar */}
      <aside
        className="
          w-64 bg-(--bg-secondary)
          border-r border-(--border-color)
          p-8 flex flex-col
        "
      >
        {/* Brand */}
        <div className="mb-10 select-none pl-1 flex items-center gap-3">
          {/* Placeholder Logo */}
          <div
            className="
              w-9 h-9 rounded-lg 
              bg-(--bg-tertiary) 
              border border-(--border-color)
              flex items-center justify-center 
              font-semibold text-(--txt-secondary)
              tracking-tight
            "
          >
            D
          </div>

          {/* Product Name */}
          <div className="flex flex-col leading-tight translate-y-[1px]">
            <span className="text-[1.25rem] font-bold text-(--txt-primary) tracking-tight">
              Dockerite
            </span>
            <span className="text-[0.70rem] text-(--txt-secondary) tracking-wide">
              dashboard
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium tracking-tight transition-all duration-200 ${active
                    ? "bg-(--bg-tertiary) border border-(--border-color) shadow-sm"
                    : "text-(--txt-secondary) hover:bg-(--bg-tertiary) hover:text-(--txt-primary) hover:shadow-sm"
                  }`}
              >
                {/* LEFT BLUE BAR */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-(--accent-blue) rounded-r transition-all duration-300" />
                )}

                {/* ICON BLOCK */}
                <div
                  className={`
                    p-2 rounded-md border border-(--border-color)
                    bg-(--bg-primary)
                    flex items-center justify-center transition-all duration-200
                    ${active ? "bg-(--bg-secondary) scale-105 shadow-sm" : ""}
                  `}
                >
                  <Icon
                    size={22}
                    className={`
                      transition-all duration-200
                      ${active
                        ? "text-(--accent-blue) scale-110"
                        : "text-[#6d7080] group-hover:text-(--txt-primary) group-hover:scale-105"
                      }
                    `}
                  />
                </div>

                {/* LABEL */}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
