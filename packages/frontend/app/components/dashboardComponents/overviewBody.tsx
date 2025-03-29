"use client"


// importing necessary modules
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // for building the table
import {Box, Typography, Paper} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

// Hard coding in data for now - structure will remain largely the same
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'timestamp', headerName: 'Time stamp', width: 200 },
    { field: 'flatNumber', headerName: 'Flat Number', width: 150 },
    { field: 'packageStatus', headerName: 'Package Status', width: 150 },
    { field: 'resident', headerName: 'Resident', width: 150 },
];

// The row values will be fetched from the backend TODO *
const rows = [
    { id: 1, resident: 'John Smith', flatNumber: '201', packageStatus: 'Holding', timestamp: '2021-10-10 10:00:00' },
    { id: 2, resident: 'Alice Jones', flatNumber: '203', packageStatus: 'Holding', timestamp: '2021-10-10 10:00:00' },
    { id: 3, resident: 'Robert Brown', flatNumber: '205', packageStatus: 'Collected', timestamp: '2021-10-10 10:00:00' },
    { id: 4, resident: 'Nancy Hall', flatNumber: '207', packageStatus: 'Collected', timestamp: '2021-10-10 10:00:00' },
    { id: 5, resident: 'Daniel King', flatNumber: '209', packageStatus: 'Collected', timestamp: '2021-10-10 10:00:00' },
    { id: 6, resident: 'Michael Green', flatNumber: '211', packageStatus: 'Collected', timestamp: '2021-10-10 10:00:00' },
];


export default function overviewBody() {
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
                        <Typography variant="h3">2</Typography>
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
                        <Typography variant="h3">4</Typography>
                    </Box>
                </Box>

            </Box>

            {/* adding box for the data table */}
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

