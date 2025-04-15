"use client"

// TODO: consistency needed in naming - sometimes using "Resident" and other times using "User"

// importing necessary modules
import React, { useState, useEffect } from 'react'; // handling current info displayed
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import api from "@/components/services/apiService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useUser} from "@/components/services/UserContext"; // for retrieving resident data from the backend

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
    const [selectionModel, setSelectionModel] = useState<string[]>([])
    const [rows, setRows] = useState<IUser[]>([]); // starts as an empty array of IUser objects
    const [residentCount, setResidentCount] = useState<number>(0); // For summary statistics at the top of the page
    {/* TODO: improve this logic - show be active packages count, not just packages */ }
    const [residentsWithPackagesCount, setResidentsWithPackagesCount] = useState<number>(0); // For summary statistics at the top of the page
    const [openDialog, setOpenDialog] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { userInfo } = useUser();
    const [formData, setFormData] = useState({
        name: "",
        unitNumber: "",
        phone: "",
        email: "",
    });

    const complexId = userInfo?.selectedComplex || "";

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: "",
            unitNumber: "",
            phone: "",
            email: "",
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async () => {

        try {
            // create an IUser object TODO: take complexId from the sidebar
            const newResident = {
                ...formData,
                complexId: complexId, // TODO: take complexId from the sidebar
                packages: []
            }
            console.log(newResident)
            await api.post("/db/user", newResident);
            alert("Resident added successfully!");
            handleCloseDialog();
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Error adding resident:", error);
            alert("Failed to add resident. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (selectionModel.length === 0) {
            alert("Please select at least one resident to delete")
            return
        }

            try {

                //await api.delete(`/db/user/${residentId}`)

            } catch (error) {
                console.error("Error deleting residents:", error)
                alert("Failed to delete residents. Please try again.")
            }
    }

    useEffect(() => {
        // Function to fetch residents from the backend
        const fetchResidents = async () => {
            try {
                const complexId = userInfo?.selectedComplex || "";
                const response = await api.get<IUser[]>(`/db/complex/${complexId}/residents`);

                const residents: IUser[] = response.data;
                setRows(residents);
                setResidentCount(residents.length);
                setResidentsWithPackagesCount(residents.filter(resident => resident.packages.length > 0).length);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        fetchResidents();
    }, [complexId, refreshKey]);

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
            <Typography variant="h4" sx={{ mb: 4 }}>
                Resident Management
            </Typography>

            <Box sx={{
                height: "30%",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
            }}>
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
                    <Typography variant="h6">Residents with packages in-hold:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarehouseIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{residentCount - residentsWithPackagesCount}</Typography>
                    </Box>
                </Paper>

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
                    <Typography variant="h6">Happy Residents:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{residentsWithPackagesCount}</Typography>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog} >
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
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Box>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel as string[])
                        }}
                        rowSelectionModel={selectionModel}
                        sx={{ border: 0 }}
                    />

                    {/* Dialog for manually adding residents */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>Add New Resident</DialogTitle>

                        <DialogContent>
                            <Box component="form">

                                { /*
                                name - used to identify the field when handling input changes.
                                label - the label displayed for the input field.
                                type - the type of input (text, email, etc.).
                                value - the current value of the input field, controlled by state.
                                */}
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label="name"
                                    type="name"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    margin="dense"
                                    name="unitNumber"
                                    label="unit number"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.unitNumber}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    margin="dense"
                                    name="phone"
                                    label="phone number"
                                    type="tel"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    margin="dense"
                                    name="email"
                                    label="email"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />

                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleSubmit} variant="contained">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Paper>
            </Box>
        </Box>
    );
}