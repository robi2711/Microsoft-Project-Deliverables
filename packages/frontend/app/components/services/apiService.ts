// This file is used to create an axios instance that will be used to make requests to the backend.
// The baseURL is the URL of the backend that we want to make requests to.
// All you have to do is import this file and use the api object to make requests to the backend. See the TmpButton component for an example of how to use this api object.
import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:3001' ,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	}
});

export default api;

