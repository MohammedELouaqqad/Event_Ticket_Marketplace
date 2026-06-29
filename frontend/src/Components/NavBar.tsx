import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { IoTicketOutline, IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import { UserContext } from "../context/UserContext";
import { getInitials, cn } from "../lib/utils";
import { clearAuth } from "../lib/auth";
import Button from "./ui/Button";

function NavBar() {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!context) return null;

  const { userConnected, setUserConnected } = context;

  function handleLogout() {
    clearAuth();
    setUserConnected(null);
    setMobileOpen(false);
    navigate("/");
  }

  const navLinks = [
    { label: "Events", path: "/events" },
    { label: "My Cart", path: "/card" },
  ];

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 shadow-nav backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("/events")}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-500/25 transition-transform group-hover:scale-105">
            <IoTicketOutline className="text-lg text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            TRICKER
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                isActive(link.path)
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* User + logout — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-xs font-bold text-brand-300">
              {getInitials(userConnected?.name)}
            </div>
            <span className="text-sm font-medium text-slate-300">
              {userConnected?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<IoLogOutOutline className="text-base" />}
            className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900 px-4 py-4 md:hidden animate-fade-in">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20 text-sm font-bold text-brand-300">
              {getInitials(userConnected?.name)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userConnected?.name}</p>
              <p className="text-xs text-slate-500">{userConnected?.email}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileOpen(false);
                }}
                className={cn(
                  "rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
