import type { Id, Product, Submission, Template, Tenant } from "@/lib/types/domain";

// This file defines the interface boundary between the UI and any data source.

export type CreateTenantInput = Pick<Tenant, "name"> & {
  schema_name: string;
};
export type CreateProductInput = {
  product_code: string;
  name: string;
  description?: string;
};
export type CreateTemplateInput = Pick<Template, "name"> & {
  // The backend accepts a JSON schema/blob. We keep it flexible.
  schema?: unknown;
};
export type CreateSubmissionInput = {
  productId?: Id;
  templateId: Id;
  payload: Record<string, unknown>;
};

export interface ApiClient {
  // Tenants (global)
  listTenants(): Promise<Tenant[]>;
  createTenant(input: CreateTenantInput): Promise<Tenant>;

  // Products (tenant scoped)
  listProducts(tenantId: Id): Promise<Product[]>;
  createProduct(tenantId: Id, input: CreateProductInput): Promise<Product>;

  // Templates
  getBaselineTemplate(): Promise<Template | undefined>;
  getTenantExtensionTemplate(tenantId: Id): Promise<Template | undefined>;
  listTemplatesForTenant(tenantId: Id): Promise<Template[]>;
  createTemplate(tenantId: Id, input: CreateTemplateInput): Promise<Template>;

  // Submissions
  listSubmissions(tenantId: Id): Promise<Submission[]>;
  getSubmission(tenantId: Id, submissionId: Id): Promise<Submission | undefined>;
  createSubmission(tenantId: Id, input: CreateSubmissionInput): Promise<Submission>;
}

