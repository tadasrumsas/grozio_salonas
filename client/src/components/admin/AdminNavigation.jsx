import { NavLink } from 'react-router';

export default function AdminNavigation() {
  const baseLinkStyle =
    'px-4 py-2 rounded-xl transition-all duration-200 font-semibold';
  const activeStyle =
    'bg-blue-600 text-white shadow-md scale-105';
  const inactiveStyle =
    'text-blue-700 hover:bg-blue-100 hover:text-blue-900';

  return (
    <nav className="flex justify-center gap-6 text-lg bg-white py-4 shadow-sm rounded-xl mx-auto mt-6">
      <NavLink
        to="/ban"
        className={({ isActive }) =>
          `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Ban User
      </NavLink>

      <NavLink
        to="/create"
        className={({ isActive }) =>
          `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Create Tour
      </NavLink>

      <NavLink
        to="/registrations"
        className={({ isActive }) =>
          `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Registrations
      </NavLink>
    </nav>
  );
}
