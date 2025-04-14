"use client"


// importing necessary modules
import { Box, Typography, MenuItem, FormControl, Select, Tab, Link } from "@mui/material"
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import {useUser} from "@/components/services/UserContext"; //we will use user context to get complex list
// import Image from 'next/image';

{/* We need arguments relating to active tabs so we can highlight the active */}
interface SideBarProps {
    setActiveTab: (tab: string) => void;
    activeTab: string;
}

export default function SideBar({ setActiveTab, activeTab }: SideBarProps) {
    const { userInfo } = useUser()
    //console.log(userInfo)
    return(
        <Box
            sx={{
                width: "20vw", // setting the width of the sidebar - 20% of the viewport width
                height: "100vh", // should be the whole visable height
                display: "flex",
                flexDirection: "column", // elements are stacked on top of each other
                bgcolor: "primary.dark"
            }}
        >
            {/* adding a logo and title to the sidebar within it's own box */}
            <Box sx={{ display: "flex", alignItems: "center"}}>
                {/* <Image src="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/favicon.ico"
                     style={{ width: 24, height: 24, marginRight: 8 }} alt={""}/>
                     currently commenting out image
                     TODO: fix it, giving errors and idk how it's supposed to work*/}
                <Typography variant="h5" sx={{ color: "white", textAlign: "center" }}>
                    Deliverables
                </Typography>
            </Box>

            {/* adding the complex selection within it's own box */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
                <Typography variant="h6" sx={{ color: "white" }}>
                    Building Complex
                </Typography>
                <FormControl sx={{ width: "80%", mt: 2 }}>
                    <Select
                        defaultValue={10}
                        id="complex-select"
                        label="Select Complex"
                        sx={{ bgcolor: "white" }}
                    >
                        <MenuItem value={10}>2 Rathbourne, Dublin D15 PF6A</MenuItem>
                        <MenuItem value={20}>15 Adelaide Street, Dun Laoghaire, Dublin A96 D8Y9</MenuItem>
                        <MenuItem value={30}>10 Elmwood Avenue, Ranelagh, Dublin D06 F9C3</MenuItem>
                    </Select>
                </FormControl> {/* TODO: Link with backend*/}
                {/* Almost ready, we'll hittem with the get("/admin/:id/complexes")*/}
            </Box>

            {/* The overview tab*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab
                    label="Overview"
                    sx={{ color: "white",
                        bgcolor: activeTab === "overview" ? "secondary.dark" : "secondary.light", // if active, make it dark, else light
                        width: "100%" }}
                    onClick={() => setActiveTab("overview")} // magic
                />
            </Box>

            {/* google maps window */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Box sx={{ width: "80%", height: "100px", bgcolor: "white"}}>
                    {/* TODO: Google Maps API goes here - gotta look into that */}
                    {/* <Image src="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/SampleImage.png"
                         style={{ width: "100%", height: "100%"}} alt={""}/> */}
                </Box>
            </Box>

            {/* resident management tab*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab
                    label="Resident management"
                    sx={{ color: "white",
                        bgcolor: activeTab === "residentManagement" ? "secondary.dark" : "secondary.light", // if active, make it dark, else light
                        width: "100%" }}
                    onClick={() => setActiveTab("residentManagement")}
                />
            </Box>

            {/*  this can be extended to all tabs we develope more*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0, width: "100%" }}>
                <Tab
                    label="Concierge management"
                    sx={{ color: "white",
                        bgcolor: activeTab === "conciergeManagement" ? "secondary.dark" : "secondary.light", // if active, make it dark, else light
                        width: "100%" }}
                    onClick={() => setActiveTab("conciergeManagement")}
                />
                <Tab label="Other tabs..." sx={{ color: "white", bgcolor: "secondary.light", width: "100%" }} />
            </Box>

            {/* adding a route to scanner that's fixed at the bottom of the page.*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: "auto", width: "100%" }}>
                <Link href="/scanner" sx={{ width: "100%", textDecoration: "none" }}>
                    <Tab label="Scanner" sx={{ color: "white", bgcolor: "secondary.light", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} icon={<CenterFocusStrongIcon sx={{ fontSize: 80 }} />} />
                </Link>
            </Box>
        </Box>
    )
}