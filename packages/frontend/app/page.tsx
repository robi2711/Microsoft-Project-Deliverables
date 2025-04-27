"use client"

import { Box, useMediaQuery, useTheme } from "@mui/material"
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
                </>
            ) : (
                <>
                    <LeftSide />
                    <RightSide />
                </>
            )}
        </Box>
    )
}

