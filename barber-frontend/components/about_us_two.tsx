import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function Services() {
    return (
        <section className='bg-neutral-900 p-7'>
            <div className="flex justify-center items-center">
                <ul className="grid grid-cols-1 md:grid-cols-3  sm:grid-cols-3 gap-9">
                    <li>
                        <Image className="img-services rounded-full border-8 border-red-500" src="/foto1.jpg" width={200} height={200} alt="image" />
                    </li>
                    <li>
                        <Image className="img-services rounded-full border-8 border-red-500" src="/foto2.jpg" width={200} height={200} alt="image" />
                    </li>
                    <li>
                        <Image className="img-services rounded-full border-8 border-red-500" src="/foto3.jpg" width={200} height={200} alt="image" />
                    </li>
                </ul>
            </div>
            <div className='max-w-xl mx-auto my-16 text-white text-lg text-center'>
                “Ofrecemos una amplia gama de cortes de cabello que van desde los clásicos hasta los modernos. Nuestros barberos expertos te proporcionarán el estilo perfecto.”
            </div>
        </section>
    )
}

export default Services