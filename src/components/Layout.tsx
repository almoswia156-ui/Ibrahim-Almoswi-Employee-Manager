import { NavLink, useLocation } from "react-router-dom";
import { BarChart2, Users, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { t, isRTL } = useApp();
  const location = useLocation();
  const isTab = ["/", "/employees", "/settings"].includes(location.pathname);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)" }} dir={isRTL ? "rtl" : "ltr"}>
      <main style={{ flex: 1, paddingBottom: isTab ? 72 : 0, overflowY: "auto" }}>
        {children}
      </main>

      {isTab && (
        <nav className="bottom-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <BarChart2 size={22} />
            <span>{t("dashboard")}</span>
          </NavLink>
          <NavLink to="/employees" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <Users size={22} />
            <span>{t("employees")}</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <Settings size={22} />
            <span>{t("settings")}</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}
