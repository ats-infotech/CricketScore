'use client'
import { leaderBoardShorting, scrollTopDiv } from '@/components/common/commomFunction';
import { CommonText } from '@/components/common/commonText';
import CustomeErrorBox from '@/components/common/commonUi/CustomeErrorBox';
import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CustomeTabs from '../../components/common/commonUi/CustomeTabs';
import './Leaderboard.css';

// const typePlayer = [
//     { id: 0, type: 'Bat' },
//     { id: 1, type: 'Bowl' },
//     // { id: 2, type: 'AR' },
// ];

const typePlayer = [
    { label: 'Bat', key_name: 0 },
    { label: 'Bowl', key_name: 1 }
];

const CommonStatsSection = React.memo(({ name, innings, average, sr, runs, type, wickets, eco, teamName }) => {
    const allStats = [
        { label: "Inn", value: innings },
        { label: "Wickets", value: wickets },
        { label: "Runs", value: runs },
        { label: "Avg", value: average },
        { label: "Eco", value: eco },
        { label: "SR", value: sr },
    ];
    const stats = allStats.filter(stat => stat.value !== undefined && stat.value !== null);

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <Typography variant='body2'>{`${name} `}</Typography>
                <Typography variant='p'>{`(${teamName})`}</Typography>
            </Box>
            <Box className='leaderboard_stats'>
                {stats.map((stat, index) =>
                stat.value !== undefined && stat.value !== null ? (
                    <Box key={index} className="player_milestone_section">
                        <Typography variant='body2'>
                            {stat.label}: {stat.value}
                        </Typography>
                        {index !== stats.length - 1 && (
                            <Divider orientation="vertical" className='leaderboard_divider' />
                        )}
                    </Box>
                ) : null
            )}
            </Box>
        </Box>
    )
})

const PlayerMilestoneStats = React.memo(({ notOuts, highestScore, fours, sixes, hundreds, maidens, highestWicket, strikeRate, fiftys }) => {
    const allStats = [
        { label: "Hs", value: highestScore },
        { label: "N/O", value: notOuts },
        { label: "4s", value: fours },
        { label: "6s", value: sixes },
        { label: "50s", value: fiftys },
        { label: "100s", value: hundreds },
        { label: "Maiden", value: maidens },
        { label: "HW", value: highestWicket },
        { label: "SR", value: strikeRate },
    ];
    const stats = allStats.filter(stat => stat.value !== undefined && stat.value !== null);

    return (
        <Box className="leaderboard_player_milestone">
            {stats.map((stat, index) =>
                stat.value !== undefined && stat.value !== null ? (
                    <Box key={index} className="player_milestone_section">
                        <Typography className="milestone_item">
                            {stat.label}: {stat.value}
                        </Typography>
                        {index !== stats.length - 1 && (
                            <Divider orientation="vertical" className='leaderboard_divider' />
                        )}
                    </Box>
                ) : null
            )}
        </Box>
    )
})

