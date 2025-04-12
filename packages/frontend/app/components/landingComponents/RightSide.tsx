"use client"

import { Box, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPanelSettings, PersonAdd } from "@mui/icons-material"

// Import panel components
import AdminSignInPanel from "@/components/auth/AdminSignInPanel"
import AdminSignUpPanel from "@/components/auth/AdminSignUpPanel"
import {AdminInfo} from "@/components/services/authService";

import {useUser} from "@/components/services/UserContext";
type PanelType = "admin-signin" | "admin-signup"

export default function RightSide() {
	// Animation and panel state
	const [animatePanel, setAnimatePanel] = useState(false)
	const [activePanel, setActivePanel] = useState<PanelType>("admin-signin")
	const [slideDirection, setSlideDirection] = useState<"left" | "right">("left")
	const router = useRouter()
	const { setUserInfo } = useUser();

	// Initial animation
	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatePanel(true)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	// Handle panel change with animation
	const handlePanelChange = (newPanel: PanelType) => {
		// Determine animation direction
		setSlideDirection(newPanel === "admin-signup" ? "right" : "left")

		// Animate out
		setAnimatePanel(false)

		// Change panel and animate in
		setTimeout(() => {
			setActivePanel(newPanel)
			setAnimatePanel(true)
		}, 300)
	}

	const handleAuthSuccess = (LoginInfo: AdminInfo) => {

		console.log("Authentication successful:", LoginInfo);

		setUserInfo({
			email: LoginInfo.email,
			username: LoginInfo.username,
			accessToken: LoginInfo.accessToken,
			idToken: LoginInfo.idToken,
			refreshToken: LoginInfo.refreshToken,
			tokenType: LoginInfo.tokenType,
			sub: LoginInfo.sub,
			type: LoginInfo.type
		})

		// Redirect to dashboard for admin
		router.push("/dashboard")
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
			{/* Title for Admin Panel */}
			<Box
				sx={{
					width: "100%",
					maxWidth: 400,
					mb: 3,
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						fontSize: "1.75rem",
						fontWeight: "bold",
						mb: 1,
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<AdminPanelSettings sx={{ fontSize: "2rem" }} />
					Admin Portal
				</Box>
			</Box>

			{/* Main form panel with animation */}
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
					transform: animatePanel ? "translateX(0)" : `translateX(${slideDirection === "right" ? "-100%" : "100%"})`,
					transition: "all 0.5s cubic-bezier(0.1, 0.3, 0.2, 0.4)",
				}}
			>
				{/* Render the appropriate panel based on activePanel */}
				{activePanel === "admin-signin" ? (
					<AdminSignInPanel onSignInSuccess={handleAuthSuccess} />
				) : (
					<AdminSignUpPanel onSignUpComplete={() => handlePanelChange("admin-signin")}/>
				)}

				{/* Toggle between sign-in and sign-up */}
				<Box sx={{ mt: 4, textAlign: "center" }}>
					{activePanel === "admin-signin" ? (
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<Box sx={{ mb: 1 }}>Need an admin account?</Box>
							<Box
								component="button"
								onClick={() => handlePanelChange("admin-signup")}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									background: "none",
									border: "1px solid",
									borderColor: "secondary.main",
									color: "secondary.main",
									cursor: "pointer",
									fontWeight: "bold",
									p: "8px 16px",
									borderRadius: 1,
									transition: "all 0.2s",
									"&:hover": {
										bgcolor: "rgba(255,255,255,0.1)",
									},
								}}
							>
								<PersonAdd fontSize="small" />
								Register New Admin
							</Box>
						</Box>
					) : (
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<Box sx={{ mb: 1 }}>Already have an admin account?</Box>
							<Box
								component="button"
								onClick={() => handlePanelChange("admin-signin")}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									background: "none",
									border: "1px solid",
									borderColor: "secondary.main",
									color: "secondary.main",
									cursor: "pointer",
									fontWeight: "bold",
									p: "8px 16px",
									borderRadius: 1,
									transition: "all 0.2s",
									"&:hover": {
										bgcolor: "rgba(255,255,255,0.1)",
									},
								}}
							>
								<AdminPanelSettings fontSize="small" />
								Sign In
							</Box>
						</Box>
					)}
				</Box>
			</Paper>
		</Box>
	)
}
