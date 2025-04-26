"use client"

import React, { useState, useEffect, useRef } from "react";
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
    TextField,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import api from "@/components/services/apiService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useUser} from "@/components/services/UserContext"; // for retrieving resident data from the backend
import { Article, Check, Print, Refresh, Save, Schedule, Upload } from "@mui/icons-material";
import jsPDF from "jspdf";

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
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 200 },
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
        scanned: false,
        complete: false,
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
                    scanned: contractToEdit.scanned,
                    complete: contractToEdit.complete,
                });
                setEditMode(true);
            }
        } else {
            setFormData({
                name: "",
                phone: "",
                address: "",
                email: "",
                scanned: false,
                complete: false,
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
            email: "",
            scanned: false,
            complete: false,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if(e.target.type === "checkbox") {
            setFormData({...formData, [name]: e.target.checked});
        } else {
            setFormData({...formData, [name]: value});
        }
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


    //LOADING CSV FILE
    const fileInputRef = useRef(null); // Ref for the hidden file input
    const loadContractsCSV = (event : any) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        // Read the file as text
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.trim().split("\n");
            const headers = lines[0].split(",");

            //Get all rows from the CSV file
            const rows = lines.slice(1).map((line) => {
                const values = line.split(",");
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header.trim()] = values[index].trim();
                });
                return row;
            });

            //Load contracts
            const contracts = [];
            for (const row of rows) {
                const contractData = {
                    phone: row.phone,
                    name: row.name,
                    complexId: complexId,
                    address: row.address,
                    email: row.email,
                    scanned: false,
                    complete: false,
                    createdAt: new Date().toISOString(),
                };
                contracts.push(contractData);
            }

            //Push all contracts to backend
            Promise.all(contracts.map(async (contract) => {
                try {
                    await api.post<IContract>(`/db/contract`, contract);
                }
                catch (error) {
                    console.error("Error adding contract from CSV:", error);
                }
            })).then(() => {
                setRefreshKey((prev) => prev + 1); // Refresh the data after loading contracts
            });
            
        };
        reader.readAsText(file);
    }

    const savePDF = () => {
        const doc = generatePDF();
        if(doc) {
            doc.save("contracts.pdf");
        }
        
    }
    
    const handlePrint = () => {
        const doc = generatePDF();
        if(doc) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    //PDF GENERATION
    const generatePDF = () => {
        const doc = new jsPDF();
        const contracts = rows.filter((row) => selectionModel.includes(row.id));
        if(contracts.length === 0) {
            alert("Please select at least one contract to save as PDF")
            return;
        }
        doc.setFont("helvetica", "normal");

        contracts.forEach((contract,i) => {
            doc.setFontSize(22);
            doc.text(`Dear ${contract.name},`, 10, 40);
            doc.setFontSize(16);
            doc.text(
`Within your complex we are using a service that allows you to receive 
notifications whenever a package is delivered to the complex.

By signing this contract and scanning it, you agree to use the service 
and hence will be notified whenever a package is delivered to the complex.
            
Should you have any questions, please contact the concierge or the admin 
of the complex.
            

In order to begin, send the contract to our service bot on Whatsapp: 
+44 7700 171376


You may also chat with the bot to ask any questions you may have in
regards to packages or general queries

We will process information such as your name, phone number, email,
address and flat number in order to provide you with the service.`
            , 10, 60, {align:"left"});
            doc.setFontSize(20);
            doc.text("Signature: ______________________", 10, 280);
            doc.setFontSize(8);
            doc.text("Contract ID: " + contract.id, 10, 290);
            if(i < contracts.length-1) doc.addPage();
        });
        return doc;
    }

    return (
        <Box sx={{position: "absolute", top: "8vh", left: "21vw", width: "78vw", height: "91vh", bgcolor: "white", display: "flex", flexDirection: "column"}}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Contract Management
            </Typography>

            {/* Hidden input for CSV file upload */}
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={loadContractsCSV}
            />

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

            {/* Refresh button */}
            <Button variant="outlined" onClick={() => setRefreshKey((prev) => prev + 1)} sx={{ mb: 2, ml: 2, width: "8%" }}>
                <Refresh sx={{ mr: 1 }} />
                Refresh
            </Button>
            {/* Page area */}
            <Box sx={{ display: "flex", height: "70%" }}>

                {/* Operation boxes */}
                <Paper elevation={3} sx={{ width: "96%", p: 2}}>
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")}>
                            Manually add contract
                        </Button>
                        <Button variant="contained" startIcon={<Upload />} onClick={() => {
                            (fileInputRef.current as any).click();
                        }}>
                            Load CSV
                        </Button>
                    </Box>
                    <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenDialog("edit")}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="outlined" color="info" startIcon={<Print />} onClick={()=>{handlePrint()}}>
                            Print
                        </Button>
                        <Button variant="outlined" color="info" startIcon={<Save />} onClick={()=>{savePDF()}}>
                            Save as PDF
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
                            <TextField margin="dense" name="name" label="name" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required />
                            <TextField margin="dense" name="address" label="address" type="text" fullWidth variant="outlined" value={formData.address} onChange={handleInputChange} required />
                            <TextField margin="dense" name="phone" label="phone" type="text" fullWidth variant="outlined" value={formData.phone} onChange={handleInputChange} />
                            <TextField margin="dense" name="email" label="email" type="text" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} />
                            <FormControlLabel control={<Checkbox checked={formData.scanned} onChange={handleInputChange} name="scanned" color="primary" />} label="Scanned"/>
                            <FormControlLabel control={<Checkbox  checked={formData.complete} onChange={handleInputChange} name="complete" color="primary"/>} label="Complete" />

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