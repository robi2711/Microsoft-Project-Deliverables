import api from "./apiService";
import {UserInfo} from "@/components/services/UserContext";


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

export const confirmPackage = async (packageData: PackageData, userInfo : UserInfo): Promise<boolean> => {

	if (!userInfo) {
		console.error("User info is not available.");
		return false;
	}
	if(userInfo.type === "admin") {
		const userId = await api.get<UserResponse>(`/db/userIdName`, {
			params: {
				name: packageData.recipientName,
				address: packageData.flatNumber,
				complexId: userInfo.selectedComplex,
			}
		});
		await api.post(`/db/user/${userId.data.id}/package`, {
				packageData,
		});

		// Send WhatsApp notification to the target user
		await api.post(`/whatsapp/send`, {
			telephone: 'whatsapp:'+userId.data.phone,
			name: packageData.recipientName,
			packages: packageData.carrier //Tracking number for now, no way to know what package is yet
		})

		return true;
	}
	interface ComplexResponse {
		data: {
			id: string;
		}[];
	}
	interface UserResponse {
		id: string;
		phone: string;
	}
	const complex = await api.get<ComplexResponse>(`/db/concierge/${userInfo.sub}/complexes`, {});
	if (!complex) {
		console.error("Complex not found.");
		return false;
	}
	const complexId = Array.isArray(complex.data) && complex.data.length > 0 ? complex.data[0].id : null;
	const userId = await api.get<UserResponse>(`/db/userIdName`, {
		params: {
			name: packageData.recipientName,
			address: packageData.flatNumber,
			complexId: complexId,
		}
	});
	await api.post(`/db/user/${userId.data.id}/package`, {
		packageData,
	});

	return true;
} 