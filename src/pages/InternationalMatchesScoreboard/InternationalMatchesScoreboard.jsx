'use client'
import { useDispatch, useSelector } from 'react-redux'
import './InternationalMatchesScoreboard.css'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getLiveMatchesScorecard, getPastMatchesScorecard } from '@/redux/internationalMatchesSlices/matchesSlice'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Banner from '@/components/common/commonUi/Banner/Banner'
import SwitchSelect from '@/components/common/commonUi/SwitchSelect/SwitchSelect'
import SvgIcon from '@/assets/icons/SvgIcon'
import ExtraSection from '@/components/common/commonUi/ExtrasSection/ExtraSection'
import CommonBack from '@/components/common/commonUi/commonBack'

const batterheader = [
    { label: 'Batter', icon: 'striker' },
    { label: 'R' },
    { label: 'B' },
    { label: "4's" },
    { label: "6's" },
    { label: 'SR' }
]

const bowlerheader = [
    { label: 'Bowler', icon: 'whiteball' },
    { label: 'O' },
    { label: 'R' },
    { label: "M" },
    { label: "W" },
    { label: 'Eco' }
]

const batterbody = ['name', 'runs', 'balls_faced', 'fours', 'sixes', 'strike_rate']

const bowlerbody = ['name', 'overs', 'runs_conceded', 'maidens', 'wickets', 'econ']

const parseScoreFull = (scoreFull) => {
    if (!scoreFull) return { run: 0, wicket: 0, over: 0, ball: 0 };

    const match = scoreFull.match(/(\d+)\/(\d+)\s+\(([\d.]+)\s*ov\)/);
    if (!match) return { run: 0, wicket: 0, over: 0, ball: 0 };

    const [, run, wicket, overs] = match;
    const [over, ball = 0] = overs.split(".");

    return {
        run: +run,
        wicket: +wicket,
        over: +over,
        ball: +ball
    };
};

