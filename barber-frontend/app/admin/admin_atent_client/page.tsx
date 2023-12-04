'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import '@/styles/globals2.css';
import RootLayout from '../../layout'



interface Contact {
    idContact: string;
    user_name: string;
    user_email: string;
    message: string;
}
function page() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const router = useRouter();
    const accessTokenRef = useRef<string | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken('');
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.clear();
        router.replace('/sign-in');
    }

    useEffect(() => {
        console.log('Entrando en useEffect para verificar el token');
        const storedAccessToken = localStorage.getItem('accessToken');
        console.log('Valor inicial de accessToken:', storedAccessToken);
        setAccessToken(storedAccessToken);
        accessTokenRef.current = storedAccessToken;
        console.log('Token de acceso almacenado en estado:', storedAccessToken);
    }, []); // Este efecto se ejecutará solo en el montaje inicial del componente

    useEffect(() => {
        // Verificar accessToken y redirigir si es necesario
        if (accessTokenRef.current === null) {
            console.log('No hay token, redirigiendo...');
            router.replace('/sign-in');
        } else {
            console.log('Si hay Token');
        }
    }, [router]);
    const [contacts, setContact] = useState<Contact[]>([]);
    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);

    useEffect(() => {
        // Obtener el token de acceso almacenado en localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken);
        console.log('Token de acceso almacenado en estado:', storedAccessToken);
    }, []);


    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallContact:', accessToken);
            const url = 'http://186.64.113.85:3001/contacts/getAllContacts';
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,  // Incluir el token de acceso en los encabezados
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    setContact(res);
                    console.log(res)
                } else {
                    console.error('Error al obtener Contactos:', response.status);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        consultAPI();
    }, [accessToken]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarClosed(true);
            } else {
                setSidebarClosed(false);
            }
            if (window.innerWidth > 576) {
                setSearchFormVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            {accessToken && (
                <>
                    <RootLayout showNavbar={false}>
                        <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
                            <Link href="#" legacyBehavior>
                                <a className="logo">
                                    <img className="img-p-admin w-auto" src="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
                                </a>
                            </Link>
                            <ul className="side-menu">
                                <li className={activeMenuItem === 3 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 2 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_barbers"><i className='bx bx-group'></i>Barberos</a>
                                </li>
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(2)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_reservations"><i className='bx bx-receipt'></i>Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_atent_client"><i className='bx bx-receipt'></i>Atencion a Cliente</a>
                                </li>
                                <li className={activeMenuItem === 4 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_histo_reserv"><i className='bx bx-receipt'></i>Historial Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 5 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_services"><i className='bx bx-receipt'></i>Servicios</a>
                                </li>
                                <li><a href="http://186.64.113.85:3000/"><i className='bx bx-store-alt'></i>ir a Barberia</a></li>
                                <li>
                                    <button
                                        onClick={() => handleLogout()}>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="content">
                            <main className='bg-neutral-800 rounded-bl-3xl text-white'>
                                <div className="header">
                                    <div className="left">
                                        <h1>Atencio a Cliente</h1>
                                        <ul className="breadcrumb text-neutral-500">
                                            <li>Resultados </li> / <li>Barberia</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bottom-data">
                                    <div className="orders">
                                        <div className="header">
                                            <i className='bx bx-receipt text-red-700'></i>
                                            <h3>Solicitudes</h3>
                                        </div>

                                        <ol className="relative border-s border-gray-200">
                                            {contacts.map((contact) => (
                                                <li className="mb-10 ms-4" key={contact.idContact}>
                                                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white"></div>
                                                    <h4 className="mb-1 text-base font-medium leading-none text-red-600 ">{contact.user_name}</h4>
                                                    <h3 className="text-lg font-semibold text-white dark:text-white">{contact.user_email}</h3>
                                                    <p className="mb-4 text-left text-base font-normal text-neutral-300 ">{contact.message}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </RootLayout>
                </>
            )}
        </>
    )
}

export default page