import { Employee } from "@/context/AppContext";
import * as XLSX from "xlsx";

export function exportToExcel(employees: Employee[], language: "ar" | "en"): void {
  const headers =
    language === "ar"
      ? ["الاسم", "الاسم بالعربية", "المسمى الوظيفي", "القسم", "الجنسية", "رقم الهوية", "الهاتف", "البريد الإلكتروني", "حالة التوظيف", "حالة الفيزا", "انتهاء الفيزا", "التصريح الأمني", "انتهاء التصريح", "رقم الجواز", "انتهاء الجواز", "الراتب", "تاريخ البدء", "ملاحظات"]
      : ["Full Name", "Full Name (AR)", "Job Title", "Department", "Nationality", "ID Number", "Phone", "Email", "Employment Status", "Visa Status", "Visa Expiry", "Security Clearance", "Security Expiry", "Passport Number", "Passport Expiry", "Salary", "Start Date", "Notes"];

  const rows = employees.map((e) => [
    e.fullName, e.fullNameAr || "", e.jobTitle, e.department, e.nationality,
    e.idNumber, e.phone, e.email || "", e.employmentStatus, e.visaStatus,
    e.visaExpiry || "", e.securityClearance, e.securityExpiry || "",
    e.passportNumber || "", e.passportExpiry || "", e.salary?.toString() || "",
    e.startDate || "", e.notes || "",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = headers.map(() => ({ wch: 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, language === "ar" ? "الموظفون" : "Employees");
  XLSX.writeFile(wb, `employees_${Date.now()}.xlsx`);
}

export function exportToJSON(jsonString: string): void {
  const blob = new Blob([jsonString], { type: "application/json" });
  triggerDownload(blob, `backup_${Date.now()}.json`);
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
