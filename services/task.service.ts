import api from "@/lib/axios";
import type {
    CreateTaskPayload,
    DeleteTaskResponse,
    TaskFilters,
    TaskResponse,
    TasksResponse,
    UpdateTaskPayload,
} from "@/types/task";

export async function getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    const params: Record<string, string> = {};
    if (filters?.projectId) params.projectId = filters.projectId;
    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;
    if (filters?.fromDate) params.fromDate = filters.fromDate;
    if (filters?.toDate) params.toDate = filters.toDate;

    const { data } = await api.get<TasksResponse>("/api/tasks", {
        params: Object.keys(params).length > 0 ? params : undefined,
    });
    return data;
}

export async function getTaskById(id: string): Promise<TaskResponse> {
    const { data } = await api.get<TaskResponse>(`/api/tasks/${id}`);
    return data;
}

export async function createTask(
    payload: CreateTaskPayload
): Promise<TaskResponse> {
    const { data } = await api.post<TaskResponse>("/api/tasks", payload);
    return data;
}

export async function updateTask(
    id: string,
    payload: UpdateTaskPayload
): Promise<TaskResponse> {
    const { data } = await api.put<TaskResponse>(`/api/tasks/${id}`, payload);
    return data;
}

export async function deleteTask(id: string): Promise<DeleteTaskResponse> {
    const { data } = await api.delete<DeleteTaskResponse>(`/api/tasks/${id}`);
    return data;
}

