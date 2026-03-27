import type { ApiClient } from "./contracts";
import { portalFetch } from "./client";
import type { Product, Submission, Template, Tenant } from "@/lib/types/domain";

// UI -> (Next BFF) -> FastAPI
export const api: ApiClient = {
  async listTenants() {
    return await portalFetch<Tenant[]>("/api/portal/tenants");
  },
  async createTenant(input) {
    return await portalFetch<Tenant>("/api/portal/tenants", { method: "POST", json: input });
  },

  async listProducts(tenantId) {
    return await portalFetch<Product[]>(`/api/portal/products?tenantId=${encodeURIComponent(tenantId)}`);
  },
  async createProduct(tenantId, input) {
    return await portalFetch<Product>("/api/portal/products", {
      method: "POST",
      json: { tenantId, ...input },
    });
  },

  async listTemplatesForTenant(tenantId) {
    return await portalFetch<Template[]>(
      `/api/portal/templates?tenantId=${encodeURIComponent(tenantId)}`
    );
  },
  async createTemplate(tenantId, input) {
    return await portalFetch<Template>("/api/portal/templates", {
      method: "POST",
      json: { tenantId, ...input },
    });
  },
  async getBaselineTemplate() {
    const list = await portalFetch<Template[]>("/api/portal/baseline-templates");
    return list[0];
  },
  async getTenantExtensionTemplate(tenantId) {
    const list = await portalFetch<Template[]>(
      `/api/portal/templates?tenantId=${encodeURIComponent(tenantId)}`
    );
    return list[0];
  },

  async listSubmissions(tenantId) {
    return await portalFetch<Submission[]>(
      `/api/portal/submissions?tenantId=${encodeURIComponent(tenantId)}`
    );
  },
  async getSubmission(tenantId, submissionId) {
    return await portalFetch<Submission>(
      `/api/portal/submissions/${encodeURIComponent(submissionId)}?tenantId=${encodeURIComponent(tenantId)}`
    );
  },
  async createSubmission(tenantId, input) {
    return await portalFetch<Submission>("/api/portal/submissions", {
      method: "POST",
      json: { tenantId, ...input },
    });
  },
};

