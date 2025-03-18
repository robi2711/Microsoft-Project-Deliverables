"use client"


// importing necessary modules
import { Box, TextField, FormControl, NativeSelect} from "@mui/material";
import Search from '@mui/icons-material/Search';

export default function topBar() {
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
                <FormControl>
                    <NativeSelect
                        defaultValue={10}
                    >
                        <option value={10}>EamonnBoyle@Benchmark.Property.ie</option>
                        <option value={20}>Settings</option>
                        <option value={30}>Log-out</option>
                    </NativeSelect>
                </FormControl>
            </Box>

        </Box>

    )
}

