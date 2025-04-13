import express, {Response} from "express";
import {UserInfo, AdminInfo, CustomRequest, CustomUserRequest, ConciergeInfo} from "@/types/authTypes";
import { signUpAdmin, signUpConcierge, signInConcierge, signInAdmin, signOutAdmin } from "@/helpers/authHelper";
import {IAdmin} from "@/types/dbTypes";
import {v4 as uuidv4} from "uuid";
import {adminsContainer} from "@/config/cosmosConfig";

interface IUserController {
    signUpConcierge: express.Handler,
    signInConcierge: express.Handler,
    signUpAdmin: express.Handler,
    signOutAdmin: express.Handler,
    signInAdmin: express.Handler
}

const authController: IUserController = {

    signUpConcierge: async (req: CustomUserRequest, res: Response) => {
        const ConciergeInfo : ConciergeInfo = {
            email: req.body.credentials
        }
        const password = req.body.password as string
        try {
            const response = await signUpConcierge(ConciergeInfo, password as string);
            if (response && typeof response === "object" && response.UserConfirmed === true) {
                const admin: IAdmin = {
                    role: "concierge",
                    name: "concierge",
                    email: ConciergeInfo.email,
                    id: response.UserSub as string,
                    complexId: "",
                    createdAt: new Date().toISOString(),
                };
                await adminsContainer.items.create(admin);
            }
            res.send(response);
        } catch (error : any) {
            res.status(500).send('Error signing up user');
        }
    },

    signInConcierge: async (req: CustomRequest, res: Response) => {
        const Email = req.body.credentials;
        const Password = req.body.password
        console.log(req.body);
        try {
            const response = await signInConcierge(Email, Password);
            console.log(response);
            res.send(response);
        } catch (error) {
            res.status(500).send('Error signing in user');
        }
    },

    signUpAdmin: async (req: CustomRequest, res: Response) => {
        const AdminInfo : AdminInfo = {
            email: req.body?.credentials.email,
            givenName: req.body?.credentials.givenName,
        }
        const password = req.body.password as string
        try {
            const response = await signUpAdmin(AdminInfo, password as string);
            if (response && typeof response === "object" && response.UserConfirmed === true) {
                const admin: IAdmin = {
                    role: "admin",
                    name: AdminInfo.givenName,
                    email: AdminInfo.email,
                    id: response.UserSub as string,
                    complexId: "",
                    createdAt: new Date().toISOString(),
                };
                await adminsContainer.items.create(admin);
            }
            res.send(response);
        } catch (error : any) {
            res.status(500).send('Error signing up user');
        }
    },

    signInAdmin: async (req: CustomRequest, res: Response) => {
        const Email = req.body.credentials.email;
        const Password = req.body.password
        console.log(req.body);
        try {
            const response = await signInAdmin(Email, Password);
            console.log(response);
            res.send(response);
        } catch (error) {
            res.status(500).send('Error signing in user');
        }
    },

    signOutAdmin: async (req: CustomRequest, res: Response) => {
        const AccessToken = req.body.AccessToken;
        try {
            const response = await signOutAdmin(AccessToken);
            res.send(response);
        } catch (error) {
            res.status(500).send('Error signing out user');
        }
    },

};
export default authController;