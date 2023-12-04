import React, { useState, useEffect } from 'react';

interface Servicio {
    idService: string;
    name: string;
    price: string;
}

interface ServiciosAgendProps {
    onDataSelect: (selectedServices: Servicio[]) => void;
}

function ServiciosAgend({ onDataSelect }: ServiciosAgendProps) {
    const [services, setServices] = useState<Servicio[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    useEffect(() => {
        // Aquí puedes realizar la llamada a la base de datos para obtener los servicios
        const consultAPI = async () => {
            try {
                const url = 'http://186.64.113.85:3001/services/getAllService';
                const rep = await fetch(url);
                const res = await rep.json();
                setServices(res);
                console.log(res);
            } catch (error) {
                console.error('Error al obtener servicios:', error);
            }
        };

        consultAPI();
    }, []);

    const handleServiceClick = (servicio: Servicio) => {
        setSelectedServices((prevSelectedServices) => {
            const isServiceSelected = prevSelectedServices.includes(servicio.idService);

            if (isServiceSelected) {
                const updatedServices = prevSelectedServices.filter((id) => id !== servicio.idService);
                console.log('Servicios seleccionados:', updatedServices);
                onDataSelect(services.filter((s) => updatedServices.includes(s.idService)));
                return updatedServices;
            } else {
                const updatedServices = [...prevSelectedServices, servicio.idService];
                console.log('Servicios seleccionados:', updatedServices);
                onDataSelect(services.filter((s) => updatedServices.includes(s.idService)));
                return updatedServices;
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((servicio) => (
                    <div
                        key={servicio.idService}
                        onClick={() => handleServiceClick(servicio)}
                        className={`bg-neutral-900 p-4 shadow-md cursor-pointer relative rounded-xl overflow-hidden
                                ${selectedServices.includes(servicio.idService) ? 'border-4 border-red-500' : 'border-4 border-transparent'}
                            `}
                    >
                        <div className="mb-2 font-bold uppercase text-xl text-white">{servicio.name}</div>
                        <div className="text-red-700 font-bold">{servicio.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiciosAgend;
