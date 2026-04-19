# بناء تطبيق Android APK | Android APK Build Guide

## نظرة عامة | Overview

هذا المشروع هو تطبيق Capacitor يعمل كـ Web App في المتصفح ويُحوّل إلى APK باستخدام Android Studio.
مجلد `android/` **موجود مسبقاً** في المشروع، لا حاجة لتشغيل `npx cap add android`.

---

## المتطلبات | Requirements

| الأداة | الإصدار |
|--------|---------|
| Node.js | v18 أو أحدث |
| npm | v9 أو أحدث (مدمج مع Node.js) |
| Android Studio | Hedgehog 2023.1.1 أو أحدث |
| Java JDK | 17 |
| Android SDK | API 34 (يُثبَّت مع Android Studio) |

---

## خطوات البناء الكاملة | Full Build Steps

### 1. فك ضغط وفتح المجلد
```bash
# بعد فك الضغط، ادخل مجلد المشروع:
cd artifacts/capacitor-app
```

### 2. تثبيت الحزم (npm — لا تستخدم pnpm هنا)
```bash
npm install
```
هذا يُنشئ مجلد `node_modules/` بجميع التبعيات.

### 3. بناء تطبيق الويب
```bash
npm run build
```
يُولّد مجلد `dist/` ببناء الإنتاج.

### 4. مزامنة مع Android (لا تضيف android مرة ثانية!)
```bash
npx cap sync android
```
يُحدّث محتوى `android/app/src/main/assets/public/` بآخر بناء.

> **ملاحظة مهمة:** مجلد `android/` موجود مسبقاً في هذا المشروع.
> لا تشغّل `npx cap add android` — سيتسبب في خطأ "platform already added".

### 5. فتح Android Studio
```bash
npx cap open android
```
أو افتح مجلد `android/` مباشرة من Android Studio: **File → Open**.

### 6. البناء داخل Android Studio
1. انتظر **Gradle Sync** (قد يأخذ دقائق أول مرة)
2. اذهب إلى: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. ستجد APK في: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## الأمر المختصر | Quick Commands

```bash
# تثبيت + بناء + مزامنة بخطوة واحدة:
npm install && npm run build && npx cap sync android

# فتح Android Studio مباشرة:
npx cap open android
```

---

## بناء APK للنشر (Signed APK) | Production Build

```bash
npm run build
npx cap sync android
npx cap open android
```

ثم في Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. اختر **APK**
3. أنشئ Keystore جديد أو استخدم موجودًا
4. اختر **release** وابنِ

---

## معلومات التطبيق | App Info

| المعلومة | القيمة |
|----------|--------|
| App ID | `com.ibrahimalmoswi.employeemanager` |
| App Name | `Ibrahim Almoswi Employee Manager` |
| Web Dir | `dist/` |
| Min SDK | 22 (Android 5.1+) |
| Target SDK | 34 (Android 14) |
| Capacitor | v6.2 |

---

## هيكل المشروع | Project Structure

```
capacitor-app/
├── src/                        # كود React + TypeScript
│   ├── context/AppContext.tsx  # البيانات + الترجمات + الثيمات
│   ├── pages/                  # Dashboard, Employees, EmployeeProfile, Settings
│   ├── components/             # StatusBadge, OCRReviewModal, ImageUpload...
│   └── utils/                  # ocr.ts, export.ts, validation.ts
├── android/                    # مشروع Android (موجود مسبقاً)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml # الصلاحيات: CAMERA, STORAGE, INTERNET...
│   │   ├── assets/public/      # dist/ منسوخ هنا بعد cap sync
│   │   └── java/.../MainActivity.java
│   └── capacitor.settings.gradle  # مسارات node_modules (npm-compatible)
├── dist/                       # إخراج npm run build
├── capacitor.config.ts         # إعدادات Capacitor
├── package.json                # تبعيات npm (بدون catalog:)
└── vite.config.ts
```

---

## الميزات | Features

| الميزة | الوصف |
|--------|-------|
| OCR | Tesseract.js يدعم English + Arabic (eng+ara) — مع fallback تلقائي |
| تصدير Excel | XLSX عبر SheetJS |
| نسخة احتياطية | تصدير/استيراد JSON |
| الثيمات | فاتح / داكن / أزرق / أخضر |
| اللغة | عربي (RTL) / English (LTR) |
| الصور | رفع جواز سفر + تأشيرة، عرض، حذف |
| التحقق | نسبة اكتمال + تنبيهات ذكية |

---

## حل المشاكل | Troubleshooting

| المشكلة | الحل |
|---------|------|
| `platform already added` | لا تشغّل `cap add android` — المجلد موجود |
| Gradle sync فاشل | تأكد من Java 17 وAndroid SDK 34 |
| `Could not resolve :capacitor-android` | شغّل `npm install` أولاً لإنشاء `node_modules/` |
| OCR بطيء | Tesseract يحمّل ملفات Arabic+English (~10MB) — طبيعي |
| OCR لا يعمل أبداً | يتطلب اتصال إنترنت لتحميل نماذج WASM |
| الصور لا تظهر | تأكد من صلاحية `READ_MEDIA_IMAGES` على Android 13+ |
| localStorage فارغ بعد إعادة التثبيت | WebView storage منفصل — استخدم JSON backup |

---

*Ibrahim Almoswi Employee Manager v1.0.0 — Capacitor 6 + React 18 + Vite 5*
