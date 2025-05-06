import SvgIcon from "@/assets/icons/SvgIcon"
import { Edit } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import React from "react"

const CommonPlayerSection = ({ name, run, ball, activeStrike, type, icon, onClick, balls, length, wickets, post }) => {
    return (
        <Box className={`score_common_player_main_section ${type === 'non-striker' && 'nonstriker'}`} >
            <Box className='score_player_info_section'>
                <Box>
                    <Box className={`score_player_icon_section ${type !== 'bowler' && activeStrike && 'active'}`} >
                        <SvgIcon id={icon} style={{ color: type !== 'bowler' && activeStrike ? "white" : "black" }} />
                    </Box>
                    {type === 'bowler' && balls.ballNo === 0 &&
                        <Box className={`score_player_icon_section`} sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={onClick} >
                            <Edit />
                        </Box>
                    }
                    {
                        type !== 'bowler' && length !== wickets &&
                        <Box className={`score_player_icon_section`} sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={run === 0 && ball === 0 ? () => onClick(name, 'edit') : run > 0 && ball > 0 ? () => onClick(name, 'ro') : undefined} >
                            {run === 0 && ball === 0 ?
                                <Edit />
                                :
                                <Typography variant="body2">RO</Typography>
                            }
                        </Box>
                    }
                </Box>
                <Box sx={{ flexShrink: '1' }}>
                    <Typography variant="body2">{`${name ? name : 'batter'}${(name === post?.team1Captain?.playerName || name === post?.team2Captain?.playerName) ? ' (C)' : ''}${(name === post?.team1WicketKeeper?.playerName || name === post?.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}`}</Typography>
                    <Box className={`score_player_score_section ${type === 'bowler' && 'bowler'}`}>
                        <Typography variant="body2">{`${run}`}</Typography>
                        <Typography variant="body2">{`(${ball})`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(CommonPlayerSection)