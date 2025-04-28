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
import { useUser } from "@/components/services/UserContext";  // for retrieving resident data from the backend
import { v4 as uuidv4 } from "uuid";

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
    const [selectionModel, setSelectionModel] = useState<string[]>([]);
    const [rows, setRows] = useState<IUser[]>([]);
    const [residentCount, setResidentCount] = useState<number>(0);
    const [residentsWithPackagesCount, setResidentsWithPackagesCount] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { userInfo } = useUser();
    const [formData, setFormData] = useState({
        name: "",
        unitNumber: "",
        phone: "",
        email: "",
    });

    const complexId = userInfo?.selectedComplex || "";

    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const response = await api.get<IUser[]>(`/db/complex/${complexId}/residents`);
                const residents: IUser[] = response.data || [];
                setRows(residents);
                setResidentCount(residents.length);
                setResidentsWithPackagesCount(residents.filter(resident => resident.packages?.length > 0).length);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        fetchResidents();
    }, [complexId]);

    const handleOpenDialog = (mode: "add" | "edit") => {
        if (mode === "edit") {
            if (selectionModel.length !== 1) {
                alert("Please select exactly one resident to edit");
                return;
            }

            const residentToEdit = rows.find((row) => row.id === selectionModel[0]);
            if (residentToEdit) {
                setFormData({
                    name: residentToEdit.name,
                    unitNumber: residentToEdit.unitNumber,
                    phone: residentToEdit.phone,
                    email: residentToEdit.email,
                });
                setEditMode(true);
            }
        } else {
            setFormData({
                name: "",
                unitNumber: "",
                phone: "",
                email: "",
            });
            setEditMode(false);
        }
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (editMode && selectionModel.length === 1) {
                const updatedResident: IUser = {
                    ...formData,
                    id: selectionModel[0],
                    complexId: complexId,
                    packages: rows.find((row) => row.id === selectionModel[0])?.packages || [],
                    createdAt: rows.find((row) => row.id === selectionModel[0])?.createdAt || new Date().toISOString(), // If it cannot find previous created at date, it'll now serve as a 'last edited' date.
                };

                const updatedRows = rows.map((row) =>
                    row.id === selectionModel[0] ? updatedResident : row
                );
                setRows(updatedRows);

                // TODO: Check api call
                // await api.put(`/db/user/${selectionModel[0]}`, updatedResident);

            } else {
                const newResident: IUser = {
                    ...formData,
                    id: uuidv4(),
                    complexId: complexId,
                    packages: [], // Default value for packages
                    createdAt: new Date().toISOString(), // Set createdAt to the current timestamp
                };

                setRows([...rows, newResident]);
                // TODO: Check api call
                // await api.post("/db/user", newResident);
            }

            setOpenDialog(false);
        } catch (error) {
            console.error("Error saving resident:", error);
            alert("Failed to save resident. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (selectionModel.length === 0) {
            alert("Please select at least one resident to delete");
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectionModel.length} resident(s)?`)) {
            try {
                const remainingRows = rows.filter((row) => !selectionModel.includes(row.id));
                setRows(remainingRows);

                for (const id of selectionModel) {
                    console.log(id);
                    // TODO: Check api call
                    //await api.delete(`/db/user/${id}`);
                }

                setSelectionModel([]);
            } catch (error) {
                console.error("Error deleting residents:", error);
                alert("Failed to delete residents. Please try again.");
            }
        }
    };

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
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")}>
                            Manually add resident
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenDialog("edit")}
                            disabled={selectionModel.length !== 1}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={selectionModel.length === 0}
                        >
                            Delete
                        </Button>
                    </Box>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel as string[]);
                        }}
                        rowSelectionModel={selectionModel}
                        sx={{ border: 0 }}
                    />

                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>{editMode ? "Edit Resident" : "Add New Resident"}</DialogTitle>
                        <DialogContent>
                            <Box component="form">
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <TextField
                                    margin="dense"
                                    name="unitNumber"
                                    label="Unit Number"
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
                                    label="Phone Number"
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
                                    label="Email"
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
                                {editMode ? "Save" : "Add"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Box>
        </Box>
    );
}