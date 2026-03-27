import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

export function PortalShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <div className="px-5 py-4 border-b">
          <div className="text-sm font-semibold tracking-tight">eKYC Portal</div>
          <div className="text-xs text-zinc-500">Mock-first admin UI</div>
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b bg-white/85 backdrop-blur">
          <div className="px-6 py-4">
            <div className="text-lg font-semibold">{title}</div>
            {subtitle ? (
              <div className="text-sm text-zinc-500">{subtitle}</div>
            ) : null}
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

