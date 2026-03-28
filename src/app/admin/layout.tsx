import { PortalShell } from "@/components/portal/PortalShell";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      title="Platform Admin"
      subtitle="Super Admin global dashboard"
      nav={[
        { label: "Dashboard", href: "/admin/dashboard", routeKey: "super_dashboard" },
        { label: "Tenants Directory", href: "/tenants", routeKey: "tenants" },
        { label: "Baseline Templates", href: "/baselines", routeKey: "tenant_templates_baseline" }
      ]}
    >
      {children}
    </PortalShell>
  );
}
