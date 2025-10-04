import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import './FootballSummary.css';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import SvgIcon from '@/assets/icons/SvgIcon';

const CommonTeamSection = ({ image, name }) => {
    return (
        <Box className="football-summary-card-team-details">
            <Image src={image} width={100} height={100} alt="logo" />
            <Typography variant="body2">{name}</Typography>
        </Box>
    );
};

// Function to group incidents by time, type, and is_home
const groupIncidents = (incidents) => {
    const groups = {};
    
    incidents.forEach(incident => {
        const key = `${incident.time}-${incident.type}-${incident.is_home}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(incident);
    });
    
    return Object.values(groups).map(group => {
        if (group.length === 1) return group[0];
        
        // Merge incidents
        return {
            ...group[0],
            groupedData: group,
            // For cards: combine all player names
            player_name: group.map(i => i.player_name).filter(Boolean).join(', '),
            // For substitutions: combine all player_in and player_out names
            player_in_name: group.map(i => i.player_in_name).filter(Boolean).join(', '),
            player_out_name: group.map(i => i.player_out_name).filter(Boolean).join(', ')
        };
    });
};

// Function to adjust all positions to prevent overlaps
const calculateNonOverlappingPositions = (incidents, minSpacing = 5) => {
    if (!incidents.length) return incidents;

    // Sort incidents by original time
    const sortedIncidents = [...incidents].sort((a, b) => a.time - b.time);

    // First pass - calculate positions with ideal spacing
    const withSpacing = [];
    for (let i = 0; i < sortedIncidents.length; i++) {
        const current = sortedIncidents[i];
        const prev = withSpacing[i - 1];

        let position = current.time;
        if (prev && position - prev.adjustedTime < minSpacing) {
            position = prev.adjustedTime + minSpacing;
        }

        withSpacing.push({
            ...current,
            adjustedTime: position
        });
    }

    // Check if the last element exceeds 100%
    const lastPosition = withSpacing[withSpacing.length - 1].adjustedTime;
    if (lastPosition <= 100) {
        return withSpacing; // Everything fits, return as-is
    }

    // Calculate compression ratio needed to fit everything
    const compressionRatio = 100 / lastPosition;

    // Second pass - compress all positions proportionally
    return withSpacing.map(incident => ({
        ...incident,
        adjustedTime: incident.adjustedTime * compressionRatio
    }));
};

// Function to shift the timeline left if the rightmost incident touches the right edge
const shiftIncidentsLeft = (incidents, minSpacing = 5) => {
    // Get all incidents except FT (which stays at 103% outside the progress bar)
    const incidentsExcludingFT = incidents.filter((incident) => incident.label !== 'FT');

    // Get the position of the rightmost incident excluding FT
    const rightmostIncident = incidentsExcludingFT[incidentsExcludingFT.length - 1];

    // If the rightmost incident is touching or going past the right edge (100%), calculate the space
    if (rightmostIncident?.adjustedTime >= 100 - minSpacing) {
        const spaceLeft = 100 - rightmostIncident.adjustedTime;

        // If space left is less than the minimum spacing, we shift the incidents
        if (spaceLeft < minSpacing) {
            const shiftAmount = rightmostIncident.adjustedTime - (100 - minSpacing);

            // Shift all incidents (except FT) left by the shiftAmount
            const shiftedIncidents = incidents.map((incident) => {
                if (incident.label !== 'FT') {
                    return {
                        ...incident,
                        adjustedTime: Math.max(incident.adjustedTime - shiftAmount, 0),
                    };
                }
                return incident;
            });

            return shiftedIncidents;
        }
    }
    return incidents;
};

const FootballSummary = ({ type }) => {
    const { matchSummary, particularMatchData, liveFootballMatches } = useSelector(
        (state) => state.footballData
    );
    const [data, setData] = useState([]);
    const [progress, setProgress] = useState(parseInt(data?.time) || 0);
    const params = useParams();
    const imageBaseUrl = process.env.NEXT_PUBLIC_FOOTBALL_IMAGE_BASE_URL;
    const [adjustedIncidents, setAdjustedIncidents] = useState([]);
    const renderedTimes = new Set(); // To track already rendered labels
    const labelPositions = {}; // To store label positions

    const staticIncidents = [
        { time: 50, label: 'HT', type: 'Half Time' },
    ];

    useEffect(() => {
        const filterLiveMatch = liveFootballMatches ? liveFootballMatches?.find((item) => item?.id === parseInt(params?.id)) : [];
        if (type === 'past') {
            setData(particularMatchData?.[0]);
            setProgress(100);
        } else {
            setData(filterLiveMatch);
        }
    }, [type, liveFootballMatches, params?.id, particularMatchData]);

    useEffect(() => {
        const filteredIncidents = (matchSummary?.[0]?.incidents || [])
            .filter((incident) => incident.time !== 45) // Remove HT (45) since we have our own HT at 50
            .map((incident) => ({
                ...incident,
                label: incident.time.toString(),
            }));

        // Group incidents before combining with static ones
        const groupedIncidents = groupIncidents(filteredIncidents);

        // Combine all incidents (static and dynamic)
        const allIncidents = [
            ...staticIncidents,
            ...groupedIncidents,
        ];

        // Calculate non-overlapping positions first
        let withAdjustedPositions = calculateNonOverlappingPositions(allIncidents);

        // Shift incidents to the left if the rightmost one touches the edge (excluding FT)
        withAdjustedPositions = shiftIncidentsLeft(withAdjustedPositions);

        setAdjustedIncidents(withAdjustedPositions);
    }, [matchSummary]);

    // Helper function to render tooltip content
    const renderTooltipContent = (incident) => {
        // If this is a grouped incident
        if (incident.groupedData) {
            return (
                <Box>
                    {incident.groupedData.map((item, idx) => (
                        <Box key={idx}>
                            {getIncidentDetail(item)}
                        </Box>
                    ))}
                </Box>
            );
        }
        
        // Single incident
        return getIncidentDetail(incident);
    };

    // Helper to get incident detail text
    const getIncidentDetail = (incident) => {
        if (incident.type === 'card') {
            return `${incident.player_name || ''} ${incident.class} ${incident.type}`;
        }
        if (incident.type === 'goal') {
            return `${incident.player_name || ''} ${incident.type}`;
        }
        if (incident.type === 'substitution' && (incident.player_in_name || incident.player_out_name)) {
            const parts = [];
            if (incident.player_out_name) parts.push(`Off: ${incident.player_out_name}`);
            if (incident.player_in_name) parts.push(`On: ${incident.player_in_name}`);
            return parts.join(' | ');
        }
        return incident.type;
    };

    return (
        <Box className="football-summary-main-section">
            <Box className="football-summary-title">
                <Typography variant="body2">Match Timeline</Typography>
            </Box>
            <Box className="football-summary-card">
                <CommonTeamSection
                    name={data?.home_team_name}
                    image={`${imageBaseUrl}${data?.home_team_hash_image}.png`}
                />
                <Box className="football-summary-match-progress-section" position="relative">
                    <LinearProgress
                        className="football-summary-match-progress"
                        variant="determinate"
                        value={progress}
                        color="success"
                    />

                    {/* Render all incidents */}
                    {adjustedIncidents
                        .filter((incident) => incident.adjustedTime <= 100)
                        .map((incident, index) => {
                            const labelAlreadyRendered = renderedTimes.has(incident.label);

                            // Only render the label if it hasn't been rendered yet
                            if (!labelAlreadyRendered) {
                                // Mark this label as rendered and store its position
                                renderedTimes.add(incident.label);
                                labelPositions[incident.label] = incident.adjustedTime; // Save position
                            }

                            return (
                                <React.Fragment key={index}>
                                    {!labelAlreadyRendered && (
                                        <Box className={`incident-label ${incident?.label === 'HT' ? 'ht' : ''}`}
                                            sx={{ left: `${labelPositions[incident.label]}%` }} >
                                            <span>{incident.label}</span>
                                        </Box>
                                    )}

                                    <Box className={`incident-svg ${incident.is_home ? 'home' : ''} ${incident.type === 'goal' ? 'goal' : ''}`}
                                        sx={{ left: `${labelPositions[incident.label]}%` }}>
                                        {incident?.type === "card" ?
                                            <Tooltip title={renderTooltipContent(incident)}>
                                                <Box className={`card ${incident?.class}`}></Box>
                                            </Tooltip>
                                            : <Tooltip title={renderTooltipContent(incident)}>
                                                <SvgIcon id={incident?.type === 'substitution' ? 'substitute' : incident?.type === "goal" ? 'football' : ''} />
                                            </Tooltip>}
                                    </Box>
                                </React.Fragment>
                            );
                        })}

                    {/* Render static incidents (KO and FT) outside the progress bar */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '-5%',
                            top: '2px',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '12px',
                        }}
                    >
                        <span>{'KO'}</span>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: '-5%',
                            top: '2px',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '12px',
                        }}
                    >
                        <span>{'FT'}</span>
                    </Box>
                </Box>
                <CommonTeamSection
                    name={data?.away_team_name}
                    image={`${imageBaseUrl}${data?.away_team_hash_image}.png`}
                />
            </Box>
            <Box className='incidents_summary_main_section'>
                {
                    matchSummary?.[0]?.incidents?.length > 0 && matchSummary?.[0]?.incidents?.map((items, i) => {
                        return (
                            items?.time !== 45 && <Box key={i} className='incidents_summary' >
                                <Typography variant='body2'>{items?.time}</Typography>
                                {items?.player_name && <Typography variant='body2'>{items?.player_name}</Typography>}
                                {items?.type !== 'substitution' && <Typography variant='body2'>{items?.type === 'card' ? `${items?.class}${items?.type}` : items?.type}</Typography>}
                                {items?.type === 'substitution' && (items?.player_in_name || items?.player_out_name) ? <Typography variant='body2'>{`${items?.player_in_name ? `On: ${items?.player_in_name}` : ''} ${items?.player_in_name && items?.player_out_name ? '|' : ''} ${items?.player_out_name ? `Off: ${items?.player_out_name}` : ''}`}</Typography> : items?.type === 'substitution' && <Typography variant='body2'>{items?.type}</Typography>}
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    );
};

export default FootballSummary;