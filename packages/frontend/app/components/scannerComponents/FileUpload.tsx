"use client"

import type React from "react"

import { useState } from "react"
import { Box, Paper, Button } from "@mui/material"
import { CloudUpload } from "@mui/icons-material"


export default function FileUpload() {
	const [dragOver, setDragOver] = useState(false)
	const [files] = useState<File[]>([])

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setDragOver(true)
	}

	const handleDragLeave = () => {
		setDragOver(false)
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setDragOver(false)
		const droppedFiles = Array.from(event.dataTransfer.files)
		handleFiles(droppedFiles)
	}

	const handleFiles = (files: File[]) => {
		console.log('Files uploaded:', files);
	}



	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
			}}
		>
			<Paper
				elevation={dragOver ? 4 : 2}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				sx={{
					p: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: 250,
					minWidth: 250,
					border: "2px dashed",
					borderRadius: 2,
					cursor: "pointer",
				}}
				onClick={() => document.getElementById("fileInput")?.click()}
			>
				<Button
					variant="contained"
					color="primary"
					startIcon={<CloudUpload />}
					onClick={(e) => {
						e.stopPropagation()
						document.getElementById("fileInput")?.click()
					}}
					sx={{ mt: files.length > 0 ? 2 : 0 }}
				>
					Browse Files
				</Button>
				<input
					type="file"
					id="fileInput"
					style={{ display: "none" }}
				/>
			</Paper>
		</Box>
	)
}

