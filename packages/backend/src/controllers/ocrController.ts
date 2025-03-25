import { Request, Response } from 'express';
import axios from 'axios';
import { OcrStatusResponse } from '../types/ocrTypes';

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

const AZURE_ENDPOINT = process.env.AZURE_OCR_ENDPOINT as string;
const AZURE_KEY = process.env.AZURE_OCR_KEY as string;

export const testLocalOcr = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = (req as MulterRequest).file;

        if (!file || !file.buffer) {
            res.status(400).json({ error: 'No image uploaded.' });
            return;
        }

        const imageBuffer = file.buffer;

        const response = await axios.post(
            `${AZURE_ENDPOINT}/vision/v3.2/read/analyze`,
            imageBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': AZURE_KEY,
                },
            }
        );

        const operationLocation = response.headers['operation-location'];

        if (!operationLocation) {
            res.status(400).json({ error: 'No operation-location returned from Azure OCR.' });
            return;
        }

        let result = null;

        for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const statusResponse = await axios.get<OcrStatusResponse>(operationLocation, {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_KEY,
                },
            });

            const data = statusResponse.data;

            if (data.status === 'failed') {
                res.status(400).json({ error: 'Azure OCR failed to process the image.' });
                return;
            }

            if (data.status === 'succeeded' && data.analyzeResult) {
                result = data.analyzeResult.readResults;
                break;
            }
        }

        if (!result) {
            res.status(504).json({ error: 'Azure OCR timed out waiting for results.' });
            return;
        }

        const lines: string[] = [];

        for (const page of result) {
            for (const line of page.lines) {
                lines.push(line.text);
            }
        }

        let name = '';
        let address = '';

        const nameRegex = /^name[:\s]*(.*)$/i;
        const addressRegex = /^address[:\s]*(.*)$/i;

        for (const line of lines) {
            const nameMatch = nameRegex.exec(line);
            const addressMatch = addressRegex.exec(line);

            if (nameMatch && nameMatch[1]) {
                name = nameMatch[1].trim();
            }

            if (addressMatch && addressMatch[1]) {
                address = addressMatch[1].trim();
            }
        }

        res.json({
            name,
            address,
            allLines: lines,
        });
    } catch (error: any) {
        if (error?.response && error?.isAxiosError) {
            res.status(500).json({
                error: 'Azure OCR error',
                details: error.response?.data,
            });
        } else if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error during OCR processing.' });
        }
    }
};
