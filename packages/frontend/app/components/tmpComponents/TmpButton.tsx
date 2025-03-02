//This is a temporary button that is used to show how the connection between the frontend and the backend works
//When the button is clicked, a request is sent to the backend and the backend sends a response back to the frontend
//The response is then displayed on the button

import { Button } from "@mui/material"
import api from "@/components/services/apiService";
import {useState} from "react";

export default function TmpButton() {
	const [buttonText, setButtonText] = useState("TmpButton"); // This is the text that will be displayed on the button

	const handleClick = async () => { // This function is called when the button is clicked
		try {
			const response = await api.post("/db/create", { // This is the endpoint that the request will be sent to
				 // This is the data that will be sent to the backend
			});// This will set the text of the button to the response from the backend
			console.log(response.data);
		}
		catch (error){
			console.error(error);
		}
	}

	return (
		<Button variant="contained" color="primary" onClick={handleClick}>
			{buttonText} {/* This is the text that will be displayed on the button and is stored as a variable */}
		</Button>
	)
}