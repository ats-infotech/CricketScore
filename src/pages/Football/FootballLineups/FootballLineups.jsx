'use client'
import { Box, Typography } from '@mui/material'
import './FootballLineups.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SwitchSelect from '@/components/common/commonUi/SwitchSelect/SwitchSelect';
import FootballPitch from './FootballPitch/FootballPitch';
import { useParams } from 'next/navigation';

const CommonTeamPlayersInfoSection = ({ startXI, substitutes }) => {
    return (
        <Box className='football-lineup-team-players-information'>
            {
                startXI?.map((items, i) => {
                    return (
                        <Box key={i} className='football-lineup-team-player-data'>
                            <Typography variant='body2'>{items?.player?.number}</Typography>
                            <Typography variant='p'>{items?.player?.name}</Typography>
                        </Box>
                    )
                })
            }
            <Typography variant='h6'>Substitutes</Typography>
            <Box className='football-lineup-team-players-information_lineargradient'></Box>
            {
                substitutes?.map((items, i) => {
                    return (
                        <Box key={i} className='football-lineup-team-player-data'>
                            <Typography variant='body2'>{items?.player?.number}</Typography>
                            <Typography variant='p'>{items?.player?.name}</Typography>
                        </Box>
                    )
                })
            }
        </Box>
    )
}

const FootballLineups = () => {
    const { particularMatchData, liveFootballMatches, liveMatchData, premiumLeaguesPastMatchData } = useSelector((state) => state.footballData);
    const { leagueType } = useSelector(state => state.footballLocal)
    const params = useParams()
    const [matchData, setMatchData] = useState([])
    const [currentTeam, setCurrentTeam] = useState(0)
    const [teamFormation, setTeamFormation] = useState([])

    useEffect(() => {
        if (liveFootballMatches?.response?.find((items) => items?.fixture?.id === parseInt(params?.id))) {
            setMatchData(liveMatchData?.response?.[0])
        } else {
            setMatchData(particularMatchData?.response?.[0])
        }
    }, [particularMatchData, liveFootballMatches])

    useEffect(() => {
        if (matchData) {
            setTeamFormation([{ name: matchData?.lineups?.[0]?.formation, img: matchData?.lineups?.[0]?.team?.logo },
            { name: matchData?.lineups?.[1]?.formation, img: matchData?.lineups?.[1]?.team?.logo }])
        }
    }, [matchData])

    const handleSwitchTeam = (val) => {
        setCurrentTeam(val)
    }

    if (matchData?.lineups?.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
                No Lineups Available
            </Box>
        )
    };

    return (
        <Box className='football-lineup-main-section'>
            {matchData?.lineups?.[0]?.formation && matchData?.lineups?.[1]?.formation && <>
                <Box className='football-lineup-team-switch'>
                    <SwitchSelect type='football' options={teamFormation} defaultSelected={currentTeam} onChange={(val) => handleSwitchTeam(val)} />
                </Box>
                <Box sx={{ marginTop: '30px' }}>
                    <FootballPitch
                        players={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.startXI
                                : matchData?.lineups?.[0]?.startXI
                        }
                        formation={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.formation
                                : matchData?.lineups?.[0]?.formation
                        }
                        jerseyColor={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.team?.colors?.player?.primary
                                : matchData?.lineups?.[0]?.team?.colors?.player?.primary
                        }
                        jerseyNumberColor={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.team?.colors?.player?.number
                                : matchData?.lineups?.[0]?.team?.colors?.player?.number
                        }
                        goalkeeperJerseyColor={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.team?.colors?.goalkeeper?.primary
                                : matchData?.lineups?.[0]?.team?.colors?.goalkeeper?.primary
                        }
                        goalkeeperJerseyNumberColor={
                            currentTeam === 1
                                ? matchData?.lineups?.[1]?.team?.colors?.goalkeeper?.number
                                : matchData?.lineups?.[0]?.team?.colors?.goalkeeper?.number
                        }
                    />
                </Box>
            </>}
            <CommonTeamPlayersInfoSection startXI={currentTeam === 1 ? matchData?.lineups?.[1]?.startXI : matchData?.lineups?.[0]?.startXI} substitutes={currentTeam === 1 ? matchData?.lineups?.[1]?.substitutes : matchData?.lineups?.[0]?.substitutes} />
        </Box>
    )
}

export default FootballLineups