import api, { TOKEN_KEY } from "@/lib/axios";
import type {
    ApiResponse,
    AuthResponse,
    AuthUser,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "@/types/auth";

function persistAuthToken(response: AuthResponse) {
    if (typeof window !== "undefined" && response.success && response.data?.accessToken) {
        localStorage.setItem(TOKEN_KEY, response.data.accessToken);
    }
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/api/auth/register", payload);
    persistAuthToken(data);
    return data;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
    persistAuthToken(data);
    return data;
}

export async function getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const { data } = await api.get<ApiResponse<AuthUser>>("/api/auth/me");
    return data;
}

export function logoutUser() {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
    }
}
