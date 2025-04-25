import { Box, Typography, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, } from 'recharts';
import './AnalysisCharts.css'
import { useEffect, useMemo, useState } from "react";
import WagonWheel from '../WagonWheel/WagonWheel';

// Top Section contains title and Select for Graphs
const TopSection = ({ value, onChange, title, team1, team2, type, isTestMatch, team1Players, team2Players, onBowlerChange, onBatterChange, BowlerValue, BatterValue }) => {
    return (
        <>
            <Box className="chart_title">
                <Typography variant="body2">{title}</Typography>
                <Box className="analysis-gradient-line"></Box>
            </Box>

            {
                isTestMatch ? <TestFilterSelect value={value} onChange={onChange} team1={team1} team2={team2} type={type} />
                    : <FilterSelect value={value} onChange={onChange} team1={team1} team2={team2} type={type} />
            }
            {
                type === 'wagonWheel' &&
                <Box className="analysis_player_select">
                    <FilterPlayerSelect disable={value === "Both" || value === "Both 1" || value === "Both 2"} players={value === "Team1" || value === "Team1firstinning" || value === "Team1secondinning" ? team1Players : team2Players} onChange={onBatterChange} value={BatterValue} type={"batter"}/>
                    <FilterPlayerSelect disable={value === "Both" || value === "Both 1" || value === "Both 2"} players={value === "Team1" || value === "Team1firstinning" || value === "Team1secondinning" ? team2Players : team1Players} onChange={onBowlerChange} value={BowlerValue} type={"bowler"}/>
                </Box>
            }
        </>
    )
}

// limited over Match select
const FilterSelect = ({ value, onChange, team1, team2, type }) => {
    return (
        <Box className="filter_section">
            <Select value={value} onChange={onChange} size="small" variant="outlined">
                {type !== "partnerships" && <MenuItem value="Both">Both Teams</MenuItem>}
                <MenuItem value="Team1">{team1?.team_name || 'Team 1'}</MenuItem>
                <MenuItem value="Team2">{team2?.team_name || 'Team 2'}</MenuItem>
            </Select>
        </Box>
    )
}

// Test Match select
const TestFilterSelect = ({ value, onChange, team1, team2, type }) => {
    return (
        <Box className="filter_section">
            <Select value={value} onChange={onChange} size="small" variant="outlined" >
                {type !== "partnerships" && <MenuItem value="Both 1">Both Teams 1st innnings</MenuItem>}
                {type !== "partnerships" && <MenuItem value="Both 2">Both Teams 2nd innnings</MenuItem>}
                <MenuItem value="Team1firstinning">{team1?.team_name || 'Team 1'} 1st inning</MenuItem>
                <MenuItem value="Team1secondinning">{team1?.team_name || 'Team 1'} 2nd inning</MenuItem>
                <MenuItem value="Team2firstinning">{team2?.team_name || 'Team 2'} 1st inning</MenuItem>
                <MenuItem value="Team2secondinning">{team2?.team_name || 'Team 2'} 2nd inning</MenuItem>
            </Select>
        </Box>
    )
}

// Players Select
const FilterPlayerSelect = ({ value, onChange, players, type, disable }) => {
    return (
        <Box className={`filter_section ${disable ? 'disable' : ''}`}>
            <Select displayEmpty value={value || ''}  onChange={onChange} disabled={disable} size="small" variant="outlined" >
                <MenuItem value=''>{type === "batter" ? 'All Batters' : 'All Bowler'}</MenuItem>
                {
                    players.length > 0 && players.map((items,i) => {
                        return(
                            <MenuItem key={i} value={items?.id} >{items?.playerName}</MenuItem>
                        )
                    })
                }
            </Select>
        </Box>
    )
}

// This Wicket Label is for Manhattan graph
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

// This tooltip is specially for Manhattan graph
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

