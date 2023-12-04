import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Barber {
    idBarber: string;
    name: string;
    profileImage: any;
}

interface ListBarberProps {
    onDataSelect: (idBarber: string) => void;
}

function ListBarber({ onDataSelect }: ListBarberProps) {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

    useEffect(() => {
        const consultAPI = async () => {
            try {
                const url = 'http://186.64.113.85:3001/barber/getAllBarber';
                const rep = await fetch(url);
                const res = await rep.json();
                setBarbers(res);
                console.log(res);
            } catch (error) {
                console.error('Error al obtener barberos:', error);
            }
        };

        consultAPI();
    }, []);


    const handleBarberClick = (idBarber: string) => {
        console.log('Selected Barber ID:', idBarber);
        setSelectedBarber((prevSelectedBarber) =>
            prevSelectedBarber === idBarber ? null : idBarber
        );

        onDataSelect(idBarber);
    };

    return (
        <div className="flex justify-center items-center">
            <ul className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-3 gap-11">
                {barbers.map((barber) => (
                    <li key={barber.idBarber}>
                        <div
                            className={`w-32 h-32 rounded-full overflow-hidden cursor-pointer ${selectedBarber === barber.idBarber ? 'border-4 border-red-500' : ''}`}
                            onClick={() => handleBarberClick(barber.idBarber)}
                        >
                            {barber.profileImage && (
                                <Image
                                    src={barber.profileImage}
                                    alt={`Imagen de ${barber.name}`}
                                    width={150} // Ajusta el ancho según tus necesidades
                                    height={150} // Ajusta la altura según tus necesidades
                                />
                            )}
                        </div>
                        <h2 className='text-center text-black font-bold my-5 text-sm'>{barber.name}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListBarber;
