"use client"

import type React from "react"

import { Box, IconButton, Typography } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"

interface ScannerHeaderProps {
	title: string
	onBack?: () => void
	backHref?: string
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({ title, onBack, backHref = "/" }) => {
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
			<IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={onBack} component={backHref && !onBack ? 'a' : 'button'} href={backHref && !onBack ? backHref : undefined}>
				<ArrowBack />
			</IconButton>
			<Typography variant="h6" component="h1">
				{title}
			</Typography>
		</Box>
	)
}

