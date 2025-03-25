import type React from "react"
import { Card, CardContent, Typography } from "@mui/material"

export const ScanInstructions: React.FC = () => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					How to scan a package
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					1. Position the package label within the camera frame
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					2. Ensure good lighting and hold the camera steady
				</Typography>
				<Typography variant="body2" color="text.secondary" paragraph>
					3. Tap the camera button to scan
				</Typography>
				<Typography variant="body2" color="text.secondary">
					4. If camera doesn&#39;t work, try uploading an image or entering details manually
				</Typography>
			</CardContent>
		</Card>
	)
}

