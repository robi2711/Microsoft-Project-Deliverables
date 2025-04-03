import express, {Response} from "express";
import {UserInfo, AdminInfo, CustomRequest, CustomUserRequest} from "@/types/authTypes";
import { signUpAdmin, signUpUser, signInAdmin, signOutAdmin } from "@/helpers/authHelper";

interface IUserController {
    signUpUser: express.Handler,
    signUpAdmin: express.Handler,
    signOutAdmin: express.Handler,
    signInAdmin: express.Handler
}

const authController: IUserController = {

    signUpUser: async (req: CustomUserRequest, res: Response) => {
        const UserInfo : UserInfo = {
            email: req.body?.email,
            givenName: req.body?.givenName,
            number: req.body?.number,
            address: req.body?.address,
        }
        const password = req.body.password as string
        try {
            const response = await signUpUser(UserInfo, password as string);
            res.send(response);
        } catch (error : any) {
            res.status(500).send('Error signing up user');
        }
    },

    signUpAdmin: async (req: CustomRequest, res: Response) => {
        const AdminInfo : AdminInfo = {
            email: req.body?.email,
            givenName: req.body?.givenName,
        }
        const password = req.body.password as string
        try {
            const response = await signUpAdmin(AdminInfo, password as string);
            res.send(response);
        } catch (error : any) {
            res.status(500).send('Error signing up user');
        }
    },

    signInAdmin: async (req: CustomRequest, res: Response) => {
        const Email = req.body.Email;
        const Password = req.body.Password
        try {
            const response = await signInAdmin(Password, Email);
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