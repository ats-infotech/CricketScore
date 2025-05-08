import SvgIcon from '@/assets/icons/SvgIcon';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CustomeFileCss/CustomeCommon.css';

export const SwipeUpDrawer = React.memo(({ open, children, onClose, backgroundColor, closeIconShow, ref, id, maxHeight }) => {
    const [drawerHeight, setDrawerHeight] = useState(0);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                const drawerElement = document.querySelector('.MuiDrawer-paper');
                if (drawerElement) {
                    setDrawerHeight(drawerElement.clientHeight);
                }
            }, 100); 
        }
    }, [open, children]);
    
    return (
        <>
            {open && (
                <Box sx={{ width: '100%', position: 'fixed', bottom: `${drawerHeight + 12}px` || '94%', zIndex: 1000, maxWidth: '440px', left: 0, right: 0, margin: '0 auto' }}>
                    <CloseIcon
                        sx={{
                            margin:'0 auto',
                            display:'block',
                            color:'var(--color-black)',
                            backgroundColor: 'var(--color-white)',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            borderRadius:'50px',
                            padding:'5px'
                           
                        }}
                        onClick={onClose}
                    />
                </Box>
            )}
            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => { }}
                disableScrollLock
                disableEscapeKeyDown
                // hideBackdrop
                keepMounted={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    position: 'relative',
                    maxWidth: 'var(--layout-max-width)',
                    zIndex: '10',
                    '& .MuiDrawer-paper': {
                        borderRadius: '40px 40px 0 0',
                        padding: '50px 30px 20px',
                        scrollbarColor: 'transparent transparent',
                        backgroundColor: backgroundColor || 'var(--theme-primary)',
                        zIndex: '10',
                        maxHeight: maxHeight || '92%',
                        maxWidth: 'var(--layout-max-width)',
                        margin: 'auto',
                        scrollbarWidth: 'none'
                    }
                }}
                ref={ref}
                id={'drawerId'}
            >
                {/* {!closeIconShow && <CloseIcon sx={{ position: 'absolute', top: '-35px', right: '-10px', color: 'var(--color-white)', width: '24px', height: '24px', cursor: 'pointer' }} onClick={onClose} />} */}
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }} ref={ref} >
                    {children}
                </Box>
            </Drawer>
        </>
    )
})

export const TitleBox = React.memo(({ title, icon }) => {
    return (
        <Box className='title_box'>
            <Box className='child_box'>
                {icon && <SvgIcon id={icon} width={18} height={18} />}
                {title && <Typography variant="body2" className='title'>{title}</Typography>}
            </Box>
            <Box className='gradiant_box'></Box>
        </Box>
    )
})

export const BlueInput = React.memo(({ placeholder, type, value, onChange, error, disabled }) => {

    const onChangeHandler = (e) => {
        let val = e.target.value
        let value = val
        if (value?.length === 1 && value?.[0] === ' ') {
            return;
        }
        onChange(e)
    }

    const handleOnlyNumbers = (event, keyName) => {
        if (type === 'number') {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
            if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
                event.preventDefault();
            }
        }
    }

    return (
        <Box sx={{ display: 'block', width: '100%' }}>
            <input placeholder={placeholder} type={type === 'number' ? 'tel' : type} value={value} onChange={onChangeHandler} className='blue_input' disabled={disabled} onKeyDown={(e) => handleOnlyNumbers(e)} />
            {error && <Typography variant='body2' color='error' className='errorMessageText'>{error}</Typography>}
        </Box>
    )
})