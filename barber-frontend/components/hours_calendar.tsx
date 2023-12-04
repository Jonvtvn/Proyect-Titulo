'use client'
import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, isBefore, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';

interface CalendarHoursProps {
    onDateTimeSelect: (selectedDateTime: Date | null) => void;
}
interface Reservation {
    idReservation: string;
    reservationTime: Date;
}

const availableHours = Array.from({ length: 12 }, (_, index) => (index + 9).toString().padStart(2, '0'));


const CalendarHours: React.FC<CalendarHoursProps> = ({ onDateTimeSelect }) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [isSlotAvailable, setIsSlotAvailable] = useState(true);


    const consultAPI = async () => {
        const url = 'http://186.64.113.85:3001/reservation/getAllReservations';
        try {
            const rep = await fetch(url);
            const res = await rep.json();
            setReservations(res);
            console.log(res);
        } catch (error) {
            console.error('Error fetching reservations', error);
        }
    };
    useEffect(() => {
        consultAPI();
    }, []);

    useEffect(() => {
        const fetchAvailability = async () => {
            // Llamada al servidor para verificar la disponibilidad
            // Implementa la lógica según tu backend
            // En este ejemplo, siempre se establece como disponible para fines de demostración
            setIsSlotAvailable(true);
        };
        if (areBothSelected(selectedDate, selectedTime)) {
            fetchAvailability();
        }
    }, [selectedDate, selectedTime]);

    const handleDateTimeSelect = (date: Date, time: Date) => {
        if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
            // No permitir selección de días anteriores, excepto el día actual
            return;
        }
        const selectedDateTime = startOfDay(date); // Establecer la fecha a medianoche
        if (!isSameDay(selectedDateTime, selectedDate)) {
            setCurrentDate(date);
            setSelectedDate(date);
            onDateTimeSelect(selectedDateTime);
            console.log('Fecha seleccionada:', selectedDateTime.toISOString());
        } else {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
            setSelectedTime(new Date());
            onDateTimeSelect(null);
            console.log('Fecha y hora deseleccionadas');
        }
    };

    const handleDateSelect = (date: Date) => {
        // Agregar la condición para evitar que los domingos sean seleccionables
        if (date.getDay() === 0) {
            // Es domingo, no hacemos nada
            return;
        }
        const selectedDateTime = setSeconds(setMinutes(setHours(date, selectedTime.getHours()), selectedTime.getMinutes()), 0);
        if (!isSameDay(selectedDateTime, selectedDate)) {
            setCurrentDate(date);
            setSelectedDate(date);
            const dateAndTimeSelected = areBothSelected(selectedDateTime, selectedTime) ? selectedDateTime : null;
            onDateTimeSelect(dateAndTimeSelected);
            console.log('Fecha Seleccionada', date);
        } else {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
            onDateTimeSelect(null);
            console.log('Fecha y hora deseleccionadas');
        }
    };

    const handleTimeSelect = (time: Date) => {
        if (format(time, 'HH:mm') === 'not-selected') {
            // No se ha seleccionado una hora
            setSelectedTime(new Date());
            onDateTimeSelect(null);
        } else {
            // Se ha seleccionado una hora
            const selectedDateTime = new Date(selectedDate);
            selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

            // Mostrar la hora seleccionada en el DOM
            setSelectedTime(selectedDateTime);

            const dateAndTimeSelected = areBothSelected(selectedDate, selectedDateTime)
                ? selectedDateTime
                : null;

            onDateTimeSelect(dateAndTimeSelected);
            console.log('Fecha y hora seleccionadas:', dateAndTimeSelected);
        }
    };




    const areBothSelected = (date: Date, time: Date): boolean => {
        return date instanceof Date && time instanceof Date;
    };

    const daysInMonth = [];
    const today = new Date();

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDayOfMonth.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado

    const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    for (let i = 0; i < startingDay - 1; i++) {
        // Agregar días en blanco para ajustar el inicio al lunes
        daysInMonth.push(null);
    }

    for (let d = firstDayOfMonth; d <= lastDay; d = addDays(d, 1)) {
        const isPastDay = isBefore(d, today) && !isSameDay(d, today);
        const isSunday = d.getDay() === 0;

        daysInMonth.push({
            date: d,
            isPastDay,
            isSunday,
        });
    }

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="bg-neutral-900 text-white p-4 rounded-lg">
                    <h2 className="text-lg mb-4 text-center font-semibold">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {weekdays.map((day) => (
                            <div key={day} className="text-sm font-semibold">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((dayData, index) => (
                            <div
                                key={index}
                                className={`text-center p-2 rounded-full cursor-pointer ${dayData ? (dayData.isPastDay || dayData.isSunday ? 'bg-neutral-400 cursor-not-allowed' : '') : 'bg-neutral-400 cursor-not-allowed'
                                    } ${dayData && dayData.date && isSameDay(dayData.date, today) ? 'bg-blue-200' : ''} ${dayData && dayData.date && isSameDay(dayData.date, selectedDate) ? 'bg-green-600' : ''
                                    } ${!isSlotAvailable ? 'bg-red-500' : ''}`}
                                onClick={() => dayData && dayData.date && !dayData.isPastDay && handleDateSelect(dayData.date)}
                            >
                                {dayData ? format(dayData.date, 'd') : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-900 text-white p-4 rounded-lg mt-4">
                    <h2 className="text-xl mb-4 text-center font-semibold">Hora</h2>
                    <div className="text-center text-black">
                        <select
                            className={`rounded-lg ${!isSlotAvailable ? 'bg-red-500' : ''}`}
                            value={selectedTime ? format(selectedTime, 'HH:mm') : 'not-selected'}
                            onChange={(e) => handleTimeSelect(new Date(`1970-01-01T${e.target.value}:00`))}
                        >
                            <option value="not-selected">Hora</option>
                            {availableHours.map((hour) => (
                                <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                            ))}
                        </select>
                    </div>
                    {!isSlotAvailable && (
                        <p className="text-red-500 text-sm mt-2">Este slot no está disponible. Por favor, elige otro.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarHours;
