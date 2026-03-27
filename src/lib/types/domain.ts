export type Id = string;

export type Role = "super_admin" | "tenant_admin" | "agent" | "auditor";

export type Tenant = {
  id: Id;
  name: string;
  schema_name?: string;
  status?: string;
  created_at?: string;
};

export type ProductStatus = "draft" | "active" | "inactive";

export type Product = {
  id: Id;
  name: string;
  product_code: string;
  status: ProductStatus;
  version: number;
  template_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type TemplateType = "kyc" | "kyb";

export type Template = {
  id: Id;
  name: string;
  template_type: TemplateType;
  baseline_level: number;
  is_active: boolean;
  active_version_id?: string;
  schema?: any;
  version?: string;
};

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "returned"
  | "completed"
  | "cancelled";

export type Submission = {
  id: Id;
  template_id: Id;
  template_version_id: Id;
  product_id?: Id;
  form_data: Record<string, unknown>;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  submitter_id?: string;
  external_ref?: string;
};

export type FieldType =
  | "text"
  | "dropdown"
  | "radio"
  | "date"
  | "checkbox"
  | "fileUpload"
  | "signature"
  | "imageCapture";

export type FieldSchema = {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: string[];
  dependsOn?: string;
  visibleWhenEquals?: unknown;
  regex?: string;
  minDate?: string;
  maxDate?: string;
  defaultValue?: unknown;
  rowGroup?: string;
  flex?: number;
  columnSpan?: number;
  startNewRow?: boolean;
};

export type FormSchema = {
  title: string;
  fields: FieldSchema[];
};

// Deprecated alias (older UI used "case"). Do not use in new code.
export type Case = Submission;

