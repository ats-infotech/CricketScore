'use client';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer,
} from 'recharts';
import './Analysis.css';
import { useEffect, useState } from 'react';
import { teamsState } from '@/redux/slices/teamSlice';
import { useSelector } from 'react-redux';

const CustomWicketLabel = ({ x, y, value, width }) => {
    if (value > 0) {
        return (
            <g>
                {Array.from({ length: value }).map((_, i) => (
                    <g key={i}>
                        <circle
                            cx={x + width + 12 + i * (12 + 5)}
                            cy={y + 7}
                            r={8}
                            fill="#ff4d4d"
                        />
                        <text
                            x={x + width + 12 + i * (12 + 5)}
                            y={y + 10}
                            fill="#fff"
                            fontSize={8}
                            fontWeight="bold"
                            textAnchor="middle"
                            className="Wicket_Text"
                        >
                            W
                        </text>
                    </g>
                ))}
            </g>
        );
    }
    return null;
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const inningsOneData = payload.find(item => item.dataKey === "inningsOneRuns");
        const inningsTwoData = payload.find(item => item.dataKey === "inningsTwoRuns");

        return (
            <div
                className="custom-tooltip"
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    padding: "5px",
                    borderRadius: "5px",
                }}
            >
                <p className="label">{`Over: ${payload[0].payload.over}`}</p>

                {inningsOneData && inningsOneData.value > 0 && (
                    <>
                        <p style={{ color: inningsOneData.fill }}>
                            {`${inningsOneData.name}: ${inningsOneData.value} runs`}
                        </p>
                        {inningsOneData.payload.inningsOneWickets > 0 && (
                            <p style={{ color: "#ff4d4d" }}>
                                {`${inningsOneData.payload.inningsOneWickets} Wickets`}
                            </p>
                        )}
                    </>
                )}

                {inningsTwoData && inningsTwoData.value > 0 && (
                    <>
                        <p style={{ color: inningsTwoData.fill }}>
                            {`${inningsTwoData.name}: ${inningsTwoData.value} runs`}
                        </p>
                        {inningsTwoData.payload.inningsTwoWickets > 0 && (
                            <p style={{ color: "#ff4d4d" }}>
                                {`${inningsTwoData.payload.inningsTwoWickets} Wickets`}
                            </p>
                        )}
                    </>
                )}
            </div>
        );
    }
    return null;
};

