import React, { useState, useEffect, useRef } from 'react';

interface FormUserProps {
    onDataSelect: (data: any) => void;
}

interface FieldChanged {
    [key: string]: boolean;
}

function FormUser({ onDataSelect }: FormUserProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });

    const fieldChanged = useRef<FieldChanged>({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        email: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        // Marcar el campo como cambiado
        fieldChanged.current[id] = true;
    };

    useEffect(() => {
        // Solo actualiza el estado si se ha cambiado algún campo
        if (Object.values(fieldChanged.current).includes(true)) {
            onDataSelect(formData);

            // Reiniciar los cambios
            fieldChanged.current = {
                firstName: false,
                lastName: false,
                phoneNumber: false,
                email: false,
            };
        }
    }, [formData, onDataSelect]);

    return (
        <form>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-black dark:text-white">Nombre</label>
                    <input
                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                        placeholder="John"
                        required
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}

                    />

                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-black dark:text-white">Apellido</label>
                    <input
                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                        placeholder="Doe"
                        required
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />

                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-black dark:text-white">Numero Cel</label>
                    <input
                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                        placeholder="9 1234 1234"
                        pattern="[9]{1} [0-9]{4} [9]{1} [0-9]{4}"
                        required
                        type="tel"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-black dark:text-white">Email</label>
                    <input
                        className="bg-gray-50 border border-neutral-900 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                        placeholder="john.doe@company.com"
                        required
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange} />

                </div>
            </div>
        </form>
    );
}

export default FormUser;
