// components/MiniMap.tsx
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { geocodeAddress } from "@/components/services/mapServices";

interface MiniMapProps {
    address: string;
}

const containerStyle = {
    width: "100%",
    height: "100%"
};

const defaultCenter = { lat: 37.4221, lng: -122.0841 };

export const MiniMap: React.FC<MiniMapProps> = ({ address }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.GOOGLE_API || "",
        libraries: ["places"]
    });

    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
        if (isLoaded && address) {
            geocodeAddress(address)
                .then(setCenter)
                .catch(err => console.error(err));
        }
    }, [isLoaded, address]);

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker position={center} />
        </GoogleMap>
    );
};