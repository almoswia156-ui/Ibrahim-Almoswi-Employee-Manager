import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, ChevronDown } from "lucide-react";
import { useApp, Employee, VisaStatus, SecurityClearance, EmploymentStatus } from "@/context/AppContext";
import { ImageUpload } from "@/components/ImageUpload";
import { ValidationModal } from "@/components/ValidationModal";
import { validateEmployee } from "@/utils/validation";
import { showToast } from "@/components/Toast";

interface Props {
  initial?: Partial<Employee>;
  editingId?: string;
  onSave: (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => void;
  title: string;
}

const defaultForm: Omit<Employee, "id" | "createdAt" | "updatedAt"> = {
  fullName: "",
  fullNameAr: "",
  jobTitle: "",
  department: "",
  nationality: "",
  idNumber: "",
  phone: "",
  email: "",
  employmentStatus: "active",
  visaStatus: "valid",
  visaExpiry: "",
  securityClearance: "none",
  securityExpiry: "",
  passportNumber: "",
  passportExpiry: "",
  passportImage: undefined,
  visaImage: undefined,
  photo: undefined,
  salary: undefined,
  startDate: "",
  notes: "",
};

function SelectField({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ appearance: "none", paddingInlineEnd: 36 }}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} color="var(--muted)" style={{ position: "absolute", insetInlineEnd: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 8, paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
      {title}
    </div>
  );
}

export function EmployeeForm({ initial, editingId, onSave, title }: Props) {
  const { t, isRTL, employees } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Employee, "id" | "createdAt" | "updatedAt">>({
    ...defaultForm,
    ...initial,
  });
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateEmployee> | null>(null);

  const set = useCallback(<K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleOCRData = (data: Record<string, string>) => {
    setForm((prev) => ({ ...prev, ...data }));
    showToast(t("ocrSuccess"));
  };

  const handleSubmit = () => {
    const result = validateEmployee(form, employees, editingId);
    if (!result.isValid || result.warnings.length > 0) {
      setValidationResult(result);
      setShowValidation(true);
    } else {
      doSave();
    }
  };

  const doSave = () => {
    onSave(form);
    showToast(t("saved"));
    navigate(-1);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const employmentOptions: { label: string; value: EmploymentStatus }[] = [
    { label: t("active"), value: "active" },
    { label: t("inactive"), value: "inactive" },
    { label: t("terminated"), value: "terminated" },
  ];
  const visaOptions: { label: string; value: VisaStatus }[] = [
    { label: t("valid"), value: "valid" },
    { label: t("expired"), value: "expired" },
    { label: t("expiring_soon"), value: "expiring_soon" },
    { label: t("not_applicable"), value: "not_applicable" },
  ];
  const securityOptions: { label: string; value: SecurityClearance }[] = [
    { label: t("approved"), value: "approved" },
    { label: t("pending"), value: "pending" },
    { label: t("rejected"), value: "rejected" },
    { label: t("none"), value: "none" },
  ];

  return (
    <div>
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg)", padding: 4 }}>
          <BackIcon size={22} />
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
        <button className="btn-primary" onClick={handleSubmit} style={{ padding: "8px 14px" }}>
          <Save size={15} /> {t("save")}
        </button>
      </div>

      <div style={{ padding: 16 }} dir={isRTL ? "rtl" : "ltr"}>
        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("photo")} />
          <ImageUpload
            value={form.photo}
            onChange={(v) => set("photo", v)}
            label={t("uploadPhoto")}
          />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("personalInfo")} />
          <TextField label={`${t("fullName")} *`} value={form.fullName} onChange={(v) => set("fullName", v)} />
          <TextField label={t("fullNameAr")} value={form.fullNameAr || ""} onChange={(v) => set("fullNameAr", v)} />
          <TextField label={`${t("jobTitle")} *`} value={form.jobTitle} onChange={(v) => set("jobTitle", v)} />
          <TextField label={`${t("department")} *`} value={form.department} onChange={(v) => set("department", v)} />
          <TextField label={`${t("nationality")} *`} value={form.nationality} onChange={(v) => set("nationality", v)} />
          <TextField label={`${t("idNumber")} *`} value={form.idNumber} onChange={(v) => set("idNumber", v)} />
          <TextField label={`${t("phone")} *`} value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
          <TextField label={t("email")} value={form.email || ""} onChange={(v) => set("email", v)} type="email" />
          <TextField label={t("salary")} value={form.salary?.toString() || ""} onChange={(v) => set("salary", v ? parseFloat(v) : undefined)} type="number" />
          <TextField label={t("startDate")} value={form.startDate || ""} onChange={(v) => set("startDate", v)} type="date" />
          <div className="form-group">
            <label className="label">{t("notes")}</label>
            <textarea
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("employmentStatus")} />
          <SelectField
            label={t("employmentStatus")}
            value={form.employmentStatus}
            onChange={(v) => set("employmentStatus", v as EmploymentStatus)}
            options={employmentOptions}
          />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("visaInfo")} />
          <SelectField
            label={t("visaStatus")}
            value={form.visaStatus}
            onChange={(v) => set("visaStatus", v as VisaStatus)}
            options={visaOptions}
          />
          <TextField label={t("visaExpiry")} value={form.visaExpiry || ""} onChange={(v) => set("visaExpiry", v)} type="date" />
          <TextField label={t("passportNumber")} value={form.passportNumber || ""} onChange={(v) => set("passportNumber", v)} />
          <TextField label={t("passportExpiry")} value={form.passportExpiry || ""} onChange={(v) => set("passportExpiry", v)} type="date" />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("securityInfo")} />
          <SelectField
            label={t("securityClearance")}
            value={form.securityClearance}
            onChange={(v) => set("securityClearance", v as SecurityClearance)}
            options={securityOptions}
          />
          <TextField label={t("securityExpiry")} value={form.securityExpiry || ""} onChange={(v) => set("securityExpiry", v)} type="date" />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <SectionHeader title={t("documents")} />
          <ImageUpload
            value={form.passportImage}
            onChange={(v) => set("passportImage", v)}
            label={t("uploadPassport")}
            docType="passport"
            onOCRData={handleOCRData}
          />
          <ImageUpload
            value={form.visaImage}
            onChange={(v) => set("visaImage", v)}
            label={t("uploadVisa")}
            docType="visa"
            onOCRData={handleOCRData}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center", marginBottom: 32 }}>
          <Save size={16} /> {t("save")}
        </button>
      </div>

      {showValidation && validationResult && (
        <ValidationModal
          result={validationResult}
          onProceed={() => { setShowValidation(false); doSave(); }}
          onCancel={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}
