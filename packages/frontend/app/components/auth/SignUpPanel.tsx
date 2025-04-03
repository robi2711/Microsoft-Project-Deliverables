"use client"

import { useState } from "react"
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress } from "@mui/material"
import { PersonAdd, Person, SupportAgent, AdminPanelSettings, Visibility, VisibilityOff } from "@mui/icons-material"
import {signUp, type SignUpData, UserData} from "@/components/services/authService"

type SignUpPanelProps = {
	//TODO: Create a type for userData when it is known
	onSignUpSuccess: (userData: UserData) => void
}

export default function SignUpPanel({ onSignUpSuccess }: SignUpPanelProps) {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [phone, setPhone] = useState("")
	const [address, setAddress] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [accountType, setAccountType] = useState<"user" | "concierge" | "admin" | null>(null)

	const handleTogglePassword = () => {
		setShowPassword(!showPassword)
	}

	const handleSubmit = async (type: "user" | "concierge" | "admin") => {
		setError("")

		//basic validation
		if (!name.trim() || !email.trim() || !password.trim() || !phone.trim() || !address.trim()) {
			setError("Please fill in all fields")
			return
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address")
			return
		}

		// Password strength validation
		if (password.length < 8) {
			setError("Password must be at least 8 characters long")
			return
		}

		setAccountType(type)
		setLoading(true)

		try {
			const signUpData: SignUpData = {
				name,
				phone,
				address,
				email,
				password,
				accountType: type,
			}
			const userData = await signUp(signUpData)
			onSignUpSuccess(userData)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign up")
			setAccountType(null)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Box sx={{ textAlign: "center", mb: 2 }}>
				<PersonAdd sx={{ fontSize: 48, mb: 1, color: "secondary.main" }} />
				<Typography variant="h4" gutterBottom fontWeight="bold">
					Create Account
				</Typography>
				<Typography variant="body2" color="rgba(255,255,255,0.7)">
					Select the type of account you want to create
				</Typography>
			</Box>

			<Box sx={{ display: "flex", gap: 2 }}>


			<TextField label="Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
			<TextField label="Phone Number" variant="outlined" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} required />
			<TextField label="Email" variant="outlined" fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			<TextField label="Address" variant="outlined" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} required />
			<TextField
				label="Password"
				variant="outlined"
				fullWidth
				type={showPassword ? "text" : "password"}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleTogglePassword} edge="end">
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				required
			/>
			</Box>
			{error && (
				<Typography color="error" variant="body2">
					{error}
				</Typography>
			)}

			<Typography variant="subtitle2" sx={{ mt: 1, color: "rgba(255,255,255,0.9)" }}>
				Account Type:
			</Typography>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Button
					variant="contained"
					color="secondary"
					size="large"
					fullWidth
					startIcon={loading && accountType === "user" ? <CircularProgress size={20} color="inherit" /> : <Person />}
					sx={{ py: 1.5 }}
					onClick={() => handleSubmit("user")}
					disabled={loading}
				>
					{loading && accountType === "user" ? "Creating..." : "Create User Account"}
				</Button>

				<Button
					variant="outlined"
					color="secondary"
					size="large"
					fullWidth
					startIcon={
						loading && accountType === "concierge" ? <CircularProgress size={20} color="inherit" /> : <SupportAgent />
					}
					sx={{
						py: 1.5,
						borderColor: "rgba(255,255,255,0.5)",
						color: "white",
						"&:hover": {
							borderColor: "secondary.main",
							backgroundColor: "rgba(255,255,255,0.1)",
						},
					}}
					onClick={() => handleSubmit("concierge")}
					disabled={loading}
				>
					{loading && accountType === "concierge" ? "Creating..." : "Create Concierge Account"}
				</Button>

				<Button
					variant="outlined"
					color="secondary"
					size="large"
					fullWidth
					startIcon={
						loading && accountType === "admin" ? <CircularProgress size={20} color="inherit" /> : <AdminPanelSettings />
					}
					sx={{
						py: 1.5,
						borderColor: "rgba(255,255,255,0.5)",
						color: "white",
						"&:hover": {
							borderColor: "secondary.main",
							backgroundColor: "rgba(255,255,255,0.1)",
						},
					}}
					onClick={() => handleSubmit("admin")}
					disabled={loading}
				>
					{loading && accountType === "admin" ? "Creating..." : "Create Admin Account"}
				</Button>
			</Box>
		</Box>
	)
}

