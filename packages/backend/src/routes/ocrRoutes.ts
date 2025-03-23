import express, { Request, Response } from 'express';
import { testLocalOcr } from '../controllers/ocrController';

const router = express.Router();

router.get('/dev-test', async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const result = await testLocalOcr(req, res);
        res.json(result);
    } catch (error) {
        const err = error as Error;
        res.status(500).send(err.message);
    }
});

export default router;