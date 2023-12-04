'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import '@/styles/globals2.css';
import RootLayout from '../../layout'

interface Reservation {
    idReservation: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    reservationTime: Date;
    status: string;
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


    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);

    //total de reservaciones...
    const [totalReservations, setTotalReservations] = useState<number>(0);

    const approvedReservations = reservations.filter(reservation => reservation.status === 'finalized');

    useEffect(() => {
        // Obtener el token de acceso almacenado en localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken);
        console.log('Token de acceso almacenado en estado:', storedAccessToken);
    }, []); // Este efecto se ejecutará solo en el montaje inicial del componente



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
                    console.log(res)

                    const totalReservationsValue = res.reduce((total: number, reservation: any) => {
                        if (reservation.status === 'finalized') {
                            return total + 1;
                        } else {
                            return total;
                        }
                    }, 0);

                    setTotalReservations(totalReservationsValue);
                } else {
                    console.error('Error al obtener las reservaciones:', response.status);
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
                                <li className={activeMenuItem === 4 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 3 ? 'active' : ''} onClick={() => setActiveMenuItem(2)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_barbers"><i className='bx bx-group'></i>Barberos</a>
                                </li>
                                <li className={activeMenuItem === 2 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_reservations"><i className='bx bx-receipt'></i>Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_atent_client"><i className='bx bx-receipt'></i>Atencion a Cliente</a>
                                </li>
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
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
                                        <h1>Historial de Reservaciones</h1>
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
                                </ul>
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
                                                        <td>{reservation.status}</td>
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
                    </RootLayout>
                </>
            )
            }
        </>

    );
};

export default Page;