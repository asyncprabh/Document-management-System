import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  let menu = [];

  // Tenant Admin
  if (role === "TenantAdmin") {
    menu = [
      { name: "Dashboard", icon: "📊", path: "/dashboard" },
      { name: "Projects", icon: "📂", path: "/projects" },
      { name: "Upload", icon: "⬆️", path: "/upload" },
      { name: "Search", icon: "🔍", path: "/search" },
      { name: "Activity", icon: "📜", path: "/activity" }
    ];
  }

  // Project Admin
  else if (role === "ProjectAdmin") {
    menu = [
      { name: "Dashboard", icon: "📊", path: "/dashboard" },
      { name: "Projects", icon: "📂", path: "/projects" },
      { name: "Upload", icon: "⬆️", path: "/upload" },
      { name: "Search", icon: "🔍", path: "/search" },
      { name: "Activity", icon: "📜", path: "/activity" }
    ];
  }

  // Internal User
  else if (role === "InternalUser") {
    menu = [
      { name: "Dashboard", icon: "📊", path: "/dashboard" },
      { name: "Search", icon: "🔍", path: "/search" },
      { name: "Activity", icon: "📜", path: "/activity" }
    ];
  }

  // External User (shared links)
  else if (role === "ExternalUser") {
    menu = [
      { name: "Shared Documents", icon: "📄", path: "/shared" }
    ];
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (

    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-lg">

      {/* Logo */}

      <div className="p-6 border-b border-gray-700 flex items-center gap-2">

        <span className="text-2xl">📁</span>

        <h1 className="text-lg font-semibold tracking-wide">
          Enterprise DMS
        </h1>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-4 space-y-2">

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-800 text-gray-300"
              }`
            }
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* Footer */}

      <div className="p-4 border-t border-gray-700">

        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 transition p-2 rounded-lg font-medium"
        >
          Logout
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Document Management System
        </p>

      </div>

    </aside>
  );
}