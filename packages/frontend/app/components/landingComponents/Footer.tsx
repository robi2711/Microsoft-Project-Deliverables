"use client"

import { Box, Container, Divider, Grid, IconButton, Link, Typography } from "@mui/material"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import InstagramIcon from "@mui/icons-material/Instagram"

const footerLinks = [
	{
		title: "Company",
		links: ["About", "Careers", "Blog", "Press"],
	},
	{
		title: "Product",
		links: ["Features", "Pricing", "Integrations", "FAQ"],
	},
	{
		title: "Resources",
		links: ["Documentation", "Guides", "API Status", "Support"],
	},
	{
		title: "Legal",
		links: ["Privacy", "Terms", "Security", "Cookies"],
	},
]

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				bgcolor: "background.paper",
				py: 6,
				borderTop: 1,
				borderColor: "divider",
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					<Grid item xs={12} md={4}>
						<Box sx={{ mb: 3 }}>
							<Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
								BRAND
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 300 }}>
								We're on a mission to help businesses grow and succeed in the digital age.
							</Typography>
						</Box>
						<Box sx={{ display: "flex", gap: 1 }}>
							<IconButton color="primary" aria-label="Facebook">
								<FacebookIcon />
							</IconButton>
							<IconButton color="primary" aria-label="Twitter">
								<TwitterIcon />
							</IconButton>
							<IconButton color="primary" aria-label="LinkedIn">
								<LinkedInIcon />
							</IconButton>
							<IconButton color="primary" aria-label="Instagram">
								<InstagramIcon />
							</IconButton>
						</Box>
					</Grid>

					{footerLinks.map((section, index) => (
						<Grid item xs={6} sm={3} md={2} key={index}>
							<Typography
								variant="subtitle1"
								component="h3"
								sx={{
									fontWeight: 600,
									mb: 2,
								}}
							>
								{section.title}
							</Typography>
							<Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
								{section.links.map((link, linkIndex) => (
									<Box component="li" key={linkIndex} sx={{ mb: 1 }}>
										<Link
											href="#"
											underline="hover"
											color="text.secondary"
											sx={{
												fontSize: "0.875rem",
												"&:hover": {
													color: "primary.main",
												},
											}}
										>
											{link}
										</Link>
									</Box>
								))}
							</Box>
						</Grid>
					))}
				</Grid>

				<Divider sx={{ my: 4 }} />

				<Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
					<Typography variant="body2" color="text.secondary">
						© {new Date().getFullYear()} BRAND. All rights reserved.
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Made with ❤️ for a better web
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}

