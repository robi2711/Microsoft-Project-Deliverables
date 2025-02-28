import express, {Request, Response} from "express";
import {randomHelperCommand} from "@/helpers/tmpHelper";


interface ItmpController {
	randomCommand: express.Handler, // This is the function that will be called when the frontend makes a request to the backend, we can define multiple functions here
}

const tmpController: ItmpController = {
	randomCommand: async (req: Request, res: Response)  => { // This is the function that will be called when the frontend makes a request to the backend
			const yo : string = req.body.yo as string; // This is the data that the frontend sends to the backend
			console.log(yo);
			const someResponse: string = await randomHelperCommand(); // This is the response that the backend will send back to the frontend which is defined in the helper
			res.send(someResponse); // This sends the response back to the frontend
		}
}

export default tmpController;