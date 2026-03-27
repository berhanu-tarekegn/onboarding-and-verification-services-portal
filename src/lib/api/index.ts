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
  async getProduct(tenantId, productId) {
    return await portalFetch<Product>(`/api/portal/products/${encodeURIComponent(productId)}?tenantId=${encodeURIComponent(tenantId)}`);
  },
  async createProduct(tenantId, input) {
    return await portalFetch<Product>("/api/portal/products", {
      method: "POST",
      json: { tenantId, ...input },
    });
  },
  async updateProduct(tenantId, productId, input) {
    return await portalFetch<Product>(`/api/portal/products/${encodeURIComponent(productId)}`, {
      method: "PATCH",
      json: { tenantId, ...input },
    });
  },
  async activateProduct(tenantId, productId) {
    return await portalFetch<Product>(`/api/portal/products/${encodeURIComponent(productId)}/activate`, {
      method: "POST",
      json: { tenantId },
    });
  },
  async deactivateProduct(tenantId, productId) {
    return await portalFetch<Product>(`/api/portal/products/${encodeURIComponent(productId)}/deactivate`, {
      method: "POST",
      json: { tenantId },
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
  async createTemplateDefinition(tenantId, templateId, isDraft, questionGroups) {
    return await portalFetch<any>(`/api/portal/templates/${encodeURIComponent(templateId)}/definitions`, {
      method: "POST",
      json: { tenantId, is_draft: isDraft, question_groups: questionGroups },
    });
  },
  async getBaselineTemplate() {
    const list = await portalFetch<Template[]>("/api/portal/baseline-templates");
    const baseline = list[0];
    if (!baseline || !baseline.active_version_id) return baseline;
    // We need to fetch the definition to get the schema
    const def = await portalFetch<{ question_groups: any }>(`/api/portal/baseline-templates/${baseline.id}/definitions/${baseline.active_version_id}`);
    return { ...baseline, schema: { title: baseline.name, fields: def.question_groups } } as any;
  },
  async getTenantExtensionTemplate(tenantId) {
    const list = await portalFetch<Template[]>(
      `/api/portal/templates?tenantId=${encodeURIComponent(tenantId)}`
    );
    const ext = list[0];
    if (!ext || !ext.active_version_id) return ext;
    const def = await portalFetch<{ question_groups: any }>(
      `/api/portal/templates/${ext.id}/definitions/${ext.active_version_id}?tenantId=${encodeURIComponent(tenantId)}`
    );
    return { ...ext, schema: { title: ext.name, fields: def.question_groups } } as any;
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
  async submitSubmission(tenantId, submissionId) {
    return await portalFetch<Submission>(`/api/portal/submissions/${encodeURIComponent(submissionId)}/submit?tenantId=${encodeURIComponent(tenantId)}`, {
      method: "POST",
    });
  },
  async transitionSubmission(tenantId, submissionId, targetStatus, comments) {
    return await portalFetch<Submission>(`/api/portal/submissions/${encodeURIComponent(submissionId)}/transition?tenantId=${encodeURIComponent(tenantId)}`, {
      method: "POST",
      json: { target_status: targetStatus, comments },
    });
  },
};

