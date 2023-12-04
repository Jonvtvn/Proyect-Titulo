'use client'
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import RootLayout from '../layout';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import '@/styles/globals2.css';

interface Reservation {
    idReservation: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    reservationTime: Date;
    status: string;
}
interface Contact {
    idContact: string;
    user_name: string;
    user_email: string;
    message: string;
}
interface ModalContent {
    title: string;
    message: string;
}

function Page() {

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

    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);

    const [totalReservations, setTotalReservations] = useState<number>(0);
    const [totalSales, setTotalSales] = useState<number>(0);

    //reservaciones visibles...
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [contacts, setContact] = useState<Contact[]>([]);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
    });


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

    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallreservaciones:', accessToken);
            const url = 'http://186.64.113.85:3001/reservation/getAllReservations';
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,  // Incluir el token de acceso en los encabezados
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    setReservations(res);

                    const totalReservationsValue = res.reduce((total: number, reservation: any) => {
                        if (reservation.status === 'finalized') {
                            return total + 1;
                        } else {
                            return total;
                        }
                    }, 0);

                    setTotalReservations(totalReservationsValue);
                    // Calcular la suma de los valores de los servicios solo para las reservaciones con estado 'finalized'
                    const totalSalesValue = res.reduce((total: number, reservation: any) => {
                        if (reservation.status === 'finalized' && reservation.services && Array.isArray(reservation.services)) {
                            return total + reservation.services.reduce((subtotal: number, service: any) => subtotal + Number(service.price), 0);
                        } else {
                            return total;
                        }
                    }, 0);

                    setTotalSales(totalSalesValue);
                    console.log("total price...:", totalSalesValue)
                    console.log(res);
                } else {
                    console.error('Error al obtener barberos:', response.status);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        consultAPI();
    }, [accessToken]);

    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallbarber:', accessToken);
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
                    console.log(res);
                } else {
                    console.error('Error al obtener barberos:', response.status);
                    setAccessToken(null);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setAccessToken(null);
            }
        };

        consultAPI();
    }, [accessToken]);

    return (
        <>
            {accessToken && (
                <div>
                    <RootLayout showNavbar={false}>
                        <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
                            <Link href="#" legacyBehavior>
                                <a className="logo">
                                    <img className="img-p-admin w-auto" src="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
                                </a>
                            </Link>
                            <ul className="side-menu">
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_barbers"><i className='bx bx-group'></i>Barberos</a>
                                </li>
                                <li className={activeMenuItem === 2 ? 'active' : ''} onClick={() => setActiveMenuItem(2)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_reservations"><i className='bx bx-receipt'></i>Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 3 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_atent_client"><i className='bx bx-receipt'></i>Atencion a Cliente</a>
                                </li>
                                <li className={activeMenuItem === 4 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_histo_reserv"><i className='bx bx-receipt'></i>Historial Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 5 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
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
                                        <h1>Panel</h1>
                                        <ul className="breadcrumb text-neutral-500">
                                            <li>Resultados </li> / <li>Barberia</li>
                                        </ul>
                                    </div>
                                </div>
                                <ul className="insights text-white rounded-3xl">
                                    <li>
                                        <i className='bx bx-line-chart text-yellow-300'></i>
                                        <span className="info">
                                            <h3 className='font-bold'>{totalReservations}</h3>
                                            <p className='font-bold text-2xl '>Total Citas</p>
                                        </span>
                                    </li>
                                    <li>
                                        <i className='bx bx-dollar-circle text-green-700'></i>
                                        <span className="info">
                                            <h3 className='font-bold'>$ {totalSales}</h3>
                                            <p className='font-bold text-2xl '>Total Ventas</p>
                                        </span>
                                    </li>
                                </ul>
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
                                        <div className="show-more mx-auto"><a href="http://186.64.113.85:3000/admin/admin_atent_client"> Ver más solicitudes...</a></div>
                                    </div>
                                </div>
                            </main>
                        </div>
                        <Transition.Root show={modalOpen} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <div className="fixed inset-0 bg-neutral-900 bg-opacity-60 transition-opacity" />
                                </Transition.Child>
                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                    <div className="">
                                                        <div className="mt-10 text-center">
                                                            <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-black">
                                                                {modalContent.title}
                                                            </Dialog.Title>
                                                            <div className="mt-5">
                                                                <p className="text-base font-medium text-black">
                                                                    {modalContent.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                        onClick={() => setModalOpen(false)}>Cerrar
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition.Root>
                    </RootLayout>
                </div>
            )}
        </>
    );
}

export default Page;
