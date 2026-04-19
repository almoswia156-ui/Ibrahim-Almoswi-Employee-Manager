import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Clock, XCircle, Shield, UserX, Plus, AlertCircle, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";

function StatCard({ label, value, icon: Icon, iconColor, iconBg }: {
  label: string; value: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  iconColor: string; iconBg: string;
}) {
  return (
    <div className="card" style={{ flex: "1 1 44%", minWidth: 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={20} color={iconColor} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fg)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { employees, t, isRTL } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.employmentStatus === "active").length,
    visaExpiring: employees.filter((e) => e.visaStatus === "expiring_soon").length,
    visaExpired: employees.filter((e) => e.visaStatus === "expired").length,
    pendingSecurity: employees.filter((e) => e.securityClearance === "pending").length,
    inactive: employees.filter((e) => e.employmentStatus === "inactive").length,
  }), [employees]);

  const recentEmployees = useMemo(
    () => [...employees].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [employees]
  );

  const alerts = useMemo(() => {
    const list: { message: string; type: "error" | "warning" }[] = [];
    if (stats.visaExpired > 0) list.push({ message: `${stats.visaExpired} ${t("expiredVisa")}`, type: "error" });
    if (stats.visaExpiring > 0) list.push({ message: `${stats.visaExpiring} ${t("visaExpiring")}`, type: "warning" });
    if (stats.pendingSecurity > 0) list.push({ message: `${stats.pendingSecurity} ${t("pendingSecurity")}`, type: "warning" });
    return list;
  }, [stats, t]);

  return (
    <div style={{ padding: "0 0 8px" }}>
      <div style={{ padding: "20px 16px 12px", backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", marginBottom: 4 }}>Ibrahim Almoswi</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg)" }}>{t("dashboard")}</div>
      </div>

      <div style={{ padding: "16px" }}>
        {alerts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                backgroundColor: alert.type === "error" ? "#FEE2E2" : "#FEF3C7",
                borderRadius: 10,
              }}>
                {alert.type === "error"
                  ? <AlertCircle size={16} color="#DC2626" />
                  : <AlertTriangle size={16} color="#D97706" />
                }
                <span style={{ fontSize: 13, fontWeight: 500, color: alert.type === "error" ? "#991B1B" : "#92400E" }}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <StatCard label={t("totalEmployees")} value={stats.total} icon={Users} iconColor="var(--primary)" iconBg="color-mix(in srgb, var(--primary) 18%, transparent)" />
          <StatCard label={t("activeEmployees")} value={stats.active} icon={UserCheck} iconColor="#059669" iconBg="#D1FAE5" />
          <StatCard label={t("visaExpiring")} value={stats.visaExpiring} icon={Clock} iconColor="#D97706" iconBg="#FEF3C7" />
          <StatCard label={t("expiredVisa")} value={stats.visaExpired} icon={XCircle} iconColor="#DC2626" iconBg="#FEE2E2" />
          <StatCard label={t("pendingSecurity")} value={stats.pendingSecurity} icon={Shield} iconColor="#7C3AED" iconBg="#EDE9FE" />
          <StatCard label={t("inactiveEmployees")} value={stats.inactive} icon={UserX} iconColor="#6B7280" iconBg="#F3F4F6" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{t("recentEmployees")}</div>
          <button
            onClick={() => navigate("/employees")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontSize: 13, fontWeight: 500 }}
          >
            {t("seeAll")} {isRTL ? "←" : "→"}
          </button>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <Users size={36} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 15, color: "var(--muted)", marginBottom: 16 }}>{t("noEmployees")}</div>
            <button className="btn-primary" onClick={() => navigate("/employee/new")}>
              <Plus size={16} /> {t("addEmployee")}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="card"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}
                onClick={() => navigate(`/employee/${emp.id}`)}
              >
                {emp.photo ? (
                  <img src={emp.photo} alt={emp.fullName} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "color-mix(in srgb, var(--primary) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Users size={20} color="var(--primary)" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.fullName}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{emp.jobTitle}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <StatusBadge status={emp.visaStatus} type="visa" size="sm" />
                  <StatusBadge status={emp.employmentStatus} type="employment" size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
