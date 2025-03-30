import 'module-alias/register';
import moduleAlias from 'module-alias';
import * as path from 'path';
moduleAlias({
	base: path.resolve(__dirname, '..') // points to the folder with the relevant package.json
});
import express from 'express';
import cors from 'cors';
import dbRoutes from "@/routes/dbRoutes";
import twilioRoutes from "@/routes/twilioRoutes";
import ocrRoutes from '@/routes/ocrRoutes';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json()); // This is used to parse the data that the frontend sends to the backend
app.use(express.urlencoded()); // This allows for body to be parsed when testing with POST forms in Postman!

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true
})); // This is used to allow the frontend to make requests to the backend


app.use("/db", dbRoutes); // This is the route that the frontend will use to make requests to the backend.
// app.use("/whatsapp", twilioRoutes)
app.use('/ocr', ocrRoutes); // Route for OCR

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
