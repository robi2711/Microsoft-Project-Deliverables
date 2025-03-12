//This is the theme for MUI it gets called in the layout.tsx file and is used to style the entire app.

"use client"

import { createTheme } from "@mui/material/styles"


export const lpTheme = createTheme({
	palette: {
		primary: {
			main: "#A86B31", // Base color from the logo
			light: "#C48A5A", // Lighter shade for hover effects
			dark: "#875A29", // Depth color from the logo
			contrastText: "#FFFFFF", // White text for contrast
		},
		secondary: {
			main: "#875A29", // Depth color from the logo
			light: "#A86B31", // Base color for hover effects
			dark: "#452B1F", // Shading on the depth
			contrastText: "#FFFFFF", // White text for contrast
		},
		background: {
			default: "#ffffff",
			paper: "#f8fafc",
		},
		text: {
			primary: "#0f172a",
			secondary: "#2E1A13",
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 800,
		},
		h2: {
			fontWeight: 700,
		},
		h3: {
			fontWeight: 700,
		},
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 600,
		},
		h6: {
			fontWeight: 500,
		},
		button: {
			fontWeight: 600,
			textTransform: "none",
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					"&:hover": {
						boxShadow: "none",
					},
				},
				containedPrimary: {
					"&:hover": {
						backgroundColor: "#1d4ed8",
					},
				},
				containedSecondary: {
					"&:hover": {
						backgroundColor: "#c2410c",
					},
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				"*": {
					boxSizing: "border-box",
					margin: 0,
					padding: 0,
				},
				html: {
					WebkitFontSmoothing: "antialiased",
					MozOsxFontSmoothing: "grayscale",
					height: "100%",
					width: "100%",
				},
				body: {
					height: "100%",
					width: "100%",
					overflowX: "hidden",
				},
			},
		},
	},
})

