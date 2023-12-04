import React, { useState } from 'react';
import { format, addDays, isSameDay, isBefore } from 'date-fns';

interface CalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const CalendarHours: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDaySelected, setIsDaySelected] = useState(false);

    const handleDateSelect = (date: Date) => {
        if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
            // No permitir selección de días anteriores, excepto el día actual
            return;
        }

        const selectedDateWithoutTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        if (!isSameDay(selectedDateWithoutTime, selectedDate)) {
            setCurrentDate(date);
            onDateSelect(selectedDateWithoutTime);
            setIsDaySelected(true);
            console.log('Día seleccionado:', selectedDateWithoutTime);
        } else {
            setCurrentDate(new Date());
            onDateSelect(new Date());
            setIsDaySelected(false);
            console.log('Día deseleccionado');
        }
    };

    const daysInMonth = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let d = firstDay; d <= lastDay; d = addDays(d, 1)) {
        daysInMonth.push(d);
    }

    return (
        <div className="bg-neutral-900 text-white p-4 rounded-lg">
            <h2 className="text-lg mb-4 text-center font-semibold">
                {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center">
                {['We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu'].map((day) => (
                    <div key={day} className="text-sm font-semibold">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, index) => (
                    <div
                        key={index}
                        className={`text-center p-2 rounded-full cursor-pointer ${isBefore(day, new Date()) && !isSameDay(day, new Date()) ? 'bg-neutral-700' : ''
                            } ${isSameDay(day, new Date()) ? 'bg-blue-200' : ''} ${isSameDay(day, selectedDate) ? 'bg-green-600' : ''
                            }`}
                        onClick={() => handleDateSelect(day)}
                    >
                        {format(day, 'd')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarHours;