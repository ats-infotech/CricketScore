import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import './FootballSummary.css';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SvgIcon from '@/assets/icons/SvgIcon';
import { useParams } from 'next/navigation';

const CommonTeamSection = ({ image, name }) => (
    <Box className="football-summary-card-team-details">
        {image && <Image src={image} width={100} height={100} alt="logo" />}
        <Typography variant="body2">{name}</Typography>
    </Box>
);

// Normalize incidents to consistent structure
const mapIncidents = (rawIncidents, homeTeamId) => {
    return rawIncidents.map(i => {
        let playerName = i.player?.name || '';
        let playerInName = i.type === 'subst' ? i.player?.name : '';
        let playerOutName = i.type === 'subst' ? i.assist?.name : '';

        return {
            time: i.time.elapsed,
            extraTime: i.time.extra,
            type: i.type.toLowerCase(),
            label: i.time.elapsed.toString(),
            is_home: i.team?.id === homeTeamId,
            player_name: playerName,
            player_in_name: playerInName,
            player_out_name: playerOutName,
            team: i.team,
            detail: i.detail,
            comments: i.comments,
        };
    });
};

// Group incidents by time, type, and home/away
const groupIncidents = (incidents) => {
    const groups = {};

    incidents.forEach(incident => {
        const key = `${incident.time}-${incident.type}-${incident.is_home}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(incident);
    });

    return Object.values(groups).map(group => {
        if (group.length === 1) return group[0];

        return {
            ...group[0],
            groupedData: group,
            player_name: group.map(i => i.player_name).filter(Boolean).join(', '),
            player_in_name: group.map(i => i.player_in_name).filter(Boolean).join(', '),
            player_out_name: group.map(i => i.player_out_name).filter(Boolean).join(', ')
        };
    });
};

// Prevent overlapping timeline positions
const calculateNonOverlappingPositions = (incidents, minSpacing = 5) => {
    if (!incidents.length) return incidents;

    const sorted = [...incidents].sort((a, b) => a.time - b.time);
    const withSpacing = [];

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const prev = withSpacing[i - 1];

        let position = current.time;
        if (prev && position - prev.adjustedTime < minSpacing) {
            position = prev.adjustedTime + minSpacing;
        }

        withSpacing.push({ ...current, adjustedTime: position });
    }

    const lastPosition = withSpacing[withSpacing.length - 1].adjustedTime;
    if (lastPosition <= 100) return withSpacing;

    const compressionRatio = 100 / lastPosition;
    return withSpacing.map(i => ({ ...i, adjustedTime: i.adjustedTime * compressionRatio }));
};

// Shift incidents left if rightmost touches edge
const shiftIncidentsLeft = (incidents, minSpacing = 5) => {
    const incidentsExcludingFT = incidents.filter(i => i.label !== 'FT');
    const rightmost = incidentsExcludingFT[incidentsExcludingFT.length - 1];

    if (rightmost?.adjustedTime >= 100 - minSpacing) {
        const spaceLeft = 100 - rightmost.adjustedTime;
        if (spaceLeft < minSpacing) {
            const shiftAmount = rightmost.adjustedTime - (100 - minSpacing);
            return incidents.map(i => i.label !== 'FT' ? { ...i, adjustedTime: Math.max(i.adjustedTime - shiftAmount, 0) } : i);
        }
    }
    return incidents;
};

const mapPremiumLeagueIncidents = (matchData) => {
    const incidents = [];
    matchData?.goalscorers?.forEach(goal => {
        if (goal.home_scorer && goal.home_scorer !== '') {
            incidents.push({
                time: parseInt(goal.time),
                type: 'goal',
                player_name: goal.home_scorer,
                is_home: true,
                label: goal.time
            });
        }
        if (goal.away_scorer && goal.away_scorer !== '') {
            incidents.push({
                time: parseInt(goal.time),
                type: 'goal',
                player_name: goal.away_scorer,
                is_home: false,
                label: goal.time
            });
        }
    });
    matchData?.substitutes?.forEach(sub => {
        if (sub.home_scorer && sub.home_scorer.in) {
            incidents.push({
                time: parseInt(sub.time),
                type: 'subst',
                player_in_name: sub.home_scorer.in,
                player_out_name: sub.home_scorer.out,
                is_home: true,
                label: sub.time
            });
        }
        if (sub.away_scorer && sub.away_scorer.in) {
            incidents.push({
                time: parseInt(sub.time),
                type: 'subst',
                player_in_name: sub.away_scorer.in,
                player_out_name: sub.away_scorer.out,
                is_home: false,
                label: sub.time
            });
        }
    });
    matchData?.cards?.forEach(card => {
        incidents.push({
            time: parseInt(card.time),
            type: 'card',
            detail: card.card,
            is_home: card.info === 'home',
            label: card.time
        });
    });
    return incidents;
};

const FootballSummary = () => {
    const params = useParams()
    const { particularMatchData, liveFootballMatches, liveMatchData, premiumLeaguesPastMatchData } = useSelector(state => state.footballData);
    const { leagueType } = useSelector(state => state.footballLocal)
    const [matchData, setMatchData] = useState([])
    const [adjustedIncidents, setAdjustedIncidents] = useState([]);

    useEffect(() => {
        if (leagueType === 'PremiumLeague') {
            setMatchData(premiumLeaguesPastMatchData?.result?.[0])
        } else if (liveFootballMatches?.response?.find((items) => items?.fixture?.id === parseInt(params?.id)) && leagueType === '') {
            setMatchData(liveMatchData?.response?.[0])
        } else if (leagueType === '') {
            setMatchData(particularMatchData?.response?.[0])
        }
    }, [particularMatchData, liveFootballMatches, premiumLeaguesPastMatchData, leagueType])

    const staticIncidents = [{ time: 50, label: 'HT', type: 'Half Time' }];

    useEffect(() => {
        let filteredIncidents = [];

        if (leagueType === 'PremiumLeague') {
            filteredIncidents = mapPremiumLeagueIncidents(matchData);
        } else {
            filteredIncidents = mapIncidents(matchData?.events || [], matchData?.teams?.home?.id)
                .filter(i => i.time !== 45); // Remove original HT
        }

        const grouped = groupIncidents(filteredIncidents);
        let allIncidents = [...staticIncidents, ...grouped];

        let positioned = calculateNonOverlappingPositions(allIncidents);
        positioned = shiftIncidentsLeft(positioned);

        setAdjustedIncidents(positioned);
    }, [matchData, leagueType]);

    const getIncidentDetail = (incident) => {
        if (incident.type === 'card') return `${incident.player_name || ''} ${incident.detail} ${incident.type}`;
        if (incident.type === 'goal') return `${incident.player_name || ''} ${incident.detail}`;
        if (incident.type === 'subst' && (incident.player_in_name || incident.player_out_name)) {
            const parts = [];
            if (incident.player_out_name) parts.push(`Off: ${incident.player_out_name}`);
            if (incident.player_in_name) parts.push(`On: ${incident.player_in_name}`);
            return parts.join(' | ');
        }
        return incident.type;
    };

    const renderTooltipContent = (incident) => incident.groupedData
        ? <Box>{incident.groupedData.map((i, idx) => <Box key={idx}>{getIncidentDetail(i)}</Box>)}</Box>
        : getIncidentDetail(incident);

    return (
        <Box className="football-summary-main-section">
            <Box className="football-summary-title">
                <Typography variant="body2">Match Timeline</Typography>
            </Box>
            <Box className="football-summary-card">
                <CommonTeamSection name={leagueType === 'PremiumLeague' ? matchData?.event_home_team : matchData?.teams?.home?.name} image={leagueType === 'PremiumLeague' ? matchData?.home_team_logo : matchData?.teams?.home?.logo} />

                <Box className="football-summary-match-progress-section" position="relative">
                    <LinearProgress
                        className="football-summary-match-progress"
                        variant="determinate"
                        value={leagueType === 'PremiumLeague' ? 100 : (matchData?.fixture?.status?.elapsed || 0) + 10}
                        color="success"
                    />

                    {Object.entries(
                        adjustedIncidents.reduce((acc, incident) => {
                            if (!acc[incident.label]) acc[incident.label] = [];
                            acc[incident.label].push(incident);
                            return acc;
                        }, {})
                    ).map(([label, incidentsAtLabel]) => {
                        return (
                            <React.Fragment key={label}>
                                {/* Render label once on top */}
                                <Box
                                    className={`incident-label ${label === 'HT' ? 'ht' : ''}`}
                                    sx={{
                                        left: `${incidentsAtLabel[0].adjustedTime}%`,
                                        position: 'absolute',
                                    }}
                                >
                                    <span>{label}</span>
                                </Box>

                                {/* Stack incidents above or below based on team */}
                                {incidentsAtLabel.map((incident, idx) => {
                                    return (
                                        <Box
                                            key={`${label}-${idx}`}
                                            className={`incident-svg ${incident.is_home ? 'home' : ''} ${incident.type === 'goal' ? 'goal' : ''}`}
                                            sx={{
                                                left: `${incident.adjustedTime}%`,
                                                position: 'absolute',
                                            }}
                                        >
                                            <Tooltip title={renderTooltipContent(incident)}>
                                                {incident.type === "card" ? (
                                                    <Box className={`card ${incident.detail.toLowerCase().includes('yellow') ? 'yellow' : 'red'}`}></Box>
                                                ) : (
                                                    <SvgIcon id={incident.type === 'subst' ? 'substitute' : incident.type === "goal" ? 'football' : ''} />
                                                )}
                                            </Tooltip>
                                        </Box>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}

                    <Box sx={{ position: 'absolute', left: '-5%', top: '2px', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}><span>KO</span></Box>
                    <Box sx={{ position: 'absolute', right: '-5%', top: '2px', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}><span>FT</span></Box>
                </Box>

                <CommonTeamSection name={leagueType === 'PremiumLeague' ? matchData?.event_away_team : matchData?.teams?.away?.name} image={leagueType === 'PremiumLeague' ? matchData?.away_team_logo : matchData?.teams?.away?.logo} />
            </Box>
            <Box className='incidents_summary_main_section'>
                {leagueType === 'PremiumLeague' && matchData?.goalscorers?.length > 0 || matchData?.substitutes?.length > 0 || matchData?.cards?.length > 0
                    ? adjustedIncidents.map((incident, idx) => (
                        incident.label !== 'HT' && (
                            <Box key={idx} className='incidents_summary'>
                                <Typography variant='body2'>{incident.time}</Typography>
                                {incident.type === 'goal' && incident.player_name && (
                                    <Typography variant='body2'>{incident.player_name}</Typography>
                                )}
                                {incident.type === 'subst' && (incident.player_in_name || incident.player_out_name) && (
                                    <Typography variant='body2'>
                                        {incident.player_in_name && `On: ${incident.player_in_name}`}
                                        {incident.player_in_name && incident.player_out_name ? ' | ' : ''}
                                        {incident.player_out_name && `Off: ${incident.player_out_name}`}
                                    </Typography>
                                )}
                                {incident.type === 'card' && incident.detail && (
                                    <Typography variant='body2'>{`${incident.detail} ${incident.type}`}</Typography>
                                )}
                            </Box>
                        )
                    ))
                    : matchData?.events?.length > 0 && matchData?.events.map((i, idx) => (
                        i.time.elapsed !== 45 && (
                            <Box key={idx} className='incidents_summary'>
                                <Typography variant='body2'>{i.time.elapsed}</Typography>
                                {i.player?.name && <Typography variant='body2'>{i.player.name}</Typography>}
                                {i.type.toLowerCase() !== 'subst' && <Typography variant='body2'>{i.type === 'card' ? `${i.detail} ${i.type}` : i.type}</Typography>}
                                {i.type.toLowerCase() === 'subst' && (i.player?.name || i.assist?.name) ?
                                    <Typography variant='body2'>{`${i.player?.name ? `On: ${i.player.name}` : ''} ${i.player?.name && i.assist?.name ? '|' : ''} ${i.assist?.name ? `Off: ${i.assist.name}` : ''}`}</Typography>
                                    : i.type.toLowerCase() === 'subst' && <Typography variant='body2'>{i.type}</Typography>}
                            </Box>
                        )
                    ))
                }
            </Box>
        </Box>
    );
};

export default FootballSummary;