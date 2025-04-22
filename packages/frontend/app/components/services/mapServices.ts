
export const geocodeAddress = (address: string): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results && results.length > 0 && results[0]?.geometry?.location) {
                const { lat, lng } = results[0].geometry.location;
                resolve({ lat: lat(), lng: lng() });
            } else {
                reject(`Geocode failed: ${status}`);
            }
        });
    });
};