import express, {Response} from "express";
import {UserInfo, CustomRequest} from "@/types/authUserTypes";
import { signUpUser } from "@/helpers/authUserHelper";

interface IUserController {
    signUp: express.Handler,
}

const authController: IUserController = {

    signUp: async (req: CustomRequest, res: Response) => {
        // const UserInfo : UserInfo = {
        //     email: req.body?.email,
        //     givenName: req.body?.givenName,
        //     number: req.body?.number,
        //     address: req.body?.address,
        // }
        // const password = req.body.password as string
        const UserInfo : UserInfo = {
            email: "test",
            givenName: "test",
            number: "test",
            address: "1 test",
        }
        const password = "PoopyWater1!!!" as string
        try {
            const response = await signUpUser(UserInfo, password as string);
            res.send(response);
        } catch (error : any) {
            res.status(500).send('Error signing up user');
        }
    }

};
export default authController;