"use client"

import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material"
import SpeedIcon from "@mui/icons-material/Speed"
import SecurityIcon from "@mui/icons-material/Security"
import DevicesIcon from "@mui/icons-material/Devices"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"

const features = [
	{
		title: "Lightning Fast",
		description: "Our platform is optimized for speed and performance, ensuring your users have the best experience.",
		icon: <SpeedIcon sx={{ fontSize: 50 }} />,
	},
	{
		title: "Secure by Design",
		description: "Security is built into every aspect of our platform, protecting your data and your users.",
		icon: <SecurityIcon sx={{ fontSize: 50 }} />,
	},
	{
		title: "Responsive Design",
		description: "Our platform looks great on any device, from desktop to mobile and everything in between.",
		icon: <DevicesIcon sx={{ fontSize: 50 }} />,
	},
	{
		title: "24/7 Support",
		description: "Our team is available around the clock to help you with any issues or questions you may have.",
		icon: <SupportAgentIcon sx={{ fontSize: 50 }} />,
	},
]

export default function Features() {
	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth="lg">
				<Box sx={{ textAlign: "center", mb: 6 }}>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							fontWeight: 700,
							mb: 2,
						}}
					>
						Our Features
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: 700,
							mx: "auto",
							lineHeight: 1.6,
						}}
					>
						We provide the tools you need to succeed in today&#39;s digital landscape
					</Typography>
				</Box>

				<Grid container spacing={4}>
					{features.map((feature, index) => (
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									borderRadius: 2,
									transition: "transform 0.3s, box-shadow 0.3s",
									"&:hover": {
										transform: "translateY(-8px)",
										boxShadow: 6,
									},
								}}
							>
								<CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
									<Box
										sx={{
											color: "primary.main",
											mb: 2,
											display: "flex",
											justifyContent: "center",
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h5"
										component="h3"
										sx={{
											fontWeight: 600,
											mb: 1.5,
										}}
									>
										{feature.title}
									</Typography>
									<Typography variant="body1" color="text.secondary">
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

