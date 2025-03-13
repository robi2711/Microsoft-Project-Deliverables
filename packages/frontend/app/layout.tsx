//This is the layout Next.js will use to display the pages

import type React from "react"
import {ThemeProvider} from "@mui/material/styles"
import {lpTheme} from "@/components/theme/lpTheme"
import {Inter} from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Deliverables",
	description: "Microsoft project for tracking packages",
	icon: "/favicon.ico", // Is this supposed to be here? - Owen
}


export default function RootLayout({children,}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/favicon.ico" />
				// I know there's better ways of linking this but I couldn't get it to work - Owen
			</head>
			<body className={inter.className} style={{ margin: 0, padding: 0}}>
				<ThemeProvider theme={lpTheme}>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
