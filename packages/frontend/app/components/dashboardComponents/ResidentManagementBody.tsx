"use client"

// importing necessary modules
import { useState, useEffect } from 'react'; // handling current info displayed
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Box, Typography, Paper, IconButton} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // for retrieving resident data from the backend

interface IUser {
    id: string;
    complexId: string;  // Reference to Complex
    name: string;
    unitNumber: string; // Unit number - should we rename this? - it was address
    phone: string; // changed to phone from telephone to match cosmos
    email: string;
    packages: Package[];
    createdAt: string;
}

interface Package {
    id: string;
    name: string; // Why do packages have names?
    description: string;
    delivered: boolean;
}

// The columns define the structure of the data table
const columns: GridColDef[] = [
    { field: 'name', headerName: 'Resident Name', width: 150 },
    { field: 'unitNumber', headerName: 'Unit', width: 150 },
    { field: 'phone', headerName: 'Whatsapp Number', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'createdAt', headerName: 'Registration Date', width: 200 },
];

export default function ResidentManagementBody() {
    const [rows, setRows] = useState<IUser[]>([]); // starts as an empty array of IUser objects
    const [residentCount, setResidentCount] = useState<number>(0); // For summary statistics at the top of the page
    {/* TODO: improve this logic - show be active packages count, not just packages */ }
    const [residentsWithPackagesCount, setResidentsWithPackagesCount] = useState<number>(0); // For summary statistics at the top of the page
    const complexId = "c0"; // complexId will be selected within the sidebar and passed in, hardcoded for now

    useEffect(() => {
        // Function to fetch residents from the backend
        const fetchResidents = async () => {
            try {
                const response = await axios.get<IUser[]>(`http://localhost:3001/db/complex/${complexId}/residents`);
                console.log("Response from backend:", response); // Debugging line
                const residents: IUser[] = response.data;
                setRows(residents);
                setResidentCount(residents.length);
                setResidentsWithPackagesCount(residents.filter(resident => resident.packages.length > 0).length);
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
                    {/* TODO: improve this logic - currently just shows who has packages - doesn't consider if they're delivered or not */}
                    <Typography variant="h6">Residents with packages in-hold:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarehouseIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{residentCount - residentsWithPackagesCount}</Typography>
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
                        <Typography variant="h3">{residentsWithPackagesCount}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper sx={{ height: '100%', width: '100%' }}>
                    <Box sx={{
                        position: 'absolute',
                        top: 140
                    }}> {/* This box is for the RUD icons */}
                        <IconButton>
                            <AddIcon />
                        </IconButton>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
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