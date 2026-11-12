import api from "@/lib/axios";
import type {
    CreateTechnologyPayload,
    DeleteTechnologyResponse,
    TechnologiesResponse,
    TechnologyPayload,
    TechnologyResponse,
    UpdateTechnologyPayload,
} from "@/types/technology";

function buildTechnologyFormData(payload: TechnologyPayload): FormData {
    const formData = new FormData();
    formData.append("Name", payload.name.trim());
    formData.append("Slug", payload.slug.trim());

    if (payload.description?.trim()) {
        formData.append("Description", payload.description.trim());
    }

    if (payload.logo) {
        formData.append("Logo", payload.logo);
    }

    return formData;
}

export async function getTechnologies(): Promise<TechnologiesResponse> {
    const { data } = await api.get<TechnologiesResponse>("/api/technologies");
    return data;
}

export async function getTechnologyById(id: string): Promise<TechnologyResponse> {
    const { data } = await api.get<TechnologyResponse>(`/api/technologies/${id}`);
    return data;
}

export async function createTechnology(
    payload: CreateTechnologyPayload
): Promise<TechnologyResponse> {
    const formData = buildTechnologyFormData(payload);
    const { data } = await api.post<TechnologyResponse>("/api/technologies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function updateTechnology(
    id: string,
    payload: UpdateTechnologyPayload
): Promise<TechnologyResponse> {
    const formData = buildTechnologyFormData(payload);
    const { data } = await api.put<TechnologyResponse>(`/api/technologies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function deleteTechnology(id: string): Promise<DeleteTechnologyResponse> {
    const { data } = await api.delete<DeleteTechnologyResponse>(`/api/technologies/${id}`);
    return data;
}

