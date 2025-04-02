"use client"
// This page displays data from packages within the selected complex

// importing necessary modules
import { Package } from '../../../../backend/src/types/dbTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // for building the table
import {Box, Typography, Paper} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import axios from "axios";
import {useEffect, useState} from "react"; // for retrieving resident data from the backend

// The columns define the structure of the data table - fields should match the Package type TODO: add time delivered
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Resident name', width: 200 },
    { field: 'description', headerName: 'Package Description', width: 600 },
    { field: 'delivered', headerName: 'Package Status', width: 300 },
];


export default function overviewBody() {
    const [rows, setRows] = useState<Package[]>([]); // starts as an empty array of IUser objects
    const complexId = "c0"; // complexId will be selected within the sidebar and passed in, hardcoded for now

    useEffect(() => {
        // Function to fetch packages from the backend
        const fetchPackages = async () => {
            try {
                const response = await axios.get<Package[]>(`http://localhost:3001/db/complex/${complexId}/packages`);
                console.log("Response from backend:", response); // Debugging line
                const packages: Package[] = response.data;
                setRows(packages);
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
            {/* adding box for summary stats */}
            <Box sx={{
                height: "30%",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
            }}>
                {/* another box within for the individual stats and graphics - here Packages holding */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h6">Packages holding:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircleIcon sx={{ color: 'cornflowerblue' }}/>
                        <Typography variant="h3">x</Typography>
                        {/* TODO: MAKE THIS NUMBER REFLECT #PACKAGES DELIVERED = FALSE*/}
                    </Box>
                </Box>

                {/* another box within for the individual stats and graphics - here Packages collected */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h6">Packages collected:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircleIcon sx={{ color: 'green' }}/>
                        <Typography variant="h3">x</Typography>
                        {/* TODO: MAKE THIS NUMBER REFLECT #PACKAGES DELIVERED = TRUE*/}
                    </Box>
                </Box>

            </Box>

            {/* adding box for the data table */}
            {/* TODO: ADD A COLUMN OF CIRCLES TO THE LEFT INDICATING DELIVERY STATUS*/}
            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper sx={{ height: '100%', width: '100%'}}>
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

