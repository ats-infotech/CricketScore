'use client';
import { Box } from '@mui/material';
import './Analysis.css';
import { useEffect, useState } from 'react';
import { teamsState } from '@/redux/slices/teamSlice';
import { useSelector } from 'react-redux';
import { playersState } from '@/redux/slices/playersSlice';
import { AnalysisBarChart, AnalysisLineChart, AnalysisPartnership, AnalysisPieChart } from '@/components/common/commonUi/AnalysisCharts/AnalysisCharts';

const ScoreAnalysis = ({ matchData }) => {
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [filter, setFilter] = useState({
        manhattan: 'Both',
        runrate: 'Both',
        worm: 'Both',
        wickets: 'Both',
        typesofruns: 'Both',
        partnerships: 'Team1'
    });
    const team_data = useSelector(teamsState);
    const player_data = useSelector(playersState)

    // Innings Data
    const inningsOneOversData = matchData?.firstInnings?.Completedovers || [];
    const inningsTwoOversData = matchData?.secondInnings?.Completedovers || [];
    const inningsOneWicketData = matchData?.firstInnings?.Wickets || [];
    const inningsTwoWicketData = matchData?.secondInnings?.Wickets || [];
    const inningsOneBattingOrder = matchData?.firstInnings?.BattingOrder?.[0] || [];
    const inningsTwoBattingOrder = matchData?.secondInnings?.BattingOrder?.[0] || [];
    const inningsOnePartnership = matchData?.firstInnings?.Partnerships || []
    const inningsTwoPartnership = matchData?.secondInnings?.Partnerships || []

    const isTeam1BattingFirst = (matchData?.toss?.tossWinner === matchData?.team1?.id && matchData?.toss?.selectSide === 'Bat')
        || (matchData?.toss?.tossWinner !== matchData?.team1?.id && matchData?.toss?.selectSide !== 'Bat');
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
                return item.inningsOneRuns !== undefined && item.inningsOneRuns !== null;
            case 'Team2':
                return item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null;
            default:
                return (item.inningsOneRuns !== undefined && item.inningsOneRuns !== null) ||
                    (item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null);
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
    const mergeAndSumWicketData = (data1, data2) => {
        const mergedData = [...data1];
        data2.forEach(item => {
            const existingItem = mergedData.find(existing => existing.name === item.name);
            if (existingItem) {
                existingItem.value += item.value;
            } else {
                mergedData.push(item);
            }
        });
        return mergedData;
    };
    const preparePieData = (wicketData, innings) => {
        const data = [
            { name: 'LBW', value: wicketData?.lbw || 0, color: 'var(--light-green)' },
            { name: 'Catches', value: wicketData?.Catches || 0, color: 'var(--chart-blue)' },
            { name: 'Stumping', value: wicketData?.Stumping || 0, color: 'var(--purple)' },
            { name: 'Run Out', value: wicketData?.RunOut || 0, color: 'var(--orange-red)' },
            { name: 'Bowled', value: wicketData?.Bowled || 0, color: 'var(--yellow)' },
            { name: 'Hit Wicket', value: wicketData?.Hitwicket || 0, color: 'var(--pink)' },
            { name: 'Retired Hurt', value: wicketData?.RetiredHurt || 0, color: 'var(--coral)' },
        ];
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        if (totalValue === 0 && filter.wickets !== "Both") {
            return [{ name: 'No Wickets Lost', value: 0, color: 'var(--green)' }];
        }
        return data.filter((item) => item.value > 0);
    };
    const inningsOneWicket = calculateWicketType(inningsOneWicketData);
    const inningsTwoWicket = calculateWicketType(inningsTwoWicketData);
    const inningsOnePieData = preparePieData(inningsOneWicket, 'Innings 1');
    const inningsTwoPieData = preparePieData(inningsTwoWicket, 'Innings 2');
    const pieData = filter.wickets === 'Both'
        ? mergeAndSumWicketData(inningsOnePieData, inningsTwoPieData)
        : filter.wickets === 'Team1'
            ? inningsOnePieData
            : filter.wickets === 'Team2'
                ? inningsTwoPieData
                : [];

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
        let previousBatter1Id = null;
        let previousBatter2Id = null;

        for (let i = 0; i < wickets.length; i++) {
            let wicket = wickets[i];
            let pair = pairs.find(p => p.includes(wicket.BatterId));
            let partnershipRun = wicket.partnership - previousPartnership;

            if (pair) {
                let batter1Run = 0;
                let batter2Run = 0;
                let batter1Ball = 0;
                let batter2Ball = 0;
                if (pair[0] === wicket.BatterId) {
                    batter1Run = wicket.batter1Contribution;
                    batter1Ball = wicket.batter1balls;
                    batter2Run = wicket.batter2Contribution
                    batter2Ball = wicket.batter2balls
                    previousBatter1Id = wicket.BatterId
                } else if (pair[1] === wicket.BatterId) {
                    batter2Run = wicket.batter2Contribution
                    batter2Ball = wicket.batter2balls
                    batter1Run = wicket.batter1Contribution
                    batter1Ball = wicket.batter1balls
                    previousBatter2Id = wicket.BatterId
                }
                let pairId = pair.sort().join("-");
                let batter1Id = wicket.batter1Id
                let batter2Id = wicket.batter2Id
                if (batter1Id === "" || batter2Id === "") {
                    continue;
                }
                if ((previousBatter1Id?.toString() === batter1Id && previousBatter2Id?.toString() === batter2Id)) {
                    continue;
                }
                partnerships.push({
                    wicketId: pairId,
                    batter1run: batter1Run,
                    batter1ball: batter1Ball,
                    batter1Id,
                    batter2Id,
                    batter2run: batter2Run,
                    batter2ball: batter2Ball,
                    partnershipRun: partnershipRun,
                });
                previousPartnership = wicket.partnership;
            }
        }
        return partnerships;
    };

    const inningsOneBattingPair = WicketPairs({ wickets: inningsOneWicketData, BattingOrder: inningsOneBattingOrder }) || []
    const inningsOnePartnerships = CalculatePartnerships({ over: inningsOneOversData, wickets: inningsOneWicketData, pairs: inningsOneBattingPair })
    const inningsTwoBattingPair = WicketPairs({ wickets: inningsTwoWicketData, BattingOrder: inningsTwoBattingOrder }) || []
    const inningsTwoPartnerships = CalculatePartnerships({ over: inningsTwoOversData, wickets: inningsTwoWicketData, pairs: inningsTwoBattingPair })
    const PartnershipData = filter.partnerships === "Team1" ? inningsOnePartnerships : inningsTwoPartnerships

    return (
        <Box className="main_analysis_section">
            {/* Manhattan Bar Chart */}
            <AnalysisBarChart team1={TeamOne} team2={TeamTwo} filter={filter.manhattan} handleChange={handleChange('manhattan')} data={filteredData}
                inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} title={"Manhattan"} yaxisdatakey={"over"} yaxislabel={"Overs"}
                xaxislabel={"Runs"} bar1datakey={"inningsOneRuns"} bar2datakey={"inningsTwoRuns"} bar1wicketslabel={"inningsOneWickets"} bar2wicketslabel={"inningsTwoWickets"} />

            {/* Run Rate Line Chart*/}
            <AnalysisLineChart TeamOne={TeamOne} TeamTwo={TeamTwo} onChange={handleChange('runrate')} value={filter.runrate} title={"Run Rate"} data={formattedRunRateData}
                filter={filter.runrate} inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} team1dataKey={'team1RunRate'} team2dataKey={'team2RunRate'} />

            {/* Worm Line Chart */}
            <AnalysisLineChart TeamOne={TeamOne} TeamTwo={TeamTwo} onChange={handleChange('worm')} value={filter.worm} title={"Worm"} data={formattedRunsData}
                filter={filter.worm} inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} team1dataKey={'team1Runs'} team2dataKey={'team2Runs'} />

            {/* Wickets Pie Chart */}
            <AnalysisPieChart team1={TeamOne} team2={TeamTwo} filter={filter.wickets} onChange={handleChange('wickets')} title={"Wickets Pie"} data={pieData} />

            {/* Types of Runs Bar Chart */}
            <AnalysisBarChart team1={TeamOne} team2={TeamTwo} filter={filter.typesofruns} handleChange={handleChange('typesofruns')} data={shots}
                inningsOneLabel={inningsOneLabel} inningsTwoLabel={inningsTwoLabel} title={"Types of Runs"} yaxisdatakey={"shotType"} yaxislabel={'Shots'} xaxislabel={'No of shots'}
                bar1datakey={"inningsOne"} bar2datakey={"inningsTwo"} />

            {/* Partnerships */}
            <AnalysisPartnership team1={TeamOne} team2={TeamTwo} onChange={handleChange('partnerships')} title={"Partnerships"} topsectionvalue={filter.partnerships}
                playerdata={player_data} data={PartnershipData} />

        </Box>
    );
};

export default ScoreAnalysis;