import { X, Download } from "lucide-react";

interface Props {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function ImageViewerModal({ imageUrl, title, onClose }: Props) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${title}_${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="modal-center" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0, overflow: "hidden", maxWidth: 400 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--primary)",
                padding: 6,
                borderRadius: 8,
              }}
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                padding: 6,
                borderRadius: 8,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div style={{ backgroundColor: "#000", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ maxWidth: "100%", maxHeight: "70dvh", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
