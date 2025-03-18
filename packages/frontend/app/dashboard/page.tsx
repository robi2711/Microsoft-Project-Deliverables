// This will become the Dashboard page
"use client"

import {Box} from "@mui/material"

import SideBar from "@/components/dashboardComponents/sideBar"
import TopBar from "@/components/dashboardComponents/topBar"
import Overview from "@/components/dashboardComponents/overviewBody"
import ResidentManagement from "@/components/dashboardComponents/residentManagementBody"

export default function dashboard() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                overflow: "hidden",
            }}
        >
            <SideBar />
            <TopBar />
            <Overview />
        </Box>
    )
}