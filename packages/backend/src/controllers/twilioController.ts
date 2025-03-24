import express, { Request, Response, Handler } from "express";
import { User } from "@/types/dbTypes";
import client from "@/config/twilioConfig";

interface extendTwilio {
    sendSMS: Handler
    receiveSMS: Handler
}

const twilioController: extendTwilio = {

    //POST route for sending an SMS to a given phone number
    sendSMS: async (req: Request, res: Response): Promise<void> => {
        
        const { name, address, telephone, packages, msg } = req.body;

        console.log("Sending SMS to:", telephone);
        console.log("Name:", name);
        console.log("Address:", address);
        console.log("Packages:", packages);

        //Check if we are provided with necessary parameters
        if (!name || !telephone) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }

        //Attempt to send the message
        try {
            const message = await client.messages.create({
                body: msg || `Hello ${name}, your package has arrived. Please come pick it up.`,
                from: process.env.TWILIO_PHONE,
                to: telephone
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

    },

    //POST route for receiving an SMS, Twilio handles Webhook and sends the POST request to a given endpoint
    receiveSMS: async (req: Request, res: Response): Promise<void> => {
        console.log("Received SMS:", req.body);

        //If we are running a command, handle it
        if(req.body.startsWith("/")) {
            const args = req.body.split(" ");
            runCommand(args);
        } else {
            //Do some AI prompt stuff here
        }

        //IDEAS:
        //1. Store previous message history on database and use them for our AI prompts

        res.status(200).send();
    }
}

//Command Management
const runCommand = (args: string[]): void => {
    const command = args[0].substring(1);
    const params = args.slice(1);
    
    if(command === "register") {
        console.log("Registering user with params:", params);
    }
}
export default twilioController;