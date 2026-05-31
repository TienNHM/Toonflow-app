import type { Socket } from "socket.io";

/** Locale from socket handshake (`locale` set by web client). */
export function getSocketLocale(socket: Socket): string {
  const raw = socket.handshake.auth?.locale;
  return typeof raw === "string" && raw.length > 0 ? raw : "zh-CN";
}

export function isViLocale(locale: string): boolean {
  return locale.toLowerCase().startsWith("vi");
}
