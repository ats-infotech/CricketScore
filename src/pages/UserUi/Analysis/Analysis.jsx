'use client';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, } from 'recharts';
import './Analysis.css';
import { useEffect, useState } from 'react';
import { teamsState } from '@/redux/slices/teamSlice';
import { useSelector } from 'react-redux';

const TopSection = ({ value, onChange, title, team1, team2, type }) => {
    return (
        <>
            <Box className="chart_title">
                <Typography variant="body2">{title}</Typography>
                <Box className="analysis-gradient-line"></Box>
            </Box>

            <FilterSelect value={value} onChange={onChange} team1={team1} team2={team2} type={type} />
        </>
    )
}

const CustomWicketLabel = ({ x, y, value, height }) => {
    if (value > 0) {
        return (
            <g>
                {Array.from({ length: value }).map((_, i) => (
                    <g key={i}>
                        <circle
                            cx={x + 7}
                            cy={y - 10 - i * (12 + 5)}
                            r={8}
                            fill="#ff4d4d"
                        />
                        <text
                            x={x + 7}
                            y={y - 10 - i * (12 + 5) + 3}
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

const FilterSelect = ({ value, onChange, team1, team2, type }) => {
    return (
        <Box className="filter_section">
            <Typography variant="body2">
                Filter by Team:
            </Typography>
            <Select
                value={value}
                onChange={onChange}
                size="small"
                variant="outlined"
            >
                {type !== "partnerships" && <MenuItem value="Both">Both Teams</MenuItem>}
                <MenuItem value="Team1">{team1?.team_name || 'Team 1'}</MenuItem>
                <MenuItem value="Team2">{team2?.team_name || 'Team 2'}</MenuItem>
            </Select>
        </Box>
    )
}

const CommonLineChart = ({ data, inningsOneLabel, inningsTwoLabel, team1dataKey, team2dataKey, filter, TeamOne, TeamTwo, onChange, title, value }) => {
    return (
        <>
            <TopSection team1={TeamOne} team2={TeamTwo} value={value} onChange={onChange} title={title} />
            <ResponsiveContainer className="runrate_chart_container" width="90%" height={500} style={{ paddingBlock: 15 }}>
                <LineChart data={data}>
                    <XAxis dataKey="over" label={{ value: "OVERS", position: "insideBottom", offset: -5 }} padding={{ left: 10, right: 10 }} allowDuplicatedCategory={false} />
                    <YAxis domain={[0, 'auto']} label={{ value: "RUNS", angle: -90, position: "insideLeft", offset: 15 }} />
                    <Tooltip />
                    <Legend verticalAlign="top" align="center" wrapperStyle={{ top: 0 }} />
                    {(filter === "Both" || filter === "Team1") &&
                        <Line fill="var(--light-green)" type="monotone" dataKey={team1dataKey} strokeWidth={2} name={inningsOneLabel} stroke="var(--light-green)" connectNulls />
                    }
                    {(filter === "Both" || filter === "Team2") &&
                        <Line fill="var(--yellow)" type="monotone" dataKey={team2dataKey} strokeWidth={2} name={inningsTwoLabel} stroke="var(--yellow)" connectNulls />
                    }
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

const ScoreAnalysis = ({ matchData }) => {
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [filter, setFilter] = useState({
        manhattan: 'Both',
        runrate: 'Both',
        worm: 'Both',
        wickets: 'Both',
        partnerships: 'Team1'
    });
    const [filterRunsType, setFilterRunsType] = useState({
        innings: 'Both',
        batter: 'All',
        bowler: 'All'
    })
    const team_data = useSelector(teamsState);

    // Innings Data
    const inningsOneOversData = matchData?.firstInnings?.Completedovers || [];
    const inningsTwoOversData = matchData?.secondInnings?.Completedovers || [];
    const inningsOneWicketData = matchData?.firstInnings?.Wickets || [];
    const inningsTwoWicketData = matchData?.secondInnings?.Wickets || [];
    const inningsOneBattingOrder = matchData?.firstInnings?.BattingOrder?.[0] || [];
    const inningsTwoBattingOrder = matchData?.secondInnings?.BattingOrder?.[0] || [];
    const isTeam1BattingFirst = (matchData?.toss?.tossWinner === matchData?.team1?.id && matchData?.toss?.selectSide === 'Bat') || (matchData?.toss?.tossWinner !== matchData?.team1?.id && matchData?.toss?.selectSide !== 'Bat');
    const TeamOne = isTeam1BattingFirst ? team1 : team2
    const TeamTwo = isTeam1BattingFirst ? team2 : team1

    useEffect(() => {
        const team1Data = team_data?.data?.find((item) => item?.id === matchData?.team1?.id);
        const team2Data = team_data?.data?.find((item) => item?.id === matchData?.team2?.id);
        setTeam1(team1Data || {});
        setTeam2(team2Data || {});
    }, [team_data, matchData]);

    const handleChange = (field) => event => {
        setFilter(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleRunTypeChange = (field) => event => {
        setFilterRunsType(prev => ({ ...prev, [field]: event.target.value }));
    };

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

        return {
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
    });

    // Define dynamic bar labels based on batting order
    const inningsOneLabel = isTeam1BattingFirst
        ? `Innings 1 - ${team1?.team_name || 'Team 1'}`
        : `Innings 1 - ${team2?.team_name || 'Team 2'}`;

    const inningsTwoLabel = isTeam1BattingFirst
        ? `Innings 2 - ${team2?.team_name || 'Team 2'}`
        : `Innings 2 - ${team1?.team_name || 'Team 1'}`;

    // Filter data based on selected filter and remove empty overs
    const filteredData = mergedData.filter((item) => {
        switch (filter.manhattan) {
            case 'Team1':
                return item.inningsOneRuns > 0;
            case 'Team2':
                return item.inningsTwoRuns > 0;
            default:
                return item.inningsOneRuns > 0 || item.inningsTwoRuns > 0;
        }
    }).map((item) => {
        switch (filter.manhattan) {
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

    // Run Rate Line Chart
    const calculateRunRate = (data) => {
        return data.map((over, index) => {
            const runRate = over.runs / (over?.legalBall === 6 ? index + 1 : index + (over?.legalBall / 10));
            return {
                over: index + 1,
                runRate: runRate.toFixed(2),
            };
        });
    };
    const inningsOneRunRate = calculateRunRate(inningsOneOversData)
    const inningsTwoRunRate = calculateRunRate(inningsTwoOversData)
    const maxOvers = Math.max(inningsOneRunRate.length, inningsTwoRunRate.length);
    const combinedRunRateData = [];
    for (let i = 0; i < maxOvers; i++) {
        const over1 = inningsOneRunRate[i];
        const over2 = inningsTwoRunRate[i];
        if (over1 && over2) {
            combinedRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runRate,
                team2RunRate: over2.runRate,
            });
        } else if (over1) {
            combinedRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runRate,
                team2RunRate: null,
            });
        } else if (over2) {
            combinedRunRateData.push({
                over: over2.over,
                team1RunRate: null,
                team2RunRate: over2.runRate,
            });
        }
    }
    const formattedRunRateData = combinedRunRateData.map((item) => ({
        ...item,
        team1RunRate: item.team1RunRate ? parseFloat(item.team1RunRate) : null,
        team2RunRate: item.team2RunRate ? parseFloat(item.team2RunRate) : null,
    }));

    // Worm Line Chart
    const calculatePerOverRuns = (data) => {
        return data.map((over, index) => {
            return {
                over: index + 1,
                run: over.runs,
            };
        });
    }
    const inningsOneRuns = calculatePerOverRuns(inningsOneOversData)
    const inningsTwoRuns = calculatePerOverRuns(inningsTwoOversData)
    const combinedRunsData = [];
    for (let i = 0; i < maxOvers; i++) {
        const over1 = inningsOneRuns[i];
        const over2 = inningsTwoRuns[i];
        if (over1 && over2) {
            combinedRunsData.push({
                over: over1.over,
                team1Runs: over1.run,
                team2Runs: over2.run,
            });
        } else if (over1) {
            combinedRunsData.push({
                over: over1.over,
                team1Runs: over1.run,
                team2Runs: null,
            });
        } else if (over2) {
            combinedRunsData.push({
                over: over2.over,
                team1Runs: null,
                team2Runs: over2.run,
            });
        }
    }
    const formattedRunsData = combinedRunsData.map((item) => ({
        ...item,
        team1Runs: item.team1Runs ? parseFloat(item.team1Runs) : null,
        team2Runs: item.team2Runs ? parseFloat(item.team2Runs) : null,
    }));

    // Wicket Pie Chart
    const preparePieData = (wicketData, innings) => {
        const data = [
            { name: 'LBW', value: wicketData?.lbw || 0, color: 'var(--light-green)' },
            { name: 'Catches', value: wicketData?.Catches || 0, color: 'var(--chart-blue)' },
            { name: 'Stumping', value: wicketData?.Stumping || 0, color: 'var(--purple)' },
            { name: 'Run Out', value: wicketData?.RunOut || 0, color: 'var(--orange-red)' },
            { name: 'Bowled', value: wicketData?.Bowled || 0, color: 'var(--yellow)' },
            { name: 'Hit Wicket', value: wicketData?.Hitwicket || 0, color: 'var(--coral)' },
            { name: 'Retired Hurt', value: wicketData?.RetiredHurt || 0, color: 'var(--pink)' },
        ];
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        if (totalValue === 0 && filter.wickets !== "Both") {
            return [{ name: 'No Wickets Lost', value: 0, color: 'var(--green)' }];
        }
        return data.filter((item) => item.value > 0);
    };

    const inningsOneWicket = calculateWicketType(inningsOneWicketData)
    const inningsTwoWicket = calculateWicketType(inningsTwoWicketData)
    const inningsOnePieData = preparePieData(inningsOneWicket, 'Innings 1');
    const inningsTwoPieData = preparePieData(inningsTwoWicket, 'Innings 2');

    // Types of Runs Bar Chart
    const countShots = (data) => {
        const shotCounts = {};
        data.forEach((over) => {
            Object.keys(over).forEach((key) => {
                if (!isNaN(parseInt(key))) {
                    const valueMatch = over[key].match(/(\d+)/);
                    if (valueMatch) {
                        const value = parseInt(valueMatch[0]);
                        shotCounts[value] = (shotCounts[value] || 0) + 1;
                    }
                }
            });
        });
        return shotCounts;
    };
    const inningsOneShotsCount = countShots(inningsOneOversData)
    const inningsTwoShotsCount = countShots(inningsTwoOversData)
    const prepareChartData = (inningsOneShotsCount, inningsTwoShotsCount) => {
        const uniqueKeys = Array.from(
            new Set([
                ...Object.keys(inningsOneShotsCount),
                ...Object.keys(inningsTwoShotsCount),
            ])
        );
        const sortedKeys = uniqueKeys
            .map((key) => parseInt(key))
            .sort((a, b) => a - b);

        return sortedKeys.map((key) => ({
            shotType: `${key}`,
            inningsOne: inningsOneShotsCount[key] || 0,
            inningsTwo: inningsTwoShotsCount[key] || 0,
        })).reverse();
    };
    const shots = prepareChartData(inningsOneShotsCount, inningsTwoShotsCount)

    // Partnerships
    const WicketPairs = ({ wickets, BattingOrder }) => {
        const pairs = [];
        let currentPair = [BattingOrder[0], BattingOrder[1]];
        if (currentPair[0] !== "" && currentPair[1] !== "") {
            pairs.push([...currentPair]);
        }
        wickets.forEach(wicket => {
            if (currentPair[0] === wicket.BatterId) {
                currentPair[0] = wicket.newBatter || '';
            }
            if (currentPair[1] === wicket.BatterId) {
                currentPair[1] = wicket.newBatter || '';
            }

            if (currentPair[0] !== "" && currentPair[1] !== "") {
                pairs.push([...currentPair]);
            }
        });
        return pairs;
    };

    const CalculatePartnerships = ({ over, wickets, pairs }) => {
        let partnerships = [];
        let previousPartnership = 0;
        let processedPairs = new Set();
    
        for (let i = 0; i < wickets.length; i++) {
            let wicket = wickets[i];
            let pair = pairs.find(p => p.includes(wicket.BatterId));
            let partnershipRun = wicket.partnership - previousPartnership;
    
            if (pair) {
                let batter1Run = 0;
                let batter2Run = 0;
                if (pair[0] === wicket.BatterId) {
                    batter1Run = wicket.run;
                    batter2Run = partnershipRun - wicket.run;
                } else if (pair[1] === wicket.BatterId) {
                    batter2Run = wicket.run;
                    batter1Run = partnershipRun - wicket.run;
                }
                let pairId = pair.sort().join("-"); 
                if (!processedPairs.has(pairId)) {
                    partnerships.push({
                        wicketId: pairId,
                        batter1run: batter1Run,
                        batter2run: batter2Run,
                        partnershipRun: partnershipRun,
                    });
                    processedPairs.add(pairId);
                }
    
                previousPartnership = wicket.partnership;
            }
        }
    
        return partnerships;
    };
    
    const inningsOneBattingPair = WicketPairs({ wickets: inningsOneWicketData, BattingOrder: inningsOneBattingOrder }) || []
    const inningsOnePartnerships = CalculatePartnerships({over: inningsOneOversData, wickets: inningsOneWicketData, pairs: inningsOneBattingPair})
    const inningsTwoBattingPair = WicketPairs({ wickets: inningsTwoWicketData, BattingOrder: inningsTwoBattingOrder }) || []
    const inningsTwoPartnerships = CalculatePartnerships({over: inningsTwoOversData, wickets: inningsTwoWicketData, pairs: inningsTwoBattingPair})

    return (
        <Box className="main_analysis_section">
            <TopSection team1={TeamOne} team2={TeamTwo} value={filter.manhattan} onChange={handleChange('manhattan')} title={"Manhattan"} />
            <ResponsiveContainer className="barchart_container" width="90%" height={500} style={{ paddingBottom: 15 }}>
                <BarChart
                    data={filteredData}
                    layout="horizontal"
                    margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                >
                    <Legend verticalAlign="top" align="center" height={36} />
                    <XAxis
                        dataKey="over"
                        type="category"
                        tickFormatter={(value) => `${value}`}
                        label={{
                            value: 'Overs',
                            position: 'insideBottom',
                            offset: -5,
                        }}
                    />
                    <YAxis
                        type="number"
                        label={{
                            value: 'Runs',
                            angle: -90,
                            position: 'insideLeft',
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    {(filter.manhattan === 'Both' || filter.manhattan === 'Team1') && (
                        <Bar
                            dataKey="inningsOneRuns"
                            fill="var(--light-green)"
                            name={inningsOneLabel}
                            barSize={15}
                        >
                            <LabelList
                                dataKey="inningsOneWickets"
                                position="top"
                                content={(props) => <CustomWicketLabel {...props} />}
                            />
                        </Bar>
                    )}
                    {(filter.manhattan === 'Both' || filter.manhattan === 'Team2') && (
                        <Bar
                            dataKey="inningsTwoRuns"
                            fill="var(--yellow)"
                            name={inningsTwoLabel}
                            barSize={15}
                        >
                            <LabelList
                                dataKey="inningsTwoWickets"
                                position="top"
                                content={(props) => <CustomWicketLabel {...props} />}
                            />
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>

            {/* Run Rate Line Chart*/}
            <CommonLineChart TeamOne={TeamOne} TeamTwo={TeamTwo} onChange={handleChange('runrate')} value={filter.runrate} title={"Run Rate"} data={formattedRunRateData}
                filter={filter.runrate} inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} team1dataKey={'team1RunRate'} team2dataKey={'team2RunRate'} />


            {/* Worm Line Chart */}
            <CommonLineChart TeamOne={TeamOne} TeamTwo={TeamTwo} onChange={handleChange('worm')} value={filter.worm} title={"Worm"} data={formattedRunsData}
                filter={filter.worm} inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} team1dataKey={'team1Runs'} team2dataKey={'team2Runs'} />


            {/* Wickets Pie Chart */}
            <TopSection team1={TeamOne} team2={TeamTwo} value={filter.wickets} onChange={handleChange('wickets')} title={"Wickets Pie"} />
            <ResponsiveContainer className="pie_chart_container" width="90%" height={250}>
                <PieChart>
                    <Legend
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ marginBottom: 10 }}
                    />
                    <Pie
                        data={
                            filter.wickets === 'Team2'
                                ? inningsOnePieData
                                : filter.wickets === 'Team1'
                                    ? inningsTwoPieData
                                    : inningsOnePieData.concat(inningsTwoPieData)
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const fillColor =
                                filter.wickets === 'Team2'
                                    ? inningsOnePieData[index]?.color
                                    : filter.wickets === 'Team1'
                                        ? inningsTwoPieData[index]?.color
                                        : inningsOnePieData.concat(inningsTwoPieData)[index]?.color;

                            return (
                                <>
                                    <circle cx={x} cy={y} r={14} fill="white" stroke={fillColor} strokeWidth={2} />
                                    <text
                                        x={x}
                                        y={y}
                                        fill={fillColor}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={12}
                                        fontWeight="bold"
                                    >
                                        {value}
                                    </text>
                                </>
                            );
                        }}
                    >
                        {(
                            filter.wickets === 'Team2'
                                ? inningsOnePieData
                                : filter.wickets === 'Team1'
                                    ? inningsTwoPieData
                                    : inningsOnePieData.concat(inningsTwoPieData)
                        ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Types of Runs Bar Chart */}
            <TopSection team1={TeamOne} team2={TeamTwo} value={filterRunsType.innings} onChange={handleRunTypeChange('innings')} title={"Types of Runs"} />
            <ResponsiveContainer className="barchart_container" width="90%" height={500} style={{ paddingBottom: 15 }}>
                <BarChart
                    data={shots}
                    layout="vertical"
                    margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                >
                    <Legend verticalAlign="top" align="center" height={36} />
                    <YAxis
                        dataKey="shotType"
                        type="category"
                        tickFormatter={(value) => `${value}s`}
                        label={{
                            value: 'Shots',
                            angle: -90,
                            position: 'insideLeft',
                        }}
                    />
                    <XAxis
                        type="number"
                        label={{
                            value: 'No of shots',
                            position: 'insideBottom',
                            offset: -5,
                        }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    {(filterRunsType.innings === "Both" || filterRunsType.innings === "Team1") && <Bar
                        dataKey="inningsOne"
                        fill="var(--light-green)"
                        name={inningsOneLabel}
                        barSize={15}
                    />}
                    {(filterRunsType.innings === "Both" || filterRunsType.innings === "Team2") && <Bar
                        dataKey="inningsTwo"
                        fill="var(--yellow)"
                        name={inningsTwoLabel}
                        barSize={15}
                    />}
                </BarChart>
            </ResponsiveContainer>

            {/* Partnerships */}
            {/* <TopSection value={filter.partnerships} onChange={handleChange('partnerships')} team1={TeamOne} team2={TeamTwo} title={"Partnerships"} type={"partnerships"} /> */}

        </Box>
    );
};

export default ScoreAnalysis;