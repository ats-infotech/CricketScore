import { Box } from '@mui/material'
import Image from 'next/image'
import loader from '../../../assets/img/appLoder.gif'
import './CustomeFileCss/Loader.css'

const Loader = () => {
    return (
        <Box className='loader_main'>
            <Box className='loader_image'>
                <Image src={loader} alt='loader' width={100} height={100} />
            </Box>
        </Box>
    )
}

export default Loader