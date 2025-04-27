"use client"
// This page displays data from packages within the selected complex

// TODO: May be worth changing 'delivered' to 'collected' for packages

// importing necessary modules
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // for building the table
import {
    Box,
    Typography,
    Paper,
    Button,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from "uuid"; // for generating unique IDs for packages
import api from "@/components/services/apiService";
import React, {useEffect, useState} from "react";
import {useUser} from "@/components/services/UserContext";

// necessary interfaces
interface Package {
    id: string;
    name: string; // Why do packages have names?
    description: string;
    delivered: boolean;
}

export interface IUser {
    id: string;
    name: string;
}


// The columns define the structure of the data table - fields should match the Package type TODO: add time delivered
const columns: GridColDef[] = [
    { field: 'name', headerName: 'Resident name', width: 150 },
    { field: 'description', headerName: 'Description', width: 500 },
    { field: 'delivered', headerName: 'Collection Status', width: 150 }
];


export default function OverviewBody() {
    const [rows, setRows] = useState<Package[]>([]); // starts as an empty array of IUser objects
    const [packagesHoldingCount, setPackagesHoldingCount] = useState<number>(0); // for summary statistics at the top of the page
    const [packagesCollectedCount, setPackagesCollectedCount] = useState<number>(0);
    const [residents, setResidents] = useState<IUser[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
    const [selectionModel, setSelectionModel] = useState<string[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false)
    const { userInfo } = useUser();

    // Form State
    const [formData, setFormData] = useState({
        packageID: "",
        name: "",
        description: "",
        residentID: ""
    });

    const complexId = userInfo?.selectedComplex

    useEffect(() => {
        // Function to fetch packages from the backend
        const fetchPackages = async () => {
            try {
                const complexId = userInfo?.selectedComplex || "";
                const response = await api.get<Package[]>(`/db/complex/${complexId}/packages`);

                const packages: Package[] = response.data;
                setRows(packages);
                setPackagesHoldingCount(packages.filter(pkg => !pkg.delivered).length);
                setPackagesCollectedCount(packages.filter(pkg => pkg.delivered).length);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        // Fetch residents for the dropdown
        const fetchResidents = async () => {
            try {
                const response = await api.get<IUser[]>(`/db/complex/${complexId}/residents`);
                setResidents(response.data);
            } catch (error) {
                console.error("Error fetching residents:", error);
            }
        };

        fetchPackages();
        fetchResidents();
    }, [complexId]);


    const handleOpenDialog = (mode: "add" | "edit") => {
        if (mode === "edit") {
            if (selectionModel.length !== 1) {
                alert("Please select exactly one package to edit");
                return;
            }

            const packageToEdit = rows.find((row) => row.id === selectionModel[0]);
            if (packageToEdit) {
                setSelectedPackage(packageToEdit);
                setFormData({
                    packageID: packageToEdit.id,
                    name: packageToEdit.name,
                    description: packageToEdit.description,
                    residentID: ""
                });
                setEditMode(true);
            }
        } else {
            // Reset form for add mode
            setFormData({
                packageID: "",
                name: "",
                description: "",
                residentID: ""
            });
            setSelectedPackage(null);
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            packageID: "",
            name: "",
            description: "",
            residentID: ""
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async () => {
        try {
            if (editMode && selectedPackage) {
                const updatedPackage = {
                    ...selectedPackage,
                    name: formData.name,
                    description: formData.description
                };

                const updatedRows = rows.map((row) =>
                    row.id === selectedPackage.id ? updatedPackage : row
                );
                setRows(updatedRows);

                // Update package via API
                await api.put(`/package/${selectedPackage.id}`, updatedPackage);
            } else {
                const newPackage = {
                    id: uuidv4(),
                    name: formData.name,
                    description: formData.description,
                    delivered: false
                };

                setRows([...rows, newPackage]);

                // Add package via API
                // await api.post(`/package`, newPackage);
            }

            handleCloseDialog();
        } catch (error) {
            console.error("Error saving package:", error);
            alert("Failed to save package. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (selectionModel.length === 0) {
            alert("Please select at least one package to delete");
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectionModel.length} package(s)?`)) {
            try {
                const remainingRows = rows.filter((row) => !selectionModel.includes(row.id));
                setRows(remainingRows);

                // Delete packages via API
                for (const id of selectionModel) {
                    await api.delete(`/package/${id}`);
                }

                setSelectionModel([]);
            } catch (error) {
                console.error("Error deleting packages:", error);
                alert("Failed to delete packages. Please try again.");
            }
        }
    };

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

            {/* adding box for the data table and CRUD buttons */}
            {/* TODO: ADD A COLUMN OF CIRCLES TO THE LEFT INDICATING DELIVERY STATUS*/}
            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>

                    {/* buttons */}
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")} >
                            Manually add package
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon/>}
                            onClick={() => handleOpenDialog("edit")}
                            disabled={selectionModel.length !== 1}

                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon/>}
                            onClick={handleDelete}
                            disabled={selectionModel.length === 0}
                        >
                            Delete
                        </Button>
                    </Box>

                    {/* Data table */}
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel as string[])
                        }}
                        sx={{ border: 0 }}
                    />

                    {/* Dialog for manually adding residents */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>{editMode ? "Edit Package" : "Add New Package"}</DialogTitle>
                        <DialogContent>
                            <Box component="form" sx={{mt: 2}}>
                                <FormControl fullWidth margin="dense" required>
                                    <InputLabel id="resident-select-label">Resident</InputLabel>
                                    <Select
                                        labelId="resident-select-label"
                                        name="residentID"
                                        value={formData.residentID || ""}
                                        onChange={(e) => {
                                            const selectedResident = residents.find(resident => resident.id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                residentID: e.target.value,
                                                name: selectedResident ? selectedResident.name : ""
                                            });
                                        }}
                                        variant="outlined"
                                    >
                                        {residents.map((resident) => (
                                            <MenuItem key={resident.id} value={resident.id}>
                                                {resident.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    margin="dense"
                                    name="description"
                                    label="package description"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.description}
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

    )
}

