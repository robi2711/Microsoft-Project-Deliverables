"use client"

import type React from "react"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useUser } from "@/components/services/UserContext"

interface ScannerHeaderProps {
	title: string
	onBack?: () => void
	backHref?: string
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({ title, onBack, backHref = "/" }) => {
	const { userInfo } = useUser()

	return (
		<Box
			sx={{
				bgcolor: "primary.main",
				color: "white",
				p: 2,
				display: "flex",
				alignItems: "center",
			}}
		>
			<IconButton
				color="inherit"
				edge="start"
				sx={{ mr: 2 }}
				onClick={onBack}
				component={backHref && !onBack ? "a" : "button"}
				href={backHref && !onBack ? backHref : undefined}
			>
				<ArrowBack />
			</IconButton>

			<Typography variant="h6" component="h1">
				{title}
			</Typography>
			{userInfo?.type === "admin" && (
				<Button variant="contained" color="secondary" href="/dashboard" sx={{ ml: "auto" }}>
					Go to Dashboard
				</Button>
			)}
		</Box>
	)
}