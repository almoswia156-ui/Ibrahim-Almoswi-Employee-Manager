import { VisaStatus, SecurityClearance, EmploymentStatus } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";

type AnyStatus = VisaStatus | SecurityClearance | EmploymentStatus;

interface Props {
  status: AnyStatus;
  type: "visa" | "security" | "employment";
  size?: "sm" | "md";
}

const visaColors: Record<VisaStatus, { bg: string; color: string }> = {
  valid: { bg: "#D1FAE5", color: "#065F46" },
  expired: { bg: "#FEE2E2", color: "#991B1B" },
  expiring_soon: { bg: "#FEF3C7", color: "#92400E" },
  not_applicable: { bg: "#F1F5F9", color: "#475569" },
};

const securityColors: Record<SecurityClearance, { bg: string; color: string }> = {
  approved: { bg: "#D1FAE5", color: "#065F46" },
  pending: { bg: "#FEF3C7", color: "#92400E" },
  rejected: { bg: "#FEE2E2", color: "#991B1B" },
  none: { bg: "#F1F5F9", color: "#475569" },
};

const employmentColors: Record<EmploymentStatus, { bg: string; color: string }> = {
  active: { bg: "#D1FAE5", color: "#065F46" },
  inactive: { bg: "#F1F5F9", color: "#475569" },
  terminated: { bg: "#FEE2E2", color: "#991B1B" },
};

export function StatusBadge({ status, type, size = "md" }: Props) {
  const { t } = useApp();
  let colors = { bg: "#F1F5F9", color: "#475569" };

  if (type === "visa") colors = visaColors[status as VisaStatus] || colors;
  else if (type === "security") colors = securityColors[status as SecurityClearance] || colors;
  else colors = employmentColors[status as EmploymentStatus] || colors;

  const fontSize = size === "sm" ? "10px" : "12px";
  const padding = size === "sm" ? "2px 6px" : "3px 8px";

  return (
    <span
      className="badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize,
        padding,
      }}
    >
      {t(status)}
    </span>
  );
}
