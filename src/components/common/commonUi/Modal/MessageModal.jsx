import { Box, Dialog, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import ErrorGif from '../../../../assets/img/Error.gif';
import successGif from '../../../../assets/img/login-successfull.gif';
import leftfireworkgif from '../../../../assets/img/toss/leftfirework.gif';
import fireworkgif from '../../../../assets/img/toss/rightfirework.gif';
import CustomeButton from '../CustomeButton';
import './MessageModal.css';

const MessageModal = ({ open, handleClose, handleSubmit, success, message, processing, type }) => {
    const [isClosing, setIsClosing] = useState(false);
    const gif = success ? successGif : ErrorGif

    const handleDialogClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            handleClose();
        }, 300);
    };
    return (
        open &&
        <Dialog onClose={() => { }} open={open} sx={{
            '.MuiDialog-container': {
                maxWidth: 'var(--layout-max-width)',
                margin: '0 auto',
                // transform: 'translateX(-8px)'
            },
            '.MuiPaper-root': {
                backgroundColor: 'transparent',
                boxShadow: 'var(--shadow-popup)',
                borderRadius: '30px',
                // maxWidth:'400px',
                width: '100%'
            },
            overflow: 'hidden'
        }}
            TransitionProps={{
                onExited: () => setIsClosing(false),
            }}
        >
            <Box className={`message-alert-box ${success ? 'success' : 'error'} 
                ${isClosing ? 'closing' : ''}`}
            >
                <Box className='warning-message' sx={{zIndex: 10, position: 'relative'}}>
                    <Box className='gif-box'>
                        <Image unoptimized src={gif} alt='alert gif' width={100} height={100} />
                    </Box>
                    <Typography variant='h6' className={success ? 'success' : 'error'}>{success ? 'Success' : 'Warning'}</Typography>
                </Box>
                <Typography variant='body2' sx={{zIndex: 10, position: 'relative'}}>{processing ? 'Wait a Secounds...' : message}</Typography>
                {
                    !processing &&
                    <Box className='btn-group' sx={{zIndex: 10, position: 'relative'}}>
                        {!success && <CustomeButton
                            title={"No"}
                            width={'45%'}
                            height={'50px'}
                            hover={'none'}
                            border={'1px solid var(--color-grey-300)'}
                            bgColor={'transparent'}
                            color={'var(--color-grey-400)!important'}
                            onClick={handleClose}
                        />}
                        <CustomeButton
                            title={type === 'login' ? 'Confirm' : success ? 'Continue' : "Yes"}
                            width={success ? '100%' : '45%'}
                            height={'50px'}
                            hover={'none'}
                            onClick={success ? handleClose : handleSubmit}
                        />
                    </Box>
                }
                {type === "login" &&
                    <Box sx={{ position: 'absolute', display: 'flex', bottom: 0, overflow: 'hidden', gap: '20px', left: -10 }}>
                        <Box>
                            <Box sx={{ height: '150px', transform: 'rotate(45deg)'}}>
                                <Image unoptimized src={leftfireworkgif} alt="gif" height={500} width={500} />
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ height: '150px', transform: 'rotate(-45deg)'}}>
                                <Image unoptimized src={fireworkgif} alt="gif" height={500} width={500} />
                            </Box>
                        </Box>
                    </Box>
                }
            </Box>
        </Dialog>
    )
}

export default MessageModal