'use client'
import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import RootLayout from '../../layout'
import { Dialog, Transition } from '@headlessui/react';



interface ModalContent {
    title: string;
    message: string;
}

function Page() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: 'Cita agendada',
        message: 'El pago se realizará en efectivo en el local.',
    });
    const onCancel = () => {
        // El usuario dijo "No" o cerró la ventana modal
        // Puedes realizar acciones adicionales si es necesario
        setModalOpen(false);
        setTimeout(() => {
            // Redirigir a otra ruta después del retraso
            window.location.href = 'http://186.64.113.85:3000/';
        }, 700);

    };

    const handleEfectivoClick = () => {
        setModalOpen(true);
    };

    return (
        <>
            <section className="tipo-pago flex items-center justify-center">
                <div>
                    <button className="w-40 h-16 bg-neutral-900 text-white font-bold rounded-lg text-lg mx-auto block">
                        WebPay(Prox)
                    </button>
                    <button
                        className="w-40 h-16 bg-neutral-900 text-white font-bold rounded-lg text-lg mx-auto block mt-4"
                        onClick={handleEfectivoClick}
                    >
                        Efectivo
                    </button>
                </div>
            </section>
            <Transition.Root show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
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
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
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
                                            onClick={() => onCancel()}
                                        >
                                            Volver al Inicio
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}

export default Page;