import { useRef } from "react";
import { Moon, Sun, Droplets, Leaf, Globe, Download, Upload, FileSpreadsheet } from "lucide-react";
import { useApp, Theme, Language } from "@/context/AppContext";
import { exportToExcel, exportToJSON } from "@/utils/export";
import { showToast } from "@/components/Toast";

export default function Settings() {
  const { settings, updateSettings, employees, exportJSON, importJSON, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes: { value: Theme; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "light", label: t("themeLight"), icon: <Sun size={18} />, color: "#F59E0B" },
    { value: "dark", label: t("themeDark"), icon: <Moon size={18} />, color: "#6366F1" },
    { value: "blue", label: t("themeBlue"), icon: <Droplets size={18} />, color: "#3B82F6" },
    { value: "green", label: t("themeGreen"), icon: <Leaf size={18} />, color: "#10B981" },
  ];

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: "ar", label: "العربية", flag: "🇸🇦" },
    { value: "en", label: "English", flag: "🇬🇧" },
  ];

  const handleExcelExport = () => {
    try {
      exportToExcel(employees, settings.language);
      showToast(t("exportSuccess"));
    } catch {
      showToast(t("error"));
    }
  };

  const handleJSONExport = () => {
    try {
      exportToJSON(exportJSON());
      showToast(t("exportSuccess"));
    } catch {
      showToast(t("error"));
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importJSON(text);
    if (result.success) {
      showToast(t("importSuccess"));
    } else {
      showToast(`${t("importError")}: ${result.error}`);
    }
    e.target.value = "";
  };

  return (
    <div>
      <div style={{ padding: "20px 16px 12px", backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg)" }}>{t("settings")}</div>
      </div>

      <div style={{ padding: 16 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Globe size={14} style={{ display: "inline", marginInlineEnd: 6 }} />
            {t("language")}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => updateSettings({ language: lang.value })}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: `2px solid ${settings.language === lang.value ? "var(--primary)" : "var(--border)"}`,
                  backgroundColor: settings.language === lang.value ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "var(--muted-bg)",
                  color: settings.language === lang.value ? "var(--primary)" : "var(--fg)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 24 }}>{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t("appearance")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {themes.map((th) => (
              <button
                key={th.value}
                onClick={() => updateSettings({ theme: th.value })}
                style={{
                  padding: "14px 12px",
                  borderRadius: 12,
                  border: `2px solid ${settings.theme === th.value ? th.color : "var(--border)"}`,
                  backgroundColor: settings.theme === th.value ? `${th.color}18` : "var(--muted-bg)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ color: th.color }}>{th.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: settings.theme === th.value ? th.color : "var(--fg)" }}>
                  {th.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t("dataManagement")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn-secondary"
              onClick={handleExcelExport}
              style={{ justifyContent: "flex-start", width: "100%", gap: 10 }}
            >
              <FileSpreadsheet size={18} color="#059669" />
              <div style={{ textAlign: "start" }}>
                <div style={{ fontWeight: 600 }}>{t("exportExcel")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{employees.length} {t("employees")}</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              onClick={handleJSONExport}
              style={{ justifyContent: "flex-start", width: "100%", gap: 10 }}
            >
              <Download size={18} color="var(--primary)" />
              <div style={{ textAlign: "start" }}>
                <div style={{ fontWeight: 600 }}>{t("exportJSON")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{t("backup")}</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ justifyContent: "flex-start", width: "100%", gap: 10 }}
            >
              <Upload size={18} color="#D97706" />
              <div style={{ textAlign: "start" }}>
                <div style={{ fontWeight: 600 }}>{t("importJSON")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{t("restore")}</div>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t("appVersion")}
          </div>
          <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>Ibrahim Almoswi Employee Manager</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>v1.0.0 • com.ibrahimalmoswi.employeemanager</div>
        </div>
      </div>
    </div>
  );
}
