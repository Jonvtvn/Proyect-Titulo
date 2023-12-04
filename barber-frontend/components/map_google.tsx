'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent: React.FC = () => {
    const containerStyle = {
        height: '400px',
        margin: '0 auto',
        borderRadius: '10px',
        border: '4px solid rgb(23 23 23)',
    };

    const center = {
        lat: -33.56908296288874,
        lng: -70.80900876026854,
    };

    return (
        <section>
            <LoadScript googleMapsApiKey="AIzaSyBFQJcO29iCRYoSfbEw62KvW3RyRUW2WH0">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={17}>
                    <Marker position={center} />
                </GoogleMap>
            </LoadScript>
        </section>
    );
};

export default MapComponent;