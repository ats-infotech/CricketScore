'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { Box, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"
import './CustomeFileCss/CustomeBack.css'

const CustomeBack = ({ title, onclick, type, align }) => {
    const router = useRouter()

    const handleBack = () => {
        if (typeof onclick === 'function') {
            onclick()
        } else {
            typeof onclick === 'undefined'  && router.back(-1)
        }
    }

    return (
        <Box className='back_button_box' sx={{ marginBottom: type !== 'commonback' ? '10px' : '0px' }}>
            <SvgIcon id='down-arrow' className='backButtonIcon' onClick={handleBack} />
            {type !== 'commonback' && title && <Typography variant="p" className="backButtonNearText" sx={{ textAlign: align || 'left', width: '75%' }}>{title}</Typography>}
        </Box>
    )
}

export default React.memo(CustomeBack)