"use client"

import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function WhatsappTester() {

    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [response, setResponse] = useState("...");

    const sendMessage = async () => {
        const response = await fetch("http://localhost:3001/whatsapp/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, telephone: number, msg: message })
        });

        const data = await response.json();
        setResponse(data.message);
        console.log(data);
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2}}>
            <Stack spacing={2} direction="row" sx={{justifyContent: "space-between"}}>
                <TextField label="Name" value={name} fullWidth onChange={(e) => setName(e.target.value)} />
                <TextField label="Number (whatsapp:+353......)" value={number} fullWidth onChange={(e) => setNumber(e.target.value)} />
            </Stack>
            <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button variant="contained" color="primary" onClick={() => sendMessage()}>Send</Button>
            <Typography variant="body1">{response}</Typography>
        </Container>
    )
}