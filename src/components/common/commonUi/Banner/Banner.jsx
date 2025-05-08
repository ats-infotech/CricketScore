import { Box, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"
import banner from '../../../../assets/img/banner.png'
import vsPic from '../../../../assets/img/vs.png'
import ImageAvatar from "../ImageAvatar/ImageAvatar"
import './Banner.css'

const LogoImage = React.memo(({ src, props, style, type }) => {
    return (
        <Box className={`logo_image ${type === "score" ? 'score' : ""}`}>
            <Image unoptimized src={src} alt="logo" width={100} height={100} style={style} {...props} />
        </Box>
    )
})

const LogoImageBox = React.memo(({ image, teamScore, type, team, superover, soteamscore, name, letter, color, hidden, inningsonedeclare, inningstwodeclare }) => {
    return (
        <Box className={`logo_image_box ${team === '2' && 'team2'}`}>
            {type === "score" &&
                <Box>
                    <Box className='logo_child_box'>
                        <Typography className="title_name">{teamScore.run}-{teamScore.wicket}{inningsonedeclare && '/d'}</Typography>
                        <Typography className="score_number">({teamScore.over}.{teamScore.ball})</Typography>
                    </Box>
                    {superover && !hidden && <Box className='logo_superover_child_box' sx={{ marginTop: '8px' }}>
                        <Typography className="title_name">{soteamscore.run}-{soteamscore.wicket}{inningstwodeclare && '/d'}</Typography>
                        <Typography className="score_number">({soteamscore.over}.{soteamscore.ball})</Typography>
                    </Box>}
                </Box>
            }
            <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                {image && <LogoImage src={image} type={type} />}
                {!image && <ImageAvatar text={letter} bgColor={color} borderRadius={'10px'} width={type === 'score' ? '70px' : '90px'} 
                height={type === 'score' ? '70px' : '90px'} smallHeight={type === 'score' ? '70px' : '90px'} smallWidth={type === 'score' ? '70px' : '90px'} 
                meduimHeight={type === 'score' ? '70px' : '90px'} meduimWidth={type === 'score' ? '70px' : '90px'} />}
                {name && <Typography className="team_name">{name.split('').slice(0, 12)}</Typography>}
            </Box>
        </Box>
    )
})

const Banner = ({ image1, image2, type, team1score, team2score, winnerName = '', superover, soteam1score, soteam2score, team1name, 
    team2name, status, tossWinner, team1letter, team1color, team2letter, team2color, soteam1scorehidden = false, soteam2scorehidden = false, team1Declare = false,
    team2Declare = false, team1SuperOverDeclare = false, team2SuperOverDeclare = false }) => {
    return (
        <Box className={`banner_main ${type === 'score' || type === 'scoring' && 'active'}`}>
            <Image unoptimized src={banner} alt="banner" width={500} height={500} />
            {
                (status === 2 || status === 1) &&
                <Box className='TossWinner'>
                    <Typography variant="body2">{tossWinner}</Typography>
                </Box>
            }
            {winnerName &&
                <Box className='TossWinner'>
                    <Typography variant="body2">{`${winnerName}`}</Typography>
                </Box>
            }
            <Box className={`banner_child_box ${type === 'score' ? 'score' : ''}`}>
                <LogoImageBox type={type} hidden={soteam1scorehidden} teamScore={team1score} image={image1} superover={superover} soteamscore={soteam1score} 
                name={team1name} letter={team1letter} color={team1color} inningsonedeclare={team1Declare} inningstwodeclare={team1SuperOverDeclare} />
                <LogoImage src={vsPic} style={{ objectFit: 'contain' }} type={type} />
                <LogoImageBox team={'2'} hidden={soteam2scorehidden} type={type} teamScore={team2score} image={image2} superover={superover} 
                soteamscore={soteam2score} name={team2name} letter={team2letter} color={team2color} inningsonedeclare={team2Declare} inningstwodeclare={team2SuperOverDeclare} />
            </Box>
        </Box>
    )
}

export default React.memo(Banner)