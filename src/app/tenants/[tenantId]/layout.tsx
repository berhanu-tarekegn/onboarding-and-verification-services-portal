import { PortalShell } from "@/components/portal/PortalShell";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  return (
    <PortalShell
      title={`Tenant: ${tenantId}`}
      subtitle="Tenant-scoped portal (path-based)."
      nav={[
        { label: "Tenants", href: "/tenants", routeKey: "tenants" },
        { label: "Dashboard", href: `/tenants/${tenantId}/dashboard`, routeKey: "tenant_dashboard" },
        { label: "Products", href: `/tenants/${tenantId}/products`, routeKey: "tenant_products" },
        { label: "Templates", href: `/tenants/${tenantId}/templates/baseline`, routeKey: "tenant_templates_baseline" },
        { label: "Extensions", href: `/tenants/${tenantId}/templates/extensions`, routeKey: "tenant_templates_extensions" },
        { label: "Transform Rules", href: `/tenants/${tenantId}/templates/transform-rules`, routeKey: "tenant_templates_extensions" },
        { label: "Submissions", href: `/tenants/${tenantId}/submissions`, routeKey: "tenant_submissions" },
      ]}
    >
      {children}
    </PortalShell>
  );
}

