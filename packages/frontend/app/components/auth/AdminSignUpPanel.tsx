"use client"

import type React from "react"

import { useState } from "react"
import { Box, TextField, Button, CircularProgress, Alert } from "@mui/material"
import { type AdminCredentials, signUpAdmin } from "@/components/services/authService"

// Update the props interface to include onSignUpComplete
interface AdminSignUpPanelProps {
    onSignUpComplete: () => void
}


export default function AdminSignUpPanel({onSignUpComplete}: AdminSignUpPanelProps) {
    const [email, setEmail] = useState("")
    const [givenName, setGivenName] = useState("")
    const [password, setPassword] = useState("")
    const [address, setAddress] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSignUp(credentials: AdminCredentials,password:string, address:string) {
        try {
            const result = await signUpAdmin(credentials, password, address);
            if (result === "Username already exists") {
                setError("Username already exists");
                return;
            }
            onSignUpComplete();
            console.log("Sign up successful:", result);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const credentials: AdminCredentials = {
            email,
            givenName,
        }

        setLoading(true)

        try {
            await handleSignUp(credentials, password, address);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to sign up. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 3 }}>
                <Box component="h2" sx={{ fontSize: "1.5rem", mb: 1, fontWeight: "500" }}>
                    Admin Registration
                </Box>
                <Box sx={{ color: "text.secondary" }}>Create a new administrator account</Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-input": { color: "white" },
                }}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                id="givenName"
                label="Given Name"
                name="givenName"
                autoComplete="given-name"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-input": { color: "white" },
                }}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="address"
                label="Address"
                type="address"
                id="address"
                autoComplete="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-input": { color: "white" },
                }}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-input": { color: "white" },
                }}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                    "& .MuiOutlinedInput-input": { color: "white" },
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{
                    py: 1.5,
                    mt: 1,
                    fontWeight: "bold",
                    position: "relative",
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Register Admin Account"}
            </Button>
        </Box>
    )
}
