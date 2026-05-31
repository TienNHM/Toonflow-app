import { getApiLocale, translateApiMessage } from "@/utils/apiI18n";
import { isViLocale } from "@/utils/runtimeLocale";

/** Stable keys sent as chat message `name` — translated on web via i18n. */
export const AGENT_ROLE_KEYS = {
  scriptCoordinator: "scriptCoordinator",
  productionPlanner: "productionPlanner",
} as const;

type RoleKey = (typeof AGENT_ROLE_KEYS)[keyof typeof AGENT_ROLE_KEYS];

const ZH: Record<RoleKey, string> = {
  scriptCoordinator: "统筹",
  productionPlanner: "视频策划",
};

const VI: Record<RoleKey, string> = {
  scriptCoordinator: "Điều phối",
  productionPlanner: "Lập kế hoạch video",
};

const EN: Record<RoleKey, string> = {
  scriptCoordinator: "Coordinator",
  productionPlanner: "Video planning",
};

export function agentRoleLabel(key: RoleKey, locale?: string): string {
  const loc = locale ?? getApiLocale();
  if (isViLocale(loc)) return VI[key];
  if (loc.startsWith("en")) return EN[key];
  return ZH[key];
}

/** Map legacy Chinese labels from DB/old sessions to stable keys (optional). */
export function normalizeAgentRoleName(name: string | undefined): string | undefined {
  if (!name) return name;
  if (name === "统筹") return AGENT_ROLE_KEYS.scriptCoordinator;
  if (name === "视频策划") return AGENT_ROLE_KEYS.productionPlanner;
  return name;
}

export function translateAgentToolError(message: string, locale?: string): string {
  return translateApiMessage(message, locale);
}
