"use client"

import { useState } from "react"
import { Box, Container, Alert, Snackbar } from "@mui/material"
import { ScannerHeader } from "@/components/scannerComponents/ScannerHeader"
import { CameraView } from "@/components/scannerComponents/CameraView"
import { ScanInstructions } from "@/components/scannerComponents/ScanInstructions"
import { PackageInfoForm } from "@/components/scannerComponents/PackageInfoForm"
import { scanPackage, confirmPackage, type PackageData } from "@/components/services/scannerService"

export default function ScannerPage() {
	// Scanning states
	const [isScanning, setIsScanning] = useState(false)
	const [scanComplete, setScanComplete] = useState(false)
	const [scanError, setScanError] = useState<string | null>(null)
	const [capturedImage, setCapturedImage] = useState<string | null>(null)

	// Package data states
	const [packageData, setPackageData] = useState<PackageData | null>(null)

	// Confirmation states
	const [isConfirming, setIsConfirming] = useState(false)
	const [confirmationSuccess, setConfirmationSuccess] = useState(false)
	const [confirmationError, setConfirmationError] = useState<string | null>(null)

	// Handle image capture
	const handleCapture = async (imageSrc: string) => {
		setIsScanning(true)
		setScanError(null)
		setCapturedImage(imageSrc)

		try {
			// Send image to backend for processing
			const data = await scanPackage(imageSrc)
			setPackageData(data)
			setScanComplete(true)
		} catch (err) {
			setScanError(err instanceof Error ? err.message : "Failed to scan package")
		} finally {
			setIsScanning(false)
		}
	}

	// Handle package data edit
	const handleEditPackage = (editedData: PackageData) => {
		setPackageData(editedData)
	}

	// Handle confirmation
	const handleConfirm = async () => {
		if (!packageData) return

		setIsConfirming(true)
		setConfirmationError(null)

		try {
			await confirmPackage(packageData)
			setConfirmationSuccess(true)

			// Reset after 3 seconds
			setTimeout(() => {
				resetScan()
			}, 3000)
		} catch (err) {
			setConfirmationError(err instanceof Error ? err.message : "Failed to confirm package")
		} finally {
			setIsConfirming(false)
		}
	}

	// Reset the scan process
	const resetScan = () => {
		setScanComplete(false)
		setPackageData(null)
		setConfirmationSuccess(false)
		setConfirmationError(null)
		setScanError(null)
		setCapturedImage(null)
	}

	const handleManualEntry = () => {
		const emptyData: PackageData = {
			trackingNumber: "",
			recipientName: "",
			flatNumber: "",
			carrier: "",
		}
		setPackageData(emptyData)
		setScanComplete(true)
	}

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<ScannerHeader title="Package Scanner" />

			<Container maxWidth="md" sx={{ py: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
				{!scanComplete ? (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 3, flexGrow: 1 }}>
						{/* Camera View */}
						<CameraView
							onCapture={handleCapture}
							onManualEntry={handleManualEntry}
							isScanning={isScanning}
							scanError={scanError}
						/>

						{/* Instructions */}
						<ScanInstructions />

						{/* Error message */}
						{scanError && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{scanError}
							</Alert>
						)}
					</Box>
				) : (
					packageData && (
						<PackageInfoForm
							packageData={packageData}
							capturedImage={capturedImage}
							isConfirming={isConfirming}
							onEdit={handleEditPackage}
							onConfirm={handleConfirm}
							onScanAgain={resetScan}
						/>
					)
				)}
			</Container>

			{/* Confirmation error */}
			{confirmationError && (
				<Alert severity="error" sx={{ mt: 2, mx: 3 }}>
					{confirmationError}
				</Alert>
			)}

			{/* Success notification */}
			<Snackbar
				open={confirmationSuccess}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
			</Snackbar>
		</Box>
	)
}

