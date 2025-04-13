import {useState} from "react";
import {Box} from "@mui/material";
import SideBar from "@/components/dashboardComponents/SideBar";
import TopBar from "@/components/dashboardComponents/TopBar";
import Overview from "@/components/dashboardComponents/OverviewBody";
import ResidentManagement from "@/components/dashboardComponents/ResidentManagementBody";
import ConciergeManagement from "@/components/dashboardComponents/ConciergeManagement";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("overview") // Default to overview

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				overflow: "hidden",
			}}
		>
			{/* We pass the active tab to the sidebar so it knows which tab to darken */}
			<SideBar setActiveTab={setActiveTab} activeTab={activeTab} />
			<TopBar /> {/* Our topbar displaying current user and the search input*/}
			{activeTab === "overview" && <Overview />} {/* If the active tab is overview, display the overview component */}
			{activeTab === "residentManagement" && <ResidentManagement />} {/* same craic ^ */}
			{activeTab === "conciergeManagement" && <ConciergeManagement />} {/* same craic ^ */}
		</Box>
	)
}