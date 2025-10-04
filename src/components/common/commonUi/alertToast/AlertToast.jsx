import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useMediaQuery } from '@mui/material';
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
// import { useAuth } from '../../context/loginContext';

const AlertToast = ({ open, handleClose, success, message }) => {
    const smalldevice = useMediaQuery('(max-width:480px)')
    // const { isAuthenticated } = useAuth();

    // toast close on click only
    const handleCloseEvent = (event, reason) => {
        if (reason === 'clickaway' && !smalldevice) {
            return;
        }
        handleClose()
    };

    return (
        open &&
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleCloseEvent}
            anchorOrigin={{ vertical: "top", horizontal: smalldevice ? "center" : "right" }}
        >
            <Alert
                severity="success"
                icon={false}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: success ? "var(--light-green)" : 'var(--light-red)',
                    color: "#000",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    '& .MuiAlert-message': {
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: '250px',
                        justifyContent: 'space-between'
                    }
                }}
            >
                {/* Success Icon */}
                {<Box
                    sx={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                    }}
                >
                    {success ?
                        <CheckCircleOutlineOutlinedIcon sx={{ color: "var(--green)", fontSize: 24 }} />
                        :
                        <ErrorOutlineOutlinedIcon sx={{ color: "var(--red)", fontSize: 24 }} />

                    }
                </Box>
                }
                {/* Text Content */}
                <Box sx={{ flex: 1 }}>
                    <strong>{message}</strong>
                    {/* <br />
                    {
                        isAuthenticated &&
                        <span style={{ fontSize: "14px", color: "var(--grey-light)" }}>
                            Redirecting to Dashboard
                        </span>
                    } */}
                </Box>

                {/* Close Button */}
               {!smalldevice && <IconButton
                    size="small"
                    onClick={handleCloseEvent}
                    sx={{ marginLeft: "auto", color: "var(--black)" }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>}
            </Alert>
        </Snackbar>
    )
}

export default AlertToast;