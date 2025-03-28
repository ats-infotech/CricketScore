import { Select } from "@mui/material"

const InputSelect = ({ children, value, onChange, props, minWidth}) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            displayEmpty
            {...props}
            sx={{
                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                color: 'white',
                borderRadius: '25px!important',
                padding: '10px',
                fontWeight: 'bold',
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
                    fontSize: 'var(--small)',
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
                    color: 'var(--text-white)',
                    borderRadius: '10px',
                    outline: 'none',
                },
                '& .MuiSelect-icon': {
                    color: 'var(--text-white)',
                },
                '&:hover': {
                    transform: 'scale(1.02)',
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
                        background: 'var(--text-white)',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                        padding: '10px',
                        '& .MuiMenuItem-root': {
                            color: 'var(--primary-color)',
                            padding: '10px 15px !important',
                            fontSize: '16px',
                            transition: 'all 0.3s ease-in-out',
                            '&.MuiMenuItem-root:hover': {
                                color: 'var(--text-white)',
                                backgroundColor: 'var(--blue-background)',
                                transform: 'scale(1.05)',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                            },
                            '&.Mui-selected:hover': {
                                color: 'var(--text-white)',
                                backgroundColor: 'var(--blue-background)',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                                transform: 'scale(1.05)',
                            },
                            '&.MuiMenuItem-root.Mui-selected': {
                                // color: 'var(--text-white)',
                                // backgroundColor: 'var(--blue-background)',
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