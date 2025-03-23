import { RequestHandler } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { OcrStatusResponse } from '../types/ocrTypes';

const AZURE_ENDPOINT = process.env.AZURE_OCR_ENDPOINT as string;
const AZURE_KEY = process.env.AZURE_OCR_KEY as string;

export const testLocalOcr: RequestHandler = async (req, res, next) => {
    try {
        console.log('Starting OCR...');

        const devImagePath = path.resolve(__dirname, '../config/ocrImages/test.jpg');
        console.log('Loading image from:', devImagePath);

        if (!fs.existsSync(devImagePath)) {
            console.error('Image file not found');
            res.status(404).json({ error: 'OCR test image not found.' });
            return;
        }

        const imageBuffer = fs.readFileSync(devImagePath);


        console.log('Sending image to Azure OCR...');
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
            console.error('No operation-location header returned');
            res.status(400).json({ error: 'No operation-location returned from Azure OCR.' });
            return;
        }

        console.log('Operation-Location:', operationLocation);
        console.log('Polling Azure for result...');


        let result = null;
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const statusResponse = await axios.get<OcrStatusResponse>(operationLocation, {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_KEY,
                },
            });

            const data = statusResponse.data;
            console.log(`OCR status check ${i + 1}: ${data.status}`);

            if (data.status === 'failed') {
                console.error('Azure OCR failed to process the image.');
                res.status(400).json({ error: 'Azure OCR failed to process the image.' });
                return;
            }

            if (data.status === 'succeeded' && data.analyzeResult) {
                result = data.analyzeResult.readResults;
                break;
            }
        }

        if (!result) {
            console.error('Azure OCR timed out.');
            res.status(504).json({ error: 'Azure OCR timed out waiting for results.' });
            return;
        }


        console.log('OCR succeeded. Extracting lines...');
        const lines: string[] = [];
        for (const page of result) {
            for (const line of page.lines) {
                lines.push(line.text);
            }
        }

        console.log('Extracted lines:', lines);


        let name = '';
        let address = '';
        const nameRegex = /^name[:\s]*(.*)$/i;
        const addressRegex = /^address[:\s]*(.*)$/i;

        for (const line of lines) {
            const nameMatch = nameRegex.exec(line);
            const addressMatch = addressRegex.exec(line);

            if (nameMatch && nameMatch[1]) {
                name = nameMatch[1].trim();
                console.log('👤 Found name:', name);
            }

            if (addressMatch && addressMatch[1]) {
                address = addressMatch[1].trim();
                console.log('📍 Found address:', address);
            }
        }


        res.json({
            name,
            address,
            allLines: lines,
        });


    } catch (error: any) {
        if (error?.response && error?.isAxiosError) {
            console.error('OCR Controller Error (Axios-like):');
            console.error('Message:', error.message);
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
        } else {
            console.error('OCR Controller Error (General):', error.message);
        }

        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error during OCR processing.' });
        }
    }
};
