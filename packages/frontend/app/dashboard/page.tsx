// This will become the Dashboard page
"use client"

import {Box} from "@mui/material"
import {useState} from "react"

import SideBar from "@/components/dashboardComponents/sideBar"
import TopBar from "@/components/dashboardComponents/topBar"
import Overview from "@/components/dashboardComponents/overviewBody"
import ResidentManagement from "@/components/dashboardComponents/residentManagementBody"

export default function dashboard() {
    // It's going to be a static page and we'll nativate between the tabs
    const [activeTab, setActiveTab] = useState("overview") // Default to overview

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                overflow: "hidden",
            }}
        >
            {/* We pass the active tab to the sidebar so it knows which tab to darken */}
            <SideBar setActiveTab={setActiveTab} activeTab={activeTab} />
            <TopBar /> {/* Our topbar displaying current user and the search input*/}
            {activeTab === "overview" && <Overview />} {/* If the active tab is overview, display the overview component */}
            {activeTab === "residentManagement" && <ResidentManagement />} {/* same craic ^ */}
        </Box>
    )
}