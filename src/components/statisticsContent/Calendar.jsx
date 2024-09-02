import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export default function Calendar({ onDateChange }) {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date); // Send the selected date to the parent component via the prop
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate}
        onChange={handleDateChange}
        sx={{
          '.MuiPickersCalendarHeader-switchViewButton': {
            color: 'black',
          },
          '.MuiPickersCalendarHeader-label': {
            color: 'black',
          },
          '.MuiPickersYear-yearButton': {
            color: 'black',
          },
          '.MuiPickersMonth-root': {
            color: 'black',
          },
        }}
      />
    </LocalizationProvider>
  );
}
