"use client"

import type React from "react"

import { useState } from "react"
import {
	Box,
	Typography,
	Button,
	Paper,
	TextField,
	Divider,
	useMediaQuery,
	useTheme,
	CircularProgress,
} from "@mui/material"
import { Edit, Save, CheckCircle, Cancel } from "@mui/icons-material"
import Image from "next/image"

interface PackageData {
	trackingNumber: string
	recipientName: string
	flatNumber: string
	carrier: string
}

interface PackageInfoFormProps {
	packageData: PackageData
	capturedImage: string | null
	isConfirming: boolean
	onEdit: (editedData: PackageData) => void
	onConfirm: () => void
	onScanAgain: () => void
}

export const PackageInfoForm: React.FC<PackageInfoFormProps> = ({
	                                                                packageData,
	                                                                capturedImage,
	                                                                isConfirming,
	                                                                onEdit,
	                                                                onConfirm,
	                                                                onScanAgain,
                                                                }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
	const [isEditing, setIsEditing] = useState(false)
	const [editedData, setEditedData] = useState<PackageData>(packageData)

	// Handle edit mode
	const handleEdit = () => {
		setIsEditing(true)
	}

	// Handle save edits
	const handleSave = () => {
		onEdit(editedData)
		setIsEditing(false)
	}

	// Handle field changes in edit mode
	const handleFieldChange = (field: keyof PackageData, value: string) => {
		setEditedData({
			...editedData,
			[field]: value,
		})
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			{/* Captured image preview */}
			{capturedImage && (
				<Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
					<Typography variant="subtitle1" gutterBottom>
						Scanned Image
					</Typography>
					<Box
						sx={{
							width: "100%",
							height: "200px",
							display: "flex",
							justifyContent: "center",
							overflow: "hidden",
							borderRadius: 1,
						}}
					>
						<Image
							src={capturedImage || ""}
							alt="Captured Package"
							width={400} // Replace with the appropriate width
							height={400} // Replace with the appropriate height
							layout="intrinsic"
							style={{ objectFit: "cover" }}

						/>
					</Box>
				</Paper>
			)}

			{/* Package information */}
			<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
					<Typography variant="h5" component="h2">
						Package Information
					</Typography>

					{!isEditing ? (
						<Button startIcon={<Edit />} onClick={handleEdit} variant="outlined" size={isMobile ? "small" : "medium"}>
							Edit
						</Button>
					) : (
						<Button startIcon={<Save />} onClick={handleSave} variant="contained" size={isMobile ? "small" : "medium"}>
							Save
						</Button>
					)}
				</Box>

				<Divider sx={{ mb: 3 }} />

				{isEditing ? (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							label="Tracking Number"
							fullWidth
							value={editedData.trackingNumber}
							onChange={(e) => handleFieldChange("trackingNumber", e.target.value)}
							size={isMobile ? "small" : "medium"}
						/>
						<TextField
							label="Recipient Name"
							fullWidth
							value={editedData.recipientName}
							onChange={(e) => handleFieldChange("recipientName", e.target.value)}
							size={isMobile ? "small" : "medium"}
						/>
						<TextField
							label="Flat Number"
							fullWidth
							value={editedData.flatNumber}
							onChange={(e) => handleFieldChange("flatNumber", e.target.value)}
							size={isMobile ? "small" : "medium"}
						/>
						<TextField
							label="Carrier"
							fullWidth
							value={editedData.carrier}
							onChange={(e) => handleFieldChange("carrier", e.target.value)}
							size={isMobile ? "small" : "medium"}
						/>
					</Box>
				) : (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Box>
							<Typography variant="subtitle2" color="text.secondary">
								Tracking Number
							</Typography>
							<Typography variant="body1">{packageData.trackingNumber || "N/A"}</Typography>
						</Box>

						<Box>
							<Typography variant="subtitle2" color="text.secondary">
								Recipient Name
							</Typography>
							<Typography variant="body1">{packageData.recipientName || "N/A"}</Typography>
						</Box>

						<Box>
							<Typography variant="subtitle2" color="text.secondary">
								Flat Number
							</Typography>
							<Typography variant="body1">{packageData.flatNumber || "N/A"}</Typography>
						</Box>

						<Box>
							<Typography variant="subtitle2" color="text.secondary">
								Carrier
							</Typography>
							<Typography variant="body1">{packageData.carrier || "N/A"}</Typography>
						</Box>
					</Box>
				)}
			</Paper>

			{/* Action buttons */}
			<Box sx={{ display: "flex", gap: 2, mt: 2 }}>
				<Button
					variant="outlined"
					color="primary"
					startIcon={<Cancel />}
					onClick={onScanAgain}
					fullWidth
					size={isMobile ? "medium" : "large"}
				>
					Scan Again
				</Button>

				<Button
					variant="contained"
					color="primary"
					startIcon={isConfirming ? null : <CheckCircle />}
					onClick={onConfirm}
					disabled={isConfirming || isEditing}
					fullWidth
					size={isMobile ? "medium" : "large"}
				>
					{isConfirming ? <CircularProgress size={24} color="inherit" /> : "Confirm Package"}
				</Button>
			</Box>
		</Box>
	)
}

