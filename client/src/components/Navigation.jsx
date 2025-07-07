import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { logout } from "../utils/logout";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => navigate("/"), 2000);
      setUser(null);
      toast.success("Logged out successfully", {
        position: "bottom-right",
        autoClose: 2000,
        style: { background: "#161D2F", color: "#FFFFFF" },
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error("Failed to log out. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        style: { background: "#161D2F", color: "#FFFFFF" },
        hideProgressBar: true,
      });
    }
  };

  return (
    <nav className="bg-blue-950 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Beauty salon
        </Link>

        {/* Burgerio mygtukas mažiems ekranams */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigacijos nuorodos dideliems ekranams */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-300">
            Procedures
          </Link>
          {user?.role === "admin" && (
            <Link to="/dashboard" className="hover:text-gray-300">
              Admin Dashboard
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-tours`} className="hover:text-gray-300">
              My procedures
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-reviews`} className="hover:text-gray-300">
              My reviews
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-bookmarks`} className="hover:text-gray-300">
              Bookmarks
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-300">{user.name}</span>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 focus:outline-none"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobilus meniu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 mt-4">
          <Link to="/" onClick={toggleMenu} className="hover:text-gray-300">
            Tours
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              onClick={toggleMenu}
              className="hover:text-gray-300"
            >
              Admin Dashboard
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-tours`} className="hover:text-gray-300">
              My Tours
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-reviews`} className="hover:text-gray-300">
              My reviews
            </Link>
          )}
          {user?.role === "user" && (
            <Link to={`/my-bookmarks`} className="hover:text-gray-300">
              My bookmarks
            </Link>
          )}
          {user ? (
            <>
              <span className="text-gray-300">{user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-left hover:text-gray-300 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="hover:text-gray-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="hover:text-gray-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
