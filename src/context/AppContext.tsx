import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "ar" | "en";
export type Theme = "light" | "dark" | "blue" | "green";
export type VisaStatus = "valid" | "expired" | "expiring_soon" | "not_applicable";
export type SecurityClearance = "approved" | "pending" | "rejected" | "none";
export type EmploymentStatus = "active" | "inactive" | "terminated";

export interface Employee {
  id: string;
  fullName: string;
  fullNameAr?: string;
  jobTitle: string;
  department: string;
  nationality: string;
  idNumber: string;
  phone: string;
  email?: string;
  employmentStatus: EmploymentStatus;
  visaStatus: VisaStatus;
  visaExpiry?: string;
  securityClearance: SecurityClearance;
  securityExpiry?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportImage?: string;
  visaImage?: string;
  photo?: string;
  salary?: number;
  startDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
  currency: string;
  dateFormat: string;
}

interface AppContextValue {
  employees: Employee[];
  settings: AppSettings;
  addEmployee: (emp: Omit<Employee, "id" | "createdAt" | "updatedAt">) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  getEmployee: (id: string) => Employee | undefined;
  exportJSON: () => string;
  importJSON: (json: string) => { success: boolean; error?: string };
  t: (key: string) => string;
  isRTL: boolean;
}

const defaultSettings: AppSettings = {
  language: "ar",
  theme: "light",
  currency: "SAR",
  dateFormat: "DD/MM/YYYY",
};

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    appName: "إبراهيم الموسوي - إدارة الموظفين",
    employees: "الموظفون",
    dashboard: "لوحة التحكم",
    settings: "الإعدادات",
    addEmployee: "إضافة موظف",
    editEmployee: "تعديل موظف",
    employeeProfile: "ملف الموظف",
    fullName: "الاسم الكامل",
    fullNameAr: "الاسم بالعربية",
    jobTitle: "المسمى الوظيفي",
    department: "القسم",
    nationality: "الجنسية",
    idNumber: "رقم الهوية",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    employmentStatus: "حالة التوظيف",
    visaStatus: "حالة الفيزا",
    visaExpiry: "انتهاء الفيزا",
    securityClearance: "التصريح الأمني",
    securityExpiry: "انتهاء التصريح",
    passportNumber: "رقم الجواز",
    passportExpiry: "انتهاء الجواز",
    salary: "الراتب",
    startDate: "تاريخ البدء",
    notes: "ملاحظات",
    active: "نشط",
    inactive: "غير نشط",
    terminated: "منتهي",
    valid: "ساري",
    expired: "منتهي",
    expiring_soon: "ينتهي قريباً",
    not_applicable: "لا ينطبق",
    approved: "معتمد",
    pending: "قيد الانتظار",
    rejected: "مرفوض",
    none: "لا يوجد",
    passportImage: "صورة الجواز",
    visaImage: "صورة الفيزا",
    uploadPassport: "رفع صورة الجواز",
    uploadVisa: "رفع صورة الفيزا",
    extractOCR: "استخراج البيانات (OCR)",
    ocrReview: "مراجعة البيانات المستخرجة",
    confirmData: "تأكيد البيانات",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    back: "رجوع",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    exportExcel: "تصدير Excel",
    exportJSON: "تصدير JSON",
    importJSON: "استيراد JSON",
    backup: "نسخ احتياطي",
    restore: "استعادة",
    totalEmployees: "إجمالي الموظفين",
    activeEmployees: "الموظفون النشطون",
    visaExpiring: "فيزا تنتهي قريباً",
    expiredVisa: "فيزا منتهية",
    pendingSecurity: "تصريح أمني معلق",
    inactiveEmployees: "موظفون غير نشطين",
    language: "اللغة",
    theme: "السمة",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeBlue: "أزرق",
    themeGreen: "أخضر",
    arabic: "العربية",
    english: "English",
    confirmDelete: "تأكيد الحذف",
    deleteConfirmMsg: "هل أنت متأكد من حذف هذا الموظف؟",
    yes: "نعم",
    no: "لا",
    noEmployees: "لا يوجد موظفون",
    addFirst: "أضف أول موظف",
    required: "مطلوب",
    invalidDate: "تاريخ غير صالح",
    saved: "تم الحفظ",
    deleted: "تم الحذف",
    error: "خطأ",
    success: "نجاح",
    ocrProcessing: "جاري معالجة الصورة...",
    ocrSuccess: "تم استخراج البيانات بنجاح",
    ocrFailed: "فشل استخراج البيانات",
    ocrNote: "يرجى مراجعة البيانات قبل الحفظ",
    photo: "الصورة الشخصية",
    uploadPhoto: "رفع صورة",
    all: "الكل",
    currency: "العملة",
    dateFormat: "صيغة التاريخ",
    exportSuccess: "تم التصدير بنجاح",
    importSuccess: "تم الاستيراد بنجاح",
    importError: "خطأ في الاستيراد",
    noResults: "لا توجد نتائج",
    selectStatus: "اختر الحالة",
    viewImage: "عرض الصورة",
    smartValidation: "التحقق الذكي",
    validationPassed: "اجتاز التحقق",
    validationWarnings: "تحذيرات",
    missingPhoto: "لا توجد صورة شخصية",
    missingPassport: "لا توجد صورة جواز",
    expiryWarning: "تاريخ انتهاء قريب",
    duplicateId: "رقم هوية مكرر",
    incompleteProfile: "الملف غير مكتمل",
    profileCompleteness: "اكتمال الملف",
    personalInfo: "المعلومات الشخصية",
    visaInfo: "معلومات الفيزا",
    securityInfo: "التصريح الأمني",
    documents: "الوثائق",
    employeeInfo: "معلومات الموظف",
    recentEmployees: "الموظفون الأخيرون",
    seeAll: "عرض الكل",
    name: "الاسم",
    status: "الحالة",
    actions: "إجراءات",
    view: "عرض",
    confirmSave: "تأكيد الحفظ",
    validationTitle: "نتائج التحقق",
    proceedAnyway: "المتابعة رغم التحذيرات",
    passportData: "بيانات الجواز",
    visaData: "بيانات الفيزا",
    extractedData: "البيانات المستخرجة",
    applyData: "تطبيق البيانات",
    imagePreview: "معاينة الصورة",
    close: "إغلاق",
    removeImage: "حذف الصورة",
    chooseImage: "اختر صورة",
    dragOrClick: "اسحب صورة هنا أو انقر للاختيار",
    ocrMockNote: "ملاحظة: OCR يعمل على بيانات تجريبية في بيئة التطوير",
    appVersion: "إصدار التطبيق",
    dataManagement: "إدارة البيانات",
    appearance: "المظهر",
  },
  en: {
    appName: "Ibrahim Almoswi - Employee Manager",
    employees: "Employees",
    dashboard: "Dashboard",
    settings: "Settings",
    addEmployee: "Add Employee",
    editEmployee: "Edit Employee",
    employeeProfile: "Employee Profile",
    fullName: "Full Name",
    fullNameAr: "Full Name (Arabic)",
    jobTitle: "Job Title",
    department: "Department",
    nationality: "Nationality",
    idNumber: "ID Number",
    phone: "Phone",
    email: "Email",
    employmentStatus: "Employment Status",
    visaStatus: "Visa Status",
    visaExpiry: "Visa Expiry",
    securityClearance: "Security Clearance",
    securityExpiry: "Security Expiry",
    passportNumber: "Passport Number",
    passportExpiry: "Passport Expiry",
    salary: "Salary",
    startDate: "Start Date",
    notes: "Notes",
    active: "Active",
    inactive: "Inactive",
    terminated: "Terminated",
    valid: "Valid",
    expired: "Expired",
    expiring_soon: "Expiring Soon",
    not_applicable: "N/A",
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    none: "None",
    passportImage: "Passport Image",
    visaImage: "Visa Image",
    uploadPassport: "Upload Passport Image",
    uploadVisa: "Upload Visa Image",
    extractOCR: "Extract Data (OCR)",
    ocrReview: "Review Extracted Data",
    confirmData: "Confirm Data",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    search: "Search",
    filter: "Filter",
    export: "Export",
    exportExcel: "Export Excel",
    exportJSON: "Export JSON",
    importJSON: "Import JSON",
    backup: "Backup",
    restore: "Restore",
    totalEmployees: "Total Employees",
    activeEmployees: "Active Employees",
    visaExpiring: "Visa Expiring Soon",
    expiredVisa: "Expired Visa",
    pendingSecurity: "Pending Security Clearance",
    inactiveEmployees: "Inactive Employees",
    language: "Language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeBlue: "Blue",
    themeGreen: "Green",
    arabic: "العربية",
    english: "English",
    confirmDelete: "Confirm Delete",
    deleteConfirmMsg: "Are you sure you want to delete this employee?",
    yes: "Yes",
    no: "No",
    noEmployees: "No Employees",
    addFirst: "Add your first employee",
    required: "Required",
    invalidDate: "Invalid date",
    saved: "Saved",
    deleted: "Deleted",
    error: "Error",
    success: "Success",
    ocrProcessing: "Processing image...",
    ocrSuccess: "Data extracted successfully",
    ocrFailed: "Failed to extract data",
    ocrNote: "Please review data before saving",
    photo: "Photo",
    uploadPhoto: "Upload Photo",
    all: "All",
    currency: "Currency",
    dateFormat: "Date Format",
    exportSuccess: "Exported successfully",
    importSuccess: "Imported successfully",
    importError: "Import error",
    noResults: "No results found",
    selectStatus: "Select Status",
    viewImage: "View Image",
    smartValidation: "Smart Validation",
    validationPassed: "Validation Passed",
    validationWarnings: "Warnings",
    missingPhoto: "Missing profile photo",
    missingPassport: "Missing passport image",
    expiryWarning: "Expiry date is near",
    duplicateId: "Duplicate ID number",
    incompleteProfile: "Incomplete profile",
    profileCompleteness: "Profile Completeness",
    personalInfo: "Personal Info",
    visaInfo: "Visa Info",
    securityInfo: "Security Info",
    documents: "Documents",
    employeeInfo: "Employee Info",
    recentEmployees: "Recent Employees",
    seeAll: "See All",
    name: "Name",
    status: "Status",
    actions: "Actions",
    view: "View",
    confirmSave: "Confirm Save",
    validationTitle: "Validation Results",
    proceedAnyway: "Proceed Anyway",
    passportData: "Passport Data",
    visaData: "Visa Data",
    extractedData: "Extracted Data",
    applyData: "Apply Data",
    imagePreview: "Image Preview",
    close: "Close",
    removeImage: "Remove Image",
    chooseImage: "Choose Image",
    dragOrClick: "Drag an image here or click to choose",
    ocrMockNote: "Note: OCR uses demo data in development environment",
    appVersion: "App Version",
    dataManagement: "Data Management",
    appearance: "Appearance",
  },
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

