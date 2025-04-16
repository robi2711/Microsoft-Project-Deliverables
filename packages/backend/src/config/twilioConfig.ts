import dotenv from "dotenv";
import twilio from 'twilio';
dotenv.config();

const sid = process.env.TWILIO_SID;
const key = process.env.TWILIO_KEY;

const client = twilio(sid, key);

if (!sid || !key) {
    console.error("Missing environment variables for Twilio");
    process.exit(1);
}

export default client;