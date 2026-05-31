import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import getPath from "@/utils/getPath";
import { resolveRequestLocale } from "@/utils/resolveVendorLocale";

type MessageMap = Record<string, string>;

function loadViMessages(): MessageMap {
  const candidates = [
    join(getPath("i18n"), "api-messages.vi-VN.json"),
    join(process.cwd(), "src/i18n/api-messages.vi-VN.json"),
    join(process.cwd(), "data/i18n/api-messages.vi-VN.json"),
  ];
  for (const file of candidates) {
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file, "utf8")) as MessageMap;
    }
  }
  return {};
}

const viMessages = loadViMessages();

const localeStorage = new AsyncLocalStorage<{ locale: string }>();

export function runWithApiLocale(locale: string, next: () => void): void {
  localeStorage.run({ locale }, next);
}

export function getApiLocale(): string {
  return localeStorage.getStore()?.locale ?? "zh-CN";
}

export function translateApiMessage(message: string, locale?: string): string {
  const loc = locale ?? getApiLocale();
  if (!message || loc === "zh-CN" || !loc.startsWith("vi")) return message;

  if (viMessages[message]) return viMessages[message];

  const tableCleared = message.match(/^表 (.+) 已清空$/);
  if (tableCleared) return `Bảng ${tableCleared[1]} đã được xóa sạch`;

  const updateVersion = message.match(/^更新(.+)成功，5秒后重启$/);
  if (updateVersion) return `Cập nhật ${updateVersion[1]} thành công, khởi động lại sau 5 giây`;

  const vendorValidate = message.match(/^vendor配置校验失败，共 (\d+) 处:\n([\s\S]*)$/);
  if (vendorValidate) {
    return `Xác thực cấu hình vendor thất bại, ${vendorValidate[1]} lỗi:\n${vendorValidate[2]}`;
  }

  const vendorValidateOne = message.match(/^vendor配置校验失败: (.+)$/);
  if (vendorValidateOne) return `Xác thực cấu hình vendor thất bại: ${vendorValidateOne[1]}`;

  return message;
}

export function translateApiPayload<T>(data: T, locale?: string): T {
  if (!data || typeof data !== "object") return data;
  const loc = locale ?? getApiLocale();
  if (loc === "zh-CN" || !loc.startsWith("vi")) return data;

  if ("message" in data && typeof (data as { message?: unknown }).message === "string") {
    const msg = (data as { message: string }).message;
    return { ...data, message: translateApiMessage(msg, loc) } as T;
  }
  return data;
}

export { resolveRequestLocale };
