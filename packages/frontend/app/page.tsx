"use client"
//This is the landing page of the application
//It is the first page that users will see when they visit the site
//It contains the header, hero, features, and footer components
//It is the only time the page.tsx is outside a file
import { Box, CssBaseline } from "@mui/material"
import Header from "@/components/landingComponents/NavBar"
import Hero from "@/components/landingComponents/Hero"
import Features from "@/components/landingComponents/Features"
import Footer from "@/components/landingComponents/Footer"

export default function LandingPage() {
  return (
      <div>
        <CssBaseline />
        <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
          <Header />
          <Hero />
          <Features />
          <Footer />
        </Box>
      </div>
  )
}

