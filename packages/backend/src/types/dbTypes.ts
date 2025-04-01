export interface Package {
    id: string;
    name: string; // Why do packages have names?
    description: string;
    delivered: boolean;
    // Should we add a field for the date/time the package was delivered?
}

export interface IUser {
    id: string;
    complexId: string;  // Reference to Complex
    name: string;
    unitNumber: string; // Unit number - should we rename this? - it was address
    phone: string; // changed to phone from telephone to match cosmos
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
