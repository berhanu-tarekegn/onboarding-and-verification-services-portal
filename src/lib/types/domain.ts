export type Id = string;

export type Role = "super_admin" | "tenant_admin" | "agent" | "auditor";

export type Tenant = {
  id: Id;
  name: string;
  status?: string;
  created_at?: string;
};

export type Product = {
  id: Id;
  // FastAPI uses product_code; we keep code as an alias for older UI calls.
  product_code?: string;
  code?: string;
  name: string;
  description?: string;
  status?: string;
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

export type Template = {
  id: Id;
  name: string;
  version?: number;
  is_published?: boolean;
  schema?: unknown;
};

export type Submission = {
  id: Id;
  status?: string;
  payload?: Record<string, unknown>;
  decision?: Record<string, unknown>;
  templateId?: Id;
};

// Deprecated alias (older UI used "case"). Do not use in new code.
export type Case = Submission;

