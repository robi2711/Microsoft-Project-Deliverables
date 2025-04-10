import express, { Request, Response, Handler } from "express";
import { User } from "@/types/dbTypes";
import client from "@/config/twilioConfig";
import axios from "axios";
import pdfParse from 'pdf-parse';
import { text } from "stream/consumers";

interface extendTwilio {
    sendSMS: Handler
    receiveSMS: Handler
}

//Command Management
const runCommand = (args: string[]): void => {
    const command = args[0].substring(1);
    const params = args.slice(1);
    
    if(command === "register") {
        console.log("Registering user with params:", params);
        const email = params[0];

        //IDEA: Generate a token, give link to the user to register and get them to put in the token
        //Register accoutn with email and the password that they give

    }
}

//Process the contract we received
const processContract = (text: string): void => {

    //Use the LLM to extract the data, check in the database if user exists

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
                //body: msg || `Hello ${name}, your package has arrived. Please come pick it up.`,
                from: process.env.TWILIO_PHONE,
                to: telephone,
                contentSid: "HX9404ac9cf792bb00cf9ccff03dba9472",
                contentVariables: JSON.stringify({        
                  1: name,
                }),
            
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

        //Check if we receive contract
        const numMedia = parseInt(req.body.NumMedia || '0', 10);

        if (numMedia > 0) {

            //Hardcoded for now for testing
            const mediaUrl = ''//req.body.MediaUrl0;
            const contentType = 'application/pdf'//req.body.MediaContentType0;
            
            //Read PDF directly
            if(contentType == 'application/pdf') {
                try {
                    // Download the PDF file
                    const pdfResponse = await axios.get(mediaUrl, {
                      responseType: 'arraybuffer',
                      auth: {
                        username: process.env.TWILIO_SID,
                        password: process.env.TWILIO_AUTH_TOKEN,
                      },
                    });
                    
                    const data = await pdfParse(pdfResponse.data);

                    console.log('PDF text content:', data.text);
                    processContract(data.text);
                    res.send('PDF received and parsed successfully!');
                } catch(error) {
                    console.error('Error parsing PDF:', error);
                    res.status(500).send('Error handling PDF');
                }
            }

            //Read image and do OCR
            if(contentType == 'image/jpeg' || contentType == 'image/png') {
                try {
                    // Download the image file
                    const imageResponse = await axios.get(mediaUrl, {
                      responseType: 'arraybuffer',
                      auth: {
                        username: process.env.TWILIO_SID,
                        password: process.env.TWILIO_AUTH_TOKEN,
                      },
                    });

                    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                
                    // Perform OCR on the image

                } catch(error) {
                    console.error('Error parsing image:', error);
                    res.status(500).send('Error handling image');
                }
            }
        }

        res.status(200).send();
    }
}

export default twilioController;