"use client"

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
import { PersonAdd, Person, SupportAgent, AdminPanelSettings, Visibility, VisibilityOff } from "@mui/icons-material"
import {signUp, signUpAdmin, type SignUpData, type UserData} from "@/components/services/authService"

type SignUpPanelProps = {
	onSignUpSuccess: (userData: UserData) => void
}

export default function SignUpPanel({ onSignUpSuccess }: SignUpPanelProps) {
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [accountType, setAccountType] = useState<"user" | "concierge" | "admin" | null>(null)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

	const handleTogglePassword = () => {
		setShowPassword(!showPassword)
	}

	const handleSubmit = async (type: "user" | "concierge" | "admin") => {
		setError("")

		// Basic validation
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
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
				name: firstName,
				email,
				password,
				accountType: type,
			}

			if (type === "admin") {

				const userData1 =signUpAdmin(signUpData)
				console.log(userData1);
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
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Box sx={{ textAlign: "center", mb: 1 }}>
				<PersonAdd sx={{ fontSize: { xs: 36, sm: 48 }, mb: 1, color: "secondary.main" }} />
				<Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
					Create Account
				</Typography>
				<Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
					Select the type of account you want to create
				</Typography>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: isMobile ? "column" : "row",
					gap: 2,
				}}
			>
				<TextField
					label="First Name"
					variant="outlined"
					fullWidth
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
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
					label="Last Name"
					variant="outlined"
					fullWidth
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
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
				<Typography color="error" variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
					{error}
				</Typography>
			)}

			<Typography
				variant="subtitle2"
				sx={{
					mt: 1,
					color: "rgba(255,255,255,0.9)",
					fontSize: { xs: "0.8rem", sm: "0.875rem" },
				}}
			>
				Account Type:
			</Typography>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Button
					variant="contained"
					color="secondary"
					size={isMobile ? "medium" : "large"}
					fullWidth
					startIcon={
						loading && accountType === "user" ? (
							<CircularProgress size={isMobile ? 16 : 20} color="inherit" />
						) : (
							<Person fontSize={isMobile ? "small" : "medium"} />
						)
					}
					sx={{ py: isMobile ? 1 : 1.5 }}
					onClick={() => handleSubmit("user")}
					disabled={loading}
				>
					{loading && accountType === "user" ? "Creating..." : "Create User Account"}
				</Button>

				<Button
					variant="outlined"
					color="secondary"
					size={isMobile ? "medium" : "large"}
					fullWidth
					startIcon={
						loading && accountType === "concierge" ? (
							<CircularProgress size={isMobile ? 16 : 20} color="inherit" />
						) : (
							<SupportAgent fontSize={isMobile ? "small" : "medium"} />
						)
					}
					sx={{
						py: isMobile ? 1 : 1.5,
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
					size={isMobile ? "medium" : "large"}
					fullWidth
					startIcon={
						loading && accountType === "admin" ? (
							<CircularProgress size={isMobile ? 16 : 20} color="inherit" />
						) : (
							<AdminPanelSettings fontSize={isMobile ? "small" : "medium"} />
						)
					}
					sx={{
						py: isMobile ? 1 : 1.5,
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

