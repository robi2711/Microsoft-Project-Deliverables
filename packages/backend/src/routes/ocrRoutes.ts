import express from 'express';
import multer from 'multer';
import { testLocalOcr } from '@/controllers/ocrController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), testLocalOcr);

export default router;
