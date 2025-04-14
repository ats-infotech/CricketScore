import { FormControl, MenuItem } from "@mui/material";
import InputSelect from "./InputSelect";

const CustomSelectInput = ({ value, label, onChange, options, disabled = false, disabledOptions = [], minWidth, borderRadius, bgColor, labelfont, color, fontWeight }) => {
     
    return (
        <FormControl >
            {/* <InputLabel
                sx={{
                    color: 'var(--text-white)',
                    '&.Mui-focused': {
                        color: 'var(--text-white)',
                    },
                    '&': {
                        transform: value ? 'translate(14px, -6px) scale(0.75)' : 'translate(14px, 16px) scale(1)',
                        transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    },
                }}
                id="demo-simple-select-label"
            >
                {label}
            </InputLabel> */}
            <InputSelect
                // labelId="demo-simple-select-label"
                // id="demo-simple-select"
                value={value || ""}
                label={label}
                onChange={onChange}
                disabled={disabled}
                minWidth={minWidth}
                borderRadius={borderRadius}
                bgColor={bgColor}
                labelfont={labelfont}
                color={color}
                fontWeight={fontWeight}
            // sx={{
            //     backgroundColor: 'var(--blue-background)',
            //     color: 'var(--text-white)',
            //     '& .MuiSvgIcon-root': {
            //         color: 'var(--text-white)',
            //     },
            //     '&.Mui-focused': {
            //         border: 'none',
            //     },
            //     '& .MuiOutlinedInput-notchedOutline': {
            //         border: 'none',
            //     },
            //     '&:hover': {
            //         border: 'none',
            //     },
            // }}
            >
                {options && options.length > 0 ? (
                    [
                        <MenuItem sx={{ fontWeight: 'bold', color: 'white' }} key={label} value={''}>{label}</MenuItem>,
                        ...options.map((item,i) => (
                            <MenuItem
                                key={i}
                                value={item.key}
                                disabled={disabledOptions.includes(item.key)}
                                sx={{ fontWeight: 'bold', color: 'white' }}
                            >
                                {item.name}
                            </MenuItem>
                        ))
                    ]
                ) : (
                    <MenuItem disabled sx={{ fontWeight: 'bold', color: 'white' }}>No options available</MenuItem>
                )}
            </InputSelect>
        </FormControl>
    );
};

export default CustomSelectInput;