const EMPLOYEES_KEY = "em_employees";
const SETTINGS_KEY = "em_settings";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const empData = localStorage.getItem(EMPLOYEES_KEY);
      const settData = localStorage.getItem(SETTINGS_KEY);
      if (empData) setEmployees(JSON.parse(empData));
      if (settData) setSettings({ ...defaultSettings, ...JSON.parse(settData) });
    } catch (_) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = settings.language;
    applyTheme(settings.theme);
  }, [settings.language, settings.theme, loaded]);

  const saveEmployees = useCallback((emps: Employee[]) => {
    setEmployees(emps);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(emps));
  }, []);

  const addEmployee = useCallback(
    (emp: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newEmp: Employee = { ...emp, id: generateId(), createdAt: now, updatedAt: now };
      saveEmployees([...employees, newEmp]);
    },
    [employees, saveEmployees]
  );

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      const updated = employees.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      );
      saveEmployees(updated);
    },
    [employees, saveEmployees]
  );

  const deleteEmployee = useCallback(
    (id: string) => {
      saveEmployees(employees.filter((e) => e.id !== id));
    },
    [employees, saveEmployees]
  );

  const updateSettings = useCallback(
    (s: Partial<AppSettings>) => {
      const updated = { ...settings, ...s };
      setSettings(updated);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    },
    [settings]
  );

  const getEmployee = useCallback(
    (id: string) => employees.find((e) => e.id === id),
    [employees]
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify({ employees, settings, exportedAt: new Date().toISOString() }, null, 2);
  }, [employees, settings]);

  const importJSON = useCallback(
    (json: string): { success: boolean; error?: string } => {
      try {
        const data = JSON.parse(json);
        if (!Array.isArray(data.employees)) {
          return { success: false, error: "Invalid JSON format" };
        }
        saveEmployees(data.employees);
        if (data.settings) {
          const updated = { ...settings, ...data.settings };
          setSettings(updated);
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        }
        return { success: true };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    },
    [saveEmployees, settings]
  );

  const t = useCallback(
    (key: string) => translations[settings.language][key] || key,
    [settings.language]
  );

  const isRTL = settings.language === "ar";

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        employees,
        settings,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateSettings,
        getEmployee,
        exportJSON,
        importJSON,
        t,
        isRTL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark", "theme-blue", "theme-green");
  root.classList.add(`theme-${theme}`);
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
