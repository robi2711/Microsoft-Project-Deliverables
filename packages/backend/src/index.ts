import 'module-alias/register';
import moduleAlias from 'module-alias';
import * as path from 'path';
moduleAlias({
	base: path.resolve(__dirname, '..') // points to the folder with the relevant package.json
});
import express from 'express';
import cors from 'cors';
import dbRoutes from "@/routes/dbRoutes";
import authRoutes from "@/routes/authRoutes";
import session from "express-session";

import ocrRoutes from '@/routes/ocrRoutes';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json()); // This is used to parse the data that the frontend sends to the backend
app.use(express.urlencoded()); // This allows for body to be parsed when testing with POST forms in Postman!
app.use(session({
	secret: 'v',
	resave: true,
	saveUninitialized: false,
	cookie: { secure: false }
})); // Backend session management

const allowedOrigins = [
	process.env.FRONTEND_URL || 'http://localhost:3000',
	'https://api.twilio.com'
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) {
				return callback(null, true);
			}
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true // Allow cookies and credentials
	})
);
app.use("/auth", authRoutes);
app.use("/db", dbRoutes); // This is the route that the frontend will use to make requests to the backend.
//app.use("/whatsapp", twilioRoutes)
app.use('/ocr', ocrRoutes); // Route for OCR

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
console.log("closed")