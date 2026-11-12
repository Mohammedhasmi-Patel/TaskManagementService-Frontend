import type { ApiResponse } from "@/types/auth";

export interface Technology {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
}

export interface TechnologyPayload {
    name: string;
    slug: string;
    description?: string;
    logo?: File;
}

export type CreateTechnologyPayload = TechnologyPayload;
export type UpdateTechnologyPayload = TechnologyPayload;

export type TechnologiesResponse = ApiResponse<Technology[]>;
export type TechnologyResponse = ApiResponse<Technology>;
export type DeleteTechnologyResponse = ApiResponse<object | null>;
