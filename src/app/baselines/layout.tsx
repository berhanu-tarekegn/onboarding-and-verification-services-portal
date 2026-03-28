import { PortalShell } from "@/components/portal/PortalShell";

export default function BaselinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      title="Global Configurations"
      subtitle="Manage global platform configurations and baseline schemas."
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
