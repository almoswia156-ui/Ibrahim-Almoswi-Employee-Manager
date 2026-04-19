import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { EmployeeForm } from "./EmployeeForm";
import { Employee } from "@/context/AppContext";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const { getEmployee, updateEmployee, t } = useApp();
  const navigate = useNavigate();

  const emp = getEmployee(id!);
  if (!emp) {
    navigate("/employees");
    return null;
  }

  return (
    <EmployeeForm
      title={t("editEmployee")}
      initial={emp}
      editingId={emp.id}
      onSave={(data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => updateEmployee(emp.id, data)}
    />
  );
}
