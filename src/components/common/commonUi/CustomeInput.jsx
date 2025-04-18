"use client"
import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import './CustomeFileCss/CustomeInput.css';
import DateTimePickers from "./DateTimePickers";

const CustomeInput = ({ tournament, placeholder, keyName, label, type, value = '', onChange, error, startDate, disabled, onClick, readOnly = false, ampm }) => {
    const openTornamentEndDate = (type === 'date' && keyName === 'tournament_end_date' && !startDate)
    const openAutoMatchEndDate = (type === 'datetime-local' && keyName === 'match_end_date' && !startDate)
    const isDateType = type === 'date' || type === 'datetime-local' || type === 'time';
    const isDate = type === 'date' || type === 'datetime-local'
    const inputRef = useRef(null);
    
    const handleOnChange = (val, keyName) => {
        let value = val
        if (value?.length === 1 && value?.[0] === ' ') {
            return;
        }
        if (isDateType) {
            if (type !== 'time') {
                if (type === 'datetime-local') {
                    if (val && !(val instanceof Date)) {
                        value = new Date(val);
                    }
                    value = value instanceof Date && !isNaN(value) ? value.toISOString() : null;
                } else {
                    value = val ? new Date(val).toISOString() : null
                }
            }
        }
        onChange(value, keyName);
    }

    const handleFocus = () => {
        if (inputRef.current && isDateType) {
            if (inputRef.current.showPicker) {
                inputRef.current.showPicker();
            } else {
                inputRef.current.click();
            }

            const handleChange = () => {
                inputRef.current.blur();
                inputRef.current.removeEventListener('change', handleChange);
            };

            inputRef.current.addEventListener('change', handleChange);
        }
    };

    const handleOnlyNumbers = (event, keyName) => {
        if (type === 'number') {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
            if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
                event.preventDefault();
            }
        }
    }

    const getMinValue = () => {
        let minDate = tournament && tournament?.tournament_start_date
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        const formattedTime = now.toISOString().split('T')[1].slice(0, 5);

        if (type === 'number') return 0;
        if (type === 'date') {
            if (keyName === 'tournament_start_date') {
                return formattedDate
            } else {
                if (startDate && keyName === 'tournament_end_date') {
                    return startDate
                }
            }
        }

        if (type === 'datetime-local' && minDate) {
            if (keyName === 'match_start_date' || keyName === 'match_start_time') {
                const StartDate = new Date(minDate)
                const timezoneOffset = StartDate.getTimezoneOffset();
                StartDate.setMinutes(StartDate.getMinutes() - timezoneOffset);
                const endFormattedDate = StartDate.toISOString().split('T')[0];
                const endFormattedTime = StartDate.toISOString().split('T')[1].slice(0, 5);
                return `${endFormattedDate}T${endFormattedTime}`;
            } else {
                if (startDate && keyName === 'match_end_date') {
                    const start = new Date(startDate);
                    const startFormattedDate = start.toISOString().split('T')[0];
                    const startFormattedTime = start.toISOString().split('T')[1].slice(0, 5);
                    return `${startFormattedDate}T${startFormattedTime}`;
                }
            }
        }

        if (type === 'time') {
            return formattedTime
        }
        return '';
    };

    const getMaxValue = () => {
        let maxDate = tournament && tournament?.tournament_end_date
        let isActive = (keyName === 'match_start_date' || keyName === 'match_end_date' || keyName === 'match_start_time')

        if (type === 'time') {
            return '23:59';
        }

        if (maxDate && type === 'datetime-local' && isActive) {
            const endDate = new Date(maxDate);
            const timezoneOffset = endDate.getTimezoneOffset();
            endDate.setMinutes(endDate.getMinutes() - timezoneOffset);
            const endFormattedDate = endDate.toISOString().split('T')[0];
            const endFormattedTime = endDate.toISOString().split('T')[1].slice(0, 5);
            return `${endFormattedDate}T${endFormattedTime}`;
        }
        return ''
    }

    // const handleWheel = (e) => {
    //     e.preventDefault();
    // };

    let openEndDate = (keyName === 'match_end_date' ? openAutoMatchEndDate : openTornamentEndDate)
    let dateType = type === 'datetime-local' ? 'datetime' : type === 'date' ? 'date' : type === 'time' ? 'time' : ''

    return (
        <Box className='custome_input'>
            <label>{label}</label>
            {
                (type === 'datetime-local' || type === 'date' || type === 'time') ?
                    <DateTimePickers
                        type={type}
                        disabled={openEndDate}
                        value={value}
                        min={getMinValue()}
                        max={getMaxValue()}
                        keyName={keyName}
                        onChange={handleOnChange}
                        ampm={ampm}
                    />
                    :
                    <input
                        placeholder={isDate ? 'MM/DD/YYYY' : placeholder}
                        name={dateType ? dateType : type}
                        id={dateType ? dateType : type}
                        type={type === 'number' ? 'tel' : type}
                        ref={inputRef}
                        onClick={onClick ? onClick : handleFocus}
                        value={value}
                        // onWheel={handleWheel}
                        onKeyDown={(e) => handleOnlyNumbers(e, keyName)}
                        className={`${openEndDate ? '' : 'notOpen'}`}
                        onChange={(e) => handleOnChange(e.target.value, keyName)}
                        min={getMinValue()}
                        max={getMaxValue()}
                        aria-label={dateType ? dateType : label}
                        disabled={disabled ? disabled : openEndDate}
                        readOnly={readOnly}
                    />
            }
            {error && <Typography color="error" variant="body2" sx={{ fontSize: "var(--ex-small)", padding: '6px 10px 0' }}>{error}</Typography>}
        </Box>
    )
}

export default CustomeInput