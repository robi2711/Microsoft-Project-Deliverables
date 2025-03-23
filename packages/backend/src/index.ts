import express from 'express';
import cors from 'cors';
import dbRoutes from "@/routes/dbRoutes";
import ocrRoutes from '@/routes/ocrRoutes';

const PORT = 3001;

const app = express();
app.use(express.json()); // This is used to parse the data that the frontend sends to the backend


app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
})); // This is used to allow the frontend to make requests to the backend



app.use("/db", dbRoutes); // This is the route that the frontend will use to make requests to the backend.
app.use('/ocr', ocrRoutes); // Route for OCR

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
