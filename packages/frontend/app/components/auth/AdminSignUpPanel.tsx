"use client"

import type React from "react"

import { useState } from "react"
import {
Box,
Button,
TextField,
Typography,
InputAdornment,
IconButton,
CircularProgress,
useMediaQuery,
useTheme,
} from "@mui/material"
import { AdminPanelSettings, PersonAdd, Visibility, VisibilityOff } from "@mui/icons-material"
import { signUpAdmin, type AdminCredentials, type UserData } from "@/components/services/authService"

type AdminSignUpPanelProps = {
onSignUpSuccess: (userData: UserData) => void
}

export default function AdminSignUpPanel({ onSignUpSuccess }: AdminSignUpPanelProps) {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")
const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")
    const [givenName,setGivenName ] = useState("")

const theme = useTheme()
const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

const handleTogglePassword = () => {
setShowPassword(!showPassword)
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setError("")

// Basic validation
if (!email.trim() || !password || !confirmPassword) {
setError("Please fill in all fields")
return
}

if (password !== confirmPassword) {
setError("Passwords do not match")
return
}

setLoading(true)

try {
const credentials: AdminCredentials = {
email,
givenName,
}

const userData = await signUpAdmin(credentials,password)
onSignUpSuccess(userData)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setGivenName("")
} catch (err) {
setError(err instanceof Error ? err.message : "Failed to sign up")
} finally {
setLoading(false)
}
}

return (
<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
<Box sx={{ textAlign: "center", mb: 1 }}>
<AdminPanelSettings sx={{ fontSize: { xs: 36, sm: 48 }, mb: 1, color: "secondary.main" }} />
<Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
Admin Sign Up
</Typography>
<Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
Create a new administrative account
</Typography>
</Box>

<TextField
label="email"
variant="outlined"
fullWidth
value={email}
onChange={(e) => setEmail(e.target.value)}
InputProps={{
sx: {
color: "white",
"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
fontSize: { xs: "0.9rem", sm: "1rem" },
},
}}
InputLabelProps={{
sx: {
color: "rgba(255,255,255,0.7)",
fontSize: { xs: "0.9rem", sm: "1rem" },
},
}}
required
size={isMobile ? "small" : "medium"}
/>

    <TextField
        label="name"
        variant="outlined"
        fullWidth
        value={givenName}
        onChange={(e) => setGivenName(e.target.value)}
        InputProps={{
            sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
            },
        }}
        InputLabelProps={{
            sx: {
                color: "rgba(255,255,255,0.7)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
            },
        }}
        required
        size={isMobile ? "small" : "medium"}
    />

<TextField
label="Password"
variant="outlined"
fullWidth
type={showPassword ? "text" : "password"}
value={password}
onChange={(e) => setPassword(e.target.value)}
InputProps={{
sx: {
color: "white",
"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
fontSize: { xs: "0.9rem", sm: "1rem" },
},
endAdornment: (
<InputAdornment position="end">
<IconButton
onClick={handleTogglePassword}
edge="end"
sx={{ color: "rgba(255,255,255,0.7)" }}
size={isMobile ? "small" : "medium"}
>
{showPassword ? (
<VisibilityOff fontSize={isMobile ? "small" : "medium"} />
) : (
<Visibility fontSize={isMobile ? "small" : "medium"} />
)}
</IconButton>
</InputAdornment>
),
}}
InputLabelProps={{
sx: {
color: "rgba(255,255,255,0.7)",
fontSize: { xs: "0.9rem", sm: "1rem" },
},
}}
required
size={isMobile ? "small" : "medium"}
/>

<TextField
label="Confirm Password"
variant="outlined"
fullWidth
type={showPassword ? "text" : "password"}
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
InputProps={{
sx: {
color: "white",
"& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
fontSize: { xs: "0.9rem", sm: "1rem" },
},
endAdornment: (
<InputAdornment position="end">
<IconButton
onClick={handleTogglePassword}
edge="end"
sx={{ color: "rgba(255,255,255,0.7)" }}
size={isMobile ? "small" : "medium"}
>
{showPassword ? (
<VisibilityOff fontSize={isMobile ? "small" : "medium"} />
) : (
<Visibility fontSize={isMobile ? "small" : "medium"} />
)}
</IconButton>
</InputAdornment>
),
}}
InputLabelProps={{
sx: {
color: "rgba(255,255,255,0.7)",
fontSize: { xs: "0.9rem", sm: "1rem" },
},
}}
required
size={isMobile ? "small" : "medium"}
/>

{error && (
<Typography color="error" variant="body2" sx={{ mt: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
{error}
</Typography>
)}

<Button
type="submit"
variant="contained"
color="secondary"
size={isMobile ? "medium" : "large"}
fullWidth
endIcon={loading ? null : <PersonAdd fontSize={isMobile ? "small" : "medium"} />}
sx={{ mt: 2, py: isMobile ? 1 : 1.5 }}
disabled={loading}
>
{loading ? <CircularProgress size={isMobile ? 20 : 24} color="inherit" /> : "Sign Up as Admin"}
</Button>
</Box>
)
}
