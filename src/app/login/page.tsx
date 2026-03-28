"use client";

import { useRouter } from "next/navigation";
import { setMockRole } from "@/lib/rbac/mockRole";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: "super_admin" | "tenant_admin") => {
    setMockRole(role);
    // Super Admins go to the global tenant management page
    // Tenant Admins go to select their specific tenant workspace
    if (role === "super_admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/select-tenant");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-zinc-50 p-4 sm:p-6">
      <div className="w-full max-w-[800px] grid lg:grid-cols-2 gap-8 lg:gap-0 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Left side: branding/info */}
        <div className="bg-zinc-950 p-10 flex flex-col justify-between hidden lg:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">eKYC Portal</h1>
            <p className="text-zinc-400 font-medium">Multi-tenant Identity Platform</p>
          </div>
          
          <div className="relative z-10">
            <div className="px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-zinc-400 italic">
                "Separation of concerns is key. Super admins manage the platform. Tenant admins manage their customers."
              </p>
            </div>
          </div>
        </div>

        {/* Right side: login options */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8 lg:mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-zinc-950 mb-2">Welcome Back</h2>
            <p className="text-sm text-zinc-500">Choose your role to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin("super_admin")}
              className="w-full text-left group relative flex items-center p-4 sm:p-5 rounded-xl border-2 border-zinc-200 hover:border-zinc-950 transition-all duration-200 hover:shadow-md bg-white"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-bold text-zinc-950">Super Admin</div>
                <div className="text-xs text-zinc-500 mt-0.5">Manage all tenants and baselines</div>
              </div>
              <div className="text-zinc-300 group-hover:text-zinc-950 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => handleLogin("tenant_admin")}
              className="w-full text-left group relative flex items-center p-4 sm:p-5 rounded-xl border-2 border-zinc-200 hover:border-zinc-950 transition-all duration-200 hover:shadow-md bg-white"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <div className="text-sm font-bold text-zinc-950">Tenant Admin</div>
                <div className="text-xs text-zinc-500 mt-0.5">Manage products for a workspace</div>
              </div>
              <div className="text-zinc-300 group-hover:text-zinc-950 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase">Mock Authentication Entrypoint</p>
          </div>
        </div>
      </div>
    </div>
  );
}
