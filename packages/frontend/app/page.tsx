"use client"

import { Box } from "@mui/material"
import LeftSide from "@/components/landingComponents/RightSide";
import RightSide from "@/components/landingComponents/LeftSide";

export default function LandingPage() {

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                overflow: "hidden",
            }}
        >

            <RightSide />
            <LeftSide />
        </Box>
    )
}

