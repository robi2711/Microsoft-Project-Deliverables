import { Request, Response } from 'express';
import axios from 'axios';
import { OcrStatusResponse, llmResponse } from '../types/ocrTypes';

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

const AZURE_ENDPOINT = process.env.AZURE_OCR_ENDPOINT as string;
const AZURE_KEY = process.env.AZURE_OCR_KEY as string;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY as string;

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

        const fullText = lines.join('\n');

        const prompt = `
You will be given some OCR scanned text from a letter. You have to deduce and return the following fields in JSON format that make the most sense for the fields. If you're not sure about any value, return null.
ONLY RETURN THE JSON!
Required format:
{
  "name": string | null,
  "street": string | null,
  "flat_number": string | null,
  "country": string | null,
  "postal_code": string | null
}

OCR Text:
${fullText}
    `.trim();

        const llmApiResponse = await axios.post<llmResponse>(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        let extractedContent = llmApiResponse.data.choices[0].message.content;

        
        if (extractedContent.startsWith('```')) {
            extractedContent = extractedContent.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
        }

        let parsed: any = null;
        try {
            parsed = JSON.parse(extractedContent);
        } catch {
            res.status(422).json({ error: 'Failed to parse LLM response as JSON', raw: extractedContent });
            return;
        }

        res.json({
            extracted: parsed,
            allLines: lines,
        });
    } catch (error: any) {
        if (error?.response && error?.isAxiosError) {
            res.status(500).json({
                error: 'OCR or LLM request failed',
                details: error.response?.data,
            });
        } else if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error during OCR/LLM processing.' });
        }
    }
};
