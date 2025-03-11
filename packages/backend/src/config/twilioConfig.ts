import dotenv from "dotenv";
dotenv.config();

const sid = process.env.TWILIO_SID;
const key = process.env.TWILIO_KEY;

const client = require('twilio')(sid, key);

if (!sid || !key) {
    console.error("Missing environment variables for Twilio");
    process.exit(1);
}

