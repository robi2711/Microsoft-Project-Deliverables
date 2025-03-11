import express, { Request, Response, Handler } from "express";
import { User } from "@/types/dbTypes";
import client from "@/config/twilioConfig";

interface extendTwilio {
    sendSMS: Handler
}

const twilioController: extendTwilio = {
    sendSMS: async (req: Request, res: Response): Promise<void> => {
        
        const { name, address, telephone, email, packages } = req.body as User;

        if (!name || !telephone) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }

        try {
            const message = await client.messages.create({
                body: `Hello ${name}, your package has arrived. Please come pick it up.`,
                from: 'whatsapp:+'+process.env.TWILIO_PHONE,
                contentSid: process.env.TWILIO_SID,
                to: 'whatsapp+'+telephone
            });

            res.status(200).json({
                message: "SMS sent successfully!",
                messageSid: message.sid,
            });
            return;
        } catch (error) {
            console.error("Error sending SMS:", error);
            res.status(500).json({ message: "Failed to send SMS." });
            return;
        }

    }
}

export default twilioController;