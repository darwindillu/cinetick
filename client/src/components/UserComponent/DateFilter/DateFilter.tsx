import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import './DateFilter.css';

interface DateFilterProps {
    handleDateSelect: (date: any) => void; // Ensure the function expects a date and returns nothing (void)
  }

const DateFilter:React.FC<DateFilterProps> = ({handleDateSelect}:any) => {

  const [nextTenDays, setNextTenDays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [searchedText,setSearchedText] = useState<string>('')

  useEffect(() => {
    generateNextTenDays();
  }, []);

  const handleSearchText = (e:React.ChangeEvent<HTMLInputElement>) =>{
    setSearchedText(e.target.value)
  }


  const generateNextTenDays = () => {
    const today = new Date();
    const daysArray = [];
    for (let i = 0; i < 10; i++) {
      const date = addDays(today, i);
      daysArray.push({
        date: format(date, 'dd'),
        day: format(date, 'EEE'),
        month: format(date, 'MMM'),
        isToday: i === 0
      });
    }
    setNextTenDays(daysArray);
  };

  const selectDate = (day:any) => {
    setSelectedDate(day);
    console.log(day,'This is selected date');
    
    handleDateSelect(day)
    console.log('Selected date:', day);
  };

  return (
    <div className="date-filter-container">
      {/* Date Buttons */}
      <div className="date-buttons">
        {nextTenDays.map((day:any, index:any) => (
          <button
            key={index}
            className={`date-button ${selectedDate === day ? 'active' : ''}`}
            onClick={() => selectDate(day)}
          >
            <div className="month">{day.month}</div>
            <div className="date" style={{color:'black'}}>{day.date}</div>
            <div className="day">{day.day}</div>
          </button>
        ))}
      </div>

      {/* Filter and Search Component */}
      <div className="filter-search">
        <input type="text"
         value={searchedText}
         onChange={handleSearchText}
         placeholder='Search for theatres'
        />
      </div>
    </div>
  );
};

export default DateFilter;
