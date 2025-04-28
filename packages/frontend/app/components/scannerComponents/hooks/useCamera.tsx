"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"

interface UseCameraOptions {
	onCaptureSuccess?: (imageSrc: string) => void
	onCaptureError?: (error: Error) => void
	initialFacingMode?: "user" | "environment"
}

interface UseCameraReturn {
	isCameraActive: boolean
	cameraReady: boolean
	cameraError: string | null
	cameraPermission: "granted" | "denied" | "prompt" | "unknown"
	facingMode: "user" | "environment"
	availableCameras: MediaDeviceInfo[]
	isCapturing: boolean
	capturedImage: string | null
	initializeCamera: () => Promise<void>
	toggleCamera: () => void
	captureImage: () => Promise<string | null>
	resetCamera: () => void
	CameraComponent: React.FC
}

export const useCamera = ({
	                          onCaptureSuccess,
	                          onCaptureError,
	                          initialFacingMode = "environment",
                          }: UseCameraOptions = {}): UseCameraReturn => {
	const webcamRef = useRef<Webcam>(null)

	// Camera states
	const [isCameraActive, setIsCameraActive] = useState(false)
	const [cameraReady, setCameraReady] = useState(false)
	const [cameraError, setCameraError] = useState<string | null>(null)
	const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")
	const [facingMode, setFacingMode] = useState<"user" | "environment">(initialFacingMode)
	const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
	const [isCapturing, setIsCapturing] = useState(false)
	const [capturedImage, setCapturedImage] = useState<string | null>(null)

	// Initialize camera on component mount
	useEffect(() => {
		initializeCamera()
		// Clean up on unmount
		return () => {
			resetCamera()
		}
	}, [])

	// Initialize camera when facing mode changes
	useEffect(() => {
		if (isCameraActive) {
			// Reset camera with new facing mode
			setCameraReady(false)
			setTimeout(() => {
				initializeCamera()
			}, 300)
		}
	}, [facingMode])

	// Initialize camera
	const initializeCamera = async () => {
		try {
			setCameraError(null)
			// Request camera access with specific constraints
			const constraints = {
				video: {
					facingMode: facingMode,
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			}
			const stream = await navigator.mediaDevices.getUserMedia(constraints)
			// If we get here, permission is granted
			setCameraPermission("granted")
			setIsCameraActive(true)

			// Get available cameras
			const devices = await navigator.mediaDevices.enumerateDevices()
			const videoDevices = devices.filter((device) => device.kind === "videoinput")
			setAvailableCameras(videoDevices)
			stream.getTracks().forEach((track) => track.stop())

		} catch (err) {
			setIsCameraActive(false)

			if (err instanceof DOMException) {
				if (err.name === "NotAllowedError") {
					setCameraPermission("denied")
					setCameraError("Camera access was denied. Please enable camera access in your browser settings.")
				} else if (err.name === "NotFoundError") {
					setCameraError("No camera found on your device.")
				} else if (err.name === "NotReadableError") {
					setCameraError("Camera is already in use by another application.")
				} else if (err.name === "OverconstrainedError") {
					setCameraError("Camera doesn't support the requested constraints. Try a different camera.")
				} else {
					setCameraError(`Camera error: ${err.name} - ${err.message}`)
				}
			} else {
				setCameraError(`Failed to access camera: ${err instanceof Error ? err.message : String(err)}`)
			}
		}
	}

	// Handle webcam ready state
	const handleWebcamReady = () => {
		setCameraReady(true)
	}

	// Switch camera between front and back
	const toggleCamera = () => {
		setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"))
	}

	// Capture image
	const captureImage = useCallback(async (): Promise<string | null> => {
		if (!webcamRef.current) {
			const error = new Error("Camera not initialized. Please try again.")
			if (onCaptureError) onCaptureError(error)
			return null
		}

		setIsCapturing(true)

		try {
			const imageSrc = webcamRef.current.getScreenshot()
			if (!imageSrc) {
				throw new Error("Failed to capture image. Please try again.")
			}

			console.log("Image captured successfully")
			setCapturedImage(imageSrc)

			if (onCaptureSuccess) onCaptureSuccess(imageSrc)

			return imageSrc
		} catch (err) {
			console.error("Capture error:", err)
			const error = err instanceof Error ? err : new Error("Failed to capture image")
			if (onCaptureError) onCaptureError(error)
			return null
		} finally {
			setIsCapturing(false)
		}
	}, [webcamRef, onCaptureSuccess, onCaptureError])

	// Reset camera
	const resetCamera = () => {
		setCapturedImage(null)
		if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
			const stream = webcamRef.current.video.srcObject as MediaStream
			stream.getTracks().forEach((track) => track.stop())
		}
	}

	// Camera component
	const CameraComponent: React.FC = () => (
		<>
			{/* The webcam component */}
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				videoConstraints={{
					facingMode: facingMode,
					width: { ideal: 1280 },
					height: { ideal: 720 },
				}}
				onUserMedia={handleWebcamReady}
				mirrored={facingMode === "user"}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: cameraReady ? "block" : "none",
				}}
			/>

			{/* Loading indicator while camera initializes */}
			{!cameraReady && isCameraActive && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#f5f5f5",
					}}
				>
					<div style={{ marginBottom: "16px" }}>
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="12" cy="12" r="10" stroke="#e0e0e0" strokeWidth="4" />
							<path
								d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
								stroke="#3f51b5"
								strokeWidth="4"
								strokeLinecap="round"
							>
								<animateTransform
									attributeName="transform"
									type="rotate"
									from="0 12 12"
									to="360 12 12"
									dur="1s"
									repeatCount="indefinite"
								/>
							</path>
						</svg>
					</div>
					<div>Initializing camera...</div>
				</div>
			)}
		</>
	)

	return {
		isCameraActive,
		cameraReady,
		cameraError,
		cameraPermission,
		facingMode,
		availableCameras,
		isCapturing,
		capturedImage,
		initializeCamera,
		toggleCamera,
		captureImage,
		resetCamera,
		CameraComponent,
	}
}

