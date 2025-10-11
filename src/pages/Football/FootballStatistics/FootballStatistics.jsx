'use client';
import { Box, LinearProgress, Typography } from '@mui/material';
import './FootballStatistics.css';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CommonTeamSection = ({ image, possession, leagueType }) => {
    return (
        <Box className='football-ball-possession-team-section'>
            {image && <Box className='football-ball-possession-team-image-section'>
                <Image src={image} height={100} width={100} alt='logo' unoptimized />
            </Box>}
            {leagueType !== 'PremiumLeague' && <Typography variant='body2'>{possession}</Typography>}
        </Box>
    );
};

// Improved extractValue to handle percentages, decimals, numbers
const extractValue = (value) => {
    if (value == null) return 0;

    if (typeof value === 'string') {
        // Match percentage string like "64%"
        const percentMatch = value.match(/^(\d+)%$/);
        if (percentMatch) return parseInt(percentMatch[1]);

        // Match decimal or integer numbers as strings like "1.40", "0.44", "3"
        const floatMatch = value.match(/^\d+(\.\d+)?$/);
        if (floatMatch) return parseFloat(value);
    }

    // For numbers or fallback
    return typeof value === 'number' ? value : parseFloat(value) || 0;
};

// Optional: format values for display (e.g., show 1.40 as 1.4)
const formatValue = (val) => {
    if (val == null) return 0;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return Number.isInteger(val) ? val : val.toFixed(1);
    return val;
};

const FootballStatistics = () => {
    const params = useParams()
    const [matchData, setMatchData] = useState([])
    const { particularMatchData, liveFootballMatches, liveMatchData, premiumLeaguesPastMatchData } = useSelector((state) => state.footballData);
    const { leagueType } = useSelector(state => state.footballLocal)

    useEffect(() => {
        if (leagueType === 'PremiumLeague') {
            const rawMatch = premiumLeaguesPastMatchData?.result?.[0];

            const homeTeam = {
                id: rawMatch?.home_team_key,
                name: rawMatch?.event_home_team,
                logo: rawMatch?.home_team_logo,
            };

            const awayTeam = {
                id: rawMatch?.away_team_key,
                name: rawMatch?.event_away_team,
                logo: rawMatch?.away_team_logo,
            };

            const statisticsArray = rawMatch?.statistics || [];

            const homeStats = {
                team: homeTeam,
                statistics: statisticsArray?.map(stat => ({
                    type: stat.type,
                    value: stat.home,
                }))
            };

            const awayStats = {
                team: awayTeam,
                statistics: statisticsArray?.map(stat => ({
                    type: stat.type,
                    value: stat.away,
                }))
            };

            setMatchData({
                statistics: [homeStats, awayStats],
            });
        } else if (liveFootballMatches?.response?.find((items) => items?.fixture?.id === parseInt(params?.id) && leagueType === '')) {
            setMatchData(liveMatchData?.response?.[0])
        } else if (leagueType === '') {
            setMatchData(particularMatchData?.response?.[0])
        }
    }, [particularMatchData, liveFootballMatches, premiumLeaguesPastMatchData, leagueType])

    if (matchData?.statistics?.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
                No Stats Available
            </Box>
        )
    };

    const homeStats = matchData?.statistics?.[0];
    const awayStats = matchData?.statistics?.[1];

    if (!homeStats || !awayStats) return null;

    const homeTeam = homeStats.team;
    const awayTeam = awayStats.team;

    const homeStatMap = {};
    homeStats?.statistics?.forEach((stat) => {
        homeStatMap[stat.type] = stat.value;
    });

    const awayStatMap = {};
    awayStats?.statistics?.forEach((stat) => {
        awayStatMap[stat.type] = stat.value;
    });

    // Get unique stat types
    const allTypes = Array.from(
        new Set([...homeStats?.statistics?.map((s) => s.type), ...awayStats?.statistics?.map((s) => s.type)])
    );

    // Get possession values
    const homePossession = homeStatMap['Ball Possession'] || '0%';
    const awayPossession = awayStatMap['Ball Possession'] || '0%';

    return (
        <Box className='football-statistics-main-section'>
            <Box className='football-statistics-card'>
                <Box className='football-ball-possession-section'>
                    <CommonTeamSection image={homeTeam.logo} possession={homePossession} leagueType={leagueType} />
                    {leagueType !== 'PremiumLeague' && <Box
                        className='football-ball-possession-graph-main-section'
                        sx={{
                            background: `linear-gradient(90deg, #355EB1 ${extractValue(homePossession)}%, #FF8319 ${extractValue(awayPossession)}%)`,
                        }}
                    >
                        <Box className='football-ball-possession-graph'>
                            <Typography variant='body2'>Possession</Typography>
                        </Box>
                    </Box>}
                    <CommonTeamSection image={awayTeam.logo} possession={awayPossession} leagueType={leagueType} />
                </Box>
                <Box className='football-statistics-all-stats-info-section'>
                    {allTypes
                        .filter((type) => type !== 'Ball Possession')
                        .map((type, i) => {
                            const homeValueRaw = homeStatMap[type];
                            const awayValueRaw = awayStatMap[type];

                            const homeValue = extractValue(homeValueRaw);
                            const awayValue = extractValue(awayValueRaw);

                            // Skip if both zero/null
                            if (homeValue === 0 && awayValue === 0) return null;

                            const total = homeValue + awayValue;
                            const homePercent = total > 0 ? (homeValue * 100) / total : 0;
                            const awayPercent = total > 0 ? (awayValue * 100) / total : 0;

                            return (
                                <Box key={i} className='football-statistics-all-stats-info-sub-section'>
                                    <Box className='football-statistics-all-stats-info'>
                                        <Typography variant='body2'>{formatValue(homeValueRaw ?? 0)}</Typography>
                                        <Typography variant='body2'>{type}</Typography>
                                        <Typography variant='body2'>{formatValue(awayValueRaw ?? 0)}</Typography>
                                    </Box>
                                    <Box className='football-statistics-progress-graph'>
                                        <LinearProgress className='football-statistics-graph home' variant='determinate' value={homePercent} />
                                        <LinearProgress className='football-statistics-graph away' variant='determinate' value={awayPercent} />
                                    </Box>
                                </Box>
                            );
                        })}
                </Box>
            </Box>
        </Box>
    );
};

export default FootballStatistics