import {
    AuthFlowType,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    NotAuthorizedException,
    GetUserCommand,
    SignUpCommand,
    UsernameExistsException
} from "@aws-sdk/client-cognito-identity-provider";
import { UserInfo, AdminInfo } from "@/types/authTypes";
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
                Name: 'email',
                Value: UserInfo.email
            },
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
export const signUpAdmin = async (AdminInfo:AdminInfo ,Password: string) => {
    const params = {
        ClientId: process.env.COGNITO_ADMIN_CLIENT_ID || '',
        Username: AdminInfo.email,
        Password: Password,
        UserAttributes: [
            {
                Name: 'given_name',
                Value: AdminInfo.givenName
            }
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

export const getUser = async (AccessToken: string) => {
    const params = {
        AccessToken: AccessToken
    }

    try {
        const command = new GetUserCommand(params);
        return await client.send(command);
    } catch (error) {
        console.error('Error retrieving user in CONFIG:', error);
    }
}

export const signInAdmin = async (AdminInfo:AdminInfo,Password: string) => {
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH" as AuthFlowType,
        ClientId: process.env.COGNITO_CLIENT_ID || '',
        AuthParameters: {
            USERNAME: AdminInfo.email,
            PASSWORD: Password,
        }
    }

    try {
        const command = new InitiateAuthCommand(params);
        const response = await client.send(command);
        const userInfo = await getUser(response.AuthenticationResult?.AccessToken as string);

        return {
            email: AdminInfo.email,
            sub: userInfo?.UserAttributes?.find((attr) => attr.Name === 'sub')?.Value,
            username: userInfo?.UserAttributes?.find((attr) => attr.Name === 'given_name')?.Value,
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
            tokenType: response.AuthenticationResult?.TokenType,
        };
    } catch (error) {
        if (error instanceof NotAuthorizedException) {
            return 'Wrong Username or Password';
        }
        console.error('Error Signing In user in CONFIG:', error);
    }
}

export const signOutAdmin = async (AccessToken : string) => {
    const params = {
        AccessToken: AccessToken
    }
    try {
        const command = new GlobalSignOutCommand(params);
        return await client.send(command);
    } catch (error) {
        console.error('Error signing out user in CONFIG:', error);
    }
}