const ScoreAnalysis = ({ matchData }) => {
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [filter, setFilter] = useState('Both');
    const team_data = useSelector(teamsState);

    // Innings Data
    const inningsOneOversData = matchData?.firstInnings?.Completedovers || [];
    const inningsTwoOversData = matchData?.secondInnings?.Completedovers || [];
    const inningsOneWicketData = matchData?.firstInnings?.Wickets || [];
    const inningsTwoWicketData = matchData?.secondInnings?.Wickets || [];

    const isTeam1BattingFirst =
        (matchData?.toss?.tossWinner === matchData?.team1?.id && matchData?.toss?.selectSide === 'Bat') ||
        (matchData?.toss?.tossWinner !== matchData?.team1?.id && matchData?.toss?.selectSide !== 'Bat');

    useEffect(() => {
        const team1Data = team_data?.data?.find((item) => item?.id === matchData?.team1?.id);
        const team2Data = team_data?.data?.find((item) => item?.id === matchData?.team2?.id);
        setTeam1(team1Data || {});
        setTeam2(team2Data || {});
    }, [team_data, matchData]);

    // Function to calculate runs and wickets per over
    const calculateStats = (overs) => {
        return overs.map((obj, index) => {
            let runCount = 0;
            let wickets = 0;

            // Loop through each delivery
            Object.keys(obj).forEach((key) => {
                if (!isNaN(key)) {
                    const value = obj[key];

                    if (typeof value === 'string') {
                        // Handle Wickets
                        if (value.includes('W')) {
                            wickets += 1;
                            const runPart = value.split('+')[1];
                            if (runPart && !isNaN(runPart)) {
                                runCount += parseInt(runPart);
                            }
                        }

                        // Handle WD, NB, 2WD, 8NB, etc.
                        const extrasMatch = value.match(/(\d*)(WD|NB)/);
                        if (extrasMatch) {
                            const extraRuns = extrasMatch[1] ? parseInt(extrasMatch[1]) : 1;
                            runCount += extraRuns + 1; // Extra runs + 1 for delivery
                        }
                    }

                    // Add normal runs
                    const runs = parseInt(value.replace(/[^\d]/g, ''));
                    if (!isNaN(runs)) {
                        runCount += runs;
                    }
                }
            });

            return {
                over: index + 1,
                inningsRuns: runCount,
                wickets: wickets,
            };
        });
    };

    const calculateWicketType = (wickets) => {
        const lbw = wickets?.filter((item) => item.reason === "LBW")?.length
        const Catches = wickets?.filter((item) => item.reason === "Catch")?.length
        const Stumping = wickets?.filter((item) => item.reason === "Stumped")?.length
        const RunOut = wickets?.filter((item) => item.reason === "Run Out")?.length
        const Bowled = wickets?.filter((item) => item.reason === "Bowled")?.length
        const Hitwicket = wickets?.filter((item) => item.reason === "Hit Wicket")?.length
        const RetiredHurt = wickets?.filter((item) => item.reason === "Retired Hurt")?.length

        return{
            lbw,
            Catches,
            Stumping,
            RunOut,
            Bowled,
            Hitwicket,
            RetiredHurt
        }
    }

    // Calculate stats for both innings
    const inningsOneStats = calculateStats(inningsOneOversData);
    const inningsTwoStats = calculateStats(inningsTwoOversData);
    const inningsOneWicket = calculateWicketType(inningsOneWicketData)
    const inningsTwoWicket = calculateWicketType(inningsTwoWicketData)

    // Merge data for both innings
    const mergedData = inningsOneStats.map((item, index) => {
        const inningsTwo = inningsTwoStats[index] || {};
        return {
            over: item.over,
            inningsOneRuns: item.inningsRuns,
            inningsOneWickets: item.wickets,
            inningsTwoRuns: inningsTwo.inningsRuns || 0,
            inningsTwoWickets: inningsTwo.wickets || 0,
        };
    }).reverse();

    // Define dynamic bar labels based on batting order
    const inningsOneLabel = isTeam1BattingFirst
        ? `Innings 1 - ${team1?.team_name || 'Team 1'}`
        : `Innings 1 - ${team2?.team_name || 'Team 2'}`;

    const inningsTwoLabel = isTeam1BattingFirst
        ? `Innings 2 - ${team2?.team_name || 'Team 2'}`
        : `Innings 2 - ${team1?.team_name || 'Team 1'}`;

    // Filter data based on selected filter and remove empty overs
    const filteredData = mergedData
        .filter((item) => {
            switch (filter) {
                case 'Team1':
                    return item.inningsOneRuns > 0;
                case 'Team2':
                    return item.inningsTwoRuns > 0;
                default:
                    return item.inningsOneRuns > 0 || item.inningsTwoRuns > 0;
            }
        })
        .map((item) => {
            switch (filter) {
                case 'Team1':
                    return {
                        ...item,
                        inningsTwoRuns: 0,
                        inningsTwoWickets: 0,
                    };
                case 'Team2':
                    return {
                        ...item,
                        inningsOneRuns: 0,
                        inningsOneWickets: 0,
                    };
                default:
                    return item;
            }
        });

    return (
        <Box>
            <Box className="chart_title">
                <Typography variant="body2">Manhattan</Typography>
                <Box className="analysis-gradient-line"></Box>
            </Box>

            <Box className="filter_section">
                <Typography variant="body2">
                    Filter by Team:
                </Typography>
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    size="small"
                    variant="outlined"
                >
                    <MenuItem value="Both">Both</MenuItem>
                    <MenuItem value="Team1">{team1?.team_name || 'Team 1'}</MenuItem>
                    <MenuItem value="Team2">{team2?.team_name || 'Team 2'}</MenuItem>
                </Select>
            </Box>

            <ResponsiveContainer className="barchart_container" width="95%" height={400}>
                <BarChart
                    data={filteredData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                >
                    <Legend verticalAlign="top" align="center" height={36} />
                    <YAxis
                        dataKey="over"
                        type="category"
                        tickFormatter={(value) => `${value}`}
                        width={40}
                        label={{
                            value: 'Overs',
                            angle: -90,
                            position: 'insideLeft',
                        }}
                    />
                    <XAxis
                        type="number"
                        label={{
                            value: 'Runs',
                            position: 'insideBottom',
                            offset: -5,
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                    {(filter === 'Both' || filter === 'Team1') && (
                        <Bar
                            dataKey="inningsOneRuns"
                            fill="#8884d8"
                            name={inningsOneLabel}
                            barSize={15}
                        >
                            <LabelList
                                dataKey="inningsOneWickets"
                                position="right"
                                content={(props) => <CustomWicketLabel {...props} />}
                            />
                        </Bar>
                    )}

                    {(filter === 'Both' || filter === 'Team2') && (
                        <Bar
                            dataKey="inningsTwoRuns"
                            fill="#82ca9d"
                            name={inningsTwoLabel}
                            barSize={15}
                        >
                            <LabelList
                                dataKey="inningsTwoWickets"
                                position="right"
                                content={(props) => <CustomWicketLabel {...props} />}
                            />
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>

            <Box className="chart_title">
                <Typography variant="body2">Wickets Pie</Typography>
                <Box className="analysis-gradient-line"></Box>
            </Box>
        </Box>
    );
};

export default ScoreAnalysis;
