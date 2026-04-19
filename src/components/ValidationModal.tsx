import { ValidationResult } from "@/utils/validation";
import { useApp } from "@/context/AppContext";
import { AlertCircle, AlertTriangle, Info, Check, X } from "lucide-react";

interface Props {
  result: ValidationResult;
  onProceed: () => void;
  onCancel: () => void;
}

const severityIcon = {
  error: <AlertCircle size={16} color="#DC2626" />,
  warning: <AlertTriangle size={16} color="#D97706" />,
  info: <Info size={16} color="#3B82F6" />,
};

const severityBg = {
  error: { bg: "#FEE2E2", color: "#991B1B" },
  warning: { bg: "#FEF3C7", color: "#92400E" },
  info: { bg: "#DBEAFE", color: "#1E3A8A" },
};

export function ValidationModal({ result, onProceed, onCancel }: Props) {
  const { t, isRTL } = useApp();
  const hasErrors = result.warnings.some((w) => w.severity === "error");

  return (
    <div className="modal-center">
      <div className="modal-box" dir={isRTL ? "rtl" : "ltr"}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>
            {t("validationTitle")}
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
            {t("profileCompleteness")}
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${result.completeness}%`,
                backgroundColor: result.completeness >= 80 ? "#059669" : result.completeness >= 50 ? "#D97706" : "#DC2626",
              }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: "var(--fg)" }}>
            {result.completeness}%
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {result.warnings.map((w, i) => {
            const colors = severityBg[w.severity];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  backgroundColor: colors.bg,
                  borderRadius: 10,
                  color: colors.color,
                  fontSize: 13,
                }}
              >
                {severityIcon[w.severity]}
                <span style={{ flex: 1 }}>
                  <strong>{w.field}:</strong> {t(w.messageKey)}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            {t("cancel")}
          </button>
          {!hasErrors ? (
            <button className="btn-primary" onClick={onProceed} style={{ flex: 1 }}>
              <Check size={16} />
              {t("save")}
            </button>
          ) : (
            <button className="btn-danger" onClick={onProceed} style={{ flex: 1 }}>
              {t("proceedAnyway")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
