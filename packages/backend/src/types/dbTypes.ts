export interface Package {
    id: string;
    name: string;
    description: string;
    delivered: boolean;
}

export interface IUser {
    id: string;
    complexId: string;  // Reference to Complex
    name: string;
    address: string; // Unit number - should we rename this?
    telephone: string;
    email: string;
    packages: Package[];
    createdAt: string;
}

export interface IAdmin {
    id: string;
    complexId: string;
    name: string;
    role: "admin" | "concierge"; // Differentiates Admin and Concierge
    email: string;
    createdAt: string;
}

export interface Complex {
    id: string;
    address: string;
    admins: string[];  // Stores only Admin IDs
    users: string[];   // Stores only User IDs
    createdAt: string;
}
