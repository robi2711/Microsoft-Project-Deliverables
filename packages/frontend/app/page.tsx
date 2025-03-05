"use client"
//This is the landing page of the application
//It is the first page that users will see when they visit the site
//It contains the header, hero, features, and footer components
//It is the only time the page.tsx is outside a file
import { Box, CssBaseline } from "@mui/material"
import FileUpload from "@/components/landingComponents/FileUpload"

export default function LandingPage() {
  return (
      <div id="pageBox">
        <CssBaseline />
        <Box sx={{ bgcolor: "background.default", color: "text.primary", height: "600px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <FileUpload />
        </Box>
      </div>
  )
}

