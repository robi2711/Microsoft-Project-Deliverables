"use client"


// importing necessary modules
import { Box, Typography, MenuItem, FormControl, Select, Tab } from "@mui/material"
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

export default function sideBar() {
    return(

        <Box // using an MUI box to create a sidebar
            sx={{
                width: "15%", // setting the width of the sidebar
                height: "100vh", // should be the whole visable height
                display: "flex", // making the sidebar a flexbox
                flexDirection: "column", // setting the direction of the flexbox
                bgcolor: "primary.dark"
            }}
        >
            {/* adding a logo and title to the sidebar within it's own box */}
            <Box sx={{ display: "flex", alignItems: "center"}}>
                <img src="https://raw.githubusercontent.com/robi2711/Microsoft-Project-Deliverables/refs/heads/version-3-frontend/favicon.ico" style={{ width: 24, height: 24, marginRight: 8 }} />
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
                        id="complex-select"
                        label="Select Complex"
                        sx={{ bgcolor: "white" }}
                    >
                        <MenuItem value={10}>Complex 1</MenuItem>
                        <MenuItem value={20}>Complex 2</MenuItem>
                        <MenuItem value={30}>Complex 3</MenuItem>
                    </Select> {/* placeholder values for now */}
                </FormControl> {/* need to link it with backend */}
            </Box>

            {/* adding the overview tab*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab label="Overview" sx={{ color: "white", bgcolor: "secondary.dark", width: "100%" }}  />
            </Box>

            {/* adding google maps window */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Box sx={{ width: "80%", height: "100px", bgcolor: "white", borderRadius: 2 }}>
                    {/* Google Maps API goes here */}
                </Box>
            </Box>

            {/* adding the Resident management tab, this can be extended to all tabs we develope*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, width: "100%" }}>
                <Tab label="Resident management" sx={{ color: "white", bgcolor: "secondary.light", width: "100%" }}  />
            </Box>

            {/* adding a route to scanner that's fixed at the bottom of the page.*/}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: "auto", width: "100%" }}>
                <Tab label="Scanner" sx={{ color: "white", bgcolor: "secondary.light", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} icon={<CenterFocusStrongIcon sx={{ fontSize: 40 }} />} />
            </Box>

        </Box>
    )
}

