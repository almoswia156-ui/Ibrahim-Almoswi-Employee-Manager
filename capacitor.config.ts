import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ibrahimalmoswi.employeemanager",
  appName: "Ibrahim Almoswi Employee Manager",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: ["*"],
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    Filesystem: {
      androidScheme: "https",
    },
  },
};

export default config;
