import { useRef, useState } from "react";
import { Upload, Eye, Trash2, Scan } from "lucide-react";
import { performOCR as runOCR, OCRResult } from "@/utils/ocr";
import { ImageViewerModal } from "./ImageViewerModal";
import { OCRReviewModal } from "./OCRReviewModal";
import { useApp } from "@/context/AppContext";

interface Props {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label: string;
  docType?: "passport" | "visa";
  onOCRData?: (data: Record<string, string>) => void;
}

export function ImageUpload({ value, onChange, label, docType, onOCRData }: Props) {
  const { t, isRTL } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [viewing, setViewing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleFile = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    onChange(dataUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleRunOCR = async () => {
    if (!value || !docType) return;
    setOcrLoading(true);
    try {
      const result = await runOCR(value, docType);
      setOcrResult(result);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label className="label">{label}</label>

      {value ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <img
            src={value}
            alt={label}
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block", cursor: "pointer" }}
            onClick={() => setViewing(true)}
          />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 12px 12px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}>
            <button
              type="button"
              onClick={() => setViewing(true)}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
            >
              <Eye size={14} /> {t("viewImage")}
            </button>
            {docType && onOCRData && (
              <button
                type="button"
                onClick={handleRunOCR}
                disabled={ocrLoading}
                style={{ background: "rgba(59,130,246,0.8)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
              >
                {ocrLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Scan size={14} />}
                {t("extractOCR")}
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange(undefined)}
              style={{ background: "rgba(239,68,68,0.8)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
            >
              <Trash2 size={14} /> {t("delete")}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="image-upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Upload size={28} color="var(--muted)" style={{ margin: "0 auto 8px" }} />
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
            {t("dragOrClick")}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)" }}>
            JPG, PNG, WEBP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {viewing && value && (
        <ImageViewerModal
          imageUrl={value}
          title={label}
          onClose={() => setViewing(false)}
        />
      )}

      {ocrResult && docType && onOCRData && (
        <OCRReviewModal
          result={ocrResult}
          docType={docType}
          onConfirm={(data) => {
            onOCRData(data);
            setOcrResult(null);
          }}
          onClose={() => setOcrResult(null)}
        />
      )}
    </div>
  );
}
