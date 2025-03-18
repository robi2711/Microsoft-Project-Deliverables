"use client"


// importing necessary modules
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Box, Typography, Paper} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';

// Hard coding in data for now
const columns: GridColDef[] = [
    { field: 'resident', headerName: 'Resident Name', width: 150 },
    { field: 'flatNumber', headerName: 'Flat Number', width: 150 },
    { field: 'whatsappNumber', headerName: 'Whatsapp Number', width: 200 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 200 },
];

const rows = [
    { id: 1, resident: 'John Smith', flatNumber: '201', whatsappNumber: '083 123 4561', registrationDate: '2015-12-25' },
    { id: 2, resident: 'Alice Jones', flatNumber: '203', whatsappNumber: '083 123 4562', registrationDate: '2016-01-15' },
    { id: 3, resident: 'Robert Brown', flatNumber: '205', whatsappNumber: '083 123 4563', registrationDate: '2016-02-20' },
    { id: 4, resident: 'Nancy Hall', flatNumber: '207', whatsappNumber: '083 123 4564', registrationDate: '2016-03-10' },
    { id: 5, resident: 'Daniel King', flatNumber: '209', whatsappNumber: '083 123 4565', registrationDate: '2016-04-05' },
    { id: 6, resident: 'Michael Green', flatNumber: '211', whatsappNumber: '083 123 4566', registrationDate: '2016-05-25' },
    { id: 7, resident: 'Emma Wilson', flatNumber: '213', whatsappNumber: '083 123 4567', registrationDate: '2016-06-15' },
    { id: 8, resident: 'Olivia Taylor', flatNumber: '215', whatsappNumber: '083 123 4568', registrationDate: '2016-07-10' },
    { id: 9, resident: 'Liam Johnson', flatNumber: '217', whatsappNumber: '083 123 4569', registrationDate: '2016-08-05' },
    { id: 10, resident: 'Sophia White', flatNumber: '219', whatsappNumber: '083 123 4570', registrationDate: '2016-09-25' },
    { id: 11, resident: 'James Harris', flatNumber: '221', whatsappNumber: '083 123 4571', registrationDate: '2016-10-15' },
    { id: 12, resident: 'Isabella Martin', flatNumber: '223', whatsappNumber: '083 123 4572', registrationDate: '2016-11-10' },
    { id: 13, resident: 'Benjamin Lee', flatNumber: '225', whatsappNumber: '083 123 4573', registrationDate: '2016-12-05' },
    { id: 14, resident: 'Mia Walker', flatNumber: '227', whatsappNumber: '083 123 4574', registrationDate: '2017-01-25' },
    { id: 15, resident: 'Lucas Young', flatNumber: '229', whatsappNumber: '083 123 4575', registrationDate: '2017-02-15' },
];


export default function residentManagementBody() {
    return(

        <Box
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
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h6">Residents with packages in-hold:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarehouseIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h3">2</Typography>
                    </Box>
                </Box>

                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h6">Happy Residents:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h3">13</Typography>
                    </Box>
                </Box>

            </Box>

            {/* adding box for the data table */}
            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper sx={{ height: '100%', width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />

                </Paper>
            </Box>



        </Box>

    )
}

