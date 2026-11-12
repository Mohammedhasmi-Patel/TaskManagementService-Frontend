import type { ApiResponse } from "@/types/auth";

export interface Company {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    website: string | null;
    description: string | null;
    isDefault: boolean;
}

export interface CompanyPayload {
    name: string;
    slug: string;
    description?: string;
    website?: string;
    isDefault?: boolean;
    logo?: File;
}

export type CreateCompanyPayload = CompanyPayload;
export type UpdateCompanyPayload = CompanyPayload;

export type CompaniesResponse = ApiResponse<Company[]>;
export type CompanyResponse = ApiResponse<Company>;
export type CreateCompanyResponse = CompanyResponse;
export type UpdateCompanyResponse = CompanyResponse;