// This section is only for Partnership
const PartnershipCard = ({ data, playerdata }) => {
    const { batter1Id, batter1run, batter1ball, batter2Id, batter2run, batter2ball, partnershipRun } = data;
    const batter1name = playerdata?.data?.find((items) => items.id === batter1Id)?.playerName || 'Striker'
    const batter2name = playerdata?.data?.find((items) => items.id === batter2Id)?.playerName || 'Non-Striker'
    const totalRuns = batter1run + batter2run;
    const batter1Percentage = totalRuns === 0 ? 0 : (batter1run / totalRuns) * 100;
    const batter2Percentage = totalRuns === 0 ? 0 : (batter2run / totalRuns) * 100;

    return (
        <Box className="partnership_card">
            <Box className="batter_info">
                <p className="batter_name">{batter1name}</p>
                <p className="batter_score">{batter1run}({batter1ball})</p>
            </Box>

            <Box className="partnership_runs_main_section">
                <Box className="partnership_run_color_partition">
                    <Box className="partnership_run_left_section">
                        <Box sx={{ width: batter1Percentage, backgroundColor: 'var(--light-green)', height: '40px' }} ></Box>
                    </Box>
                    <Box className="partnership_run_right_section">
                        <Box sx={{ width: batter2Percentage, backgroundColor: 'var(--yellow)', height: '40px' }} ></Box>
                    </Box>
                </Box>
                <Box className='partnership_runs_section'>
                    <p className="partnership_runs">{`${partnershipRun}(${batter1ball + batter2ball})`}</p>
                </Box>
            </Box>

            <Box className="batter_info">
                <p className="batter_name">{batter2name}</p>
                <p className="batter_score">{batter2run}({batter2ball})</p>
            </Box>
        </Box>
    );
};

