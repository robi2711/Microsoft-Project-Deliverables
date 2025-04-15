import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "@/helpers/dbHelper";
import { messagesContainer } from "@/config/cosmosConfig";

interface IMessageLog {
    id: string; // same as userId
    userId: string;
    history: string; // newline-separated JSON messages
    updatedAt: string;
}

const MAX_HISTORY_LENGTH = 200;

function trimHistory(history: string, maxChars: number): string {
    const lines = history.split("\n");
    let trimmed = [...lines];

    while (trimmed.join("\n").length > maxChars && trimmed.length > 1) {
        trimmed.shift(); // remove oldest message
    }
    return trimmed.join("\n");
}

export const addUserMessage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Message content is required." });

    const { resource: existingLog } = await messagesContainer.item(userId, userId).read<IMessageLog>().catch(() => ({ resource: null }));

    const newEntry = JSON.stringify({ role: "user", content });

    let updatedHistory = existingLog?.history ? `${existingLog.history}\n${newEntry}` : newEntry;
    updatedHistory = trimHistory(updatedHistory, MAX_HISTORY_LENGTH);

    const messageDoc: IMessageLog = {
        id: userId,
        userId,
        history: updatedHistory,
        updatedAt: new Date().toISOString()
    };

    const { resource } = await messagesContainer.items.upsert(messageDoc);

    res.status(200).json({ message: "User message added.", log: resource });
});

export const addLLMMessage = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Message content is required." });

    const { resource: existingLog } = await messagesContainer.item(userId, userId).read<IMessageLog>().catch(() => ({ resource: null }));

    const newEntry = JSON.stringify({ role: "assistant", content });

    let updatedHistory = existingLog?.history ? `${existingLog.history}\n${newEntry}` : newEntry;
    updatedHistory = trimHistory(updatedHistory, MAX_HISTORY_LENGTH);

    const messageDoc: IMessageLog = {
        id: userId,
        userId,
        history: updatedHistory,
        updatedAt: new Date().toISOString()
    };

    const { resource } = await messagesContainer.items.upsert(messageDoc);

    res.status(200).json({ message: "LLM message added.", log: resource });
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const { resource: log } = await messagesContainer.item(userId, userId).read<IMessageLog>().catch(() => ({ resource: null }));

    if (!log) {
        return res.status(404).json({ message: "No chat history found for this user." });
    }

    const messages = log.history
        .split("\n")
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    res.status(200).json({ userId, messages });
});
