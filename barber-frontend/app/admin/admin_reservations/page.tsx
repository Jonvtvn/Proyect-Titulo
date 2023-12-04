'use client'
import { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import '@/styles/globals2.css';
import RootLayout from '../../layout'
import { Dialog, Transition } from '@headlessui/react';

interface Reservation {
    idReservation: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    reservationTime: Date;
    status: string;
}

interface ModalContent {
    title: string;
    message: string;
}
const Page = () => {
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

    const reloadPage = () => {
        window.location.reload();
    };
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);

    const approvedReservations = reservations.filter(reservation => reservation.status === 'aproved');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
    });


    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallReservations:', accessToken);
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

    const handleFinishReservation = async (idReservation: string) => {
        const finishReservationUrl = `http://186.64.113.85:3001/reservation/updateReservation`;
        console.log('Access Token para finalizar:', accessToken);
        try {
            console.log('Sending PUT request to update reservation status...');
            const response = await fetch(finishReservationUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ idReservation: idReservation, status: 'finalized' }),
            });
            reloadPage()
            if (response.ok) {
                console.log('Reservation status updated successfully.');
                // If the update is successful, fetch the updated reservation data
                console.log('Fetching updated reservation data...');
                // consultAPI();
            } else {
                console.error('Failed to update reservation status');
            }
        } catch (error) {
            console.error('Error updating reservation status', error);
        }
    };

    const resRout = async (phoneNumber: string) => {
        const res = await fetch('/api/sms', {
            method: 'POST',
            body: JSON.stringify({ to: phoneNumber }),  // Enviar el número de teléfono en el campo 'to'
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        reloadPage()
    };

    const handleCancelReservation = async (idReservation: string, phoneNumber: string) => {
        const cancelReservationUrl = `http://186.64.113.85:3001/reservation/deleteReservation`;
        try {
            console.log('Access Token para eliminar:', accessToken);
            console.log('Eliminado');
            console.log('Sending DELETE request to cancel reservation...');
            const response = await fetch(cancelReservationUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ id: idReservation }),
            });
            if (response.ok) {
                console.log('Reservation canceled successfully.');
                resRout(phoneNumber)
                setModalContent({
                    title: 'Aviso',
                    message: 'Enviando SMS a cliente...',
                });
                setModalOpen(true);
                console.log('Fetching updated reservation data...');
                // consultAPI();
            } else {
                console.error('Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error canceling reservation', error);
        };
    };
    const addHours = (date: Date, hours: number) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);

        // Utilizar date-fns para formatear la hora en formato de 24 horas
        return format(newDate, 'HH:mm');
    };

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
                                <li className={activeMenuItem === 2 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(2)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_barbers"><i className='bx bx-group'></i>Barberos</a>
                                </li>
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_reservations"><i className='bx bx-receipt'></i>Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 3 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
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
                                        <h1>Reservaciones</h1>
                                        <ul className="breadcrumb text-neutral-500">
                                            <li>Resultados </li> / <li>Barberia</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bottom-data">
                                    <div className="orders">
                                        <div className="header pb-20">
                                            <i className='bx bx-receipt'></i>
                                            <h3>Reservaciones</h3>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Usuario</th>
                                                    <th>Telefono</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th>Fecha</th>
                                                    <th>hora</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {approvedReservations.map((reservation) => (
                                                    <tr key={reservation.idReservation}>
                                                        <td>{reservation.firstname} {reservation.lastname}</td>
                                                        <td>{reservation.phoneNumber}</td>
                                                        <td>{reservation.email}</td>
                                                        <td>
                                                            Activo
                                                            <button className='mx-2 bg-green-400 hover:bg-green-700' onClick={() => handleFinishReservation(reservation.idReservation)}>
                                                                Finalizar
                                                            </button>
                                                            <button className='mx-2 bg-red-800 hover:bg-red-500' onClick={() => handleCancelReservation(reservation.idReservation, reservation.phoneNumber)}>
                                                                Cancelar
                                                            </button>
                                                        </td>
                                                        <td>{new Date(reservation.reservationTime).toLocaleDateString()}</td>
                                                        <td>{addHours(reservation.reservationTime, 3)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                </>
            )}
        </>
    );
};

export default Page;