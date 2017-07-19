export interface AuthResponse {
    success: boolean;
    message: string;
    user?: AuthUser;
}

export interface AuthUser {
    alias: string;
    email: string;
    jwt: string;
}