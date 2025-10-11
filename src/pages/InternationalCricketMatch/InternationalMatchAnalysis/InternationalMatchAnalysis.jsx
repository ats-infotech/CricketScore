'use client';
import { AnalysisBarChart, AnalysisLineChart, AnalysisPartnership, AnalysisPieChart } from '@/components/common/commonUi/AnalysisCharts/AnalysisCharts';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './InternationalMatchAnalysis.css';

const manhattanWithWickets = (inningsData) => {
    if (!inningsData?.statistics?.manhattan) return [];
    const manhattan = inningsData.statistics.manhattan.map((item) => ({
        over: item.over,
        runs: item.runs,
        wickets: 0,
    }));
    inningsData.fows?.forEach((wicket) => {
        const overNumber = Math.floor(wicket.overs_at_dismissal);
        const overIndex = overNumber - 1;
        if (manhattan[overIndex]) {
            manhattan[overIndex].wickets += 1;
        }
    });
    return manhattan;
};

const InternationalMatchScoreAnalysis = () => {
    const { pastMatchStatistics, liveMatchScoreboard } = useSelector(state => state.matchData)
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    let isTestMatch = liveMatchScoreboard?.response?.format_str === 'Test' ? true : false
    let isFollowOn = liveMatchScoreboard?.response?.scorecard?.is_followon === 1 ? true : false
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

    // Innings Data
    const inningsOneOversData = manhattanWithWickets(pastMatchStatistics?.response?.innings?.[0]) || [];
    const inningsTwoOversData = manhattanWithWickets(pastMatchStatistics?.response?.innings?.[1]) || [];
    const inningsThreeOversData = manhattanWithWickets(pastMatchStatistics?.response?.innings?.[2]) || [];
    const inningsFourOversData = manhattanWithWickets(pastMatchStatistics?.response?.innings?.[3]) || [];
    const isTeam1BattingFirst = pastMatchStatistics?.response?.innings?.[0]?.batting_team_id === pastMatchStatistics?.response?.teams?.[0]?.team_id;
    const TeamOne = isTeam1BattingFirst ? team1 : team2
    const TeamTwo = isTeam1BattingFirst ? team2 : team1

    useEffect(() => {
        setTeam1({
            team_name: pastMatchStatistics?.response?.teams?.[0]?.name
        });
        setTeam2({
            team_name: pastMatchStatistics?.response?.teams?.[1]?.name
        })
    }, [pastMatchStatistics]);

    const handleChange = (field) => event => {
        setFilter(prev => ({ ...prev, [field]: event.target.value }));
    };

    const inningsOneStats = inningsOneOversData;
    const inningsTwoStats = inningsTwoOversData;
    const inningsThreeStats = inningsThreeOversData;
    const inningsFourStats = inningsFourOversData;

    // Merge data for first innings
    const mergedData = inningsOneStats.map((item, index) => {
        const inningsTwo = inningsTwoStats[index] || {};
        return {
            over: item.over,
            inningsOneRuns: item.runs,
            inningsOneWickets: item.wickets,
            inningsTwoRuns: inningsTwo.runs || 0,
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
    const inningsOneRunRate = pastMatchStatistics?.response?.innings?.[0]?.statistics?.runrates
    const inningsTwoRunRate = pastMatchStatistics?.response?.innings?.[1]?.statistics?.runrates
    const inningsThreeRunRate = pastMatchStatistics?.response?.innings?.[2]?.statistics?.runrates
    const inningsFourRunRate = pastMatchStatistics?.response?.innings?.[3]?.statistics?.runrates
    const maxOvers = Math.max(inningsOneRunRate?.length, inningsTwoRunRate?.length);
    const inningsTwoMaxOvers = Math.max(inningsThreeRunRate?.length, inningsFourRunRate?.length)
    const combinedRunRateData = [];
    const combinedInningsTwoRunRateData = []

    for (let i = 0; i < maxOvers; i++) {
        const over1 = inningsOneRunRate[i];
        const over2 = inningsTwoRunRate[i];

        if (over1 != null && over2 != null) {
            combinedRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runrate ?? over1.runRate,
                team2RunRate: over2.runrate ?? over2.runRate,
            });
        } else if (over1 != null) {
            combinedRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runrate ?? over1.runRate,
                team2RunRate: null,
            });
        } else if (over2 != null) {
            combinedRunRateData.push({
                over: over2.over,
                team1RunRate: null,
                team2RunRate: over2.runrate ?? over2.runRate,
            });
        }
    }
    for (let i = 0; i < inningsTwoMaxOvers; i++) {
        const over1 = isFollowOn ? inningsFourRunRate[i] : inningsThreeRunRate[i];
        const over2 = isFollowOn ? inningsThreeRunRate[i] : inningsFourRunRate[i];
        if (over1 != null && over2 != null) {
            combinedInningsTwoRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runrate ?? over1.runRate,
                team2RunRate: over2.runrate ?? over2.runRate,
            });
        } else if (over1 != null) {
            combinedInningsTwoRunRateData.push({
                over: over1.over,
                team1RunRate: over1.runrate ?? over1.runRate,
                team2RunRate: null,
            });
        } else if (over2 != null) {
            combinedInningsTwoRunRateData.push({
                over: over2.over,
                team1RunRate: null,
                team2RunRate: over2.runrate ?? over2.runRate,
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
    const mergeAndSumWicketData = (data1 = [], data2 = []) => {
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
    const preparePieData = (wicketArray = []) => {
        if (!Array.isArray(wicketArray)) return [];
        const wicketMap = wicketArray.reduce((acc, item) => {
            acc[item.key.toLowerCase()] = item.value || 0;
            return acc;
        }, {});
        const data = [
            { name: 'LBW', value: wicketMap.lbw || 0, color: 'var(--chart-light-green)' },
            { name: 'Catches', value: wicketMap.caught || 0, color: 'var(--chart-blue)' },
            { name: 'Stumping', value: wicketMap.stumped || 0, color: 'var(--chart-purple)' },
            { name: 'Run Out', value: wicketMap.runout || 0, color: 'var(--chart-orange-red)' },
            { name: 'Bowled', value: wicketMap.bowled || 0, color: 'var(--chart-yellow)' },
            { name: 'Hit Wicket', value: wicketMap.hitwicket || 0, color: 'var(--chart-pink)' },
            { name: 'Retired Hurt', value: wicketMap.retired || 0, color: 'var(--chart-coral)' },
            { name: 'Retired Out', value: wicketMap.retiredout || 0, color: 'var(--chart-brown)' },
            { name: 'Obstructing Field', value: wicketMap.fieldobstruction || 0, color: 'var(--chart-grey)' },
        ];
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        if (totalValue === 0 && filter.wickets !== "Both") {
            return [{ name: 'No Wickets Lost', value: 0, color: 'var(--chart-green)' }];
        }
        return data.filter(item => item.value > 0);
    };
    const inningsOneWicket = pastMatchStatistics?.response?.innings?.[0]?.statistics?.wickets || [];
    const inningsTwoWicket = pastMatchStatistics?.response?.innings?.[1]?.statistics?.wickets || [];
    const inningsThreeWicket = pastMatchStatistics?.response?.innings?.[2]?.statistics?.wickets || [];
    const inningsFourWicket = pastMatchStatistics?.response?.innings?.[3]?.statistics?.wickets || [];
    const inningsOnePieData = preparePieData(inningsOneWicket);
    const inningsTwoPieData = preparePieData(inningsTwoWicket);
    const inningsThreePieData = preparePieData(inningsThreeWicket);
    const inningsFourPieData = preparePieData(inningsFourWicket);
    const pieData =
        filter.wickets === 'Both' || filter.wickets === 'Both 1'
            ? mergeAndSumWicketData(inningsOnePieData, inningsTwoPieData)
            : filter.wickets === 'Both 2' ? mergeAndSumWicketData(inningsThreePieData, inningsFourPieData)
                : filter.wickets === 'Team1' || filter.wickets === 'Team1firstinning' ? inningsOnePieData
                    : filter.wickets === 'Team2' || filter.wickets === 'Team2firstinning' ? inningsTwoPieData
                        : (filter.wickets === 'Team1secondinning' && !isFollowOn) || (filter.wickets === 'Team2secondinning' && isFollowOn)
                            ? inningsThreePieData : (filter.wickets === 'Team2secondinning' && !isFollowOn) ||
                                (filter.wickets === 'Team1secondinning' && isFollowOn) ? inningsFourPieData : [];
    const showPieData = filter.wickets === 'Both' && pieData.length === 0 ? false : true

    // Types of Runs Bar Chart
    const inningsOneShotsCount = pastMatchStatistics?.response?.innings?.[0]?.statistics?.runtypes || []
    const inningsTwoShotsCount = pastMatchStatistics?.response?.innings?.[1]?.statistics?.runtypes || []
    const inningsThreeShotsCount = pastMatchStatistics?.response?.innings?.[2]?.statistics?.runtypes || []
    const inningsFourShotsCount = pastMatchStatistics?.response?.innings?.[3]?.statistics?.runtypes || []
    const prepareChartData = (inningsOneShotsCount = [], inningsTwoShotsCount = [], innings) => {
        const mapInningsOne = Object.fromEntries(inningsOneShotsCount.map(item => [item.key, item.value]));
        const mapInningsTwo = Object.fromEntries(inningsTwoShotsCount.map(item => [item.key, item.value]));
        const uniqueKeys = Array.from(new Set([
            ...inningsOneShotsCount.map(item => item.key),
            ...inningsTwoShotsCount.map(item => item.key),
        ]));
        const sortedKeys = uniqueKeys.sort((a, b) => {
            const numA = parseInt(a.replace('run', ''), 10);
            const numB = parseInt(b.replace('run', ''), 10);
            return numA - numB;
        });
        return sortedKeys.map((key) => {
            const shotNumber = key.replace('run', '');
            return {
                shotType: shotNumber,
                inningsOne: isFollowOn && innings === "two" ? mapInningsTwo[key] || 0 : mapInningsOne[key] || 0,
                inningsTwo: isFollowOn && innings === "two" ? mapInningsOne[key] || 0 : mapInningsTwo[key] || 0,
            };
        }).reverse();
    };
    const shots = prepareChartData(inningsOneShotsCount, inningsTwoShotsCount)
    const inningsTwoShots = prepareChartData(inningsThreeShotsCount, inningsFourShotsCount, 'two')

    // Partnerships
    const mapPlayersById = (playersArray) => {
        return playersArray?.reduce((acc, player) => {
            acc[player.player_id] = player;
            return acc;
        }, {}) || {};
    };
    const getPlayerName = (id, playersMap) => playersMap?.[id]?.short_name || "";
    const CalculatePartnershipsFromStructuredData = (partnershipData, playersMap) => {
        if (!Array.isArray(partnershipData)) return [];
        return partnershipData
            .filter(p => p.batsmen.length === 2)
            .map(p => {
                const [batter1, batter2] = p.batsmen;
                const batter1Id = batter1.batsman_id;
                const batter2Id = batter2.batsman_id;
                const pairId = [batter1Id, batter2Id].sort().join('-');
                const batter1name = getPlayerName(batter1Id, playersMap)
                const batter2name = getPlayerName(batter2Id, playersMap)

                return {
                    wicketId: pairId,
                    batter1Id,
                    batter2Id,
                    batter1run: batter1.runs,
                    batter2run: batter2.runs,
                    batter1ball: batter1.balls_faced,
                    batter2ball: batter2.balls_faced,
                    batter1name: batter1name,
                    batter2name: batter2name,
                    partnershipRun: p.runs,
                    partnershipBalls: p.balls_faced,
                    order: p.order
                };
            });
    };
    const playersMap = mapPlayersById(pastMatchStatistics?.response?.players);
    const inningsOnePartnerships = CalculatePartnershipsFromStructuredData(
        pastMatchStatistics?.response?.innings?.[0]?.statistics?.partnership,
        playersMap
    );
    const inningsTwoPartnerships = CalculatePartnershipsFromStructuredData(
        pastMatchStatistics?.response?.innings?.[1]?.statistics?.partnership,
        playersMap
    );
    const inningsThreePartnerships = CalculatePartnershipsFromStructuredData(
        pastMatchStatistics?.response?.innings?.[2]?.statistics?.partnership,
        playersMap
    );
    const inningsFourPartnerships = CalculatePartnershipsFromStructuredData(
        pastMatchStatistics?.response?.innings?.[3]?.statistics?.partnership,
        playersMap
    );
    const PartnershipData =
        filter.partnerships === "Team1" || filter.partnerships === "Team1firstinning"
            ? inningsOnePartnerships : filter.partnerships === "Team2" || filter.partnerships === "Team2firstinning"
                ? inningsTwoPartnerships : (filter.partnerships === "Team1secondinning" && !isFollowOn) ||
                    (filter.partnerships === "Team2secondinning" && isFollowOn) ? inningsThreePartnerships : inningsFourPartnerships;

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
                data={PartnershipData}
                isTestMatch={isTestMatch}
            />
        </Box>
    );
};

export default InternationalMatchScoreAnalysis;