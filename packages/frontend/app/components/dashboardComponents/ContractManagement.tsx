"use client"

import React, { useState, useEffect } from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
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
import { Article, Check, Schedule } from "@mui/icons-material";

interface IContract {
    id: string;
    phone: string;
    name: string;
    complexId: string;
    address: string;
    email: string;
	scanned: boolean;
	complete: boolean;
    createdAt: string;
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'scanned', headerName: 'Scanned', width: 100, type: 'boolean' },
    { field: 'complete', headerName: 'Complete', width: 100, type: 'boolean' },
    { field: 'id', headerName: 'Identifer', width: 350, type: 'string'}
];

export default function ContractManagement() {

    const [selectionModel, setSelectionModel] = useState<string[]>([]);
    const [rows, setRows] = useState<IContract[]>([]);
    const [contractCount, setContractCount] = useState<number>(0);
    const [completeCount, setCompleteCount] = useState<number>(0);
    const [selectedContract, setSelectedContract] = useState<IContract | null>(null);
    const [editMode, setEditMode] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { userInfo } = useUser();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
    });

    const complexId = userInfo?.selectedComplex || "";

    const handleOpenDialog = (mode: "add" | "edit") => {
        if(mode === "edit") {
            if(selectionModel.length !== 1) {
                alert("Please select exactly one contract to edit")
                return
            }
            const contractToEdit = rows.find((row) => row.id === selectionModel[0]);
            if (contractToEdit) {
                setSelectedContract(contractToEdit);
                setFormData({
                    name: contractToEdit.name,
                    phone: contractToEdit.phone,
                    address: contractToEdit.address,
                    email: contractToEdit.email,
                });
                setEditMode(true);
            }
        } else {
            setFormData({
                name: "",
                phone: "",
                address: "",
                email: ""
            });
            setEditMode(false);
            setSelectedContract(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            name: "",
            phone: "",
            address: "",
            email: ""
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async () => {
        try {
            if (editMode && selectedContract) {
                await api.put<IContract>(`/db/contract/${selectedContract.id}`, formData);
                const updatedRows = rows.map((row) =>
                    row.id === selectedContract.id ? { ...row, ...formData } : row
                );
                setRows(updatedRows);
            } else {
                await api.post<IContract>(`/db/contract`, {...formData, complexId:complexId}).then((response) => {
                    const newContract : IContract = {
                        id:response.data.contract.id,
                        phone: formData.phone,
                        name: formData.name,
                        complexId: complexId,
                        address: formData.address,
                        email: formData.email,
                        scanned: false,
                        complete: false,
                        createdAt: new Date().toISOString(),
                    }
                    setRows([...rows, newContract]);
                    setContractCount(contractCount + 1);
                });

            }
            handleCloseDialog();
        } catch (error) {
            console.error("Error adding contract:", error);
            alert("Failed to add/edit contract. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (selectionModel.length === 0) {
            alert("Please select at least one contract to delete")
            return
        }
            try {
                await Promise.all(selectionModel.map(async (id) => {
                    console.log(id);
                    await api.delete<IContract>(`/db/contract/${id}`);
                }));
                const updatedRows = rows.filter((row) => !selectionModel.includes(row.id));
                setRows(updatedRows);
                setContractCount(updatedRows.length);
                setCompleteCount(updatedRows.filter(contract => contract.complete).length);
                setSelectionModel([]); // Clear selection after deletion
            } catch (error) {
                console.error("Error deleting contract:", error)
                alert("Failed to delete contracts. Please try again.")
            }
    }

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const complexId = userInfo?.selectedComplex || ""; // Get the selected complex ID from the context
                const response = await api.get<IContract[]>(`/db/complex/${complexId}/contracts`);

                const contracts : IContract[] = response.data || [];
                setRows(contracts);
                setContractCount(contracts.length);
                setCompleteCount(contracts.filter(contract => contract.complete).length);
            } catch (error) {
                console.error("Error fetching contracts:", error);
            }
        };
        fetchContracts();
    }, [complexId, refreshKey])

    return (
        <Box sx={{position: "absolute", top: "8vh", left: "21vw", width: "78vw", height: "91vh", bgcolor: "white", display: "flex", flexDirection: "column"}}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Contract Management
            </Typography>
            
            {/* Contract info boxes */}
            <Box sx={{height: "30%", width: "100%", display: "flex", justifyContent: "space-around",}}>
                <Paper elevation={3} sx={{p: 3, display: "flex", flexDirection: "column", alignItems: "center", width: "42%", height: "50%"}}>
                    <Typography variant="h6">Contract count:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Article sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{contractCount}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={3} sx={{p: 3, display: "flex", flexDirection: "column", alignItems: "center", width: "42%", height: "50%"}}>
                    <Typography variant="h6">Completed contracts:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Check sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{completeCount}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={3} sx={{p: 3, display: "flex", flexDirection: "column", alignItems: "center", width: "42%", height: "50%"}}>
                    <Typography variant="h6">Contracts in progress:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Schedule sx={{ fontSize: 40 }} />
                        <Typography variant="h3">{contractCount-completeCount}</Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Page area */}
            <Box sx={{ display: "flex", height: "70%" }}>

                {/* Operation boxes */}
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")}>
                            Manually add contract
                        </Button>
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenDialog("edit")}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                            Delete
                        </Button>
                    </Box>

                    {/* Spreadsheet info */}
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
                </Paper>
            </Box>

            {/* Dialog for adding a new contract */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Contract</DialogTitle>
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
                                name="address"
                                label="address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
            </Dialog>

        </Box>
    )

}