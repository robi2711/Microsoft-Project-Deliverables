import { Handler } from "express";

export interface twilioController {
    sendSMS: Handler;
}