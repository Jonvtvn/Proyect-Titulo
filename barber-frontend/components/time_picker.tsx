import React, { useState } from 'react';

interface TimePickerProps {
  selectedDate: Date;
  onTimeSelect: (time: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedDate, onTimeSelect }) => {
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleTimeChange = (time: Date) => {
    // Redondear al siguiente múltiplo de 1 hora
    const roundedTime = new Date(Math.ceil(time.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000));

    setSelectedTime(roundedTime);
    onTimeSelect(roundedTime);
    console.log('Hora seleccionada:', roundedTime.toTimeString().split(' ')[0]);
  };

  return (
    <div className="bg-neutral-900 text-white p-4 rounded-lg">
      <h2 className="text-xl mb-4 text-center font-semibold">Hora</h2>
      <div className="text-center text-black">
        <input
          className='rounded-lg'
          type="time"
          step={60 * 60} // Configurar el paso a 1 hora
          value={selectedTime.toISOString().substr(11, 8)}
          onChange={(e) => handleTimeChange(new Date(`1970-01-01T${e.target.value}`))}
        />
      </div>
    </div>
  );
};

export default TimePicker;
