import { Handler } from "express";

export interface Package {
    id: string;
    name: string;
    description: string;
    delivered: boolean;
}

export interface User {
    name: string;
    address: string;
    telephone: string;
    email: string;
    packages: Package[];
    createdAt: string;
}

export interface Customer extends User {
    id?: string;
}


