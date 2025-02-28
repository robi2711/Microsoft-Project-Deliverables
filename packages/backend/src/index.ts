import express from 'express';
import cors from 'cors';

const PORT = 3001;

const app = express();
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));



app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
