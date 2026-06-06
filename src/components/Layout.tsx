import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../lib/auth";
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  ScrollText,
  Users,
  Quote,
  PenSquare,
  Sparkles,
  BarChart3,
  Image as ImageIcon,
  GalleryHorizontal,
  Mail,
  ClipboardList,
  LogOut,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/site", label: "Site Settings", Icon: Settings },
  { to: "/banners", label: "Banners", Icon: ImageIcon },
  { to: "/gallery", label: "Gallery Images", Icon: GalleryHorizontal },
  { to: "/courses", label: "Courses", Icon: BookOpen },
  { to: "/exams", label: "Defence Exams", Icon: ScrollText },
  { to: "/faculty", label: "Faculty", Icon: Users },
  { to: "/testimonials", label: "Testimonials", Icon: Quote },
  { to: "/blog", label: "Blog", Icon: PenSquare },
  { to: "/why-us", label: "Why Us", Icon: Sparkles },
  { to: "/stats", label: "Stats", Icon: BarChart3 },
  { to: "/submissions/contact", label: "Contact Inbox", Icon: Mail },
  { to: "/submissions/admission", label: "Applications", Icon: ClipboardList },
];

export function Layout() {
  const navigate = useNavigate();
  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Afrin Defence</div>
          <div className="mt-0.5 text-base font-semibold text-slate-900">Admin Panel</div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