// bar chart
export const AnalysisBarChart = ({ team1, team2, filter, handleChange, data, inningsOneLabel, inningsTwoLabel, title, yaxisdatakey,
    yaxislabel, xaxislabel, bar1datakey, bar2datakey, bar1wicketslabel, bar2wicketslabel, isTestMatch }) => {
    const isTypeOfRunsGraph = title === "Types of Runs" ? true : false
    const chartWidth = useMemo(() => {
        const minWidthPerData = isTypeOfRunsGraph ? 2 : 40;
        return Math.max(data.length * minWidthPerData, 350);
    }, [data]);

    return (
        <>
            <TopSection team1={team1} team2={team2} value={filter} onChange={handleChange} title={title} isTestMatch={isTestMatch} />
            <Box className="bar_chart_container">
                <Box sx={{ width: chartWidth }}>
                    <ResponsiveContainer width="100%" height={400}>
                        {/* for manhattan horizontal layout is used and for types of runs vertical layout is used */}
                        <BarChart data={data} layout={!isTypeOfRunsGraph ? "horizontal" : 'vertical'} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                            <Legend verticalAlign="top" align="center" height={36} />
                            {/* all are not given in one condition as it will not show up if we close in a div or fragment */}

                            {/* x-axis data for manhattan chart */}
                            {!isTypeOfRunsGraph && <XAxis dataKey={yaxisdatakey} type="category" tickFormatter={(value) => `${value}`}
                                label={{ value: yaxislabel, position: "insideBottom", offset: -5 }} />}
                            {/* y-axis data for manhattan chart */}
                            {!isTypeOfRunsGraph && <YAxis type="number" label={{ value: xaxislabel, angle: -90, position: "insideLeft" }} />}

                            {/* x-axis data for types of runs chart */}
                            {isTypeOfRunsGraph && <XAxis type="number" label={{ value: xaxislabel, position: 'insideBottom', offset: -5 }} />}
                            {/* y-axis data for types of runs chart */}
                            {isTypeOfRunsGraph && <YAxis dataKey={yaxisdatakey} type="category" tickFormatter={(value) => `${value}s`} width={40}
                                label={{ value: yaxislabel, angle: -90, position: 'insideLeft' }} />}

                            {!isTypeOfRunsGraph ? <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} /> : <Tooltip cursor={{ fill: 'transparent' }} />}

                            {(filter === "Both" || filter === "Team1" || filter === "Both 1" || filter === "Both 2" || filter === "Team1firstinning" || filter === "Team1secondinning") && (
                                <Bar dataKey={bar1datakey} fill="var(--light-green)" name={inningsOneLabel} barSize={15}>
                                    {!isTypeOfRunsGraph && <LabelList dataKey={bar1wicketslabel} position="right" content={(props) => <CustomWicketLabel {...props} />} />}
                                </Bar>
                            )}
                            {(filter === "Both" || filter === "Team2" || filter === "Both 1" || filter === "Both 2" || filter === "Team2firstinning" || filter === "Team2secondinning") && (
                                <Bar dataKey={bar2datakey} fill="var(--yellow)" name={inningsTwoLabel} barSize={15}>
                                    {!isTypeOfRunsGraph && <LabelList dataKey={bar2wicketslabel} position="right" content={(props) => <CustomWicketLabel {...props} />} />}
                                </Bar>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    );
};

// Line Chart
export const AnalysisLineChart = ({ data, inningsOneLabel, inningsTwoLabel, team1dataKey, team2dataKey, filter, TeamOne, TeamTwo, onChange, title, value, isTestMatch }) => {
    const chartWidth = useMemo(() => {
        const minWidthPerData = 30;
        return Math.max(data.length * minWidthPerData, 350);
    }, [data]);

    return (
        <>
            <TopSection team1={TeamOne} team2={TeamTwo} value={value} onChange={onChange} title={title} isTestMatch={isTestMatch} />
            <Box className="line_chart_container">
                <Box sx={{ width: chartWidth }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} width={chartWidth} margin={{ left: -10, bottom: 15 }} >

                            <XAxis dataKey="over" label={{ value: "OVERS", position: "insideBottom", offset: -10 }} padding={{ left: 10, right: 10 }} allowDuplicatedCategory={false} />

                            <YAxis domain={[0, "auto"]} label={{ value: "RUNS", angle: -90, position: "insideLeft", offset: 15 }} />

                            <Tooltip />

                            <Legend verticalAlign="top" align="center" wrapperStyle={{ top: 0 }} />

                            {(filter === "Both" || filter === "Team1" || filter === "Both 1" || filter === "Both 2" || filter === "Team1firstinning" || filter === "Team1secondinning") && (
                                <Line fill="var(--light-green)" type="monotone" dataKey={team1dataKey} strokeWidth={2} name={inningsOneLabel} stroke="var(--light-green)" connectNulls />
                            )}

                            {(filter === "Both" || filter === "Team2" || filter === "Both 1" || filter === "Both 2" || filter === "Team2firstinning" || filter === "Team2secondinning") && (
                                <Line fill="var(--yellow)" type="monotone" dataKey={team2dataKey} strokeWidth={2} name={inningsTwoLabel} stroke="var(--yellow)" connectNulls />
                            )}

                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    );
};

// Pie Chart
export const AnalysisPieChart = ({ team1, team2, filter, onChange, title, data, isTestMatch }) => {
    const colorMap = {
        'LBW': 'var(--light-green)',
        'Stumping': 'var(--purple)',
        'Catches': 'var(--chart-blue)',
        'Run Out': 'var(--orange-red)',
        'Bowled': 'var(--yellow)',
        'Hit Wicket': 'var(--pink)',
        'Retired Hurt': 'var(--coral)',
    };

    return (
        <>
            <TopSection team1={team1} team2={team2} value={filter} onChange={onChange} title={title} isTestMatch={isTestMatch} />
            <ResponsiveContainer className="pie_chart_container" width="90%" height={300}>
                <PieChart>
                    <Legend
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ marginBottom: 10 }}
                    />

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        style={{ outline: 'none' }}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                            const RADIAN = Math.PI / 180;
                            const labelRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
                            const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
                            const item = data[index];
                            const name = item?.name;
                            const fillColor = colorMap[name] || 'grey';

                            return (
                                <>
                                    <circle cx={x} cy={y} r={12} fill="white" stroke={fillColor} strokeWidth={2} />
                                    <text
                                        x={x}
                                        y={y}
                                        fill={fillColor}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        style={{ fontSize: 'var(--ex-small) !important', fill: `${fillColor} !important` }}
                                        fontWeight="bold"
                                    >
                                        {value}
                                    </text>
                                </>
                            );
                        }}
                    >
                        {data.map((entry, index) => {
                            const fillColor = colorMap[entry.name] || 'gray';
                            return <Cell key={`cell-${index}`} fill={fillColor} />;
                        })}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}

