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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from "@/components/services/apiService";
import React, {useEffect, useState} from "react";
import {useUser} from "@/components/services/UserContext";

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
    const [openDialog, setOpenDialog] = useState(false);
    const { userInfo } = useUser();
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const complexId = userInfo?.sub || "c0";// complexId will be selected within the sidebar and passed in, hardcoded for now

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: "",
            description: ""
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async () => {

        try {
            const newPackage = {
                ...formData,
                delivered: false
            }
            console.log(newPackage)
            // user ID can be accessed when selected user by name in dialog
            // const response = await api.put<Package[]>('/user/:id/package');
            await api.post(`/user/${userId}/package/${packageId}`, newPackage);
            alert("Package added successfully!");
            handleCloseDialog();
        } catch (error) {
            console.error("Error adding package:", error);
            alert("Failed to add package. Please try again.");
        }
    };

    useEffect(() => {
        // Function to fetch packages from the backend
        const fetchPackages = async () => {
            try {
                const response = await api.get<Package[]>(`/db/complex/${complexId}/packages`);

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

            {/* adding box for the data table and CRUD buttons */}
            {/* TODO: ADD A COLUMN OF CIRCLES TO THE LEFT INDICATING DELIVERY STATUS*/}
            <Box sx={{ display: "flex", height: "70%" }}>
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>

                    {/* buttons */}
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog} >
                            Manually add package
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

                    {/* Data table */}
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
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
                                {/* TODO: change this from a textfield to a drop-down menu of all residents in complex, so ID can be passed onto api. post */}
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label="Resident's name"
                                    type="name"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    margin="dense"
                                    name="description"
                                    label="description"
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

