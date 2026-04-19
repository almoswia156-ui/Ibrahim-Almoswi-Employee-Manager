import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, Users, ChevronRight } from "lucide-react";
import { useApp, EmploymentStatus, VisaStatus, SecurityClearance } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";

type FilterStatus = "all" | EmploymentStatus | VisaStatus | SecurityClearance;

export default function Employees() {
  const { employees, t, isRTL } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    let list = employees;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          (e.fullNameAr || "").includes(q) ||
          e.jobTitle.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.idNumber.toLowerCase().includes(q)
      );
    }
    if (filter !== "all") {
      list = list.filter(
        (e) =>
          e.employmentStatus === filter ||
          e.visaStatus === filter ||
          e.securityClearance === filter
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [employees, query, filter]);

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: t("all"), value: "all" },
    { label: t("active"), value: "active" },
    { label: t("inactive"), value: "inactive" },
    { label: t("terminated"), value: "terminated" },
    { label: t("valid"), value: "valid" },
    { label: t("expired"), value: "expired" },
    { label: t("expiring_soon"), value: "expiring_soon" },
    { label: t("approved"), value: "approved" },
    { label: t("pending"), value: "pending" },
    { label: t("rejected"), value: "rejected" },
  ];

  return (
    <div>
      <div style={{ padding: "20px 16px 12px", backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg)" }}>{t("employees")}</div>
          <button className="btn-primary" onClick={() => navigate("/employee/new")} style={{ padding: "8px 14px" }}>
            <Plus size={16} /> {t("addEmployee")}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} color="var(--muted)" style={{ position: "absolute", [isRTL ? "right" : "left"]: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder={t("search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingInlineStart: 36 }}
            />
          </div>
          <button
            className={filter !== "all" ? "btn-primary" : "btn-secondary"}
            onClick={() => setShowFilter(!showFilter)}
            style={{ padding: "10px 14px", flexShrink: 0 }}
          >
            <Filter size={16} />
          </button>
        </div>

        {showFilter && (
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setFilter(opt.value); setShowFilter(false); }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--border)",
                  backgroundColor: filter === opt.value ? "var(--primary)" : "var(--muted-bg)",
                  color: filter === opt.value ? "var(--primary-fg)" : "var(--fg)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, fontWeight: 500 }}>
          {filtered.length} {t("employees")}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 16px" }}>
            <Users size={40} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 15, color: "var(--muted)", marginBottom: query ? 0 : 16 }}>
              {query ? t("noResults") : t("noEmployees")}
            </div>
            {!query && (
              <button className="btn-primary" onClick={() => navigate("/employee/new")}>
                <Plus size={16} /> {t("addEmployee")}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((emp) => (
              <div
                key={emp.id}
                className="card"
                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 14px" }}
                onClick={() => navigate(`/employee/${emp.id}`)}
              >
                {emp.photo ? (
                  <img src={emp.photo} alt={emp.fullName} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Users size={22} color="var(--primary)" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.fullName}</div>
                  {emp.fullNameAr && (
                    <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.fullNameAr}</div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{emp.jobTitle} • {emp.department}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    <StatusBadge status={emp.employmentStatus} type="employment" size="sm" />
                    <StatusBadge status={emp.visaStatus} type="visa" size="sm" />
                    <StatusBadge status={emp.securityClearance} type="security" size="sm" />
                  </div>
                </div>
                <ChevronRight size={18} color="var(--muted)" style={{ flexShrink: 0, transform: isRTL ? "rotate(180deg)" : "none" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