// Partnership Section
export const AnalysisPartnership = ({ data, playerdata, team1, team2, title, onChange, topsectionvalue, isTestMatch }) => {
    return (
        <>
            <TopSection value={topsectionvalue} onChange={onChange} team1={team1} team2={team2} title={title} type={"partnerships"} isTestMatch={isTestMatch} />
            <Box sx={{ marginTop: '15px' }} className="partnership_section">
                {data.map((item, i) => (
                    <PartnershipCard key={i} data={item} playerdata={playerdata} />
                ))}
            </Box>
        </>
    )
}

// Wagon Wheel
export const WagonWheelGraph = ({ team1, team2, title, filter, onChange, isTestMatch, data, team1Players, team2Players, onBatterChange, onBowlerChange, BatterValue, BowlerValue }) => {
    const [percentages, setPercentages] = useState([]);
    const shotsColors = {
        0: { label: '0s', color: 'var(--dots)' },
        1: { label: '1s', color: 'var(--singles)' },
        2: { label: '2s', color: 'var(--doubles)' },
        3: { label: '3s', color: 'var(--triples)' },
        4: { label: '4s', color: 'var(--fours)' },
        5: { label: '5s', color: 'var(--fives)' },
        6: { label: '6s', color: 'var(--sixes)' },
        7: { label: 'Others', color: 'var(--othershots)' },
    }

    useEffect(() => {
        const totalShots = data.length;
        const shotFrequency = data.reduce((acc, shot) => {
            acc[shot.currentShot] = (acc[shot.currentShot] || 0) + 1;
            return acc;
        }, {});
        const percentageData = Object.keys(shotFrequency).map((shot) => {
            const count = shotFrequency[shot];
            const percentage = ((count / totalShots) * 100).toFixed(2);
            return {
                shot: shot,
                percentage: percentage,
            };
        });
        setPercentages(percentageData)
    }, [data]);

    return (
        <Box sx={{marginTop: '30px'}}>
            <TopSection team1={team1} team2={team2} value={filter} onChange={onChange} title={title} onBatterChange={onBatterChange} onBowlerChange={onBowlerChange}
                isTestMatch={isTestMatch} type={'wagonWheel'} team1Players={team1Players} team2Players={team2Players} BatterValue={BatterValue} BowlerValue={BowlerValue} />
            <Box className="wagon_wheel_lable_section">
                {
                    percentages.length > 0 && percentages.map((items, i) => {
                        return (
                            <Box key={i} className="wagon_wheel_label" sx={{ backgroundColor: items?.shot > 6 ? shotsColors[7].color : shotsColors[parseInt(items.shot)].color }}>
                                <Typography variant='body2'>{items?.shot > 6 ? shotsColors[7].label : shotsColors[parseInt(items.shot)].label}</Typography>
                                <Typography variant='body2'>{items?.percentage}%</Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <WagonWheel shots={data} onClick={undefined} type="graph" />
            <Typography className='errorText' sx={{ textAlign: 'center', marginTop: '10px', fontWeight: '500' }}>*Runs may not tally if scorer has not used WW properly</Typography>
        </Box>
    )
}