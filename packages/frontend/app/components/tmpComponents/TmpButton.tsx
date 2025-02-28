//This is a temporary button that is used to show how the connection between the frontend and the backend works
//There is way more to this but this is a simple example of how to make a request to the backend
//In the future we will be sending and receiving data from the backend but for this case all it does is receive a message from the backend

import { Button } from "@mui/material"
import api from "@/components/services/apiService";

export default function TmpButton() {
	const handleClick = async () => {
		const response = await api.get("/temp")
		console.log(response.data)
	}

	return (
		<Button variant="contained" color="primary" onClick={handleClick}>
			CLICK ME
		</Button>
	)
}