"use client"

import { Box, Button, Link, useMediaQuery, useTheme, Container } from "@mui/material"
import LeftSide from "@/components/landingComponents/LeftSide"
import RightSide from "@/components/landingComponents/RightSide"

export default function LandingPage() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                overflow: "auto",
            }}
        >
            {isMobile ? (
                <>
                    <LeftSide />
                    <RightSide />
                    <Container sx={{ py: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                        <Link href="/scanner" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="primary" fullWidth>
                                Go to Scanner
                            </Button>
                        </Link>
                        <Link href="/dashboard" style={{ textDecoration: "none" }}>
                            <Button variant="outlined" color="primary" fullWidth>
                                Go to Dashboard
                            </Button>
                        </Link>
                    </Container>
                </>
            ) : (
                <>
                    <LeftSide />
                    <RightSide />
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 20,
                            right: 20,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        <Link href="/scanner" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="secondary">
                                Go to Scanner
                            </Button>
                        </Link>
                        <Link href="/dashboard" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="secondary">
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link href="/residentConfirmation" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="secondary">
                                Go to Resident confirmation
                            </Button>
                        </Link>
                    </Box>
                </>
            )}
        </Box>
    )
}

