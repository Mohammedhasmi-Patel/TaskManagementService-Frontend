import api from "@/lib/axios";
import type {
    CreateTimeEntryPayload,
    DeleteTimeEntryResponse,
    StopTimeEntryPayload,
    TimeEntriesResponse,
    TimeEntryResponse,
    UpdateTimeEntryPayload,
} from "@/types/time-entry";

export async function getTimeEntries(taskId?: string): Promise<TimeEntriesResponse> {
    const { data } = await api.get<TimeEntriesResponse>("/api/time-entries", {
        params: taskId ? { taskId } : undefined,
    });
    return data;
}

export async function getTimeEntryById(id: string): Promise<TimeEntryResponse> {
    const { data } = await api.get<TimeEntryResponse>(`/api/time-entries/${id}`);
    return data;
}

export async function createTimeEntry(
    payload: CreateTimeEntryPayload
): Promise<TimeEntryResponse> {
    const { data } = await api.post<TimeEntryResponse>("/api/time-entries", payload);
    return data;
}

export async function updateTimeEntry(
    id: string,
    payload: UpdateTimeEntryPayload
): Promise<TimeEntryResponse> {
    const { data } = await api.put<TimeEntryResponse>(`/api/time-entries/${id}`, payload);
    return data;
}

export async function stopTimeEntry(
    id: string,
    payload?: StopTimeEntryPayload
): Promise<TimeEntryResponse> {
    const { data } = await api.post<TimeEntryResponse>(
        `/api/time-entries/${id}/stop`,
        payload ?? {}
    );
    return data;
}

export async function deleteTimeEntry(id: string): Promise<DeleteTimeEntryResponse> {
    const { data } = await api.delete<DeleteTimeEntryResponse>(`/api/time-entries/${id}`);
    return data;
}

