import { useState } from "react";
import { OCRResult } from "@/utils/ocr";
import { useApp } from "@/context/AppContext";
import { X, Check } from "lucide-react";

interface Props {
  result: OCRResult;
  docType: "passport" | "visa";
  onConfirm: (data: Record<string, string>) => void;
  onClose: () => void;
}

export function OCRReviewModal({ result, docType, onConfirm, onClose }: Props) {
  const { t, isRTL } = useApp();

  const initialData: Record<string, string> = {};
  if (docType === "passport") {
    if (result.passportNumber) initialData.passportNumber = result.passportNumber;
    if (result.fullName) initialData.fullName = result.fullName;
    if (result.nationality) initialData.nationality = result.nationality;
    if (result.expiryDate) initialData.passportExpiry = result.expiryDate;
  } else {
    if (result.visaNumber) initialData.visaNumber = result.visaNumber;
    if (result.visaType) initialData.visaType = result.visaType;
    if (result.visaExpiry) initialData.visaExpiry = result.visaExpiry;
  }

  const [fields, setFields] = useState<Record<string, string>>(initialData);

  const fieldLabels: Record<string, string> = {
    passportNumber: t("passportNumber"),
    fullName: t("fullName"),
    nationality: t("nationality"),
    passportExpiry: t("passportExpiry"),
    visaNumber: "Visa Number",
    visaType: "Visa Type",
    visaExpiry: t("visaExpiry"),
  };

  const confidence = result.confidence ?? 0;
  const confColor = confidence >= 0.7 ? "#059669" : confidence >= 0.4 ? "#D97706" : "#DC2626";

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" dir={isRTL ? "rtl" : "ltr"}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>
              {t("ocrReview")}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              {t("ocrNote")}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ marginBottom: 16, padding: "10px 14px", backgroundColor: "var(--muted-bg)", borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
            {t("smartValidation")} • {docType === "passport" ? t("passportData") : t("visaData")}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: confColor }}>
            {t("validationPassed")}: {Math.round(confidence * 100)}%
          </div>
        </div>

        {Object.keys(fields).length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)" }}>
            {t("ocrFailed")}
          </div>
        ) : (
          Object.entries(fields).map(([key, value]) => (
            <div key={key} className="form-group">
              <label className="label">{fieldLabels[key] || key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
              />
            </div>
          ))
        )}

        {result.rawText && (
          <details style={{ marginBottom: 16 }}>
            <summary style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer", padding: "8px 0" }}>
              Raw OCR Text
            </summary>
            <pre style={{
              fontSize: 10,
              color: "var(--muted)",
              backgroundColor: "var(--muted-bg)",
              padding: 12,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: 120,
              overflow: "auto",
              marginTop: 8,
            }}>
              {result.rawText}
            </pre>
          </details>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            {t("cancel")}
          </button>
          <button
            className="btn-primary"
            onClick={() => onConfirm(fields)}
            style={{ flex: 1 }}
            disabled={Object.keys(fields).length === 0}
          >
            <Check size={16} />
            {t("applyData")}
          </button>
        </div>
      </div>
    </div>
  );
}
