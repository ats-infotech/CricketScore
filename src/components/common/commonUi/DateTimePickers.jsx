import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import './CustomeFileCss/DateTimePickers.css';

export default function DateTimePickers({ type, keyName, disabled, value, min, max, onChange, className }) {
  const validValue = dayjs(value);
  const mindate = dayjs(min).isValid() ? dayjs(min).startOf('day') : null
  const maxdate = dayjs(max).isValid() ? dayjs(max).endOf('day') : null


  const handleDateTimeChange = (newValue) => {
    if (type === 'time' && newValue) {
      onChange(newValue.format('HH:mm:ss'), keyName);
    } else {
      onChange(newValue, keyName);
    }
  }

  useEffect(() => {
    let doc = document.getElementsByClassName('')
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[type === 'date' ? 'MobileDatePicker' : type === 'time' ? 'MobileTimePicker' : 'DateTimePicker']}
      >
        {
          type === 'date' ?
            <MobileDatePicker
              value={validValue.isValid() ? validValue : null}
              onChange={(newValue) => handleDateTimeChange(newValue)}
              minDate={mindate}
              maxDate={maxdate}
              format="DD/MM/YYYY"
              className={className}
              disabled={disabled}
            />
            : type === 'time' ?
              <MobileTimePicker
                value={validValue.isValid() ? validValue : null}
                views={['hours', 'minutes', 'seconds']}
                onChange={(newValue) => handleDateTimeChange(newValue)}
                className={className}
                ampm={false}
              />
              :
              <MobileDateTimePicker
                value={validValue.isValid() ? validValue : null}
                onChange={(newValue) => handleDateTimeChange(newValue)}
                minDateTime={mindate}
                maxDateTime={maxdate}
                className={className}
                disabled={disabled}
              />
        }
      </DemoContainer>
    </LocalizationProvider>
  );
}
