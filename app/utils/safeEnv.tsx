export function safeEnv(key: string): string {
  try {
    return process.env[key] || "";
  } catch {
    return "";
  }
}
