//The reason this is so abstracted is that it allows for the ability to change the theme of the entire app by changing the theme in one place. This is a very powerful feature of MUI and is one of the reasons it is so popular.
//Also, it is a good practice to abstract the layout of the app into a separate file so that it is easier to maintain and change in the future.
import {useUser} from "@/components/services/UserContext";

export default function TmpPage() {
	const { userInfo } = useUser()
	console.log(userInfo)
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<h1 style={{ fontSize: "2rem", color: "#333" }}>Hello, {userInfo?.username || "Guest"}! </h1>
			<p style={{ fontSize: "1.5rem", color: "#666" }}>Welcome to the Temporary Page!</p>
		</div>
	)
}