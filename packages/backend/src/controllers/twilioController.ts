import express, { Request, Response, Handler } from "express";
import client from "@/config/twilioConfig";
import axios from "axios";
import pdfParse from 'pdf-parse';
import dotenv from "dotenv";
import FormData from 'form-data';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface extendTwilio {
    sendSMS: Handler
    receiveSMS: Handler
    sendCustomMessage: void
}

interface llmResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
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
const processContract = async (text: string, phone: string): void => {

    //Use the LLM to extract the data, check in the database if user exists...
    console.log("Received contract data: " + text)

    //Try extract some data from the contract
    const prompt = `You will be given some OCR scanned text from a letter. You have to deduce and return the following fields in JSON format that make the most sense for the fields. If you're not sure about any value, return null.
                    ONLY RETURN THE JSON!
                    Required format:
                    {
                        "name": string | null,
                        "flat_number": string | null,
                        "complex": string | null,
                        "postal_code": string | null
                    }

                    OCR Text: ${text}`;

    const llmApiResponse = await axios.post<llmResponse>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'google/gemini-2.0-flash-001',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    let response = llmApiResponse.data.choices[0].message.content;

    //Fix up the formatting of the response
    if(response.startsWith('```')) {
        response = response.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
    }

    //Parse the data
    let parsed: any = null;
        try {
            parsed = JSON.parse(response);
        } catch {
            console.log(`Failed to parse LLM response as JSON: ${response}`);
            sendCustomMessage("Failed to process contract! Please contact your complex administrator or concierge", phone);
            return;
    }


    //TODO
    //Try to check the database for the user
    
    //If user exists, send them a message
    //Otherwise, confirm the number


}

//Send custom message to user
const sendCustomMessage = async (message: string, phone: string): Promise<void> => {
    try {
        await client.messages.create({
            //body: msg || `Hello ${name}, your package has arrived. Please come pick it up.`,
            from: process.env.TWILIO_PHONE,
            to: phone,
            body: message
        });
        console.log("Custom message sent successfully!");
        return;
    } catch (error) {
        console.error("Error sending SMS:", error);
        return;
    }
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

        const text = req.body.Body;
        console.log("Received SMS:", text);

        const phone = req.body.From;

        //Check if we receive contract
        const numMedia = parseInt(req.body.NumMedia || '0', 10);

        if (numMedia > 0) {

            //Hardcoded for now for testing
            const mediaUrl = req.body.MediaUrl0;
            const contentType = req.body.MediaContentType0;
            
            //Read PDF directly
            if(contentType == 'application/pdf') {
                try {
                    // Download the PDF file
                    const pdfResponse = await axios.get(mediaUrl, {
                      responseType: 'arraybuffer',
                      auth: {
                        username: process.env.TWILIO_SID,
                        password: process.env.TWILIO_KEY,
                      },
                      headers: {
                        'Content-Type': 'application/pdf'
                      }
                    });
                    
                    const data = await pdfParse(pdfResponse.data);
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
                        password: process.env.TWILIO_KEY,
                      },
                    });

                    const imageBuffer = Buffer.from(imageResponse.data);
                    
                    const form = new FormData();
                    form.append('image', imageBuffer, {
                        filename: 'image.jpg',
                        contentType: contentType,
                    });
                    
                    const ocrData = await axios.post('http://localhost:3001/ocr', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    const ocrResponse = ocrData.data.allLines.join('\n');

                    processContract(ocrResponse);
                    res.send('Image received and processed successfully!');

                } catch(error) {
                    console.error('Error parsing image:', error);
                    res.status(500).send('Error handling image');
                }
            }
        } else {
            //If we are running a command, handle it
            if(text.startsWith("/")) {
                const args = text.split(" ");
                runCommand(args);
            } else {
                //Do some AI prompt stuff here
                const parcels = `` //TODO: Get the parcels from the database and format them into a string
                const prompt = `You are a helpful assistant for a parcel service known as Deliverables that answers the users questions. 
                The user sent the following message: ${text}. Please respond to the user in a friendly and helpful manner. 
                Here is the users parcel info:${parcels}`;
                const llmApiResponse = await axios.post<llmResponse>(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: 'google/gemini-2.0-flash-001',
                        messages: [
                            {
                                role: 'user',
                                content: prompt,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                sendCustomMessage(llmApiResponse.data.choices[0].message.content, phone);
            }
        }

        res.status(200).send();
    }
}

export default twilioController;