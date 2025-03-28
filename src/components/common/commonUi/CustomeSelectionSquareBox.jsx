import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import ImageAvatar from "./ImageAvatar/ImageAvatar";

export const ImageBox = React.memo(({ src, title, width, height, onClick, isActive, margin, letter, color }) => {
    return (
        <Box sx={{
            width: width ? width : '100px',
            zIndex: '1',
        }}>
            <Box sx={{
                backgroundColor: 'var(--primary-color)',
                boxShadow: isActive ? 'var(--shadow-dark)' : 'var(--shadow-light)',
                width: width ? width : '100px',
                height: height ? height : '100px',
                padding: '15px',
                borderRadius: '10px',
                margin: margin ? margin : '0 0 20px 0',
                border: isActive ? '2px solid var(--text-white)' : 'none',
                '&:hover': {
                    border: '2px solid var(--text-white)',
                    boxShadow: 'var(--shadow-dark)',
                    // padding: '22px',
                },
                cursor: 'pointer'
            }} onClick={onClick}>
                {src && <Image unoptimized src={src} alt='kit' width={1500} height={1500} style={{ objectFit: 'contain', borderRadius: '10px' }} />}
                {!src && <ImageAvatar text={letter} bgColor={color} width={'100%'} height={'100%'} smallHeight={'100%'} smallWidth={'100%'} meduimHeight={'100%'} meduimWidth={'100%'} borderRadius={'10px'} />}
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'center', color: isActive ? 'var(--text-white)' : `var(--text-grey)` }}>{title}</Typography>
        </Box>
    )
})

export const TeamSelection = React.memo(({ src, name, isActive, onClick, sx, width, height, imgheight, imgwidth, className, letter, color }) => {
    let Name = name.length > 16 ? name.slice(0, 16) + '...' : name
    return (
        <Box>
            <Box sx={{ height: height ? height : '150px', width: width ? width : '150px', backgroundColor: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px' }}>
                <ImageBox
                    src={src}
                    width={imgwidth ? imgwidth : 100}
                    height={imgheight ? imgheight : 100}
                    margin={'0px'}
                    isActive={isActive}
                    onClick={onClick}
                    letter={letter}
                    color={color}
                />
            </Box>
            <Box sx={{ marginTop: '15px' }}>
                <Typography variant="body2"
                    className={className}
                    sx={{
                        ...sx,
                        textAlign: 'center',
                        fontFamily: 'var(--primary-font)',
                        fontWeight: 600
                    }}
                >{Name}</Typography>
            </Box>
        </Box>
    )
})