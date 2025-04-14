"use client"
// This page displays data from packages within the selected complex

// importing necessary modules
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // for building the table
import {Box, Typography, Paper, Button} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import React, {useEffect, useState} from "react"; // for retrieving resident data from the backend

interface Package {
    id: string;
    name: string; // Why do packages have names?
    description: string;
    delivered: boolean;
}

// The columns define the structure of the data table - fields should match the Package type TODO: add time delivered
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Resident name', width: 150 },
    { field: 'description', headerName: 'Description', width: 500 },
    { field: 'delivered', headerName: 'Collection Status', width: 150 },
];


export default function OverviewBody() {
    const [rows, setRows] = useState<Package[]>([]); // starts as an empty array of IUser objects
    const [packagesHoldingCount, setPackagesHoldingCount] = useState<number>(0); // for summary statistics at the top of the page
    const [packagesCollectedCount, setPackagesCollectedCount] = useState<number>(0);
    const complexId = "c0"; // complexId will be selected within the sidebar and passed in, hardcoded for now

    useEffect(() => {
        // Function to fetch packages from the backend
        const fetchPackages = async () => {
            try {
                const response = await axios.get<Package[]>(`http://localhost:3001/db/complex/${complexId}/packages`);
                console.log("Response from backend:", response); // Debugging line
                const packages: Package[] = response.data;
                setRows(packages);
                setPackagesHoldingCount(packages.filter(pkg => !pkg.delivered).length);
                setPackagesCollectedCount(packages.filter(pkg => pkg.delivered).length);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        fetchPackages();
    }, [complexId]);



    return(


        <Box // This is the box which within all elements of the overview are contained
            sx={{
                position: "absolute",
                top: "8vh", // setting the top position to 8% of the viewport height
                left: "21vw", // setting the left position to 21% of the viewport width
                width: "78vw", // setting the width of the box - 78% of the viewport width
                height: "91vh", // setting the height of the box - 91% of the viewport height
                // these settings allow us to have a border of 1% of the viewport height and width
                bgcolor: "white",
                display: "flex",
                flexDirection: "column" // boxes within this box will be stacked vertically
            }}

        >

            <Typography variant="h4" sx={{ mb: 4 }}>
                Overview
            </Typography>

            {/* adding box for summary stats */}
            <Box sx={{
                height: "30%",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
            }}>
                {/* another paper - to match other styles - within for the individual stats and graphics - here Packages holding */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "42%",
                        height: "50%"
                    }}
                >
                    <Typography variant="h6">Packages holding:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircleIcon sx={{ color: 'cornflowerblue' }}/>
                        <Typography variant="h3">{packagesHoldingCount}</Typography>
                    </Box>
                </Paper>

                {/* another box within for the individual stats and graphics - here Packages collected */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "42%",
                        height: "50%"
                    }}
                >
                    <Typography variant="h6">Packages collected:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircleIcon sx={{ color: 'green' }}/>
                        <Typography variant="h3">{packagesCollectedCount}</Typography>
                    </Box>
                </Paper>

            </Box>

            {/* adding box for the data table */}
            {/* TODO: ADD A COLUMN OF CIRCLES TO THE LEFT INDICATING DELIVERY STATUS*/}
            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} >
                            Manually add resident
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            //onClick={() => handleOpenDialog("edit")}

                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            //onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Box>

                    <DataGrid // using the values defined above.
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />

                </Paper>
            </Box>



        </Box>

    )
}

