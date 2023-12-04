import React from 'react'
import Image from 'next/image'
import MapComponent from '../components/map_google';

function nosotros() {
    return (
        <>
            <section className='section-nosotros max-w-5xl mx-auto'>
                <div className="mx-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="mt-20 flex items-center text-lg  col-span-1 text-black align-middle max-w-sm mx-auto">
                        "En nuestra barbería, contamos con la atención que te mereces y un equipo
                        apasionado por la estética masculina. Te ayudaremos a realzar tu imagen, a
                        sentirte seguro y auténtico. Únete a nosotros y descubre el poder de un estilo bien definido."
                    </div>
                    <div className="col-span-1">
                        <Image src="/img1.png" width={450} height={450} alt="image" />
                    </div>
                </div>
            </section>
            <h1 className='text-center font-semibold text-2xl mb-4'>Ubicación</h1>
            <div className='max-w-lg mx-auto mb-10'>
                <MapComponent />
            </div>

        </>
    )
}

export default nosotros