import {Handler, Request, Response} from "express";
import client from "@/config/twilioConfig";
import axios from "axios";
import pdfParse from 'pdf-parse';
import dotenv from "dotenv";
import FormData from 'form-data';

dotenv.config();

interface complexData {
	id: string;
	name: string;
	address: string;
}

interface contractData {
	id: string;
	name: string;
	address: string;
	complexId: string;
	email: string;
	phone: string;
}

interface userData {
	packages: {};
	id: string;
	name: string;
	address: string;
	complexId: string;
	email: string;
	phone: string;
}

interface pdfData {
	text: string;
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL;

interface extendTwilio {
	sendSMS: Handler;
	receiveSMS: Handler;
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

	if (command === "register") {
		console.log("Registering user with params:", params);
		const email = params[0];

		//IDEA: Generate a token, give link to the user to register and get them to put in the token
		//Register accoutn with email and the password that they give

	}
}

//Process the contract we received
const processContract = async (text: string, phone: string): Promise<void> => {

	//Use the LLM to extract the data, check in the database if user exists...
	console.log("Received contract data: " + text)

	//Try extract some data from the contract
	const prompt = `You will be given some OCR scanned text from a letter. You have to deduce and return the following fields in JSON format that make the most sense for the fields. If you're not sure about any value, return null.
                    ONLY RETURN THE JSON!
                    Required format:
                    {
                        "name": string | null,
                        "address": string | null,
                        "complex": string | null,
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
	if (response.startsWith('```')) {
		response = response.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
	}

	//Parse the data
	let parsed: any = null;
	try {
		parsed = JSON.parse(response);
	} catch {
		console.log(`Failed to parse LLM response as JSON: ${response}`);
		await sendCustomMessage("Failed to process contract! Please contact your complex administrator or concierge", phone);
		return;
	}
	console.log("Parsed data:", parsed);


	//Check if the complex is valid
	let complex_data = null;
	try {
		complex_data = await axios.get<complexData>(`${BACKEND_URL}/db/complex`, {
			params: {address: parsed.complex}
		});
	} catch (error) {
		console.error('Error fetching complex data:', error);
		await sendCustomMessage("Failed to process contract! Please contact your complex administrator or concierge", phone);
		return;
	}

	//Create user data
	await sendCustomMessage("Hello! We have received your contract. Please type in your email", phone);

	const user_data = {
		phone: phone,
		name: parsed.name,
		complexId: complex_data.data.id,
		address: parsed.address,
		email: ''
	}
	await axios.post(`${BACKEND_URL}/db/contract`, user_data)

}

