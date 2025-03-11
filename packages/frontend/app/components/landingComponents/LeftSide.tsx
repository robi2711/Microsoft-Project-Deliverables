import {Box, Container, Grid, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";

export default function LeftSide() {
	const [animateCards, setAnimateCards] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimateCards(true)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	const features = [
		{
			title: "Smart Label Scanner",
			points: ["AI-powered image capture", "Instant name/flat extraction", "One-click processing"],
		},
		{
			title: "WhatsApp Notifications",
			points: ["Automated delivery alerts", "Resident confirmation", "Delivery scheduling"],
		},
		{
			title: "Resident Portal",
			points: ["Quick contract upload", "Secure phone verification", "Self-service registration"],
		},
		{
			title: "Admin Dashboard",
			points: ["Package tracking overview", "Performance metrics", "Configuration controls"],
		},
	]

	return (
		<Box
			sx={{
				width: "60%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				p: 6,
			}}
		>
			<Container maxWidth="md">
				<Typography variant="h2" component="h1" gutterBottom>
					Welcome to Deliverables
				</Typography>
				<Typography variant="h5" color="text.secondary" gutterBottom>
					A modern package tracking solution for residential communities
				</Typography>
				<Grid container spacing={8} sx={{ mt: 2 }}>
					{features.map((feature, index) => (
						<Grid item xs={12} md={6} key={feature.title}>
							<Paper
								elevation={2}
								sx={{
									p: 3,
									height: "100%",
									opacity: animateCards ? 1 : 0,
									transform: animateCards ? "translateY(0)" : "translateY(20px)",
									transition: `all 0.5s ease-out ${index * 0.15}s`,
								}}
							>
								<Typography variant="h6" gutterBottom>
									{feature.title}
								</Typography>
								<Box component="ul" sx={{ pl: 2 }}>
									{feature.points.map((point, pointIndex) => (
										<Typography
											component="li"
											variant="body2"
											key={pointIndex}
											sx={{
												mb: pointIndex < feature.points.length - 1 ? 1 : 0,
												opacity: animateCards ? 1 : 0,
												transform: animateCards ? "translateX(0)" : "translateX(10px)",
												transition: `all 0.5s ease-out ${index * 0.15 + 0.2 + pointIndex * 0.1}s`,
											}}
										>
											{point}
										</Typography>
									))}
								</Box>
							</Paper>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

