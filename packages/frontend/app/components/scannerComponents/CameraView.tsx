"use client"

import type React from "react"

import { useRef } from "react"
import { Box, Paper, Typography, Button, IconButton, CircularProgress, useMediaQuery, useTheme } from "@mui/material"
import { CameraAlt, Cameraswitch, ErrorOutline, PhotoCamera } from "@mui/icons-material"
import { useCamera } from "./hooks/useCamera"

interface CameraViewProps {
	onCapture: (imageSrc: string) => void
	onManualEntry: () => void
	isScanning: boolean
	scanError: string | null
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onManualEntry, isScanning }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
	const fileInputRef = useRef<HTMLInputElement>(null)

	const {
		isCameraActive,
		cameraReady,
		cameraError,
		cameraPermission,
		availableCameras,
		initializeCamera,
		toggleCamera,
		captureImage,
		CameraComponent,
	} = useCamera()

	// Handle camera capture
	const handleCaptureImage = async () => {
		const imageSrc = await captureImage()
		if (imageSrc) {
			onCapture(imageSrc)
		}
	}

	// Handle file upload as an alternative to webcam
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			// Convert file to base64
			const reader = new FileReader()
			reader.onloadend = () => {
				const base64data = reader.result as string
				onCapture(base64data)
			}
			reader.readAsDataURL(file)
		} catch (err) {
			console.error("File upload error:", err)
		}
	}

	// Trigger file input click
	const triggerFileUpload = () => {
		fileInputRef.current?.click()
	}

	return (
		<Paper
			elevation={3}
			sx={{
				position: "relative",
				overflow: "hidden",
				borderRadius: 2,
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: isMobile ? "50vh" : "60vh",
			}}
		>
			{isCameraActive ? (
				<Box sx={{ position: "relative", width: "100%", height: "100%" }}>
					{/* Camera Component */}
					<CameraComponent />

					{/* Camera controls */}
					<Box
						sx={{
							position: "absolute",
							bottom: 16,
							left: 0,
							right: 0,
							display: "flex",
							justifyContent: "center",
							gap: 2,
							zIndex: 5,
						}}
					>
						<IconButton
							onClick={handleCaptureImage}
							disabled={isScanning || !cameraReady}
							sx={{
								bgcolor: "primary.main",
								color: "white",
								p: 2,
								"&:hover": {
									bgcolor: "primary.dark",
								},
							}}
						>
							{isScanning ? <CircularProgress size={24} color="inherit" /> : <CameraAlt />}
						</IconButton>

						{availableCameras.length > 1 && (
							<IconButton onClick={toggleCamera} sx={{ bgcolor: "rgba(0,0,0,0.5)", color: "white" }}>
								<Cameraswitch />
							</IconButton>
						)}
					</Box>

					{/* Scanning overlay */}
					{isScanning && (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								bgcolor: "rgba(0,0,0,0.3)",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								zIndex: 10,
							}}
						>
							<Typography variant="h6" color="white" gutterBottom>
								Scanning...
							</Typography>
							<CircularProgress color="secondary" />
						</Box>
					)}
				</Box>
			) : (
				<Box sx={{ p: 4, textAlign: "center" }}>
					<ErrorOutline sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />

					<Typography variant="h6" gutterBottom>
						{cameraPermission === "denied"
							? "Camera Access Denied"
							: cameraError
								? "Camera Error"
								: "Camera Access Required"}
					</Typography>

					<Typography variant="body2" color="text.secondary" paragraph>
						{cameraError || "Please allow camera access to scan package labels"}
					</Typography>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
						<Button variant="contained" startIcon={<CameraAlt />} onClick={initializeCamera}>
							{cameraPermission === "denied" ? "Update Permissions" : "Enable Camera"}
						</Button>

						{/* File upload option */}
						<Button variant="outlined" startIcon={<PhotoCamera />} onClick={triggerFileUpload}>
							Upload Image
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							capture="environment"
							onChange={handleFileUpload}
							style={{ display: "none" }}
						/>

						<Button variant="outlined" onClick={onManualEntry}>
							Enter Package Details Manually
						</Button>
					</Box>
				</Box>
			)}
		</Paper>
	)
}

