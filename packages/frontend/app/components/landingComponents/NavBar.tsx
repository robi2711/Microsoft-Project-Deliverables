"use client"

import { useState } from "react"
import {
	AppBar,
	Box,
	Button,
	Container,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import {useRouter} from "next/navigation";

const navItems = ["Home", "Features", "Pricing", "About", "Contact"]

export default function NavBar() {
	const [mobileOpen, setMobileOpen] = useState(false)
	const router = useRouter();

	const handleCLICKME = () => {
		router.push("/tmp")
	}

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	return (
		<AppBar position="sticky" color="primary" elevation={0}>
			<Container maxWidth="lg">
				<Toolbar sx={{ py: 1 }}>
					<Typography
						variant="h6"
						component="div"
						sx={{
							flexGrow: 1,
							fontWeight: 700,
							display: "flex",
							alignItems: "center",
						}}
					>
						BRAND
					</Typography>

					<Box sx={{ display: { xs: "none", md: "flex" } }}>
						{navItems.map((item) => (
							<Button
								key={item}
								sx={{
									color: "white",
									mx: 1,
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.1)",
									},
								}}
							>
								{item}
							</Button>
						))}

						<Button
							variant="contained"
							color="secondary"
							onClick={handleCLICKME}
							sx={{
								ml: 2,
								fontWeight: 600,
								boxShadow: 2,
							}}
						>
							CLICK ME PLEASEEEEEE
						</Button>
					</Box>

					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="end"
						onClick={handleDrawerToggle}
						sx={{ display: { md: "none" } }}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</Container>

			<Drawer
				anchor="right"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: 240,
						backgroundColor: "primary.main",
						color: "white",
					},
				}}
			>
				<Box sx={{ textAlign: "right", p: 1 }}>
					<IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
						<CloseIcon />
					</IconButton>
				</Box>
				<List>
					{navItems.map((item) => (
						<ListItem key={item} disablePadding>
							<ListItemButton sx={{ textAlign: "center" }}>
								<ListItemText primary={item} />
							</ListItemButton>
						</ListItem>
					))}
					<ListItem disablePadding>
						<ListItemButton
							sx={{
								textAlign: "center",
								my: 1,
								mx: 2,
								backgroundColor: "secondary.main",
								borderRadius: 1,
								"&:hover": {
									backgroundColor: "secondary.dark",
								},
							}}
						>
							<ListItemText primary="Get Started" />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
		</AppBar>
	)
}

