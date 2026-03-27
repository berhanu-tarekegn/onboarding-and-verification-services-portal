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
        { label: "Tenants", href: "/tenants" },
        { label: "Dashboard", href: `/tenants/${tenantId}/dashboard` },
        { label: "Products", href: `/tenants/${tenantId}/products` },
        { label: "Templates", href: `/tenants/${tenantId}/templates/baseline` },
        { label: "Extensions", href: `/tenants/${tenantId}/templates/extensions` },
        { label: "Cases", href: `/tenants/${tenantId}/cases` },
      ]}
    >
      {children}
    </PortalShell>
  );
}

