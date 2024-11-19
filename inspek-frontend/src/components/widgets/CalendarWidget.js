import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Importing the react-calendar library
import 'react-calendar/dist/Calendar.css'; 

const CalendarWidget = () => {
  const [value, setValue] = useState(new Date()); // Initialize with today's date

  const handleDateChange = (date) => {
    setValue(date); // Update state when a new date is selected
  };

  return (
    <div>
      <h3>Calendar</h3>
      <Calendar 
        onChange={handleDateChange} 
        value={value} 
      />
      <p>Selected Date: {value.toDateString()}</p>
    </div>
  );
};

export default CalendarWidget;
