import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import dotenv from "dotenv";
dotenv.config();
export const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION_ID || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
})

