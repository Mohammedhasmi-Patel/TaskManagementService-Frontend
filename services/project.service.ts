import api from "@/lib/axios";
import type {
    CreateProjectPayload,
    DeleteProjectResponse,
    ProjectResponse,
    ProjectsResponse,
    UpdateProjectPayload,
} from "@/types/project";

export async function getProjects(companyId?: string): Promise<ProjectsResponse> {
    const { data } = await api.get<ProjectsResponse>("/api/projects", {
        params: companyId ? { companyId } : undefined,
    });
    return data;
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
    const { data } = await api.get<ProjectResponse>(`/api/projects/${id}`);
    return data;
}

export async function createProject(
    payload: CreateProjectPayload
): Promise<ProjectResponse> {
    const { data } = await api.post<ProjectResponse>("/api/projects", payload);
    return data;
}

export async function updateProject(
    id: string,
    payload: UpdateProjectPayload
): Promise<ProjectResponse> {
    const { data } = await api.put<ProjectResponse>(`/api/projects/${id}`, payload);
    return data;
}

export async function deleteProject(id: string): Promise<DeleteProjectResponse> {
    const { data } = await api.delete<DeleteProjectResponse>(`/api/projects/${id}`);
    return data;
}
