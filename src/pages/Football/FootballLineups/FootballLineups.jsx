'use client'
import { Box, Typography } from '@mui/material'
import './FootballLineups.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import SwitchSelect from '@/components/common/commonUi/SwitchSelect/SwitchSelect';
import FootballPitch from './FootballPitch/FootballPitch';

const CommonTeamPlayersInfoSection = ({ data }) => {
    return (
        data?.length > 0 && <Box className='football-lineup-team-players-information'>
            {
                data?.map((items, i) => {
                    return (
                        items?.substitute === false && <Box key={i} className='football-lineup-team-player-data'>
                            <Typography variant='body2'>{items?.shirt_number}</Typography>
                            <Typography variant='p'>{items?.player_name}</Typography>
                        </Box>
                    )
                })
            }
            <Typography variant='h6'>Substitutes</Typography>
            <Box className='football-lineup-team-players-information_lineargradient'></Box>
            {
                data?.map((items, i) => {
                    return (
                        items?.substitute === true && <Box key={i} className='football-lineup-team-player-data'>
                            <Typography variant='body2'>{items?.shirt_number}</Typography>
                            <Typography variant='p'>{items?.player_name}</Typography>
                        </Box>
                    )
                })
            }
        </Box>
    )
}

const FootballLineups = ({ type }) => {
    const { matchLineups, particularMatchData, liveFootballMatches } = useSelector(
        (state) => state.footballData
    );
    const imageBaseUrl = process.env.NEXT_PUBLIC_FOOTBALL_IMAGE_BASE_URL;
    const [data, setData] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(0)
    const [teamFormation, setTeamFormation] = useState([])
    const params = useParams();

    useEffect(() => {
        const filterLiveMatch = liveFootballMatches ? liveFootballMatches?.find((item) => item?.id === parseInt(params?.id)) : [];
        if (type === 'past') {
            setData(particularMatchData?.[0]);
        } else {
            setData(filterLiveMatch);
        }
    }, [type, liveFootballMatches, params?.id, particularMatchData]);

    useEffect(() => {
        if (data && matchLineups) {
            setTeamFormation([{ name: matchLineups?.[0]?.home_team?.formation, img: `${imageBaseUrl}${data?.home_team_hash_image}.png` },
            { name: matchLineups?.[0]?.away_team?.formation, img: `${imageBaseUrl}${data?.away_team_hash_image}.png` }])
        }
    }, [data, matchLineups])

    const handleSwitchTeam = (val) => {
        setCurrentTeam(val)
    }

    return (
        <Box className='football-lineup-main-section'>
            <Box className='football-lineup-team-switch'>
                <SwitchSelect type='football' options={teamFormation} defaultSelected={currentTeam} onChange={(val) => handleSwitchTeam(val)} />
            </Box>
            <Box sx={{marginTop: '30px'}}>
                <FootballPitch
                    players={
                        currentTeam === 1
                            ? matchLineups?.[0]?.away_team?.players
                            : matchLineups?.[0]?.home_team?.players
                    }
                    formation={
                        currentTeam === 1
                            ? matchLineups?.[0]?.away_team?.formation
                            : matchLineups?.[0]?.home_team?.formation
                    }
                    jerseyColor={
                        currentTeam === 1
                            ? matchLineups?.[0]?.away_team?.player_color_primary
                            : matchLineups?.[0]?.home_team?.player_color_primary
                    }
                    jerseyNumberColor={
                        currentTeam === 1
                            ? matchLineups?.[0]?.away_team?.player_color_number
                            : matchLineups?.[0]?.home_team?.player_color_number
                    }
                />
            </Box>
            <CommonTeamPlayersInfoSection data={currentTeam === 1 ? matchLineups?.[0]?.away_team?.players : matchLineups?.[0]?.home_team?.players} />
        </Box>
    )
}

export default FootballLineups