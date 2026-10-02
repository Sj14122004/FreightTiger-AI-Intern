import { NavLink } from "react-router-dom";

function Navbar() {
  const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/all-routes", label: "All Routes" },
    { to: "/generate", label: "Generate" }
  ];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="font-semibold text-slate-900">
          FreightTiger
        </NavLink>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <span className="hidden text-xs text-slate-500 sm:block">
          Analytics Active
        </span>
      </div>
    </nav>
  );
}

export default Navbar;