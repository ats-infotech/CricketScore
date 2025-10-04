'use client'
import { Box, LinearProgress, Typography } from '@mui/material'
import './FootballStatistics.css'
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const CommonTeamSection = ({ image, possession }) => {
    return (
        <Box className='football-ball-possession-team-section'>
            <Box className='football-ball-possession-team-image-section'>
                <Image src={image} height={100} width={100} alt='logo' unoptimized />
            </Box>
            <Typography variant='body2'>{possession}</Typography>
        </Box>
    )
}

const FootballStatistics = ({ type }) => {
    const { matchStats, particularMatchData, liveFootballMatches } = useSelector(
        (state) => state.footballData
    );
    const [data, setData] = useState([]);
    const imageBaseUrl = process.env.NEXT_PUBLIC_FOOTBALL_IMAGE_BASE_URL
    const params = useParams();
    const ballPossession = matchStats?.[0]?.statistics?.filter((item) => item?.type === "Ball possession" && item?.period === 'ALL')?.[0]

    useEffect(() => {
        const filterLiveMatch = liveFootballMatches ? liveFootballMatches?.find((item) => item?.id === parseInt(params?.id)) : [];
        if (type === 'past') {
            setData(particularMatchData?.[0]);
        } else {
            setData(filterLiveMatch);
        }
    }, [type, liveFootballMatches, params?.id, particularMatchData]);

    return (
        <Box className='football-statistics-main-section'>
            <Box className='football-statistics-card'>
                <Box className='football-ball-possession-section'>
                    <CommonTeamSection image={`${imageBaseUrl}${data?.home_team_hash_image}.png`} possession={ballPossession?.home_team} />
                    <Box className='football-ball-possession-graph-main-section'
                        sx={{ background: `linear-gradient(90deg, #355EB1 ${ballPossession?.home_team}, #FF8319 ${ballPossession?.away_team})`, }}
                    >
                        <Box className='football-ball-possession-graph'>
                            <Typography variant='body2'>Possession</Typography>
                        </Box>
                    </Box>
                    <CommonTeamSection image={`${imageBaseUrl}${data?.away_team_hash_image}.png`} possession={ballPossession?.away_team} />
                </Box>
                <Box className='football-statistics-all-stats-info-section'>
                    {
                        matchStats?.[0]?.statistics?.length > 0 && matchStats?.[0]?.statistics?.filter((item) => item?.type !== 'Ball possession' && item?.period === 'ALL')?.map((items, i) => {
                            const extractValue = (value) => {
                                if (!value) return 0;

                                const percentageMatch = value.match(/\((\d+)%\)/); // e.g., "5/21 (24%)"
                                if (percentageMatch) return parseInt(percentageMatch[1]);

                                const percentOnly = value.match(/^(\d+)%$/); // e.g., "44%"
                                if (percentOnly) return parseInt(percentOnly[1]);

                                // If it's a pure number (like "53"), return as number
                                return !isNaN(parseInt(value)) ? parseInt(value) : 0;
                            };

                            let homeTeamScore = !items?.home_team?.includes('%') ? (parseInt(items?.home_team) * 100) / (parseInt(items?.home_team) + parseInt(items?.away_team)) : extractValue(items?.home_team)
                            let awayTeamScore = !items?.away_team?.includes('%') ? (parseInt(items?.away_team) * 100) / (parseInt(items?.home_team) + parseInt(items?.away_team)) : extractValue(items?.away_team)

                            return (
                                (parseInt(items?.away_team) > 0 || parseInt(items?.home_team) > 0) &&
                                <Box key={i} className='football-statistics-all-stats-info-sub-section'>
                                    <Box className='football-statistics-all-stats-info'>
                                        <Typography variant='body2'>{items?.home_team}</Typography>
                                        <Typography variant='body2'>{items?.type}</Typography>
                                        <Typography variant='body2'>{items?.away_team}</Typography>
                                    </Box>
                                    <Box className='football-statistics-progress-graph'>
                                        <LinearProgress className='football-statistics-graph home' variant="determinate" value={homeTeamScore} />
                                        <LinearProgress className='football-statistics-graph away' variant="determinate" value={awayTeamScore} />
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default FootballStatistics