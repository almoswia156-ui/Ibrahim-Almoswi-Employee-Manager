# إعداد GitHub Actions لبناء APK تلقائياً

## الخطوة الوحيدة المطلوبة منك

GitHub لا يسمح برفع ملفات `.github/workflows` إلا عبر git مباشرة.
اتبع الخطوات التالية مرة واحدة فقط:

---

## الطريقة الأولى: عبر GitHub Web UI (الأسهل)

1. اذهب إلى: https://github.com/almoswia156-ui/Ibrahim-Almoswi-Employee-Manager
2. اضغط **Actions**
3. اضغط **New workflow**
4. اضغط **set up a workflow yourself**
5. سيفتح محرر نصي — **احذف كل المحتوى** واستبدله بالمحتوى التالي:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Node dependencies
        run: npm install

      - name: Build web app
        run: npm run build

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install Capacitor CLI and sync Android
        run: npx cap sync android

      - name: Make Gradle wrapper executable
        run: chmod +x android/gradlew

      - name: Cache Gradle dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('android/**/*.gradle*') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Build Debug APK
        working-directory: android
        run: ./gradlew assembleDebug --no-daemon --stacktrace

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: Ibrahim-Almoswi-Employee-Manager-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      - name: Show APK info
        run: |
          APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
          if [ -f "$APK_PATH" ]; then
            echo "✅ APK built successfully!"
            echo "📦 APK size: $(du -sh $APK_PATH | cut -f1)"
          else
            echo "❌ APK not found"
            exit 1
          fi
```

6. اضغط **Commit changes...**
7. اضغط **Commit changes** مرة أخرى لتأكيد

---

## الطريقة الثانية: عبر Terminal المحلي

```bash
git clone https://github.com/almoswia156-ui/Ibrahim-Almoswi-Employee-Manager.git
cd Ibrahim-Almoswi-Employee-Manager
mkdir -p .github/workflows
cp android-build.yml .github/workflows/
git add .github/
git commit -m "ci: add Android APK build workflow"
git push origin main
```

---

## بعد إضافة الـ Workflow

1. يبدأ البناء تلقائياً عند كل push
2. اذهب إلى: **Actions** → أحدث run
3. انتظر اكتمال البناء (~5-10 دقائق)
4. اضغط على الـ run → انتقل لأسفل → **Artifacts**
5. حمّل: **Ibrahim-Almoswi-Employee-Manager-debug**
6. فك الضغط → ستجد `app-debug.apk`

---

*هذا الملف مرجعي فقط — لا يؤثر على الكود*
