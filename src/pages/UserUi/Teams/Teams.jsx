'use client'
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar"
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { useEffect, useState } from "react"
import './Teams.css'
import { useSelector } from "react-redux"
import { teamsState } from "@/redux/slices/teamSlice"

const CommonSection = ({ data, teamlogo, teamname, matchData, letter, color }) => {
    let captain1Id = matchData?.post?.team1Captain || ''
    let wicketKeeper1Id = matchData?.post?.team1WicketKeeper || ''
    let captain2Id = matchData?.post?.team2Captain || ''
    let wicketKeeper2Id = matchData?.post?.team2WicketKeeper || ''

    return (
        <>
            <Box className='match_teams_section'>
                <Box className='match_teams_image_section'>
                    {teamlogo && <Image unoptimized src={`/${teamlogo}`} alt="teamlogo" height={500} width={500} />}
                    {!teamlogo && <ImageAvatar text={letter} bgColor={color} height={'50px'} smallHeight={'50px'} smallWidth={'50px'} meduimHeight={'50px'} meduimWidth={'50px'} width={'50px'} borderRadius={'10px'} fontSize={'var(--normal)'} />}
                </Box>
                <Typography variant="body2">{teamname}</Typography>
            </Box>
            <Box className="team-gradient-line"></Box>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto'}}>
            <Box className='match_team_players'>
                {
                    data.length > 0 && data.map((item, i) => {
                        let captain = captain1Id === item?.id || captain2Id === item?.id
                        let wicketKeeper = wicketKeeper1Id === item?.id || wicketKeeper2Id === item?.id
                        return (
                            <Box key={i} >
                                <Box className={`match_team_main_section`} key={item?.id}>
                                    <Box className={`match_team_common_section ${item?.playerImage === '' ? 'item-center' : 'items-end'}`}>
                                        {
                                            item?.playerImage === '' ?
                                                <Box sx={{ height: '70%', width: '70%' }}>
                                                    <ImageAvatar bgColor={item?.playerColor} text={item.letter} />
                                                </Box>
                                                :
                                                <Box sx={{ width: '70%', marginTop: '25px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', overflow: 'hidden' }}>
                                                    <Image unoptimized src={`/${item?.playerImage}`} alt='profile pic' width={150} height={150} />
                                                </Box>
                                        }
                                    </Box>
                                    <Box className='match_team_player_name_section'>
                                        <Typography variant="body2">{item?.playerName}</Typography>
                                        <Box className='match_team_common_sub_section'>
                                            <Box className='match_team_post_section'>
                                                {captain && <Box className='match_team_post_selection_section' >
                                                    <Box className='match_team_post_selection_sub_section'>
                                                        <Image unoptimized src={require('../../../assets/img/playing11/captain.png')} alt="post" width={500} height={500} />
                                                    </Box>
                                                </Box>}
                                                {wicketKeeper && <Box className='match_team_post_selection_section' >
                                                    <Box className='match_team_post_selection_sub_section'>
                                                        <Image unoptimized src={require('../../../assets/img/playing11/wk.png')} alt="post" width={500} height={500} />
                                                    </Box>
                                                </Box>}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
            </Box>
        </>
    )
}

const Teams = ({ matchData, playerData }) => {

    const [team1player, setTeam1player] = useState([])
    const [team2player, setTeam2player] = useState([])
    const team_data = useSelector(teamsState)
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])

    useEffect(() => {
        const filterteam1players = playerData?.filter((items) => matchData?.selectedPlayer?.team1.includes(items.id))
        const filterteam2players = playerData?.filter((items) => matchData?.selectedPlayer?.team2.includes(items.id))
        setTeam1player(filterteam1players)
        setTeam2player(filterteam2players)
    }, [matchData])

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
    },[matchData, team_data])

    return (
        <Box className='match_teams_main_section'>
            <CommonSection teamlogo={team1?.team_logo ? team1?.team_logo : ""} letter={team1?.letter} color={team1?.team_color} teamname={team1?.team_name} data={team1player} matchData={matchData} />
            <Box sx={{ marginTop: '40px' }}>
                <CommonSection teamlogo={team2?.team_logo ? team2?.team_logo : ""} letter={team2?.letter} color={team2?.team_color} teamname={team2?.team_name} data={team2player} matchData={matchData} />
            </Box>
        </Box>
    )
}

export default Teams