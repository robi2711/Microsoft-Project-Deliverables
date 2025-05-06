import api from "./apiService";
import { UserInfo } from "@/components/services/UserContext";

export interface PackageData {
	trackingNumber: string;
	recipientName: string;
	flatNumber: string;
	carrier: string;
}

interface OcrResponseData {
	extracted: {
		name: string | null;
		street: string | null;
		flat_number: string | null;
		country: string | null;
		postal_code: string | null;
	};
	allLines: string[];
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

		const extracted = (response.data as OcrResponseData)?.extracted;

		if (extracted?.name && extracted?.flat_number) {
			return {
				trackingNumber: "WE DONT KNOW YET",
				recipientName: extracted.name,
				flatNumber: extracted.flat_number,
				carrier: "UPS",
			};
		}

	} catch (error) {
		console.error("Error Message:", error);
	}

	return {
		trackingNumber: "Not Found",
		recipientName: "Not Found",
		flatNumber: "Not Found",
		carrier: "Not Found",
	};
};

export const confirmPackage = async (packageData: PackageData, userInfo: UserInfo): Promise<boolean> => {
	if (!userInfo) {
		console.error("User info is not available.");
		return false;
	}

	if (userInfo.type === "admin") {
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
