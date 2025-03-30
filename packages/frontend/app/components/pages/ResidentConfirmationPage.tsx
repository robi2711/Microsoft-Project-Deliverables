import {Box, Typography} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ResidentConfirmationPage() {
    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Box
                sx={{
                    height: "50vh",
                    width: "50vw",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "primary.main"
                }}>
                <WhatsAppIcon sx={{ fontSize: 100, color: "#25D366" }} />
                <Typography sx={{color: "white"}}>Resident Confirmation Page</Typography>
            </Box>
        </Box>
    )
}