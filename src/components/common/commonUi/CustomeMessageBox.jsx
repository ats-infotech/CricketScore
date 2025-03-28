import SvgIcon from "@/assets/icons/SvgIcon"
import { Box, Typography } from "@mui/material"
import './CustomeFileCss/CustomeMessageBox.css'

const CustomeMessageBox = ({ icon, title, describe, children }) => {
    return (
        <Box className='custome_message_box'>
            {icon && <SvgIcon id={icon} width={60} height={60} />}
            {title && <Typography variant="h6">{title}</Typography>}
            {describe && <Typography variant="p" className="message_text">{describe}</Typography>}
            {children && children}
        </Box>
    )
}

export default CustomeMessageBox