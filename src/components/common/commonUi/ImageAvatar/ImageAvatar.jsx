import { Box, Typography, useMediaQuery } from "@mui/material"
import React from "react"

const ImageAvatar = (props) => {
    const {
        bgColor = '',
        color = '',
        text = '',
        borderRadius = '50%',
        height = '100%',
        width = '100%',
        fontSize = 'var(--fs-2xl)',
        smallHeight = '100%',
        smallWidth = '100%',
        meduimHeight = '100%',
        meduimWidth = '100%'
    } = props
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')

    return (
        <Box sx={{
            backgroundColor: bgColor,
            width: sm ? smallWidth : md ? meduimWidth : width,
            height: sm ? smallHeight : md ? meduimHeight : height,
            borderRadius: borderRadius,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Typography variant="h6" sx={{ fontSize: fontSize, color: 'var(--color-white)', fontWeight: '600' }}>{text}</Typography>
        </Box>
    )
}

export default React.memo(ImageAvatar)