'use client'
import { CommonText } from "@/components/common/commonText"
import { Box, Divider, Typography } from "@mui/material"
import Image from "next/image"
import './Matchstats.css'

const CommonStatsSection = ({ team_name, name, batting, fielding, bowling, total }) => {

    return (
        <Box className='mvp_stats_section'>
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <Typography variant='body2'>{name}</Typography>
                <Typography variant='p'>({team_name})</Typography>
            </Box>
            <Box className='mvp_stats'>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{`Batting: ${batting}`}</Typography>
                <Divider orientation="vertical" className='mvp_divider' />
                <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>{`Bowling: ${bowling}`}</Typography>
                <Divider orientation="vertical" className='mvp_divider' />
                <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>{`Fielding: ${fielding}`}</Typography>
                <Divider orientation="vertical" className='mvp_divider' />
                <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>{`Total: ${total}`}</Typography>
            </Box>
        </Box>
    )
}

const Matchstats = ({ currentMatch, mvpPoints }) => {
    const sortedPlayers = [...mvpPoints].sort((a, b) => b.totalPoints - a.totalPoints);
    const topThreePlayers = mvpPoints.sort((a, b) => b.totalPoints - a.totalPoints)
    let rearrangedPlayers = []

    if (topThreePlayers.length > 3) {
        topThreePlayers.length = 3;
        rearrangedPlayers = [
            topThreePlayers[1],
            topThreePlayers[0],
            topThreePlayers[2]
        ];
    }

    return (
        <>
            {
                currentMatch?.terminate && <Box className='no_result'>
                    <Typography variant="body2">
                        {
                            currentMatch?.terminate?.mainreason === "rain" ? "This match ended in no result as it was abandoned due to rain, which is why no player was awarded"
                                : `No player was awarded, as ${currentMatch?.team1?.id === currentMatch?.terminate?.teamdisqualify ? currentMatch?.team1?.team_name
                                    : currentMatch?.team2?.team_name} was found guilty of ${currentMatch?.terminate?.reason} As a result, 
                                ${currentMatch?.team1?.id !== currentMatch?.terminate?.teamdisqualify ? currentMatch?.team1?.team_name : currentMatch?.team2?.team_name} won the match`
                        }
                    </Typography>
                </Box>
            }
            {!currentMatch?.terminate && <Box className='matchstats_main_section activeAnimation'>
                <Box className='matchstats_top3_section'>
                    {
                        rearrangedPlayers.length > 0 && rearrangedPlayers.map((items, i) => {
                            return (
                                <Box key={i} className='match_top3_card_section'>
                                    <Box className={i === 1 ? 'matchstats_top1' : 'matchstats_top3'}>
                                        <Box>
                                            <Box className={i === 1 ? 'matchstats_top1_image' : 'matchstats_top3_image'}>
                                                {items?.playerthumbnail === '' ?
                                                    <Box sx={{ backgroundColor: items?.playercolor, height: '100%', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Typography sx={{ fontSize: 'var(--normal)', color: 'var(--text-white)' }}>{items.playerletter}</Typography>
                                                    </Box>
                                                    :
                                                    <Image unoptimized src={`/${items.playerthumbnail}`} alt="players" height={500} width={500} />}
                                            </Box>
                                            <Box className='ms-gradient-line'></Box>
                                            <Typography variant="h5">{items.playerName}</Typography>
                                            <Typography variant="h6">{items.totalPoints}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2">{i === 0 ? '2' : i === 1 ? '1' : '3'}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Box className='mvp_title'>
                    <Typography variant="body2">{CommonText.mvp}</Typography>
                </Box>
                <Box sx={{ width: '100%' }}>
                    {
                        sortedPlayers.length > 0 && sortedPlayers.map((items, i) => {
                            return (
                                <Box key={i} className='mvp_all_players_stats_section'>
                                    {items?.playerthumbnail === '' ?
                                        <Box sx={{ backgroundColor: items?.playercolor, height: '40px', width: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: 'var(--normal)', color: 'var(--text-white)' }}>{items.playerletter}</Typography>
                                        </Box>
                                        :
                                        <Box className='mvp_all_players_stats'>
                                            <Image unoptimized src={`/${items.playerthumbnail}`} width={500} height={500} alt='' />
                                        </Box>
                                    }
                                    <CommonStatsSection team_name={items.team} name={items.playerName} batting={items?.battingPoints} bowling={items?.bowlingPoints} fielding={items?.fieldingPoints} total={items?.totalPoints} />
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>}
        </>
    )
}

export default Matchstats