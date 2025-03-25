export interface PackageData {
	trackingNumber: string
	recipientName: string
	flatNumber: string
	carrier: string
}

export const scanPackage = async (imageSrc: string): Promise<PackageData> => {
	await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network request
	const mockData: PackageData = {
		trackingNumber: "1Z999AA10123456784",
		recipientName: "John Doe",
		flatNumber: "Apt 4B",
		carrier: "UPS",
	}

	return mockData
}

export const confirmPackage = async (packageData: PackageData): Promise<boolean> => {
	await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network request
	return true
}

