export interface UserProp {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    roleId: number;
    createdAt: string; // ISO date string (e.g., 2023-05-15T12:34:56.789Z)
    lastLogin: string; // ISO date string
    isActive: boolean;
}