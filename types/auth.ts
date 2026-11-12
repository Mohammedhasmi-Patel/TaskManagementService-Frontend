export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: number;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthData {
    accessToken: string;
    expiresAt: string;
    user: AuthUser;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type AuthResponse = ApiResponse<AuthData>;
export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;

export interface ApiErrorPayload {
    success?: boolean;
    message?: string;
    statusCode?: number;
}

