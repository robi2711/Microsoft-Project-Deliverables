"use client"


// importing necessary modules
import { IUser } from '../../../../backend/src/types/dbTypes';
import { useState, useEffect } from 'react'; // handling current info displayed
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Box, Typography, Paper} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import axios from "axios"; // for retrieving resident data from the backend

// Define a new type for the residents data - subset of IUser
interface Resident {
    id: string; // id necessary for MUI tables
    resident: string;
    address: string;
    telephone: string;
    email: string;
    registrationDate: string;
}

// The columns define the structure of the data table
const columns: GridColDef[] = [
    { field: 'resident', headerName: 'Resident Name', width: 150 },
    { field: 'address', headerName: 'Unit', width: 150 },
    { field: 'telephone', headerName: 'Whatsapp Number', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 200 },
];

export default function ResidentManagementBody() {
    const [rows, setRows] = useState<Resident[]>([]);
    const complexId = "c0"; // complexId will be selected within the sidebar, hardcoded for now

    useEffect(() => {
        // Function to fetch residents from the backend
        const fetchResidents = async () => {
            try {
                const response = await axios.get<IUser[]>(`http://localhost:3001/db/complex/${complexId}/residents`);
                console.log("Response from backend:", response); // Debugging line
                const residents: Resident[] = response.data.map((resident) => ({
                    id: resident.id, // id necessary for MUI tables
                    resident: resident.name,
                    address: resident.unitNumber,
                    telephone: resident.phone,
                    email: resident.email,
                    registrationDate: resident.createdAt,
                }));
                setRows(residents);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        fetchResidents();
    }, [complexId]);

    return (
        <Box
            sx={{
                position: "absolute",
                top: "8vh",
                left: "21vw",
                width: "78vw",
                height: "91vh",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column"
            }}
        >
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
                        <Typography variant="h3">x</Typography>
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
                        <Typography variant="h3">x</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper sx={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </Box>
        </Box>
    );
}
