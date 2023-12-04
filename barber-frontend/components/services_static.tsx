'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Service {
    idService: string;
    name: string;
    price: string;
}

function Servicios() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const consultAPI = async () => {
            const url = 'http://186.64.113.85:3001/services/getAllService'
            const rep = await fetch(url)
            const res = await rep.json()
            setServices(res);
            console.log(res)
        }
        consultAPI();
    }, []);

    return (
        <section className='seccion-services max-w-6xl mx-auto' id='services'>
            <div className="flex flex-col items-center">
                <h2 className="h1-serv text-5xl uppercase text-center text-zinc-900 mb-14">Servicios</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {services.map((service) => (
                        <div key={service.idService} className="bg-neutral-800 rounded-lg p-4 shadow-md">
                            <div className="mb-2 font-bold uppercase text-xl text-white">{service.name}</div>
                            <div className="text-red-700 font-bold">$ {service.price}</div>
                        </div>
                    ))}
                </div>

                <Link href="http://186.64.113.85:3000/agend_user_cut">
                    <button className='mt-16'>Agendar Hora</button>
                </Link>
            </div>
        </section >
    )
}

export default Servicios

