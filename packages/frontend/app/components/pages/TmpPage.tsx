//The reason this is so abstracted is that it allows for the ability to change the theme of the entire app by changing the theme in one place. This is a very powerful feature of MUI and is one of the reasons it is so popular.
//Also, it is a good practice to abstract the layout of the app into a separate file so that it is easier to maintain and change in the future.
import TmpButton from "@/components/tmpComponents/TmpButton"

export default function TmpPage() {
	return (
		<TmpButton />
	)
}