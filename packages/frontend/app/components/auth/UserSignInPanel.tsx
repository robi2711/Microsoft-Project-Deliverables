"use client"

import type React from "react"

import { useState } from "react"
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress } from "@mui/material"
import { Person, Login, Visibility, VisibilityOff } from "@mui/icons-material"
import {signInUser, type UserCredentials, UserData} from "@/components/services/authService"

type UserSignInPanelProps = {
	//TODO: Create a type for userData when it is known
	onSignInSuccess: (userData: UserData) => void
}

export default function UserSignInPanel({ onSignInSuccess }: UserSignInPanelProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleTogglePassword = () => {
		setShowPassword(!showPassword)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		// Basic validation
		if (!email.trim() || !password) {
			setError("Please fill in all fields")
			return
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address")
			return
		}

		setLoading(true)

		try {
			const credentials: UserCredentials = {
				email,
				password,
			}

			const userData = await signInUser(credentials)
			onSignInSuccess(userData)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign in")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Box sx={{ textAlign: "center", mb: 2 }}>
				<Person sx={{ fontSize: 48, mb: 1, color: "secondary.main" }} />
				<Typography variant="h4" gutterBottom fontWeight="bold">
					User Sign In
				</Typography>
				<Typography variant="body2" color="rgba(255,255,255,0.7)">
					Access your personal account
				</Typography>
			</Box>

			<TextField
				label="Email"
				variant="outlined"
				fullWidth
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				InputProps={{
					sx: { color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" } },
				}}
				InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
				required
			/>

			<TextField
				label="Password"
				variant="outlined"
				fullWidth
				type={showPassword ? "text" : "password"}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				InputProps={{
					sx: { color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" } },
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "rgba(255,255,255,0.7)" }}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
				required
			/>

			{error && (
				<Typography color="error" variant="body2" sx={{ mt: 1 }}>
					{error}
				</Typography>
			)}

			<Button
				type="submit"
				variant="contained"
				color="secondary"
				size="large"
				fullWidth
				endIcon={loading ? null : <Login />}
				sx={{ mt: 2, py: 1.5 }}
				disabled={loading}
			>
				{loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
			</Button>
		</Box>
	)
}

