import {Request} from "express";
import session from "express-session";

export interface UserInfo {
    email: string;
    givenName: string;
    number: string;
    address: string;
}

export interface CustomRequest extends Request {
    session: session.Session & {
        userInfo?: UserInfo;
    };
}
