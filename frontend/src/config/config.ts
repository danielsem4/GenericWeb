export const CONFIG = {
  appName: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL,
  defaultTheme: "system" as const,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
} as const;