//Send custom message to user
const sendCustomMessage = async (message: string, phone: string): Promise<void> => {
	console.log("Sending custom message to user: ", phone);
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
	sendSMS: async (req: Request, res: Response) => {

		const {name, address, telephone, packages, msg} = req.body;

		console.log("Sending SMS to:", telephone);
		console.log("Name:", name);
		console.log("Address:", address);
		console.log("Packages:", packages);

		//Check if we are provided with necessary parameters
		if (!name || !telephone) {
			res.status(400).json({message: "Missing required fields."});
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
			res.status(500).json({message: "Failed to send SMS."});
			return;
		}

	},

	//POST route for receiving an SMS, Twilio handles Webhook and sends the POST request to a given endpoint
	receiveSMS: async (req: Request, res: Response): Promise<void> => {

		const text = req.body.Body;
		console.log("Received SMS:", text);

		const phone = req.body.From;
		console.log(phone);

		//Check if we have contract already processing
		try {
			const contract = await axios.get<contractData>(`${BACKEND_URL}/db/contract`, {params: {number: phone}});
			if (contract.data) {
				console.log("Contract processing, ignoring message");
				console.log(contract.data);

				//Check if we are looking for email or for phone confirmation
				try {
					if (contract.data.email == "") {
						//Check for valid email
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						if (emailRegex.test(text)) {
							console.log("Received a valid email");

							//Update the contract with the email
							await axios.put(`${BACKEND_URL}/db/contract/${contract.data.id}/${contract.data.phone}`, {
								email: text
							});
							await sendCustomMessage(`Email has been set to: ${text} \n\nPlease confirm your phone number (Beginning with +353): `, phone);
							res.status(200).send();
							return;
						} else {
							console.log("Invalid email!");
							await sendCustomMessage("Please provide a valid email address", phone);
							res.status(200).send();
							return;
						}
					} else { //Phone number checks
						console.log("Received a phone number: ", text);
						const phoneRegex = /^\+353\d{9}$/; // Check for Irish phone number format

						if (phoneRegex.test(text)) {
							console.log("Received a valid phone number");

							await sendCustomMessage("Phone number has been set to: " + text, phone);

							//Process creating user
							try {
								const userData = {
									complexId: contract.data.complexId,
									name: contract.data.name,
									address: contract.data.address,
									phone: text.replace("whatsapp:", ""), //Remove whatsapp prefix
									email: contract.data.email
								}
								await axios.post(`${BACKEND_URL}/db/user`, userData);
								await sendCustomMessage("User has been created successfully!", phone);
							} catch (error) {
								console.error('Error creating user:', error);
								await sendCustomMessage("Internal error occured whilst processing contract!", phone);
								return;
							}

							//Clear old temporary contract
							try {
								await axios.delete(`${BACKEND_URL}/db/contract/${contract.data.id}/${contract.data.phone}`);
								console.log("Contract deleted successfully!");
							} catch (error) {
								console.error('Error deleting contract:', error);
								await sendCustomMessage("Internal error occured whilst processing contract!", phone);
								return;
							}

							res.status(200).send();
							return;
						} else {
							console.log("Invalid phone number!");
							await sendCustomMessage("Please provide a valid phone number (Beginning with +353)", phone);
							res.status(200).send();
							return;
						}
					}
				} catch (error) {
					console.log("Error occured during update: ", error);
				}

				res.status(200).send();
				return;
			}
		} catch (error) {
			console.error('No contract, go proceed!');
		}

		//Check if we receive contract
		const numMedia = parseInt(req.body.NumMedia || '0', 10);

		if (numMedia > 0) {
			const mediaUrl = req.body.MediaUrl0;
			const contentType = req.body.MediaContentType0;

			//Check if we user is valid
			//TODO: Maybe implement fuzzy lookups by name instead of by phone number, so that multiple contracts can be registered by the same person!
			try {
				const real_phone = phone.replace('whatsapp:', ''); //Remove whatsapp prefix
				const user_data = await axios.get<userData>(`${BACKEND_URL}/db/user/phone/${real_phone.replace('+', '%2b')}`);
				console.log('User is already registered!');
				await sendCustomMessage(`Hello ${user_data.data.name}, you are already registered with us!`, phone);
				res.status(200).send();
				return;
			} catch (error) {
				console.log(error);
				console.log('User not found in database, making new user')
			}

			//Read PDF directly
			if (contentType == 'application/pdf') {
				try {
					// Download the PDF file
					const pdfResponse = await axios.get<ArrayBuffer>(mediaUrl, {
						responseType: 'arraybuffer',
						auth: {
							username: process.env.TWILIO_SID as string,
							password: process.env.TWILIO_KEY as string,
						},
						headers: {
							'Content-Type': 'application/pdf'
						}
					});

					const data = await pdfParse(Buffer.from(pdfResponse.data));
					await processContract(data.text, phone);
					res.send('PDF received and parsed successfully!');
				} catch (error) {
					console.error('Error parsing PDF:', error);
					sendCustomMessage("Failed to process contract! Please contact your complex administrator or concierge", phone);
					res.status(500).send('Error handling PDF');
				}
			}

			//Read image and do OCR
			if (contentType == 'image/jpeg' || contentType == 'image/png') {
				try {
					// Download the image file
					const imageResponse = await axios.get(mediaUrl, {
						responseType: 'arraybuffer',
						auth: {
							username: process.env.TWILIO_SID as string,
							password: process.env.TWILIO_KEY as string,
						},
					});

					const imageBuffer = Buffer.from(imageResponse.data as ArrayBuffer);

					const form = new FormData();
					form.append('image', imageBuffer, {
						filename: 'image.jpg',
						contentType: contentType,
					});

					const ocrData = await axios.post(`${BACKEND_URL}/ocr`, form, {
						headers: {
							'Content-Type': 'multipart/form-data',
						}
					})
					const ocrResponse = (ocrData.data as { allLines: string[] }).allLines.join('\n');

					await processContract(ocrResponse, phone);
					res.send('Image received and processed successfully!');

				} catch (error) {
					console.error('Error parsing image:', error);
					sendCustomMessage("Failed to process contract! Please contact your complex administrator or concierge", phone);
					res.status(500).send('Error handling image');
				}
			}
		} else {
			//If we are running a command, handle it
			if (text.startsWith("/")) {
				const args = text.split(" ");
				runCommand(args);
			} else {

				//Fetch user message history (20 messages back at most)
				const history_raw = await client.messages.list({
					from: phone,
					to: process.env.TWILIO_PHONE,
					limit: 20
				})
				const history = history_raw
					.filter((msg: { body: string; }) => msg.body && msg.body.trim() !== '') // Filter out empty messages
					.map((msg: { body: any; dateSent: any; }) => ({
						"body": msg.body,
						"dateSent": msg.dateSent
					}));
				
				//Get packages to use for the prompt
				let prompt_suffix = "\n"
				let packages = {}
				try {
					const real_phone = phone.replace('whatsapp:', ''); //Remove whatsapp prefix
					const user_data = await axios.get<userData>(`${BACKEND_URL}/db/user/phone/${real_phone.replace('+', '%2b')}`);
					packages = user_data.data.packages;
					prompt_suffix += "User is registered"
				} catch (error) {
					//User most likely not registered
					console.log(error);
					prompt_suffix += "User is likely unregisterd"
				}

				//Do some AI prompt stuff here

				const prompt = 
				`You are a helpful assistant for a parcel service known as Deliverables that answers the users questions. 
                Please respond to the user in a friendly and helpful manner. 
				Keep things simple and dont send complicated information to the user, don't send them the package id.
				User doesn't have to provide tracking information, use the information that is given to you.
				In order to register, the user has to send you a picture of the contract or a PDF of the contract.
				You cannot register the user directly without the contract.
				${prompt_suffix}
				The user sent the following message: ${text}. 
				You have access to the following message history: ${JSON.stringify(history)}.
                You have access to the following package info: ${JSON.stringify(packages)}.
				
				Please respond to the user in a friendly and helpful manner. `;
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

				await sendCustomMessage(llmApiResponse.data.choices[0].message.content, phone);
			}
		}

		res.status(200).send();
	}
}

export default twilioController;