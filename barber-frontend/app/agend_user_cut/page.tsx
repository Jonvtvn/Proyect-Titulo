'use client'
import React, { useState, Fragment, useEffect } from 'react';
import { format, subHours } from 'date-fns';
import ListBarber from '../../components/list_barber';
import CalendarHours from '../../components/hours_calendar';
import FormUser from '../../components/data_user';
import ServiciosAgend from '../../components/data_services';
import { Dialog, Transition } from '@headlessui/react';
import RootLayout from '../layout'
import Footer from '../../components/footer';

interface Reservation {
    idReservation: string;
    reservationTime: Date;
}

interface ModalContent {
    title: string;
    message: string;
}
interface ModalContent2 {
    title: string;
    message: string;
}

interface ModalContent3 {
    title: string;
    message: string;
}

function Page() {
    const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [modalOpen3, setModalOpen3] = useState<boolean>(false);
    const [modalContent3, setModalContent3] = useState<ModalContent3>({
        title: '',
        message: '',
    });

    const [modalOpen2, setModalOpen2] = useState<boolean>(false);
    const [modalContent2, setModalContent2] = useState<ModalContent2>({
        title: '',
        message: '',
    });

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
    });
    const [dataToSave, setDataToSave] = useState({
        idBarber: null as string | null,
        userData: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
        },
        reservationTime: null as Date | null,
        selectedServices: {},
    });

    const showConfirmationModal = () => {
        setModalContent2({
            title: 'Confirmación',
            message: '¿Está seguro de agendar la cita?',
        });
        setModalOpen2(true);
    };

    const onConfirm = () => {
        const { idBarber, reservationTime, userData, selectedServices } = dataToSave;
        // Convierte los datos a JSON
        const jsonData = {
            idBarber,
            reservationTime,
            userData,
            selectedServices,
        };
        // Llama a la función para enviar los datos al backend
        sendDataToBackend(jsonData);
        // Cierra la ventana modal
        setModalOpen2(false);
    };

    const onCancel = () => {
        // El usuario dijo "No" o cerró la ventana modal
        // Puedes realizar acciones adicionales si es necesario
        setModalOpen2(false);
    };

    const handleFormData = (formData: any) => {
        setDataToSave((prevData) => ({
            ...prevData,
            userData: formData,
        }));
    };

    const handleSelectedServices = (selectedServices: any) => {
        setDataToSave((prevData) => ({
            ...prevData,
            selectedServices,
        }));
    };

    const sendDataToBackend = async (data: any) => {
        try {
            console.log('Datos a enviar:', JSON.stringify(dataToSave));

            const response = await fetch('http://186.64.113.85:3001/reservation/createReservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setModalContent3({
                    title: 'Cita Agendada',
                    message: 'Redirigiendo a metodo de pago...',
                });
                setModalOpen3(true);
                setTimeout(() => {
                    // Redirigir a otra ruta después del retraso
                    window.location.href = 'http://186.64.113.85:3000/agend_user_cut/agend_payment';
                }, 3000);

            } else {
                setModalContent({
                    title: 'Error',
                    message: 'Hubo un problema al enviar los datos al servidor.',
                });
                setModalOpen(true);
            }
        } catch (error) {
            console.error('Error al enviar los datos al servidor:', error);
            setModalContent({
                title: 'Error',
                message: 'Hubo un error al enviar los datos al servidor.',
            });
            setModalOpen(true);
        }
    };

    const saveDataToDatabase = async () => {
        const { idBarber, reservationTime, userData, selectedServices } = dataToSave;

        if (
            idBarber === null ||
            !userData.firstName ||
            !userData.lastName ||
            !userData.phoneNumber ||
            !userData.email ||
            !reservationTime ||
            Object.keys(selectedServices).length === 0
        ) {
            setModalContent({
                title: 'Advertencia',
                message: 'Rellene todos los campos antes de agendar.',
            });
            setModalOpen(true);
        } else {
            // Validar si la fecha y hora seleccionadas están ocupadas
            if (occupiedDates.some((occupiedDate) => occupiedDate.getTime() === reservationTime?.getTime())) {
                setModalContent({
                    title: 'Advertencia',
                    message: 'La hora y día seleccionados ya están ocupados. Por favor, elija otra hora.',
                });
                setModalOpen(true);
            } else {
                showConfirmationModal();
            }
        }
    };


    const consultAPI = async () => {
        const url = 'http://186.64.113.85:3001/reservation/getAllReservations';
        try {
            const rep = await fetch(url);
            const res = await rep.json();
            const occupiedDatesArray = res.map((reservation: Reservation) => new Date(reservation.reservationTime));
            setOccupiedDates(occupiedDatesArray);
            setReservations(res);
        } catch (error) {
            console.error('Error fetching reservations', error);
        }
    };
    useEffect(() => {
        consultAPI();
    }, []);

    return (
        <>
            <RootLayout showNavbar={true}>
                <section className='section-agendado'>
                    <section className='max-w-5xl mx-auto'>
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-40">
                            <div className="col-span-1">
                                <h2 className='text-center text-black font-semibold my-5 text-xl'>Seleccion Barber</h2>
                                <ListBarber
                                    onDataSelect={(selectedBarberId) => {
                                        const barberId = typeof selectedBarberId === 'string' ? selectedBarberId : null;
                                        setDataToSave((prevData) => ({
                                            ...prevData,
                                            idBarber: barberId,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                    <section className='max-w-5xl mx-auto my-14'>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40">
                            <div className="col-span-1">
                                <h2 className='text-center text-black font-semibold my-5 text-xl'>Datos de Cita</h2>
                                <FormUser onDataSelect={handleFormData} />
                            </div>
                            <div className="col-span-1">
                                <section>
                                    <h2 className='text-center text-black font-semibold my-5 text-xl'>Seleccion Dia y Hora</h2>
                                    <CalendarHours
                                        onDateTimeSelect={(selectedDateTime) => {
                                            if (selectedDateTime instanceof Date) {
                                                // Manipular la fecha antes de actualizar el estado
                                                const adjustedDateTime = subHours(selectedDateTime, 3);
                                                setDataToSave((prevData) => ({
                                                    ...prevData,
                                                    reservationTime: adjustedDateTime,
                                                }));
                                            } else {
                                                console.error('selectedDate no es de tipo Date');
                                            }
                                        }}
                                    />
                                </section>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className='text-center text-black font-semibold my-5 text-xl'>Seleccione Servicio</h2>
                        <ServiciosAgend onDataSelect={handleSelectedServices} />
                    </section>
                    <button type="submit" className='bg-neutral-900 my-10 mb-40' onClick={saveDataToDatabase}>
                        Agendar
                    </button>
                </section>
                <Footer />
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
                <Transition.Root show={modalOpen2} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setModalOpen2(false)}>
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
                                                        {modalContent2.title}
                                                    </Dialog.Title>
                                                    <div className="mt-5">
                                                        <p className="text-base font-medium text-black">
                                                            {modalContent2.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => onConfirm()}>
                                                Aceptar
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => onCancel()}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={modalOpen3} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setModalOpen3(false)}>
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
                                                        {modalContent3.title}
                                                    </Dialog.Title>
                                                    <div className="mt-5">
                                                        <p className="text-base font-medium text-black">
                                                            {modalContent3.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </RootLayout>
        </>
    );
}

export default Page;
