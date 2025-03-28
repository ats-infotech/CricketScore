import { Box } from "@mui/material"
import { useRouter } from "next/navigation"
import CustomeBack from "./CustomeBack"



const CommonBack = ({ onClick, title }) => {
    const router = useRouter()

    const handleBackFuction = () => {
        if (typeof onClick === 'function') {
            onClick()
        } else {
            router.back(-1)
        }
    }
    return (
        <Box className='back-box' onClick={handleBackFuction}>
            {/* <Box className='btn_box'> */}
            <CustomeBack onclick={'onClick'} type={'commonback'} />
            {/* </Box> */}
        </Box>
    )
}

export default CommonBack