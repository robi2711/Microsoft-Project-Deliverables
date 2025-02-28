//This is the layout Next.js will use to display the pages

import type React from "react"
import {ThemeProvider} from "@mui/material/styles"
import {lpTheme} from "@/components/theme/lpTheme"

export default function RootLayout({children,}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
		<head>
			<title>Landing Page</title>
			<meta name="description" content="A beautiful landing page built with Next.js, TypeScript, and MUI"/>
		</head>
		<body>
			<ThemeProvider theme={lpTheme}>
				{children}
			</ThemeProvider>
		</body>
		</html>
	)
}
