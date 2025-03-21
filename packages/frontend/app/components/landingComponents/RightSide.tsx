"use client"

import { Box, Paper, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect } from "react"
import { AdminPanelSettings, Person, SupportAgent } from "@mui/icons-material"
import { useRouter } from "next/navigation"

// Import panel components
import AdminSignInPanel from "@/components/auth/AdminSignInPanel"
import ConciergeSignInPanel from "@/components/auth/ConciergeSignInPanel"
import UserSignInPanel from "@/components/auth/UserSignInPanel"
import SignUpPanel from "@/components/auth/SignUpPanel"
import type { UserData } from "@/components/services/authService"

// Form types
type FormType = "admin-signin" | "concierge-signin" | "user-signin" | "signup"

export default function RightSide() {
	// Animation and form state
	const [animatePanel, setAnimatePanel] = useState(false)
	const [activeForm, setActiveForm] = useState<FormType>("user-signin")
	const [formDirection, setFormDirection] = useState<"left" | "right">("left")
	const router = useRouter()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("md"))

	// Initial animation
	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatePanel(true)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	// Handle form change with direction for animation
	const handleFormChange = (newForm: FormType) => {
		// Determine animation direction based on form order
		const formOrder: FormType[] = ["admin-signin", "concierge-signin", "user-signin", "signup"]
		const currentIndex = formOrder.indexOf(activeForm)
		const newIndex = formOrder.indexOf(newForm)

		setFormDirection(newIndex > currentIndex ? "right" : "left")

		// Animate out
		setAnimatePanel(false)

		// Change form and animate in
		setTimeout(() => {
			setActiveForm(newForm)
			setAnimatePanel(true)
		}, 100)
	}

	// Handle successful authentication
	const handleAuthSuccess = (userData: UserData) => {
		console.log("Authentication successful:", userData)

		// Redirect based on user role
		if (userData.role === "admin") {
			router.push("/dashboard")
		} else if (userData.role === "concierge") {
			router.push("/scanner")
		} else {
			router.push("/successful-login")
		}
	}

	return (
		<Box
			sx={{
				width: { xs: "100%", md: "40%" },
				bgcolor: "primary.main",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				color: "white",
				p: { xs: 3, sm: 4 },
				minHeight: { xs: "auto", md: "100vh" },
				py: { xs: 6, md: 4 },
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Form selection tabs */}
			<Box
				sx={{
					width: "100%",
					maxWidth: 400,
					mb: 3,
					borderRadius: 2,
					bgcolor: "primary.dark",
					"& .MuiTabs-indicator": {
						backgroundColor: "secondary.main",
					},
				}}
			>
				<Tabs
					value={activeForm.includes("signin") ? activeForm : false}
					onChange={(_, value) => value && handleFormChange(value as FormType)}
					variant="fullWidth"
					textColor="inherit"
					sx={{
						"& .MuiTab-root": {
							color: "rgba(255,255,255,0.7)",
							"&.Mui-selected": {
								color: "white",
							},
							fontSize: { xs: "0.75rem", sm: "0.875rem" },
							padding: { xs: "6px 8px", sm: "12px 16px" },
							minHeight: { xs: "48px", sm: "48px" },
						},
					}}
				>
					<Tab
						icon={<AdminPanelSettings sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />}
						label="Admin"
						value="admin-signin"
						iconPosition="start"
					/>
					<Tab
						icon={<SupportAgent sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />}
						label="Concierge"
						value="concierge-signin"
						iconPosition="start"
					/>
					<Tab
						icon={<Person sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />}
						label="User"
						value="user-signin"
						iconPosition="start"
					/>
				</Tabs>
			</Box>

			{/* Main form panel */}
			<Paper
				elevation={6}
				sx={{
					p: { xs: 3, sm: 4 },
					width: "100%",
					maxWidth: 400,
					bgcolor: "primary.light",
					color: "white",
					borderRadius: 2,
					opacity: animatePanel ? 1 : 0,
					transform: animatePanel ? "translateX(0)" : `translateX(${formDirection === "right" ? "100%" : "-100%"})`,
					transition: "all 0.8s cubic-bezier(0.1, 0.3, 0.2, 0.4)",
				}}
			>
				{/* Render the appropriate panel based on activeForm */}
				{activeForm === "admin-signin" && <AdminSignInPanel onSignInSuccess={handleAuthSuccess} />}
				{activeForm === "concierge-signin" && <ConciergeSignInPanel onSignInSuccess={handleAuthSuccess} />}
				{activeForm === "user-signin" && <UserSignInPanel onSignInSuccess={handleAuthSuccess} />}
				{activeForm === "signup" && <SignUpPanel onSignUpSuccess={handleAuthSuccess} />}

				{/* Footer with sign-in/sign-up toggle */}
				<Box sx={{ mt: 4, textAlign: "center" }}>
					{activeForm === "signup" ? (
						<Box>
							Already have an account?{" "}
							<Box
								component="button"
								onClick={() => handleFormChange("user-signin")}
								sx={{
									background: "none",
									border: "none",
									color: "secondary.main",
									cursor: "pointer",
									fontWeight: "bold",
									textDecoration: "underline",
									p: 0,
								}}
							>
								Sign In
							</Box>
						</Box>
					) : (
						<Box>
							Don&#39;t have an account?{" "}
							<Box
								component="button"
								onClick={() => handleFormChange("signup")}
								sx={{
									background: "none",
									border: "none",
									color: "secondary.main",
									cursor: "pointer",
									fontWeight: "bold",
									textDecoration: "underline",
									p: 0,
								}}
							>
								Sign Up
							</Box>
						</Box>
					)}
				</Box>
			</Paper>
		</Box>
	)
}

