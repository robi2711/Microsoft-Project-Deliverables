import {Request} from "express";
import session from "express-session";

export interface UserInfo {
    email: string;
    givenName: string;
    number: string;
    address: string;
}

export interface ConciergeInfo {
    email: string;
}

export interface AdminInfo {
    email: string;
    givenName: string;
}

export interface CustomRequest extends Request {
    session: session.Session & {
        userInfo?: UserInfo;
        AdminInfo?: AdminInfo;
    };
}

export interface CustomUserRequest extends Request {
    userInfo?: UserInfo;
    AdminInfo?: AdminInfo;
}