const BatterTable = ({ data, extras, onClick, show }) => {
    const dataToShow = show ? data : data?.slice(0, 3)
    const extra = {
        wd: extras?.wides || 0,
        nb: extras?.noballs || 0,
        b: extras?.byes || 0,
        lb: extras?.legbyes || 0
    };

    return (
        <Box className='international-matches-scorecard_table_section'>
            <TableContainer className='international-matches-scorecard_table_container'>
                <Table className='international-matches-scorecard_table' aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                batterheader.map((item, index) => {
                                    return (
                                        <TableCell key={index} className="international-matches-scorecard_table-cell">
                                            {item.icon && <SvgIcon id={item.icon} />}
                                            {item.label}
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataToShow?.length > 0 && dataToShow?.map((items, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <TableRow>
                                            {
                                                batterbody?.map((item, e) => {
                                                    return (
                                                        <TableCell className="international-matches-scorecard_table-cell data" key={e}>{items[item]}{item === 'name' &&
                                                            items?.how_out === 'Not out' ? '*' : ''}</TableCell>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                        {
                                            items?.how_out !== 'Not out' && (
                                                <TableRow>
                                                    <TableCell
                                                        className="international-matches-scorecard_table-cell data out"
                                                        colSpan={batterbody.length}
                                                    >
                                                        {items?.how_out}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <ExtraSection totalBYERuns={extra?.b} totalLBRuns={extra?.lb} totalWDRuns={extra?.wd} totalNBRuns={extra?.nb} type={'scorecard'} />
            {data?.length > 3 && (
                <Button onClick={onClick} className="international-matches-scorecard_button">
                    {show ? 'Show Less' : 'Show More'}
                    {show ? <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} style={{ transform: 'rotate(180deg)' }} />
                        : <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} />}
                </Button>
            )}
        </Box>
    )
}

const BowlerTable = ({ data, show, onClick }) => {
    const dataToShow = show ? data : data?.slice(0, 3)

    return (
        <Box className='international-matches-scorecard_table_section'>
            <TableContainer className='international-matches-scorecard_table_container'>
                <Table className='international-matches-scorecard_table' aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                bowlerheader.map((item, index) => {
                                    return (
                                        <TableCell key={index} className="international-matches-scorecard_table-cell">
                                            {item.icon && <SvgIcon id={item.icon} />}
                                            {item.label}
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataToShow?.length > 0 && dataToShow?.map((items, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <TableRow>
                                            {
                                                bowlerbody?.map((item, e) => {
                                                    return (
                                                        <TableCell className="international-matches-scorecard_table-cell data" key={e}>{items[item]}</TableCell>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    </React.Fragment>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {data?.length > 3 && (
                <Button onClick={onClick} className="international-matches-scorecard_button">
                    {show ? 'Show Less' : 'Show More'}
                    {show ? <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} style={{ transform: 'rotate(180deg)' }} />
                        : <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} />}
                </Button>
            )}
        </Box>
    )
}

const SecondInningsCommonSection = ({ battingData, bowlingData, extras, showAllBatter, showAllBowler, showBatterClick, showBowlerClick }) => {
    return (
        <Box sx={{ marginTop: '30px' }}>
            <Box className="international-matches-scorecard_first_section">
                <Typography variant="p">{'Second Innings'}</Typography>
                <Box className='international-matches-scorecard_lineargradient'></Box>
            </Box>
            <BatterTable onClick={showBatterClick} show={showAllBatter} data={battingData} extras={extras} />
            <BowlerTable onClick={showBowlerClick} show={showAllBowler} data={bowlingData} />
        </Box>
    )
}

const InternationalMatchesScoreboard = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const router = useRouter()
    const { liveMatchScoreboard, liveMatches, recentMatches } = useSelector(state => state.matchData)
    const [teams, setTeams] = useState([])
    const [currentTeam, setCurrentTeam] = useState(0)
    const [showAllBatter, setShowAllBatter] = useState({
        inningsOne: false,
        inningsTwo: false
    })
    const [showAllBowler, setShowAllBowler] = useState({
        inningsOne: false,
        inningsTwo: false
    })
    let liveScorecard = liveMatchScoreboard?.response?.scorecard?.innings
    let InningsLength = Object?.keys(liveScorecard || {})?.length
    let isExtraInnings = InningsLength > 2
    const isTeamABattingFirst = liveMatchScoreboard?.response?.scorecard?.teama?.team_id === liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.batting_team_id
    let isTeam1PlayingThirdInnings = liveMatchScoreboard?.response?.scorecard?.teama?.team_id === liveMatchScoreboard?.response?.scorecard?.innings?.[2]?.batting_team_id
    let showFirstInningsTitle = InningsLength <= 2 ? false : InningsLength > 3 ? true
        : InningsLength > 2 && ((isTeam1PlayingThirdInnings && currentTeam === 0) || (!isTeam1PlayingThirdInnings && currentTeam === 1)) ? true
            : InningsLength > 2 && ((isTeam1PlayingThirdInnings && currentTeam === 1) || (!isTeam1PlayingThirdInnings && currentTeam === 0)) ? true : false

    useEffect(() => {
        if (liveScorecard?.length === 1) {
            if (isTeamABattingFirst) {
                setTeams([liveMatchScoreboard?.response?.scorecard?.teama?.short_name])
            } else {
                setTeams([liveMatchScoreboard?.response?.scorecard?.teamb?.short_name])
            }
        } else {
            setTeams([liveMatchScoreboard?.response?.scorecard?.teama?.short_name, liveMatchScoreboard?.response?.scorecard?.teamb?.short_name])
        }
    }, [isTeamABattingFirst, liveMatchScoreboard])

    useEffect(() => {
        const handleApiCall = async () => {
            const currentMatch = Array.isArray(liveMatches?.response?.items)
                ? liveMatches.response.items.find(item => item?.match_id === parseInt(params?.matchId))
                : null;

            const pastMatch = Array.isArray(recentMatches?.response?.items)
                ? recentMatches.response.items.find(item => item?.match_id === parseInt(params?.matchId))
                : null;

            if (currentMatch) {
                await dispatch(getLiveMatchesScorecard(params?.matchId));
            } else if (pastMatch) {
                await dispatch(getPastMatchesScorecard(params?.matchId));
            }
        };

        handleApiCall();
    }, [liveMatches, recentMatches, params?.matchId, dispatch]);

    const FirstInningsScores = parseScoreFull(liveScorecard?.[0]?.scores_full);
    const SecondInningsScores = parseScoreFull(liveScorecard?.[1]?.scores_full);
    const ThirdInningsScores = parseScoreFull(liveScorecard?.[2]?.scores_full);
    const FourthInningsScores = parseScoreFull(liveScorecard?.[3]?.scores_full);

    useEffect(() => {
        const currentInnings = InningsLength
        if (currentInnings === 3) {
            if (isTeam1PlayingThirdInnings) {
                setCurrentTeam(0)
            } else {
                setCurrentTeam(1)
            }
        } else if (currentInnings === 4) {
            if (isTeam1PlayingThirdInnings) {
                setCurrentTeam(1)
            } else {
                setCurrentTeam(0)
            }
        } else {
            if (isTeamABattingFirst) {
                setCurrentTeam(currentInnings - 1)
            } else {
                setCurrentTeam(0)
            }
        }
    }, [InningsLength])

    const handleSwitchTeam = (val) => {
        setCurrentTeam(val)
        setShowAllBatter({
            inningsOne: false,
            inningsTwo: false
        })
        setShowAllBowler({
            inningsOne: false,
            inningsTwo: false
        })
    }

    return (
        <Box className='international-matches-scorecard-main-section'>
            <Box sx={{ position: 'absolute' }}>
                <CommonBack onClick={() => router.push(`/`)} />
            </Box>
            <Banner
                winnerName={liveMatchScoreboard?.response?.scorecard?.status_note}
                image1={liveMatchScoreboard?.response?.scorecard?.teama?.logo_url}
                image2={liveMatchScoreboard?.response?.scorecard?.teamb?.logo_url}
                team1score={isTeamABattingFirst ? FirstInningsScores : SecondInningsScores}
                team2score={isTeamABattingFirst ? SecondInningsScores : FirstInningsScores}
                superover={isExtraInnings}
                soteam1score={isTeam1PlayingThirdInnings ? ThirdInningsScores : FourthInningsScores}
                soteam2score={isTeam1PlayingThirdInnings ? FourthInningsScores : ThirdInningsScores}
                type={'score'}
                soteam1scorehidden={isTeam1PlayingThirdInnings ? false : !isTeam1PlayingThirdInnings && InningsLength > 3 ? false : true}
                soteam2scorehidden={isTeam1PlayingThirdInnings && InningsLength === 3 ? true : false}
            />

            <Box className='international-matches-scorecard-sub-section'>
                <Box className='international-matches-teams-tab'>
                    <SwitchSelect options={teams} defaultSelected={currentTeam} onChange={(val) => handleSwitchTeam(val)} />
                </Box>

                <Box className='international-matches-scorecard-scroll-section'>
                    {
                        showFirstInningsTitle && <Box className="international-matches-scorecard_first_section">
                            <Typography variant="p">{'First Innings'}</Typography>
                            <Box className='international-matches-scorecard_lineargradient'></Box>
                        </Box>
                    }

                    <BatterTable show={showAllBatter?.inningsOne} onClick={() => setShowAllBatter((prev) => ({ ...prev, inningsOne: !showAllBatter?.inningsOne }))}
                        data={InningsLength === 1 ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.batsmen :
                            ((currentTeam === 0 && isTeamABattingFirst) || (currentTeam === 1 && !isTeamABattingFirst)) ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.batsmen : liveMatchScoreboard?.response?.scorecard?.innings?.[1]?.batsmen}
                        extras={InningsLength === 1 ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.extra_runs :
                            ((currentTeam === 0 && isTeamABattingFirst) || (currentTeam === 1 && !isTeamABattingFirst)) ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.extra_runs : liveMatchScoreboard?.response?.scorecard?.innings?.[1]?.extra_runs} />

                    <BowlerTable onClick={() => setShowAllBowler((prev) => ({ ...prev, inningsOne: !showAllBowler?.inningsOne }))} show={showAllBowler?.inningsOne}
                        data={InningsLength === 1 ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.bowlers :
                            ((currentTeam === 0 && isTeamABattingFirst) || (currentTeam === 1 && !isTeamABattingFirst)) ? liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.bowlers : liveMatchScoreboard?.response?.scorecard?.innings?.[1]?.bowlers} />

                    {
                        ((isTeam1PlayingThirdInnings && currentTeam === 0) || (!isTeam1PlayingThirdInnings && currentTeam === 1)) && InningsLength > 2 &&
                        <SecondInningsCommonSection battingData={liveMatchScoreboard?.response?.scorecard?.innings?.[2]?.batsmen} extras={liveMatchScoreboard?.response?.scorecard?.innings?.[2]?.extra_runs} bowlingData={liveMatchScoreboard?.response?.scorecard?.innings?.[2]?.bowlers}
                            showBatterClick={() => setShowAllBatter((prev) => ({ ...prev, inningsTwo: !showAllBatter?.inningsTwo }))} showAllBatter={showAllBatter?.inningsTwo}
                            showBowlerClick={() => setShowAllBowler((prev) => ({ ...prev, inningsTwo: !showAllBowler?.inningsTwo }))} showAllBowler={showAllBowler?.inningsTwo} />
                    }

                    {
                        ((isTeam1PlayingThirdInnings && currentTeam === 1) || (!isTeam1PlayingThirdInnings && currentTeam === 0)) && InningsLength > 3 &&
                        <SecondInningsCommonSection battingData={liveMatchScoreboard?.response?.scorecard?.innings?.[3]?.batsmen} extras={liveMatchScoreboard?.response?.scorecard?.innings?.[3]?.extra_runs} bowlingData={liveMatchScoreboard?.response?.scorecard?.innings?.[3]?.bowlers}
                            showBatterClick={() => setShowAllBatter((prev) => ({ ...prev, inningsTwo: !showAllBatter?.inningsTwo }))} showAllBatter={showAllBatter?.inningsTwo}
                            showBowlerClick={() => setShowAllBowler((prev) => ({ ...prev, inningsTwo: !showAllBowler?.inningsTwo }))} showAllBowler={showAllBowler?.inningsTwo} />
                    }
                </Box>

            </Box>
        </Box>
    )
}

export default InternationalMatchesScoreboard