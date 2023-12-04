'use client'
import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';


interface FormData {
    user_name: string;
    user_email: string;
    message: string;
}

const schema = Yup.object().shape({
    user_name: Yup.string()
        .min(6, 'El nombre debe tener al menos 6 caracteres')
        .max(40, 'El nombre no puede tener más de 40 caracteres')
        .required('Este campo es obligatorio'),
    user_email: Yup.string().email('El email no es válido').required('Este campo es obligatorio'),
    message: Yup.string().min(5, 'El mensaje debe tener al menos 5 caracteres').required('Este campo es obligatorio'),
});

function ContactForm() {
    const [formDataToSave, setFormDataToSave] = useState<FormData | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [open, setOpen] = useState(false);

    const onCancel = () => {
        setOpen(false);
        reset();
    };
    const onSubmit = (data: FormData) => {
        console.log('Form Data:', data);
        // Clear the form fields
        reset();
        sendFormDataToBackend(data)
        // Show the success modal
        setOpen(true);
    };

    const reloadPage = () => {
        window.location.reload();
    };

    const sendFormDataToBackend = async (dataContact: FormData) => {
        try {
            console.log('Enviando datos al backend:', dataContact);
            const response = await fetch('http://186.64.113.85:3001/contacts/createContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(dataContact),
            });
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

    return (
        <>
            <section className="bg-neutral-900 seccion-about text-white" id='contact'>
                <div className="container contenedor-form mx-auto">

                    <h1 className="h1-serv uppercase text-center text-white my-14">CONTACTO</h1>
                    <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <label htmlFor="user_name" className="block text-left my-2">Nombre</label>
                            <input
                                type="text"
                                id="user_name"
                                {...register('user_name')}
                                className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.user_name ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="john"
                            />
                            <small className="text-red-500 text-base font-bold mt-1 text-left">{errors?.user_name ? errors?.user_name.message : 'ㅤ'}</small>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="user_email" className="block text-left my-2">Email</label>
                            <input
                                type="email"
                                id="user_email"
                                {...register('user_email')}
                                className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.user_email ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="john.doe@company.com"
                            />
                            <small className="text-red-500 text-base font-bold mt-1 text-left">{errors?.user_email ? errors?.user_email.message : 'ㅤ'}</small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-left my-2">Mensaje</label>
                            <textarea
                                id="message"
                                {...register('message')}
                                className={`w-full bg-gray-200 border-2 rounded py-2 px-4 text-gray-700 focus:ring-neutral-950 focus:border-neutral-700 focus:bg-white ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="Mensaje..."
                            ></textarea>
                            <small className="text-red-500 text-base font-bold mt-1 text-left">{errors?.message ? errors?.message.message : 'ㅤ'}</small>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn_cont_form bg-zinc-950 px-10">Enviar</button>
                        </div>
                    </form>
                </div>
            </section>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                                                    Mensaje enviado correctamente
                                                </Dialog.Title>
                                                <div className="mt-5">
                                                    <p className="text-base font-medium text-black">
                                                        Estaremos en contacto muy pronto...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}>
                                            Cerrar
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

export default ContactForm;