const Leaderboard = ({ playerData, teamData }) => {

    const [activeTab, setActiveTab] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [activeId, setActiveId] = useState('')

    useEffect(() => {
        setActiveId('')
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleTypeSelection = (type) => {
        setAnimate(true);
        scrollTopDiv('leaderboard_stats_max_height')
        setActiveTab(type)
        leaderBoardShorting(playerData, type);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    };

    return (
        <>
            {
                playerData && playerData.length > 0
                    ?
                    <Box>
                        {/* <Box className="typeBox">
                            {
                                typePlayer.map((field, index) => (
                                    <Box
                                        key={index}
                                        className={`typePlayer ${activeTab === field.id ? 'active' : ''
                                            }`}
                                        onClick={() => handleTypeSelection(field.id)}
                                    >
                                        <Typography variant='body2' className={`typePlayerText ${activeTab === field.id ? 'typePlayerTextActive' : 'typePlayerText'}`}>{field.type}</Typography>
                                    </Box>
                                ))
                            }
                        </Box> */}
                        <Box className="typeBox">
                            <CustomeTabs data={typePlayer || []} onClick={handleTypeSelection} activeTab={activeTab} />
                        </Box>
                        <Box className={`leaderboard_stats_max_height ${animate ? 'activeAnimation' : ''}`}>
                            {
                                playerData.length > 0 && playerData.map((items, i) => {
                                    let innings = items.innings
                                    let runs = items.battingruns
                                    let balls = items.battingballs
                                    let batterout = items.battingout
                                    let sr = runs > 0 && balls > 0 ? Math.floor((runs / balls) * 100) : 0;
                                    let battingaverage = runs > 0 && batterout === 0 ? runs : runs > 0 && batterout > 0 ? Math.floor(runs / batterout) : 0
                                    let bowlingwickets = items.bowlingwickets
                                    let bowlingruns = items.bowlingruns
                                    let bowlingball = items.bowlingballs
                                    let overs = Math.floor(bowlingball / 6);
                                    let bowls = bowlingball % 6;
                                    let bowlingovers = `${overs}.${bowls}`;
                                    let bowlingaverage = bowlingruns > 0 && bowlingwickets === 0 ? '-' : bowlingruns > 0 && bowlingwickets > 0 ? Math.floor(bowlingruns / bowlingwickets) : 0
                                    let bowlingStrikeRate = bowlingball > 0 && bowlingwickets === 0 ? '-' : bowlingball > 0 && bowlingwickets > 0 ? Math.floor(bowlingball / bowlingwickets) : 0
                                    let ecostring = bowlingruns > 0 && bowlingball > 0 ? bowlingruns / bowlingovers : 0
                                    let eco = ecostring.toFixed(1)
                                    let teamName = teamData?.filter((item) => item?.id === items?.teamId)?.[0]

                                    return (
                                        <Box key={i} sx={{ cursor: 'pointer' }} onClick={() => setActiveId(items?.id)}>
                                            <Box className="leaderboard_stats_section">
                                                <Box className='leaderboard_image_section'>
                                                    {
                                                        items.playerImage
                                                            ? <Image unoptimized src={`/${items.playerImage}`} width={500} height={500} alt='' />
                                                            : <Box
                                                                className='imageTextBox'
                                                                sx={{
                                                                    backgroundColor: items?.playerColor
                                                                }}
                                                            >
                                                                {items?.letter}
                                                            </Box>
                                                    }
                                                </Box>
                                                <Box>
                                                    {activeTab === 0 &&
                                                        <CommonStatsSection name={items.playerName} teamName={teamName?.team_name} innings={innings} runs={runs} average={battingaverage} sr={sr} />
                                                    }
                                                    {
                                                        activeTab === 1 &&
                                                        <CommonStatsSection type={'bowler'} teamName={teamName?.team_name} name={items.playerName} innings={innings} wickets={bowlingwickets} average={bowlingaverage} eco={eco} />
                                                    }
                                                    {items?.id === activeId && <React.Fragment>
                                                        {
                                                            activeTab === 0 &&
                                                            <PlayerMilestoneStats highestScore={items?.highestScore} notOuts={items?.battingnotout} fours={items?.battingfour}
                                                                sixes={items?.battingsix} hundreds={items?.battinghundred} fiftys={items?.battingfifty} />
                                                        }
                                                        {
                                                            activeTab === 1 &&
                                                            <PlayerMilestoneStats highestWicket={items?.highestWicket} maidens={items?.bowlingmaiden} strikeRate={bowlingStrikeRate} />
                                                        }
                                                    </React.Fragment>}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Box>

                    </Box>
                    :
                    <Box className='no-file-box'>
                        <CustomeErrorBox icon='noFile' title={CommonText.LeaderBoardDataNotAvailable} />
                    </Box>
            }
        </>
    )
}

export default React.memo(Leaderboard)