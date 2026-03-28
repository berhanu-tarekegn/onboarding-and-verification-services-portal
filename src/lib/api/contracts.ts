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
export type CreateTemplateInput = {
  name: string;
  template_type: "kyc" | "kyb";
  baseline_level: number;
  description?: string;
};
export type CreateSubmissionInput = {
  product_id?: Id;
  template_id: Id;
  form_data: Record<string, unknown>;
  submitter_id?: string;
  external_ref?: string;
};

export interface ApiClient {
  // Tenants (global)
  listTenants(): Promise<Tenant[]>;
  createTenant(input: CreateTenantInput): Promise<Tenant>;

  // Products (tenant scoped)
  listProducts(tenantId: Id): Promise<Product[]>;
  getProduct(tenantId: Id, productId: Id): Promise<Product | undefined>;
  createProduct(tenantId: Id, input: CreateProductInput): Promise<Product>;
  updateProduct(tenantId: Id, productId: Id, input: Partial<CreateProductInput>): Promise<Product>;
  activateProduct(tenantId: Id, productId: Id): Promise<Product>;
  deactivateProduct(tenantId: Id, productId: Id): Promise<Product>;

  // Templates
  listBaselineTemplates(): Promise<Template[]>;
  getBaselineTemplate(templateId: Id): Promise<Template | undefined>;
  createBaselineTemplate(input: any): Promise<Template>;
  publishBaselineTemplateDefinition(templateId: Id, versionId: string): Promise<any>;
  
  getTenantExtensionTemplate(tenantId: Id): Promise<Template | undefined>;
  listTemplatesForTenant(tenantId: Id): Promise<Template[]>;
  createTemplate(tenantId: Id, input: CreateTemplateInput): Promise<Template>;
  
  // Template Definitions (Versions)
  getTemplate(tenantId: Id, templateId: Id): Promise<Template | undefined>;
  listTemplateDefinitions(tenantId: Id, templateId: Id): Promise<any[]>;
  createTemplateDefinition(tenantId: Id, templateId: Id, isDraft: boolean, questionGroups: any[]): Promise<any>;
  submitTemplateDefinition(tenantId: Id, templateId: Id, versionId: string): Promise<any>;
  approveAndPublishTemplateDefinition(tenantId: Id, templateId: Id, versionId: string): Promise<any>;

  // Submissions
  listSubmissions(tenantId: Id): Promise<Submission[]>;
  getSubmission(tenantId: Id, submissionId: Id): Promise<Submission | undefined>;
  createSubmission(tenantId: Id, input: CreateSubmissionInput): Promise<Submission>;
  submitSubmission(tenantId: Id, submissionId: Id): Promise<Submission>;
  transitionSubmission(tenantId: Id, submissionId: Id, targetStatus: string, comments?: string): Promise<Submission>;
}

