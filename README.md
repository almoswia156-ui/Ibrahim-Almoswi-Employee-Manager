# Ibrahim Almoswi Employee Manager

  **تطبيق إدارة الموظفين** | Employee Management App

  React 18 + Capacitor 6 + TypeScript + Vite  
  Package: `com.ibrahimalmoswi.employeemanager`

  ---

  ## الميزات | Features

  - إدارة الموظفين (إضافة / تعديل / حذف) — Employee CRUD
  - OCR باللغتين العربية والإنجليزية للجوازات والتأشيرات — OCR (eng+ara)
  - تصدير Excel (XLSX) — Excel Export
  - نسخ احتياطي JSON — JSON Backup/Restore
  - 4 ثيمات (فاتح / داكن / أزرق / أخضر) — 4 Themes
  - دعم العربية (RTL) والإنجليزية (LTR)
  - رفع صور الجواز والتأشيرة — Image Upload
  - التحقق الذكي + نسبة الاكتمال — Smart Validation

  ---

  ## بناء APK | Build Android APK

  ### المتطلبات
  - Node.js v18+
  - Android Studio + Java 17
  - Android SDK 34

  ### خطوات البناء
  ```bash
  npm install
  npm run build
  npx cap sync android
  npx cap open android
  ```

  ثم في Android Studio:
  **Build → Build Bundle(s) / APK(s) → Build APK(s)**

  APK يُحفظ في: `android/app/build/outputs/apk/debug/app-debug.apk`

  ---

  ## إعداد GitHub Actions (بناء تلقائي)

  لتفعيل البناء التلقائي عبر GitHub Actions:

  1. اذهب إلى المستودع على GitHub
  2. انقر **Actions** → **New workflow** → **set up a workflow yourself**
  3. انسخ محتوى الملف `BUILD_ANDROID.md` قسم CI/CD
  4. أو اتبع الخطوات التالية في terminal:

  ```bash
  git clone https://github.com/almoswia156-ui/Ibrahim-Almoswi-Employee-Manager.git
  cd Ibrahim-Almoswi-Employee-Manager
  npm install
  # Create the workflow directory manually:
  mkdir -p .github/workflows
  cp /path/to/android-build.yml .github/workflows/
  git add .github/
  git commit -m "ci: add Android build workflow"
  git push
  ```

  بعد push، يبدأ GitHub Actions تلقائياً ويبني APK.  
  تجد APK في: **Actions → أحدث Run → Artifacts → Ibrahim-Almoswi-Employee-Manager-debug**

  ---

  ## معلومات التطبيق

  | المعلومة | القيمة |
  |----------|--------|
  | App ID | `com.ibrahimalmoswi.employeemanager` |
  | Min SDK | 22 (Android 5.1+) |
  | Target SDK | 34 (Android 14) |
  | Capacitor | v6.2 |

  ---

  *Ibrahim Almoswi Employee Manager v1.0.0*
  