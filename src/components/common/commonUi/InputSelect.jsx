import { Select } from "@mui/material"

const InputSelect = ({ children, value, onChange, props, minWidth, borderRadius, bgColor, labelfont, color, fontWeight }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            displayEmpty
            {...props}
            sx={{
                background: bgColor ? bgColor : 'linear-gradient(135deg, #1e3c72, #2a5298)',
                color: color ? color : 'white',
                borderRadius: borderRadius ? borderRadius : '25px!important',
                padding: '10px',
                fontWeight: fontWeight ? fontWeight : 'bold',
                minWidth: minWidth ? minWidth : '120px',
                maxWidth: minWidth ? minWidth : '120px',
                height:"40px",
                position:'realtive',
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    padding:'0 !important'
                },
                '& .MuiInputBase-input': {
                    border: 'none',
                    padding:'0 10px !important',
                    fontSize: labelfont ? labelfont : 'var(--fs-md)',
                    position:'absolute',
                    top:'0',
                    right:'0',
                    left:'6px',
                    bottom:'0',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'flex-start',
                    width:'auto'
                },
                '& .MuiInputBase-root': {
                    fontWeight: '500',
                    fontFamily: 'var(--primary-font)',
                    height: '40px',
                    color: 'var(--color-white)',
                    borderRadius: '10px',
                    outline: 'none',
                },
                '& .MuiSelect-icon': {
                    color: 'var(--color-white)',
                },
                '&:hover': {
                    // transform: 'scale(1.02)',
                    // background: 'linear-gradient(135deg, #1e3c72, #344a72)',
                },
                '&.Mui-focused': {
                    // background: 'linear-gradient(135deg, #1e3c72, #23395d)',
                },
            }}
            MenuProps={{
                PaperProps: {
                    sx: {
                        borderRadius: '10px',
                        background: 'var(--color-white)',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                        padding: '10px',
                        '& .MuiMenuItem-root': {
                            color: 'var(--theme-primary)',
                            padding: '10px 15px !important',
                            fontSize: '16px',
                            transition: 'all 0.3s ease-in-out',
                            '&.MuiMenuItem-root:hover': {
                                color: 'var(--color-white)',
                                backgroundColor: 'var(--theme-blue-bg)',
                                transform: 'scale(1.05)',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                            },
                            '&.Mui-selected:hover': {
                                color: 'var(--color-white)',
                                backgroundColor: 'var(--theme-blue-bg)',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                                transform: 'scale(1.05)',
                            },
                            '&.MuiMenuItem-root.Mui-selected': {
                                // color: 'var(--color-white)',
                                // backgroundColor: 'var(--theme-blue-bg)',
                                // transform: 'scale(1.05)',
                            },
                        },
                    },
                },
            }}
        >
            {children}
        </Select>
    )
}

export default InputSelect