"use client"


// importing necessary modules
import { Box, Typography, MenuItem, FormControl, Select, Tab, Link } from "@mui/material"
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

export default function sideBar() {
    return(

        <Box // using an MUI box to create a sidebar
            sx={{
                width: "20vw", // setting the width of the sidebar - 20% of the viewport width
                height: "100vh", // should be the whole visable height
                display: "flex", // making the sidebar a flexbox
                flexDirection: "column", // setting the direction of the flexbox
                bgcolor: "primary.dark"
            }}
        >
            {/* adding a logo and title to the sidebar within it's own box */}
            <Box sx={{ display: "flex", alignItems: "center"}}>
                <img src="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/favicon.ico"
                     style={{ width: 24, height: 24, marginRight: 8 }} />
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
                    </Select> {/* placeholder values for now */}
                </FormControl> {/* need to link it with backend */}
            </Box>

            {/* adding the overview tab*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab label="Overview" sx={{ color: "white", bgcolor: "secondary.dark", width: "100%" }}  />
            </Box>

            {/* adding google maps window */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Box sx={{ width: "80%", height: "100px", bgcolor: "white"}}>
                    {/* TODO: Google Maps API goes here - gotta look into that */}
                    <img src="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/SampleImage.png"
                         style={{ width: "100%", height: "100%"}}/>
                </Box>
            </Box>

            {/* adding the Resident management tab*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab label="Resident management" sx={{ color: "white", bgcolor: "secondary.light", width: "100%" }}  />
            </Box>
            {/*  this can be extended to all tabs we develope more*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0, width: "100%" }}>
                <Tab label="Other tabs..." sx={{ color: "white", bgcolor: "secondary.light", width: "100%" }}  />
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

