'use client'
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"
import banner from '../../../../assets/img/banner.png'
import './FootballBanner.css'

const LogoImage = React.memo(({ src, props, style, type }) => {
    return (
        <Box className={`logo_image ${type === "score" ? 'score' : ""}`}>
            <Image unoptimized src={src} alt="logo" width={100} height={100} style={style} {...props} />
        </Box>
    )
})

const LogoImageBox = React.memo(({ image, type, team, name }) => {
    return (
        <Box className={`logo_image_box ${team === '2' && 'team2'}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                {image && <LogoImage src={image} type={type} />}
                {name && <Typography className="team_name">{name.split('').slice(0, 12)}</Typography>}
            </Box>
        </Box>
    )
})

const FootballBanner = ({ image1, image2, type, team1score, team2score, winnerName = '', team1Name, team2Name }) => {
    const team1win = team1score > team2score
    const team2win = team1score < team2score

    return (
        <Box className={`banner_main ${type === 'score' || type === 'scoring' && 'active'}`}>
            <Image unoptimized src={banner} alt="banner" width={500} height={500} />
            <Box className={`banner_child_box ${type === 'score' ? 'score' : ''}`}>
                <LogoImageBox type={type} teamScore={team1score} image={image1} name={team1Name} />
                <Box className={'football-banner-scores'}>
                    <Typography variant='body2'>
                        <span className={team2win ? 'bannerTeamLose' : ''}>{team1score} </span>-
                        <span className={team1win ? 'bannerTeamLose' : ''}> {team2score}</span>
                    </Typography>
                </Box>
                <LogoImageBox team={'2'} type={type} teamScore={team2score} image={image2} name={team2Name} />
            </Box>
        </Box>
    )
}

export default React.memo(FootballBanner)