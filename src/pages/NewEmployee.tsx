import { useApp } from "@/context/AppContext";
import { EmployeeForm } from "./EmployeeForm";
import { Employee } from "@/context/AppContext";

export default function NewEmployee() {
  const { addEmployee, t } = useApp();
  return (
    <EmployeeForm
      title={t("addEmployee")}
      onSave={(data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => addEmployee(data)}
    />
  );
}
