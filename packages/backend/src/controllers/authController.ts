import express, {Response} from "express";
import {UserInfo, AdminInfo, CustomRequest, CustomUserRequest, ConciergeInfo} from "@/types/authTypes";
import { signUpAdmin, signUpConcierge, signInConcierge, signInAdmin, signOutAdmin } from "@/helpers/authHelper";
import {Complex, IAdmin} from "@/types/dbTypes";
import {adminsContainer, complexesContainer} from "@/config/cosmosConfig";

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
                    complexId: req.body.complexId,
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
        const Password = req.body.password;
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

            const address = req.body.address;

            if (response && typeof response === "object" && response.UserConfirmed === true) {
                const complex: Complex = {
                    id: response.UserSub + "c0" as string,
                    address: address,
                    admins: [response.UserSub as string],
                    concierges: [],
                    users: [],
                    createdAt: new Date().toISOString(),
                };

                await complexesContainer.items.create(complex);

                const admin: IAdmin = {
                    role: "admin",
                    name: AdminInfo.givenName,
                    email: AdminInfo.email,
                    id: response.UserSub as string,
                    complexId: response.UserSub as string,
                    complexIds: [response.UserSub as string + "c0"],
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
            if(response && typeof response === "object" && response.sub !== undefined) {
                console.log(await adminsContainer.item(response.sub, "").read<IAdmin>());
                const { resource: admin } = await adminsContainer.item(response.sub, response.sub).read<IAdmin>();
                const complexIds = admin?.complexIds;

                res.send({...response, complexIds});
            }
            else {
                res.status(400).send('Invalid response from signInAdmin');
            }
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