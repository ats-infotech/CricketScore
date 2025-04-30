import SvgIcon from '@/assets/icons/SvgIcon'
import { Box, Typography } from '@mui/material'
import './SectionBox.css'

const SectionBox = ({ icon, title, description, children, sx, type, className }) => {
    return (
        <Box className={`section-box ${className}`} sx={{ ...sx }}>
            <Box className='iconText'>
                {icon &&
                    <Box sx={{ padding: '0 0 8px 0' }}>
                        <SvgIcon id={icon}   />
                    </Box>
                }
                {title && <Typography variant='body2'>{title}</Typography>}
            </Box>
            {description && <Typography variant='body2' className='describeText'>Quickly Add teams From Your Network.</Typography>}
            {children}
        </Box>
    )
}

export default SectionBox