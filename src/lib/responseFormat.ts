import { getApiLocale, translateApiMessage, translateApiPayload } from "@/utils/apiI18n";

export interface ApiResponse {
  code: number;
  data: any;
  message: string;
}

// 成功回调
export function success<T>(data: T | null = null, message: string = "成功"): ApiResponse {
  const locale = getApiLocale();
  return {
    code: 200,
    data: translateApiPayload(data, locale),
    message: translateApiMessage(message, locale),
  };
}

// 客户端错误响应
export function error<T>(message: string = "", data: T | null = null): ApiResponse {
  const locale = getApiLocale();
  return {
    code: 400,
    data: translateApiPayload(data, locale),
    message: translateApiMessage(message, locale),
  };
}
