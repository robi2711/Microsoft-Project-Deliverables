"use client"

import type React from "react"

import { useState } from "react"
import {
	Box,
	Button,
	TextField,
	Typography,
	InputAdornment,
	IconButton,
	CircularProgress,
	useMediaQuery,
	useTheme,
} from "@mui/material"
import { Person, Login, Visibility, VisibilityOff } from "@mui/icons-material"
import { signInUser, type UserCredentials, type UserData } from "@/components/services/authService"

type UserSignInPanelProps = {
	onSignInSuccess: (userData: UserData) => void
}

export default function UserSignInPanel({ onSignInSuccess }: UserSignInPanelProps) {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
		<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Box sx={{ textAlign: "center", mb: 1 }}>
				<Person sx={{ fontSize: { xs: 36, sm: 48 }, mb: 1, color: "secondary.main" }} />
				<Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
					User Sign In
				</Typography>
				<Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
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
					sx: {
						color: "white",
						"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
						fontSize: { xs: "0.9rem", sm: "1rem" },
					},
				}}
				InputLabelProps={{
					sx: {
						color: "rgba(255,255,255,0.7)",
						fontSize: { xs: "0.9rem", sm: "1rem" },
					},
				}}
				required
				size={isMobile ? "small" : "medium"}
			/>

			<TextField
				label="Password"
				variant="outlined"
				fullWidth
				type={showPassword ? "text" : "password"}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				InputProps={{
					sx: {
						color: "white",
						"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
						fontSize: { xs: "0.9rem", sm: "1rem" },
					},
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={handleTogglePassword}
								edge="end"
								sx={{ color: "rgba(255,255,255,0.7)" }}
								size={isMobile ? "small" : "medium"}
							>
								{showPassword ? (
									<VisibilityOff fontSize={isMobile ? "small" : "medium"} />
								) : (
									<Visibility fontSize={isMobile ? "small" : "medium"} />
								)}
							</IconButton>
						</InputAdornment>
					),
				}}
				InputLabelProps={{
					sx: {
						color: "rgba(255,255,255,0.7)",
						fontSize: { xs: "0.9rem", sm: "1rem" },
					},
				}}
				required
				size={isMobile ? "small" : "medium"}
			/>

			{error && (
				<Typography color="error" variant="body2" sx={{ mt: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
					{error}
				</Typography>
			)}

			<Button
				type="submit"
				variant="contained"
				color="secondary"
				size={isMobile ? "medium" : "large"}
				fullWidth
				endIcon={loading ? null : <Login fontSize={isMobile ? "small" : "medium"} />}
				sx={{ mt: 2, py: isMobile ? 1 : 1.5 }}
				disabled={loading}
			>
				{loading ? <CircularProgress size={isMobile ? 20 : 24} color="inherit" /> : "Sign In"}
			</Button>
		</Box>
	)
}

