import api from "./apiService";

export interface PackageData {
	trackingNumber: string;
	recipientName: string;
	flatNumber: string;
	carrier: string;
}

interface OcrResponseData {
	name: string;
	address: string;
}

export const scanPackage = async (imageSrc: string): Promise<PackageData> => {
	console.log("Image Source:", imageSrc);
	try {
		const blob = await fetch(imageSrc).then(res => res.blob());
		const formData = new FormData();
		formData.append('image', blob, 'image.jpg');

		const response = await api.post("/ocr/", formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if((response.data as OcrResponseData)?.address && (response.data as OcrResponseData)?.name){
			return {
				trackingNumber: "WE DONT KNOW YET",
				recipientName: (response.data as OcrResponseData).name,
				flatNumber: (response.data as OcrResponseData).address,
				carrier: "UPS",
			} as PackageData;
		}

		console.log("API Response:", response.data);
	} catch (error) {
		console.error("Error Message:", error);
	}

	return {
		trackingNumber: "Not Found",
		recipientName: "Not Found",
		flatNumber: "Not Found",
		carrier: "Not Found",
	} as PackageData;
};

export const confirmPackage = async (packageData: PackageData): Promise<boolean> => {
	await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network request
	console.log("Package Data:", packageData);
	return true;
} //This command will be used when we can put the package in the database :)