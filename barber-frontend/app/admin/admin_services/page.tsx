'use client'
import { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog, Transition } from '@headlessui/react';
import * as Yup from 'yup';
import Link from 'next/link';
import '@/styles/globals2.css';
import RootLayout from '../../layout'
import Image from 'next/image';

interface FormData {
    name: string;
    price: string;
}

interface Service {
    idService: string;
    name: string;
    price: string;
}

const schema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'El nombre debe tener al menos 10 caracteres')
        .max(20, 'El nombre no puede tener más de 20 caracteres')
        .required('Este campo es obligatorio'),
    price: Yup.string().min(4, 'El precio no es valido').required('Este campo es obligatorio'),
});
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
    const reloadPage = () => {
        window.location.reload();
    };
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


    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [services, setServices] = useState<Service[]>([]);
    const [formDataToSave, setFormDataToSave] = useState<FormData | null>(null);

    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data);
        // Clear the form fields
        reset();
        sendFormDataToBackend(data)
    };

    const sendFormDataToBackend = async (dataService: FormData) => {
        try {
            console.log('Enviando datos al backend:', dataService);
            console.log('Access Token creando servicio:', accessToken);
            const response = await fetch('http://186.64.113.85:3001/services/createService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }, body: JSON.stringify(dataService),
            });
            reloadPage()
            if (response.ok) {
                const responseData = await response.json();
                console.log('Respuesta del backend:', responseData);
                console.log('Datos enviados correctamente al backend');
            } else {
                console.error('Error al enviar datos al backend');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallservice:', accessToken);
            const url = 'http://186.64.113.85:3001/services/getAllService';
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,  // Incluir el token de acceso en los encabezados
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    setServices(res);
                    console.log(res);
                } else {
                    console.error('Error al obtener servicios:', response.status);
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
                                <li className={activeMenuItem === 5 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 4 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_barbers"><i className='bx bx-group'></i>Barberos</a>
                                </li>
                                <li className={activeMenuItem === 3 ? 'active' : ''} onClick={() => setActiveMenuItem(2)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_reservations"><i className='bx bx-receipt'></i>Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 2 ? 'active' : ''} onClick={() => setActiveMenuItem(4)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_atent_client"><i className='bx bx-receipt'></i>Atencion a Cliente</a>
                                </li>
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_histo_reserv"><i className='bx bx-receipt'></i>Historial Reservaciones</a>
                                </li>
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
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
                                        <h1>Servicios</h1>
                                        <ul className="breadcrumb text-neutral-500">
                                            <li>Resultados </li> / <li>Barberia</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bottom-data">
                                    <div className="orders">
                                        <div className="header">
                                            <i className='bx bx-receipt text-red-700'></i>
                                            <h3>Servicios</h3>
                                        </div>
                                        <section className='' id='services'>
                                            <div className="flex flex-col items-center">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {services.map((service) => (
                                                        <div key={service.idService} className="bg-neutral-800 rounded-lg p-4 shadow-md">
                                                            <div className="mb-2 font-bold uppercase text-xl text-white">{service.name}</div>
                                                            <div className="text-red-700 font-bold">$ {service.price}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section >
                                    </div>
                                </div>
                                <div className="add-user-form max-w-2xl mx-auto">
                                    <h2 className='text-white'>Agregar Servicios</h2>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <label >Nombre:</label>
                                        <input
                                            className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                            type="text"
                                            id="name"
                                            {...register('name')}
                                            placeholder="john" />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.name ? errors?.name.message : 'ㅤ'}</small>

                                        <label >Precio</label>
                                        <input
                                            className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
                                            type="number"
                                            id="price"
                                            {...register('price')}
                                            placeholder="10 000" />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.price ? errors?.price.message : 'ㅤ'}</small>
                                        <button type="submit" className="btn_cont_form bg-zinc-950 px-28 max-w-sm mx-auto">Agregar</button>
                                    </form>
                                </div>
                            </main>
                        </div>
                        {/* <Transition.Root show={confirmDialogOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={closeConfirmDialog}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-neutral-800 bg-opacity-60 transition-opacity" />
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
                                                        Confirmar Envío
                                                    </Dialog.Title>
                                                    <div className="mt-5">
                                                        <p className="text-base font-medium text-black">
                                                            ¿Está seguro de que desea agregar este barbero?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => {
                                                    if (formDataToSave) {
                                                        sendFormDataToBackend(formDataToSave);
                                                        setOpen(true);
                                                    }
                                                    closeConfirmDialog();
                                                }}>
                                                Aceptar
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => {
                                                    closeConfirmDialog();
                                                    // Puedes realizar acciones adicionales si es necesario
                                                    // Por ejemplo, restablecer los campos del formulario
                                                }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root> */}
                    </RootLayout>
                </>
            )
            }
        </>
    );
};

export default Page;