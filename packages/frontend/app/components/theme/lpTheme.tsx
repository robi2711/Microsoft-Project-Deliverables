"use client"

import { createTheme } from "@mui/material/styles"

export const lpTheme = createTheme({
	palette: {
		primary: {
			main: "#2563eb",
			light: "#60a5fa",
			dark: "#1d4ed8",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#f97316",
			light: "#fdba74",
			dark: "#c2410c",
			contrastText: "#ffffff",
		},
		background: {
			default: "#ffffff",
			paper: "#f8fafc",
		},
		text: {
			primary: "#0f172a",
			secondary: "#64748b",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"#pageBox": {
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignContent: "center",
				},
				".uploadBox": {
					width: "300px",
					height: "200px",
					border: "2px dashed #ccc",
					borderRadius: "10px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					backgroundColor: "#fff",
				},
				".uploadBox.dragover": {
					borderColor: "#000",
				},
				".uploadBox button": {
					marginTop: "10px",
					padding: "5px 10px",
					border: "none",
					backgroundColor: "#007bff",
					color: "#fff",
					borderRadius: "5px",
					cursor: "pointer",
				},
				".uploadBox button:hover": {
					backgroundColor: "#0056b3",
				},
			},
		},
	},
})