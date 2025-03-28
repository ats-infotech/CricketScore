import SvgIcon from "@/assets/icons/SvgIcon"
import { Box, Typography } from "@mui/material"
import './CustomeFileCss/CustomeErrorBox.css'

const CustomeErrorBox = ({ icon, title }) => {
    return (
        <Box className='custome_error_box'>
            {icon && <SvgIcon id={icon} width={24} height={24} />}
            {title && <Typography variant="h6">{title}</Typography>}
        </Box>
    )
}

export default CustomeErrorBox