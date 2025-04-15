import { Dialog } from "@mui/material"

const CustomeModal = ({ open, onClose, children, bgColor }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                maxWidth: 'var(--screen-max-width)',
                margin: '0 auto',
                '.MuiPaper-root': {
                    backgroundColor: bgColor || "var(--primary-color)",
                    borderRadius: '20px',
                    width: '100%'
                }
            }}
        >{children}</Dialog>
    )
}

export default CustomeModal