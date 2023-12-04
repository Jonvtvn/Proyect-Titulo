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
    email: string;
    phoneNumber: string;
    profileImage: any;
}

interface Barber {
    idBarber: string;
    name: string;
    email: string;
    phoneNumber: string;
    profileImage: any;
}

const schema = Yup.object().shape({
    name: Yup.string()
        .min(10, 'El nombre debe tener al menos 10 caracteres')
        .max(20, 'El nombre no puede tener más de 20 caracteres')
        .required('Este campo es obligatorio'),
    email: Yup.string().email('El email no es válido').required('Este campo es obligatorio'),
    phoneNumber: Yup.string().min(9, 'El numero no es valido').required('Este campo es obligatorio'),
    profileImage: Yup.mixed().required('Por favor, selecciona una imagen'),
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


    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [activeMenuItem, setActiveMenuItem] = useState<number>(0);
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isSearchFormVisible, setSearchFormVisible] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [formDataToSave, setFormDataToSave] = useState<FormData | null>(null);
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const openConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setFormDataToSave(null); // Limpiar los datos almacenados después de cerrar el diálogo
    };

    // Función para convertir un archivo a base64
    const fileToBase64 = async (file: File): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const img = document.createElement('img'); // Cambiado de new Image() a document.createElement('img')
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_RESOLUTION = 800;

                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_RESOLUTION || height > MAX_RESOLUTION) {
                        if (width > height) {
                            height *= MAX_RESOLUTION / width;
                            width = MAX_RESOLUTION;
                        } else {
                            width *= MAX_RESOLUTION / height;
                            height = MAX_RESOLUTION;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    const optimizedBase64 = canvas.toDataURL('image/jpeg');
                    resolve(optimizedBase64);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const reloadPage = () => {
        window.location.reload();
    };

    const onSubmit = async (data: FormData) => {
        try {
            // Convertir la imagen a base64 antes de enviarla al backend
            const profileImageBase64 = await fileToBase64(data.profileImage[0]);
            const dataWithBase64 = { ...data, profileImage: profileImageBase64 };

            console.log('Form Data:', dataWithBase64);
            openConfirmDialog();
            setFormDataToSave(dataWithBase64);
        } catch (error) {
            console.error('Error al convertir la imagen a base64:', error);
        }
    };


    const sendFormDataToBackend = async (dataBarber: FormData) => {
        try {
            console.log('Enviando datos al backend:', dataBarber);
            const response = await fetch('http://186.64.113.85:3001/barber/createBarber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }, body: JSON.stringify(dataBarber),
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
    const handleDeleteBarber = async (idBarber: string) => {
        const deleteBarberUrl = `http://186.64.113.85:3001/barber/deleteBarber`;
        console.log("id del barbero:", idBarber)
        try {
            console.log('Eliminado');
            console.log('barbero eliminado...');
            const response = await fetch(deleteBarberUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ id: idBarber }),
            });
            reloadPage()
            if (response.ok) {
                console.log('Reservation canceled successfully.');
            } else {
                console.error('Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error canceling reservation', error);
        };
    };
    useEffect(() => {
        // Obtener el token de acceso almacenado en localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken);
        console.log('Token de acceso almacenado en estado:', storedAccessToken);
    }, []); // Este efecto se ejecutará solo en el montaje inicial del componente

    useEffect(() => {
        const consultAPI = async () => {
            console.log('Access Token getallbarber:', accessToken);
            const url = 'http://186.64.113.85:3001/barber/getAllBarber';
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,  // Incluir el token de acceso en los encabezados
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    setBarbers(res);
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
                                <li className={activeMenuItem === 1 ? 'active' : ''} onClick={() => setActiveMenuItem(1)}>
                                    <a href="http://186.64.113.85:3000/admin"><i className='bx bxs-dashboard'></i>PANEL</a>
                                </li>
                                <li className={activeMenuItem === 0 ? 'active' : ''} onClick={() => setActiveMenuItem(0)}>
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
                                <li className={activeMenuItem === 5 ? 'active' : ''} onClick={() => setActiveMenuItem(3)}>
                                    <a href="http://186.64.113.85:3000/admin/admin_services"><i className='bx bx-receipt'></i>Servicios</a>
                                </li>
                                <li>
                                    <a href="http://186.64.113.85:3000/"><i className='bx bx-store-alt'></i>ir a Barberia</a>
                                </li>
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
                                        <h1>Barberos</h1>
                                        <ul className="breadcrumb text-neutral-500">
                                            <li>Resultados </li> / <li>Barberia</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bottom-data">
                                    <div className="orders">
                                        <div className="header">
                                            <i className='bx bx-receipt text-red-700'></i>
                                            <h3>Barberos</h3>
                                        </div>
                                        <table>
                                            <tbody>
                                                <tr className='text-red-700'>
                                                    <th>Nombre</th>
                                                    <th>Correo</th>
                                                    <th>Telefono</th>
                                                    <th>Imagen</th>
                                                    <th> </th>
                                                </tr>
                                                {barbers.map((barber) => (
                                                    <tr key={barber.idBarber}>
                                                        <td>{barber.name}</td>
                                                        <td>{barber.email}</td>
                                                        <td>{barber.phoneNumber}</td>
                                                        <td>
                                                            <button className='mx-2 bg-red-800 hover:bg-red-500' onClick={() => handleDeleteBarber(barber.idBarber)}>
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {barber.profileImage && (
                                                                <Image
                                                                    src={barber.profileImage}
                                                                    alt={`Imagen de ${barber.name}`}
                                                                    width={50} // Ajusta el ancho según tus necesidades
                                                                    height={50} // Ajusta la altura según tus necesidades
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="add-user-form max-w-2xl mx-auto">
                                    <h2 className='text-white'>Agregar Barbero</h2>
                                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                                        <label >Nombre:</label>
                                        <input
                                            className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                            type="text"
                                            id="name"
                                            {...register('name')}
                                            placeholder="john" />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.name ? errors?.name.message : 'ㅤ'}</small>
                                        <label >Correo Electrónico:</label>
                                        <input
                                            className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                            type="email"
                                            id="email"
                                            {...register('email')}
                                            placeholder="john.doe@company.com" />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.email ? errors?.email.message : 'ㅤ'}</small>
                                        <label >Teléfono:</label>
                                        <input
                                            className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'}`}
                                            type="tel"
                                            id="phoneNumber"
                                            {...register('phoneNumber')}
                                            placeholder="9 1111 1111" />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.phoneNumber ? errors?.phoneNumber.message : 'ㅤ'}</small>
                                        <label>Foto:</label>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            {...register('profileImage', { setValueAs: (files) => files[0] })}  // Utiliza setValueAs para obtener el primer archivo
                                            accept="image/*"
                                        />
                                        <small className="text-red-500 text-base font-bold my-2 text-left">{errors?.profileImage ? errors?.profileImage.message : 'ㅤ'}</small>
                                        <button type="submit" className="btn_cont_form bg-zinc-950 px-28 max-w-sm mx-auto">Agregar</button>
                                    </form>
                                </div>
                            </main>
                        </div>
                        <Transition.Root show={confirmDialogOpen} as={Fragment}>
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
                        </Transition.Root>
                    </RootLayout>
                </>
            )}
        </>
    );
};

export default Page;