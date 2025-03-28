import { Box, Dialog, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import successGif from '../../../../assets/img/login-successfull.gif';
import ErrorGif from '../../../../assets/img/Error.gif';
import CustomeButton from '../CustomeButton';
import './MessageModal.css';

const MessageModal = ({ open, handleClose, handleSubmit, success, message, processing }) => {
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
        <Dialog onClose={() => {}} open={open} sx={{
            '.MuiDialog-container': {
                maxWidth:'var(--screen-max-width)',
                margin:'0 auto',
                // transform: 'translateX(-8px)'
            },
            '.MuiPaper-root': {
                backgroundColor: 'transparent',
                boxShadow: 'var(--alert-popup-shadow)',
                borderRadius: '30px',
                // maxWidth:'400px',
                width:'100%'
            }
        }}
            TransitionProps={{
                onExited: () => setIsClosing(false),
            }}
        >
            <Box className={`message-alert-box ${success ? 'success' : 'error'} 
                ${isClosing ? 'closing' : ''}`}
            >
                <Box className='warning-message'>
                    <Box className='gif-box'>
                        <Image unoptimized src={gif} alt='alert gif' width={100} height={100} />
                    </Box>
                    <Typography variant='h6' className={success ? 'success' : 'error'}>{success ? 'Success' : 'Warning'}</Typography>
                </Box>
                <Typography variant='body2'>{processing ? 'Wait a Secounds...' : message}</Typography>
                {
                    !processing &&
                        <Box className='btn-group'>
                            {!success && <CustomeButton
                                title={"No"}
                                width={'45%'}
                                height={'50px'}
                                hover={'none'}
                                border={'1px solid var(--text-grey)'}
                                bgColor={'transparent'}
                                color={'var(--gray)!important'}
                                onClick={handleClose}
                            />}
                            <CustomeButton
                                title={success ? 'Continue' : "Yes"}
                                width={success ? '100%' : '45%'}
                                height={'50px'}
                                hover={'none'}
                                onClick={success ? handleClose : handleSubmit}
                            />
                        </Box>
                }
            </Box>
        </Dialog>
    )
}

export default MessageModal