'use client'
import { CommonText } from "@/components/common/commonText";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { Box, Typography } from "@mui/material";
import { useQRCode } from "next-qrcode";
import './About.css';

const About = ({ tournamentData }) => {

    const { Canvas } = useQRCode();

    return (
        <Box className='qrHeight'>
            <Box className='qr_main_section'>
                <Box className='qr_title'>
                    <Typography variant="body2" >{CommonText.TournamentQr}</Typography>
                </Box>
                <Box className='qr_section'>
                    <Box className='qr_main_section' >
                        <Canvas
                            text={`${window.location.origin}/tournament/${tournamentData?.id}`}
                            options={{
                                errorCorrectionLevel: 'H',
                                margin: 3,
                                scale: 4,
                                width: 170,
                                color: {
                                    dark: '#fff',
                                    light: '#f0f8ff00',
                                },
                            }}
                        />
                    </Box>
                </Box>
                <Box className='qr_sub_title'>
                    <Typography variant="body2" >{CommonText.TournamentQrDesc}</Typography>
                </Box>
                <Box>
                    <CustomeButton
                        title={CommonText.Share}
                        icon={'share-line'}
                        width={'170px'}
                        height={'50px'}
                        borderRadius={'15px'}
                        bgColor={'var(--theme-primary)'}
                        color={'var(--color-white)'}
                        hoverbg={'var(--color-white)'}
                        hovertext={'var(--theme-primary)'}
                        iconWidth={24}
                        iconHeight={24}
                        // onClick={() => setAddPlayerManual(true)}
                    />
                </Box>
            </Box>

        </Box>
    )
}

export default About