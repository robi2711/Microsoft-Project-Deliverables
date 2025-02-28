"use client"

import { Box, Button, Container, Grid, Typography } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export default function Hero() {
	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4} alignItems="center">
					<Grid item xs={12} md={6}>
						<Box sx={{ maxWidth: 550 }}>
							<Typography
								variant="h2"
								component="h1"
								sx={{
									fontWeight: 800,
									mb: 2,
									fontSize: { xs: "2.5rem", md: "3.5rem" },
								}}
							>
								Build amazing digital products with us
							</Typography>
							<Typography
								variant="h6"
								color="text.secondary"
								sx={{
									mb: 4,
									fontWeight: 400,
									lineHeight: 1.6,
								}}
							>
								We help ambitious companies like yours generate more profits by building awareness, driving web traffic,
								connecting with customers, and growing overall sales.
							</Typography>
							<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
								<Button
									variant="contained"
									color="primary"
									size="large"
									endIcon={<ArrowForwardIcon />}
									sx={{
										fontWeight: 600,
										px: 4,
										py: 1.5,
									}}
								>
									Get Started
								</Button>
								<Button
									variant="outlined"
									color="primary"
									size="large"
									sx={{
										fontWeight: 600,
										px: 4,
										py: 1.5,
									}}
								>
									Learn More
								</Button>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							component="img"
							src="/placeholder.svg?height=400&width=600"
							alt="Hero Image"
							sx={{
								width: "100%",
								height: "auto",
								borderRadius: 2,
								boxShadow: 3,
							}}
						/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

