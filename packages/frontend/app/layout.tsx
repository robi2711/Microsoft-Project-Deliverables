//This is the layout Next.js will use to display the pages
"use client"
import * as React from 'react';
import {ThemeProvider} from "@mui/material/styles"
import {lpTheme} from "@/components/theme/lpTheme"
import {Inter} from "next/font/google"
import {UserProvider, useUser} from "@/components/services/UserContext";
import {usePathname, useRouter} from "next/navigation";

const inter = Inter({ subsets: ["latin"] })

function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { userInfo } = useUser();
	const router = useRouter();
	const pathname = usePathname();

	React.useEffect(() => {
		const timer = setTimeout(() => {
			if (!userInfo && (pathname !== '/')) {
				router.push('/');
			}
		}, 200);

		return () => clearTimeout(timer);
	}, [userInfo, pathname, router]);

	return <>{children}</>;
}



export default function RootLayout({children,}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/favicon.ico" />
			</head>
			<body className={inter.className} style={{ margin: 0, padding: 0}}>

			<UserProvider>
				<ProtectedLayout>
				<ThemeProvider theme={lpTheme}>
					{children}
				</ThemeProvider>
				</ProtectedLayout>
			</UserProvider>
			</body>
		</html>
	)
}
