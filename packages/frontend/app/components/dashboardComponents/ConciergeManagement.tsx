"use client"

import type React from "react"

import {useState, useEffect} from "react"
import {
	Box,
	Typography,
	Paper,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	FormHelperText,
} from "@mui/material"
import {DataGrid, type GridColDef} from "@mui/x-data-grid"
import PersonIcon from "@mui/icons-material/Person"
import BadgeIcon from "@mui/icons-material/Badge"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {signUpConcierge} from "@/components/services/authService";
import api from "@/components/services/apiService";
import {useUser} from "@/components/services/UserContext";

// Interface for Concierge data
interface IConcierge {
	id: string
	email: string
} // instead use IAdmin from db types?

// The columns define the structure of the data table
const columns: GridColDef[] = [

	{field: "email", headerName: "Email", width: 250},

]

export default function ConciergeManagement() {
	const [rows, setRows] = useState<IConcierge[]>([])
	const [conciergeCount, setConciergeCount] = useState<number>(0)
	const [activeConciergeCount, setActiveConciergeCount] = useState<number>(conciergeCount)
	const [openDialog, setOpenDialog] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [selectedConcierge, setSelectedConcierge] = useState<IConcierge | null>(null)
	const [selectionModel, setSelectionModel] = useState<string[]>([])
	const [showPassword, setShowPassword] = useState(false)
	const {userInfo} = useUser();

	// Form state
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	})

	// Form validation
	const [formErrors, setFormErrors] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	})

	// Mock data for initial development

	useEffect(() => {

		const fetchConcierges = async () => {
			try {
				//TODO: Replace with actual API call
				const complexId = userInfo?.sub || "c0";
				const response = await api.get<IConcierge[]>(`/db/complex/${complexId}/concierges`);
				const concierges = response.data.map((concierge) => ({
					id: concierge.id,
					email: concierge.email,
				}));
				setRows(concierges);
				setConciergeCount(concierges.length);
			} catch (error) {
				console.error("Error fetching concierges:", error)
			}
		}

		fetchConcierges()
	}, [])

	const handleOpenDialog = (mode: "add" | "edit") => {
		if (mode === "edit") {
			if (selectionModel.length !== 1) {
				alert("Please select exactly one concierge to edit")
				return
			}

			const conciergeToEdit = rows.find((row) => row.id === selectionModel[0])
			if (conciergeToEdit) {
				setSelectedConcierge(conciergeToEdit)
				setFormData({
					email: conciergeToEdit.email,

					password: "",
					confirmPassword: "",
				})
				setEditMode(true)
			}
		} else {
			// Reset form for add mode
			setFormData({
				email: "",
				password: "",
				confirmPassword: "",
			})
			setFormErrors({
				email: "",
				password: "",
				confirmPassword: "",
			})
			setSelectedConcierge(null)
			setEditMode(false)
		}
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		setFormData({
			...formData,
			[name]: value,
		})

		// Clear error when user types
		if (formErrors[name as keyof typeof formErrors]) {
			setFormErrors({
				...formErrors,
				[name]: "",
			})
		}
	}

	const validateForm = () => {
		let valid = true
		const newErrors = {...formErrors}


		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!formData.email.trim()) {
			newErrors.email = "Email is required"
			valid = false
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = "Invalid email format"
			valid = false
		}


		// Only validate password fields for new concierges or if password is being changed
		if (!editMode || (editMode && formData.password)) {
			// Validate password
			if (!formData.password) {
				newErrors.password = "Password is required"
				valid = false
			} else if (formData.password.length < 8) {
				newErrors.password = "Password must be at least 8 characters"
				valid = false
			}

			// Validate confirm password
			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match"
				valid = false
			}
		}

		setFormErrors(newErrors)
		return valid
	}

	const handleSubmit = async () => {
		if (!validateForm()) {
			return
		}

		try {
			if (editMode && selectedConcierge) {
				//TODO: Replace with actual API call to update concierge
				const updatedRows = rows.map((row) =>
					row.id === selectedConcierge.id
						? {
							...row,
							email: formData.email,
						}
						: row,
				)
				setRows(updatedRows)
			} else {
				await signUpConcierge(formData.email, formData.password, userInfo?.sub || "c0")

				// TODO: api to get concierges
				const newConcierge: IConcierge = {
					id: `c${rows.length + 1}`,
					email: formData.email,
				}

				setRows([...rows, newConcierge])
				setConciergeCount(conciergeCount + 1)
				setActiveConciergeCount(activeConciergeCount + 1)
			}

			handleCloseDialog()
		} catch (error) {
			console.error("Error saving concierge:", error)
			alert("Failed to save concierge. Please try again.")
		}
	}

	const handleDelete = async () => {
		if (selectionModel.length === 0) {
			alert("Please select at least one concierge to delete")
			return
		}

		if (confirm(`Are you sure you want to delete ${selectionModel.length} concierge(s)?`)) {
			try {
				//TODO: ADD API call to delete concierges
				const remainingRows = rows.filter((row) => !selectionModel.includes(row.id))


				setRows(remainingRows)
				setConciergeCount(remainingRows.length)
				setActiveConciergeCount(activeConciergeCount)
				setSelectionModel([])
			} catch (error) {
				console.error("Error deleting concierges:", error)
				alert("Failed to delete concierges. Please try again.")
			}
		}
	}

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

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
			<Typography variant="h4" sx={{mb: 4}}>
				Concierge Management
			</Typography>

			<Box
				sx={{
					mb: 4,
					display: "flex",
					justifyContent: "space-around",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						p: 3,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: "42%",
					}}
				>
					<Typography variant="h6">Total Concierges</Typography>
					<Box sx={{display: "flex", alignItems: "center", mt: 2}}>
						<PersonIcon sx={{fontSize: 40, mr: 1}}/>
						<Typography variant="h3">{conciergeCount}</Typography>
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
					}}
				>
					<Typography variant="h6">Active Concierges</Typography>
					<Box sx={{display: "flex", alignItems: "center", mt: 2}}>
						<BadgeIcon sx={{fontSize: 40, mr: 1}}/>
						<Typography variant="h3">{activeConciergeCount}</Typography>
					</Box>
				</Paper>
			</Box>

			<Paper elevation={3} sx={{flex: 1, width: "96%", p: 2}}>
				<Box sx={{mb: 2, display: "flex", gap: 1}}>
					<Button variant="contained" startIcon={<AddIcon/>} onClick={() => handleOpenDialog("add")}>
						Add Concierge
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

				<DataGrid
					rows={rows}
					columns={columns}
					checkboxSelection
					onRowSelectionModelChange={(newSelectionModel) => {
						setSelectionModel(newSelectionModel as string[])
					}}
					rowSelectionModel={selectionModel}
					sx={{
						border: 0,
						height: "calc(88vh - 300px)",
						"& .MuiDataGrid-cell:focus": {
							outline: "none",
						},
					}}
				/>
			</Paper>

			{/* Dialog for adding/editing concierges */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editMode ? "Edit Concierge" : "Add New Concierge"}</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{mt: 2}}>
						<TextField
							margin="dense"
							name="email"
							label="Email Address"
							type="email"
							fullWidth
							variant="outlined"
							value={formData.email}
							onChange={handleInputChange}
							error={!!formErrors.email}
							helperText={formErrors.email}
							required
						/>


						<FormControl fullWidth margin="dense" variant="outlined" error={!!formErrors.password}
						             required={!editMode}>
							<InputLabel htmlFor="password">Password</InputLabel>
							<OutlinedInput
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={handleInputChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleTogglePasswordVisibility}
											edge="end"
										>
											{showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
							/>
							{formErrors.password && <FormHelperText>{formErrors.password}</FormHelperText>}
						</FormControl>

						<FormControl
							fullWidth
							margin="dense"
							variant="outlined"
							error={!!formErrors.confirmPassword}
							required={!editMode}
						>
							<InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
							<OutlinedInput
								id="confirmPassword"
								name="confirmPassword"
								type={showPassword ? "text" : "password"}
								value={formData.confirmPassword}
								onChange={handleInputChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleTogglePasswordVisibility}
											edge="end"
										>
											{showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
										</IconButton>
									</InputAdornment>
								}
								label="Confirm Password"
							/>
							{formErrors.confirmPassword &&
                                <FormHelperText>{formErrors.confirmPassword}</FormHelperText>}
						</FormControl>

						{editMode && (
							<Typography variant="caption" color="text.secondary" sx={{display: "block", mt: 1}}>
								Leave password fields empty to keep the current password.
							</Typography>
						)}
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
