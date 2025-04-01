import {
    SignUpCommand,
    UsernameExistsException
} from "@aws-sdk/client-cognito-identity-provider";
import { UserInfo } from "@/types/authUserTypes";
import {client} from "@/config/authConfig";
import dotenv from "dotenv";

dotenv.config();

export const signUpUser = async (UserInfo: UserInfo, password : string) => {
    const params = {
        ClientId: process.env.COGNITO_USER_CLIENT_ID || '',
        Username: UserInfo.email,
        Password: password as string,
        UserAttributes: [
            {
                Name: 'given_name',
                Value: UserInfo.givenName,
            },
            {
                Name: 'address',
                Value: UserInfo.address
            },
            {
                Name: 'phone_number',
                Value: UserInfo.number
            },
        ]
    }

    try {
        const command = new SignUpCommand(params);
        return await client.send(command);
    } catch (error) {
        if (error instanceof UsernameExistsException) {
            return 'Username already exists';
        }
        console.error('Error signing up user in CONFIG:', error);
    }
}