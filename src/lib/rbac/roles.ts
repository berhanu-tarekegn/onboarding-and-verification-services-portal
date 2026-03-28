import type { Role } from "@/lib/types/domain";

export const allRoles: Role[] = ["super_admin", "tenant_admin", "agent", "auditor"];

export function canAccessRoute(role: Role, routeKey: RouteKey): boolean {
  const allowed = routePermissions[routeKey];
  return allowed.includes(role);
}

export type RouteKey =
  | "super_dashboard"
  | "tenants"
  | "tenant_dashboard"
  | "tenant_products"
  | "tenant_templates_baseline"
  | "tenant_templates_extensions"
  | "tenant_submissions";

const routePermissions: Record<RouteKey, Role[]> = {
  super_dashboard: ["super_admin"],
  tenants: ["super_admin"],
  tenant_dashboard: ["tenant_admin", "agent", "auditor"],
  tenant_products: ["tenant_admin"],
  tenant_templates_baseline: ["super_admin"],
  tenant_templates_extensions: ["tenant_admin"],
  tenant_submissions: ["tenant_admin", "agent", "auditor"],
};

