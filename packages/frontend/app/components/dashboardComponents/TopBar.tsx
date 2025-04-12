// importing necessary modules
import {Box, TextField, FormControl, NativeSelect, Button, MenuItem, Menu} from "@mui/material";
import {useUser} from "@/components/services/UserContext";
import Search from '@mui/icons-material/Search';
import {signOutAdmin} from "@/components/services/authService";
import {useState} from "react";

export default function TopBar() {
    const { userInfo } = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        signOutAdmin(userInfo?.accessToken);
        window.location.href = "/"; // Redirect to login page
    };
    return(

        <Box
            sx={{
                width: "80vw", // setting the width of the topbar - 80% of the viewport width
                height: "7vh", // setting the height of the topbar - 7% of the viewport height
                bgcolor: "white",
                boxShadow: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // elements within the topbar are spaced evenly
                paddingRight: 2 // nothing gets too close to the right
            }}
        >

            {/* adding a search option */}
            <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 2}}
            >
                <Search sx={{ marginRight: 1 }} />
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-small"
                    defaultValue="search Dashboard"
                    variant="filled"
                    size="small"
                />
            </Box>

            {/* displaying user - drop down menu to sign out/settings */}
            {/* TODO: find a better way of doing this */}
            <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 2}}
            >

                <Button
                    variant="contained"
                    onClick={handleClick}
                >
                    {userInfo?.email || "Menu"}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            minWidth: anchorEl?.offsetWidth || "auto",
                            width: "100%",
                            height: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 10px",
                            fontSize: "16px",
                            borderRadius: "4px",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    >
                        Log-out
                    </MenuItem>
                </Menu>

            </Box>

        </Box>

    )
}

