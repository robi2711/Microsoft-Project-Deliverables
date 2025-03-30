import {Box, Typography} from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ResidentConfirmationPage() {
    return (
        <Box
            sx={{ // Box encompasses entire screen and centers it's content
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Box
                sx={{ // box half the size within the center of screen, also with main colour
                    height: "50vh",
                    width: "50vw",
                    display: "flex",
                    flexDirection: "column", // stacks elements vertically
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