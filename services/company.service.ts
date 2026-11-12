import api from "@/lib/axios";
import type {
    CompaniesResponse,
    CompanyPayload,
    CompanyResponse,
    CreateCompanyPayload,
    CreateCompanyResponse,
    UpdateCompanyPayload,
    UpdateCompanyResponse,
} from "@/types/company";

function buildCompanyFormData(payload: CompanyPayload): FormData {
    const formData = new FormData();
    formData.append("Name", payload.name.trim());
    formData.append("Slug", payload.slug.trim());

    if (payload.description?.trim()) {
        formData.append("Description", payload.description.trim());
    }

    if (payload.website?.trim()) {
        formData.append("Website", payload.website.trim());
    }

    formData.append("IsDefault", String(Boolean(payload.isDefault)));

    if (payload.logo) {
        formData.append("Logo", payload.logo);
    }

    return formData;
}

export async function getCompanies(): Promise<CompaniesResponse> {
    const { data } = await api.get<CompaniesResponse>("/api/companies");
    return data;
}

export async function getCompanyById(id: string): Promise<CompanyResponse> {
    const { data } = await api.get<CompanyResponse>(`/api/companies/${id}`);
    return data;
}

export async function createCompany(
    payload: CreateCompanyPayload
): Promise<CreateCompanyResponse> {
    const formData = buildCompanyFormData(payload);
    const { data } = await api.post<CreateCompanyResponse>("/api/companies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function updateCompany(
    id: string,
    payload: UpdateCompanyPayload
): Promise<UpdateCompanyResponse> {
    const formData = buildCompanyFormData(payload);
    const { data } = await api.put<UpdateCompanyResponse>(`/api/companies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}
