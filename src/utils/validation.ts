import { Employee } from "@/context/AppContext";

export interface ValidationWarning {
  field: string;
  messageKey: string;
  severity: "error" | "warning" | "info";
}

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  completeness: number;
}

function isDateExpiringSoon(dateStr?: string, daysThreshold = 90): boolean {
  if (!dateStr) return false;
  try {
    const parts = dateStr.split(/[\/\-]/);
    let date: Date;
    if (parts[0].length === 4) {
      date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    } else {
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    const diff = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= daysThreshold;
  } catch {
    return false;
  }
}

function isDateExpired(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const parts = dateStr.split(/[\/\-]/);
    let date: Date;
    if (parts[0].length === 4) {
      date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    } else {
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return date.getTime() < Date.now();
  } catch {
    return false;
  }
}

export function validateEmployee(
  employee: Partial<Employee>,
  allEmployees: Employee[],
  editingId?: string
): ValidationResult {
  const warnings: ValidationWarning[] = [];

  if (!employee.fullName?.trim())
    warnings.push({ field: "fullName", messageKey: "required", severity: "error" });
  if (!employee.jobTitle?.trim())
    warnings.push({ field: "jobTitle", messageKey: "required", severity: "error" });
  if (!employee.department?.trim())
    warnings.push({ field: "department", messageKey: "required", severity: "error" });
  if (!employee.idNumber?.trim()) {
    warnings.push({ field: "idNumber", messageKey: "required", severity: "error" });
  } else {
    const dup = allEmployees.find(
      (e) => e.idNumber === employee.idNumber && e.id !== editingId
    );
    if (dup) warnings.push({ field: "idNumber", messageKey: "duplicateId", severity: "error" });
  }
  if (!employee.phone?.trim())
    warnings.push({ field: "phone", messageKey: "required", severity: "error" });
  if (!employee.nationality?.trim())
    warnings.push({ field: "nationality", messageKey: "required", severity: "error" });

  if (!employee.photo)
    warnings.push({ field: "photo", messageKey: "missingPhoto", severity: "warning" });
  if (!employee.passportImage)
    warnings.push({ field: "passportImage", messageKey: "missingPassport", severity: "warning" });

  if (employee.visaStatus !== "not_applicable") {
    if (isDateExpired(employee.visaExpiry))
      warnings.push({ field: "visaExpiry", messageKey: "expired", severity: "error" });
    else if (isDateExpiringSoon(employee.visaExpiry))
      warnings.push({ field: "visaExpiry", messageKey: "expiryWarning", severity: "warning" });
  }

  if (isDateExpiringSoon(employee.passportExpiry))
    warnings.push({ field: "passportExpiry", messageKey: "expiryWarning", severity: "warning" });

  if (isDateExpiringSoon(employee.securityExpiry))
    warnings.push({ field: "securityExpiry", messageKey: "expiryWarning", severity: "warning" });

  const hasErrors = warnings.some((w) => w.severity === "error");

  const fields = [
    "fullName", "jobTitle", "department", "nationality", "idNumber",
    "phone", "email", "photo", "passportNumber", "passportImage",
    "visaImage", "startDate", "salary",
  ];
  const filled = fields.filter((f) => !!(employee as Record<string, unknown>)[f]).length;
  const completeness = Math.round((filled / fields.length) * 100);

  return { isValid: !hasErrors, warnings, completeness };
}
