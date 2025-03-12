"use client"

import {Box, Button, Link} from "@mui/material"
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
            <Link href="/scanner">
                <Button>Link To Scanner</Button>
            </Link>
            <Link href="/dashboard">
                <Button>Link To Dashboard</Button>
            </Link>
            <RightSide />
            <LeftSide />
        </Box>
    )
}

