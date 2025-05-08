'use client';
import { AnalysisBarChart, AnalysisLineChart, AnalysisPartnership, AnalysisPieChart, WagonWheelGraph } from '@/components/common/commonUi/AnalysisCharts/AnalysisCharts';
import { playersState } from '@/redux/slices/playersSlice';
import { teamsState } from '@/redux/slices/teamSlice';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Analysis.css';

const ScoreAnalysis = ({ matchData, tournamentData }) => {
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    let isTestMatch = tournamentData && tournamentData?.match_type === "Test Match" ? true : false
    let isFollowOn = matchData?.followOn === "Follow On" ? true : false
    const [filter, setFilter] = useState({
        manhattan: isTestMatch ? 'Both 1' : 'Both',
        runrate: isTestMatch ? 'Both 1' : 'Both',
        worm: isTestMatch ? 'Both 1' : 'Both',
        wickets: isTestMatch ? 'Both 1' : 'Both',
        typesofruns: isTestMatch ? 'Both 1' : 'Both',
        partnerships: isTestMatch ? 'Team1firstinning' : 'Team1',
        wagonwheel: isTestMatch ? 'Both 1' : 'Both',
        batter: '',
        bowler: ''
    });
    const team_data = useSelector(teamsState);
    const player_data = useSelector(playersState);

    // Innings Data
    const inningsOneOversData = matchData?.firstInnings?.Completedovers || [];
    const inningsTwoOversData = matchData?.secondInnings?.Completedovers || [];
    const inningsThreeOversData = matchData?.superOverFirstInnings?.Completedovers || [];
    const inningsFourOversData = matchData?.superOverSecondInnings?.Completedovers || [];
    const inningsOneWicketData = matchData?.firstInnings?.Wickets || [];
    const inningsTwoWicketData = matchData?.secondInnings?.Wickets || [];
    const inningsThreeWicketData = matchData?.superOverFirstInnings?.Wickets || [];
    const inningsFourWicketData = matchData?.superOverSecondInnings?.Wickets || [];
    const inningsOneBattingOrder = matchData?.firstInnings?.BattingOrder?.[0] || [];
    const inningsTwoBattingOrder = matchData?.secondInnings?.BattingOrder?.[0] || [];
    const inningsThreeBattingOrder = matchData?.superOverFirstInnings?.BattingOrder?.[0] || [];
    const inningsFourBattingOrder = matchData?.superOverSecondInnings?.BattingOrder?.[0] || [];
    const inningsOneWagonWheel = matchData?.firstInnings?.Shots || [];
    const inningsTwoWagonWheel = matchData?.secondInnings?.Shots || [];
    const inningsThreeWagonWheel = matchData?.superOverFirstInnings?.Shots || [];
    const inningsFourWagonWheel = matchData?.superOverSecondInnings?.Shots || [];
    // const inningsOnePartnership = matchData?.firstInnings?.Partnerships || []
    // const inningsTwoPartnership = matchData?.secondInnings?.Partnerships || []
    // const inningsThreePartnership = matchData?.superOverFirstInnings?.Partnerships || []
    // const inningsFourPartnership = matchData?.superOverSecondInnings?.Partnerships || []

    const isTeam1BattingFirst = (matchData?.toss?.tossWinner === matchData?.team1?.id && matchData?.toss?.selectSide === 'Bat')
        || (matchData?.toss?.tossWinner !== matchData?.team1?.id && matchData?.toss?.selectSide !== 'Bat');
    const TeamOne = isTeam1BattingFirst ? team1 : team2
    const TeamTwo = isTeam1BattingFirst ? team2 : team1

    useEffect(() => {
        const team1Data = team_data?.data?.find((item) => item?.id === matchData?.team1?.id);
        const team2Data = team_data?.data?.find((item) => item?.id === matchData?.team2?.id);
        const team1Player = player_data?.data?.filter((item) => item?.teamId === team1Data?.id)
        const team2Player = player_data?.data?.filter((item) => item?.teamId === team2Data?.id)
        setTeam1(team1Data || {});
        setTeam2(team2Data || {});
        setTeam1Players(team1Player || [])
        setTeam2Players(team2Player || [])
    }, [team_data, matchData, player_data]);

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
    const inningsThreeStats = calculateStats(inningsThreeOversData);
    const inningsFourStats = calculateStats(inningsFourOversData);

    // Merge data for first innings
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

    // merge data for second innings
    const mergedSecondInningsData = inningsThreeStats.map((item, index) => {
        const inningsFour = inningsFourStats[index] || {};
        return {
            over: item.over,
            inningsOneRuns: item.inningsRuns,
            inningsOneWickets: item.wickets,
            inningsTwoRuns: inningsFour.inningsRuns || 0,
            inningsTwoWickets: inningsFour.wickets || 0,
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

    const filteredInningsOneData = mergedData.filter((item) => {
        switch (filter.manhattan) {
            case 'Team1firstinning':
                return item.inningsOneRuns !== undefined && item.inningsOneRuns !== null;
            case 'Team2firstinning':
                return item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null;
            default:
                return (item.inningsOneRuns !== undefined && item.inningsOneRuns !== null) ||
                    (item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null);
        }
    })

    const filteredInningsTwoData = mergedSecondInningsData.filter((item) => {
        switch (filter.manhattan) {
            case 'Team1secondinning':
                return isFollowOn ? item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null : item.inningsOneRuns !== undefined && item.inningsOneRuns !== null;
            case 'Team2secondinning':
                return isFollowOn ? item.inningsOneRuns !== undefined && item.inningsOneRuns !== null : item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null;
            default:
                return (item.inningsOneRuns !== undefined && item.inningsOneRuns !== null) ||
                    (item.inningsTwoRuns !== undefined && item.inningsTwoRuns !== null);
        }
    })

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
    const inningsThreeRunRate = calculateRunRate(inningsThreeOversData)
    const inningsFourRunRate = calculateRunRate(inningsFourOversData)
    const maxOvers = Math.max(inningsOneRunRate.length, inningsTwoRunRate.length);
    const inningsTwoMaxOvers = Math.max(inningsThreeRunRate.length, inningsFourRunRate.length)
    const combinedRunRateData = [];
    const combinedInningsTwoRunRateData = []
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
    for (let i = 0; i < inningsTwoMaxOvers; i++) {
        const over1 = isFollowOn ? inningsFourRunRate[i] : inningsThreeRunRate[i];
        const over2 = isFollowOn ? inningsThreeRunRate[i] : inningsFourRunRate[i];
        if (over1 && over2) {
            combinedInningsTwoRunRateData.push({
                over: over1.over,
                team1RunRate: over1?.runRate,
                team2RunRate: over2?.runRate,
            });
        } else if (over1) {
            combinedInningsTwoRunRateData.push({
                over: over1.over,
                team1RunRate: over1?.runRate,
                team2RunRate: null,
            });
        } else if (over2) {
            combinedInningsTwoRunRateData.push({
                over: over2.over,
                team1RunRate: null,
                team2RunRate: over2?.runRate,
            });
        }
    }
    const formattedRunRateData = combinedRunRateData.map((item) => ({
        ...item,
        team1RunRate: item.team1RunRate ? parseFloat(item.team1RunRate) : null,
        team2RunRate: item.team2RunRate ? parseFloat(item.team2RunRate) : null,
    }));
    const formattedInningsTwoRunRateData = combinedInningsTwoRunRateData.map((item) => ({
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
    const inningsThreeRuns = calculatePerOverRuns(inningsThreeOversData)
    const inningsFourRuns = calculatePerOverRuns(inningsFourOversData)

    const combinedRunsData = [];
    const combinedInningsTwoRunsData = [];
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
    for (let i = 0; i < inningsTwoMaxOvers; i++) {
        const over1 = isFollowOn ? inningsFourRuns[i] : inningsThreeRuns[i];
        const over2 = isFollowOn ? inningsThreeRuns[i] : inningsFourRuns[i];
        if (over1 && over2) {
            combinedInningsTwoRunsData.push({
                over: over1.over,
                team1Runs: over1?.run,
                team2Runs: over2?.run,
            });
        } else if (over1) {
            combinedInningsTwoRunsData.push({
                over: over1.over,
                team1Runs: over1?.run,
                team2Runs: null,
            });
        } else if (over2) {
            combinedInningsTwoRunsData.push({
                over: over2.over,
                team1Runs: null,
                team2Runs: over2?.run,
            });
        }
    }
    const formattedRunsData = combinedRunsData.map((item) => ({
        ...item,
        team1Runs: item.team1Runs ? parseFloat(item.team1Runs) : null,
        team2Runs: item.team2Runs ? parseFloat(item.team2Runs) : null,
    }));
    const formattedInningsTwoRunsData = combinedInningsTwoRunsData.map((item) => ({
        ...item,
        team1RunRate: item.team1RunRate ? parseFloat(item.team1RunRate) : null,
        team2RunRate: item.team2RunRate ? parseFloat(item.team2RunRate) : null,
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
    const preparePieData = (wicketData) => {
        const data = [
            { name: 'LBW', value: wicketData?.lbw || 0, color: 'var(--chart-light-green)' },
            { name: 'Catches', value: wicketData?.Catches || 0, color: 'var(--chart-blue)' },
            { name: 'Stumping', value: wicketData?.Stumping || 0, color: 'var(--chart-purple)' },
            { name: 'Run Out', value: wicketData?.RunOut || 0, color: 'var(--chart-orange-red)' },
            { name: 'Bowled', value: wicketData?.Bowled || 0, color: 'var(--chart-yellow)' },
            { name: 'Hit Wicket', value: wicketData?.Hitwicket || 0, color: 'var(--chart-pink)' },
            { name: 'Retired Hurt', value: wicketData?.RetiredHurt || 0, color: 'var(--chart-coral)' },
        ];
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        if (totalValue === 0 && filter.wickets !== "Both") {
            return [{ name: 'No Wickets Lost', value: 0, color: 'var(--chart-green)' }];
        }
        return data.filter((item) => item.value > 0);
    };
    const inningsOneWicket = calculateWicketType(inningsOneWicketData);
    const inningsTwoWicket = calculateWicketType(inningsTwoWicketData);
    const inningsThreeWicket = calculateWicketType(inningsThreeWicketData);
    const inningsFourWicket = calculateWicketType(inningsFourWicketData);
    const inningsOnePieData = preparePieData(inningsOneWicket);
    const inningsTwoPieData = preparePieData(inningsTwoWicket);
    const inningsThreePieData = preparePieData(inningsThreeWicket)
    const inningsFourPieData = preparePieData(inningsFourWicket)
    const pieData = filter.wickets === 'Both' || filter.wickets === "Both 1" ? mergeAndSumWicketData(inningsOnePieData, inningsTwoPieData)
        : filter.wickets === 'Both 2' ? mergeAndSumWicketData(inningsThreePieData, inningsFourPieData)
            : filter.wickets === 'Team1' || filter.wickets === 'Team1firstinning' ? inningsOnePieData
                : filter.wickets === 'Team2' || filter.wickets === 'Team2firstinning' ? inningsTwoPieData
                    : (filter.wickets === "Team1secondinning" && !isFollowOn) || (filter.wickets === "Team2secondinning" && isFollowOn) ? inningsThreePieData
                        : (filter.wickets === "Team2secondinning" && !isFollowOn) || (filter.wickets === "Team1secondinning" && isFollowOn) ? inningsFourPieData
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
    const inningsThreeShotsCount = countShots(inningsThreeOversData)
    const inningsFourShotsCount = countShots(inningsFourOversData)

    const prepareChartData = (inningsOneShotsCount, inningsTwoShotsCount, innings) => {
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
            inningsOne: isFollowOn && innings === "two" ? inningsTwoShotsCount[key] || 0 : inningsOneShotsCount[key] || 0,
            inningsTwo: isFollowOn && innings === "two" ? inningsOneShotsCount[key] || 0 : inningsTwoShotsCount[key] || 0,
        })).reverse();
    };
    const shots = prepareChartData(inningsOneShotsCount, inningsTwoShotsCount)
    const inningsTwoShots = prepareChartData(inningsThreeShotsCount, inningsFourShotsCount, 'two')

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
        let previousPairId = null;

        for (let i = 0; i < wickets.length; i++) {
            let wicket = wickets[i];
            let pair = pairs.find(p => p.includes(wicket.BatterId));
            let partnershipRun = wicket.partnership - previousPartnership;

            if (pair) {
                let batter1Run = wicket.batter1Contribution ? wicket.batter1Contribution : partnershipRun - wicket.batter2Contribution;
                let batter2Run = wicket.batter2Contribution ? wicket.batter2Contribution : partnershipRun - wicket.batter1Contribution;
                let batter1Ball = wicket.batter1balls;
                let batter2Ball = wicket.batter2balls;
                let batter1Id = wicket.batter1Id;
                let batter2Id = wicket.batter2Id;

                if (batter1Id === "" || batter2Id === "") {
                    continue;
                }

                let pairId = [batter1Id, batter2Id].sort().join("-");
                if (previousPairId === pairId) {
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
                previousPairId = pairId;
            }
        }
        return partnerships;
    };

    const inningsOneBattingPair = WicketPairs({ wickets: inningsOneWicketData, BattingOrder: inningsOneBattingOrder }) || []
    const inningsOnePartnerships = CalculatePartnerships({ over: inningsOneOversData, wickets: inningsOneWicketData, pairs: inningsOneBattingPair })
    const inningsTwoBattingPair = WicketPairs({ wickets: inningsTwoWicketData, BattingOrder: inningsTwoBattingOrder }) || []
    const inningsTwoPartnerships = CalculatePartnerships({ over: inningsTwoOversData, wickets: inningsTwoWicketData, pairs: inningsTwoBattingPair })
    const inningsThreeBattingPair = WicketPairs({ wickets: inningsThreeWicketData, BattingOrder: inningsThreeBattingOrder }) || []
    const inningsThreePartnerships = CalculatePartnerships({ over: inningsThreeOversData, wickets: inningsThreeWicketData, pairs: inningsThreeBattingPair })
    const inningsFourBattingPair = WicketPairs({ wickets: inningsFourWicketData, BattingOrder: inningsFourBattingOrder }) || []
    const inningsFourPartnerships = CalculatePartnerships({ over: inningsFourOversData, wickets: inningsFourWicketData, pairs: inningsFourBattingPair })
    const PartnershipData = filter.partnerships === "Team1" || filter.partnerships === "Team1firstinning" ? inningsOnePartnerships
        : filter.partnerships === "Team2" || filter.partnerships === "Team2firstinning" ? inningsTwoPartnerships : (filter.partnerships === "Team1secondinning" && !isFollowOn)
            || (filter.partnerships === "Team2secondinning" && isFollowOn) ? inningsThreePartnerships
            : inningsFourPartnerships
    const showPieData = filter.wickets === 'Both' && pieData.length === 0 ? false : true

    // Wagon Wheel
    const WagonWheelData = filter.wagonwheel === 'Both' || filter.wagonwheel === 'Both 1' ? [...inningsOneWagonWheel, ...inningsTwoWagonWheel]
        : filter.wagonwheel === 'Both 2' ? [...inningsThreeWagonWheel, ...inningsFourWagonWheel]
            : filter.wagonwheel === 'Team1' || filter.wagonwheel === "Team1firstinning" ? [...inningsOneWagonWheel]
                : filter.wagonwheel === 'Team2' || filter.wagonwheel === "Team2firstinning" ? [...inningsTwoWagonWheel]
                    : filter.wagonwheel === 'Team1secondinning' && !isFollowOn ? [...inningsThreeWagonWheel]
                        : filter.wagonwheel === 'Team1secondinning' && isFollowOn ? [...inningsFourWagonWheel]
                            : filter.wagonwheel === 'Team2secondinning' && !isFollowOn ? [...inningsFourWagonWheel]
                                : filter.wagonwheel === 'Team2secondinning' && isFollowOn ? [...inningsThreeWagonWheel]
                                    : [];

    const showWagonWheel = isTestMatch && inningsOneWagonWheel.length === 0 && inningsTwoWagonWheel.length === 0 && inningsThreeWagonWheel.length === 0
        && inningsFourWagonWheel.length === 0 ? false : filter.wagonwheel === 'Both' && WagonWheelData.length === 0 ? false : true

    // Wagon Wheel Data Update Based on Batter and Bowler
    const FilterWagonWheelBasedOnPlayers = filter.batter === '' && filter.bowler === '' ? WagonWheelData : filter.batter !== '' && filter.bowler === '' ? WagonWheelData?.filter((items) => items.batterId === filter.batter)
        : filter.batter === '' && filter.bowler !== '' ? WagonWheelData?.filter((items) => items.bowlerId === filter.bowler) : WagonWheelData?.filter((items) => items.batterId === filter.batter && items?.bowlerId === filter.bowler)

    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            batter: '',
            bowler: ''
        }))
    }, [filter.wagonwheel])

    return (
        <Box className="main_analysis_section">
            {/* Manhattan Bar Chart */}
            <AnalysisBarChart
                team1={TeamOne}
                team2={TeamTwo}
                filter={filter.manhattan} handleChange={handleChange('manhattan')}
                data={isTestMatch && (filter.manhattan === "Both 1" || filter.manhattan === "Team1firstinning" || filter.manhattan === "Team2firstinning") ? filteredInningsOneData
                    : isTestMatch && (filter.manhattan === "Both 2" || filter.manhattan === "Team1secondinning" || filter.manhattan === "Team2secondinning") ? filteredInningsTwoData
                        : filteredData}
                inningsOneLabel={inningsOneLabel}
                inningsTwoLabel={inningsTwoLabel}
                title={"Manhattan"}
                yaxisdatakey={"over"}
                yaxislabel={"Overs"}
                isTestMatch={isTestMatch}
                xaxislabel={"Runs"}
                bar1datakey={"inningsOneRuns"}
                bar2datakey={"inningsTwoRuns"}
                bar1wicketslabel={"inningsOneWickets"}
                bar2wicketslabel={"inningsTwoWickets"}
            />

            {/* Run Rate Line Chart*/}
            <AnalysisLineChart
                TeamOne={TeamOne}
                TeamTwo={TeamTwo}
                onChange={handleChange('runrate')}
                value={filter.runrate}
                title={"Run Rate"}
                isTestMatch={isTestMatch}
                data={isTestMatch && (filter.runrate === "Both 2" || filter.runrate === "Team1secondinning" || filter.runrate === "Team2secondinning") ? formattedInningsTwoRunRateData
                    : formattedRunRateData}
                filter={filter.runrate}
                inningsOneLabel={inningsOneLabel}
                inningsTwoLabel={inningsTwoLabel}
                team1dataKey={'team1RunRate'}
                team2dataKey={'team2RunRate'}
            />

            {/* Worm Line Chart */}
            <AnalysisLineChart
                TeamOne={TeamOne}
                TeamTwo={TeamTwo}
                onChange={handleChange('worm')}
                value={filter.worm}
                title={"Worm"}
                isTestMatch={isTestMatch}
                data={isTestMatch && (filter.worm === "Both 2" || filter.worm === "Team1secondinning" || filter.worm === "Team2secondinning") ? formattedInningsTwoRunsData
                    : formattedRunsData}
                filter={filter.worm}
                inningsOneLabel={inningsOneLabel}
                inningsTwoLabel={inningsTwoLabel}
                team1dataKey={'team1Runs'}
                team2dataKey={'team2Runs'}
            />

            {/* Wickets Pie Chart */}
            {showPieData &&
                <AnalysisPieChart
                    team1={TeamOne}
                    team2={TeamTwo}
                    filter={filter.wickets}
                    onChange={handleChange('wickets')}
                    title={"Wickets Pie"}
                    data={pieData}
                    isTestMatch={isTestMatch}
                />
            }

            {/* Types of Runs Bar Chart */}
            <AnalysisBarChart
                team1={TeamOne}
                team2={TeamTwo}
                filter={filter.typesofruns}
                handleChange={handleChange('typesofruns')}
                data={isTestMatch && (filter.typesofruns === "Both 2" || filter.typesofruns === "Team1secondinning" || filter.typesofruns === "Team2secondinning") ? inningsTwoShots
                    : shots}
                inningsOneLabel={inningsOneLabel}
                inningsTwoLabel={inningsTwoLabel}
                title={"Types of Runs"}
                yaxisdatakey={"shotType"}
                yaxislabel={'Shots'}
                xaxislabel={'No of shots'}
                bar1datakey={"inningsOne"}
                bar2datakey={"inningsTwo"}
                isTestMatch={isTestMatch}
            />

            {/* Partnerships */}
            <AnalysisPartnership
                team1={TeamOne}
                team2={TeamTwo}
                onChange={handleChange('partnerships')}
                title={"Partnerships"}
                topsectionvalue={filter.partnerships}
                playerdata={player_data}
                data={PartnershipData}
                isTestMatch={isTestMatch}
            />

            {/* Wagon Wheel */}
            {showWagonWheel &&
                <WagonWheelGraph
                    team1={TeamOne}
                    team2={TeamTwo}
                    filter={filter.wagonwheel}
                    onChange={handleChange('wagonwheel')}
                    title={"Wagon Wheel"}
                    isTestMatch={isTestMatch}
                    data={FilterWagonWheelBasedOnPlayers}
                    team1Players={team1Players}
                    team2Players={team2Players}
                    BatterValue={filter.batter}
                    BowlerValue={filter.bowler}
                    onBatterChange={handleChange('batter')}
                    onBowlerChange={handleChange('bowler')}
                />
            }

        </Box>
    );
};

export default ScoreAnalysis;