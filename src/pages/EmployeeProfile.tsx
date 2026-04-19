import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Edit, Trash2, User, Phone, Mail, Globe, Shield, FileText, Image, Calendar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { showToast } from "@/components/Toast";
import { validateEmployee } from "@/utils/validation";

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, deleteEmployee, t, isRTL } = useApp();
  const { employees } = useApp();
  const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const emp = getEmployee(id!);
  if (!emp) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        <div style={{ marginBottom: 16 }}>Employee not found</div>
        <button className="btn-secondary" onClick={() => navigate("/employees")}>{t("back")}</button>
      </div>
    );
  }

  const validation = validateEmployee(emp, employees, emp.id);

  const handleDelete = () => {
    deleteEmployee(emp.id);
    showToast(t("deleted"));
    navigate("/employees");
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value?: string | number }) {
    if (!value) return null;
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "var(--muted-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color="var(--muted)" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>{value}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)", padding: 4 }}>
          <BackIcon size={22} />
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{t("employeeProfile")}</div>
        <button className="btn-secondary" onClick={() => navigate(`/employee/edit/${emp.id}`)} style={{ padding: "7px 12px" }}>
          <Edit size={15} /> {t("edit")}
        </button>
      </div>

      <div style={{ padding: 16 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
            {emp.photo ? (
              <img
                src={emp.photo}
                alt={emp.fullName}
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setViewingImage({ url: emp.photo!, title: emp.fullName })}
              />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={32} color="var(--primary)" />
              </div>
            )}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{emp.fullName}</div>
              {emp.fullNameAr && <div style={{ fontSize: 14, color: "var(--muted)" }}>{emp.fullNameAr}</div>}
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{emp.jobTitle} • {emp.department}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                <StatusBadge status={emp.employmentStatus} type="employment" />
                <StatusBadge status={emp.visaStatus} type="visa" />
                <StatusBadge status={emp.securityClearance} type="security" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{t("profileCompleteness")}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: validation.completeness >= 70 ? "#059669" : "#D97706" }}>{validation.completeness}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${validation.completeness}%`,
                  backgroundColor: validation.completeness >= 70 ? "#059669" : validation.completeness >= 40 ? "#D97706" : "#DC2626",
                }}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("personalInfo")}</div>
          <InfoRow icon={Phone} label={t("phone")} value={emp.phone} />
          <InfoRow icon={Mail} label={t("email")} value={emp.email} />
          <InfoRow icon={Globe} label={t("nationality")} value={emp.nationality} />
          <InfoRow icon={FileText} label={t("idNumber")} value={emp.idNumber} />
          <InfoRow icon={Calendar} label={t("startDate")} value={emp.startDate} />
          <InfoRow icon={FileText} label={t("salary")} value={emp.salary ? `${emp.salary} ${t("currency") === "currency" ? "" : ""}` : undefined} />
          {emp.notes && (
            <div style={{ marginTop: 8, padding: "10px 12px", backgroundColor: "var(--muted-bg)", borderRadius: 8, fontSize: 13, color: "var(--fg)" }}>
              {emp.notes}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("visaInfo")}</div>
          <InfoRow icon={FileText} label={t("visaExpiry")} value={emp.visaExpiry} />
          <InfoRow icon={FileText} label={t("passportNumber")} value={emp.passportNumber} />
          <InfoRow icon={Calendar} label={t("passportExpiry")} value={emp.passportExpiry} />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("securityInfo")}</div>
          <InfoRow icon={Shield} label={t("securityExpiry")} value={emp.securityExpiry} />
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("documents")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {emp.passportImage ? (
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}>{t("passportImage")}</div>
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer" }} onClick={() => setViewingImage({ url: emp.passportImage!, title: t("passportImage") })}>
                  <img src={emp.passportImage} alt={t("passportImage")} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                    <Image size={12} /> {t("viewImage")}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 16, textAlign: "center", color: "var(--muted)", fontSize: 13, backgroundColor: "var(--muted-bg)", borderRadius: 8 }}>
                {t("missingPassport")}
              </div>
            )}
            {emp.visaImage && (
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}>{t("visaImage")}</div>
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer" }} onClick={() => setViewingImage({ url: emp.visaImage!, title: t("visaImage") })}>
                  <img src={emp.visaImage} alt={t("visaImage")} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                    <Image size={12} /> {t("viewImage")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="btn-danger" onClick={() => setConfirmDelete(true)} style={{ width: "100%", justifyContent: "center" }}>
          <Trash2 size={16} /> {t("delete")}
        </button>
      </div>

      {viewingImage && (
        <ImageViewerModal imageUrl={viewingImage.url} title={viewingImage.title} onClose={() => setViewingImage(null)} />
      )}

      {confirmDelete && (
        <div className="modal-center">
          <div className="modal-box" style={{ maxWidth: 360 }} dir={isRTL ? "rtl" : "ltr"}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>{t("confirmDelete")}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>{t("deleteConfirmMsg")}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(false)} style={{ flex: 1 }}>{t("no")}</button>
              <button className="btn-danger" onClick={handleDelete} style={{ flex: 1, justifyContent: "center" }}>{t("yes")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
