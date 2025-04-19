"use client"


// importing necessary modules
import {Box, FormControl, Link, MenuItem, Select, Tab, Typography} from "@mui/material"
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import {useUser, ComplexResponse} from "@/components/services/UserContext";
import {useEffect, useState} from "react";
import api from "@/components/services/apiService";
// import Image from 'next/image';

{/* We need arguments relating to active tabs so we can highlight the active */}
interface SideBarProps {
    setActiveTab: (tab: string) => void;
    activeTab: string;
}


export default function SideBar({ setActiveTab, activeTab }: SideBarProps) {
    const { userInfo, setUserInfo } = useUser()
    const [selectedComplex, setSelectedComplex] = useState<string>(userInfo?.selectedComplexName || ""); // State to store the selected value
    const [complexes, setComplexes] = useState<ComplexResponse[]>([]);
    const complexIds = userInfo?.complexIds || []


    useEffect(() => {
        if(!complexIds || complexIds.length === 0) return;
        const fetchedComplexes: ComplexResponse[] = [];
        const fetchComplexes = async (complexIds: string[]) => {
            try {
                for (const complexId of complexIds) {
                    const response = await api.get<ComplexResponse>(`/db/complex/${complexId}`);
                    fetchedComplexes.push(response.data); // Add each fetched complex to the array
                }
                setComplexes(fetchedComplexes);
                if (fetchedComplexes.length > 0) {
                    const firstComplex = fetchedComplexes[0];
                    setUserInfo({
                        accessToken: "",
                        complexIds: [],
                        email: "",
                        idToken: "",
                        refreshToken: "",
                        sub: "",
                        tokenType: "",
                        type: "",
                        username: "",
                        ...userInfo,
                        selectedComplexName: firstComplex.address,
                        selectedComplex: firstComplex.id,
                    });
                    setSelectedComplex(firstComplex.address);
                    console.log("Selected complex set to:", firstComplex.address);
                }
            } catch (error) {
                console.error("Error fetching complexes:", error)
            }
        }
        fetchComplexes(complexIds)
    }, [complexIds])

    const handleComplexChange = (value: string, index: number) => {
        setUserInfo({
            accessToken: "",
            complexIds: [],
            email: "",
            idToken: "",
            refreshToken: "",
            sub: "",
            tokenType: "",
            type: "",
            username: "",
            ...userInfo,
            selectedComplexName: complexes[index].address,
            selectedComplex: complexes[index].id,
        });
        setSelectedComplex(value);
    };

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
                    <Select value={selectedComplex} // Bind the state to the Select component
                            defaultValue={userInfo?.selectedComplexName || complexes[0]?.address || ""}
                            onChange={(e) => {
                                const selectedIndex = complexes.findIndex(complex => complex.address === e.target.value);
                                handleComplexChange(e.target.value, selectedIndex); // e.target.value == current address

                            }}
                            id="complex-select"
                            sx={{ bgcolor: "white" }}>
                        {complexes.map((complex, index) => (
                            <MenuItem key={index} value={complex.address}>
                                {complex.address}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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