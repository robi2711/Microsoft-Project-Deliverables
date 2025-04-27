"use client"
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"

interface MiniMapProps {
    address: string
}
//Handles all geocoding logic separately from map rendering
//Address string to longitude and latitude
function GeocoderHandler({ address }: { address?: string }) {
    const map = useMap()
    const [position, setPosition] = useState({ lat: 53.34, lng: 10 })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!address || !map) return

        setLoading(true)
        const geocoder = new google.maps.Geocoder()

        geocoder.geocode({ address }, (results, status) => {
            setLoading(false)
            if (status === 'OK' && results?.[0]) {
                const newPos = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }//Takes first result
                setPosition(newPos)
                map.panTo(newPos)
            }
        })
    }, [address, map])

    return (
        <>
            {loading }
            <Marker position={position} />
        </>
    )
}

export default function MiniMap({ address }: MiniMapProps) {
    return (
        <div style={{
            height: '100px',
            width: '100%',
            position: 'relative'
        }}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                <Map
                    zoom={15}
                    defaultCenter={{ lat: 0, lng: -30 }}
                    gestureHandling="greedy"
                >
                    <GeocoderHandler address={address} />
                </Map>
            </APIProvider>
        </div>
    )
}