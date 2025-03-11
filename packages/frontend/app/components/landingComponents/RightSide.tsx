import {Box, Button, Paper, Typography} from "@mui/material";
import Link from "next/link";
import {ArrowForward} from "@mui/icons-material";
import {useEffect, useState} from "react";

export default function RightSide() {
	const [animateSignIn, setAnimateSignIn] = useState(false)

	useEffect(() => {
		const leftSideTimer = setTimeout(() => {
			setAnimateSignIn(true)
		}, 100)

		return () => {
			clearTimeout(leftSideTimer)
		}
	}, [])

	return (
		<Box
			sx={{
				width: "40%",
				bgcolor: "primary.main",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				color: "white",
				p: 4,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					width: "100%",
					maxWidth: 400,
					bgcolor: "primary.light",
					color: "white",
					borderRadius: 2,
					opacity: animateSignIn ? 1 : 0,
					transform: animateSignIn ? "translateX(0)" : "translateX(100%)",
					transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
				}}
			>
				<Typography variant="h4" gutterBottom>
					 New here?
				</Typography>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{/* I think Links are redundent here I can 100% cook up an animated thing for sign in/up. */}
					<Link href="/signup" passHref>
						<Button variant="contained" color="secondary" size="large" fullWidth endIcon={<ArrowForward />}>
							Sign Up
						</Button>
					</Link>
					<Link href="/signin" passHref>
						<Button variant="contained" color="secondary" size="large" fullWidth endIcon={<ArrowForward />}>
							Sign In
						</Button>
					</Link>

				</Box>
			</Paper>
		</Box>
	)
}

