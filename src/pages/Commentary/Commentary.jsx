'use client'
import { CommonText } from "@/components/common/commonText";
import SwitchSelect from "@/components/common/commonUi/SwitchSelect/SwitchSelect";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import './Commentary.css';
import { useSelector } from "react-redux";
import { teamsState } from "@/redux/slices/teamSlice";

const CommentaryPage = ({ matchData, teamData, playerData, type, tournamentData }) => {

    const [inningsCommentary, setInningsCommentary] = useState([]);
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [matchPlayers, setMatchPlayers] = useState([])
    const [tossWinner, setTossWinner] = useState({
        tossWinner: '',
        battingSide: '',
        bowlingSide: ''
    })
    const [innings, setInnings] = useState()
    const [commentarys, setCommentarys] = useState(0)
    const [Commentary, setCommentary] = useState([])
    const team_data = useSelector(teamsState)
    let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
    let isFollowOn = matchData?.followOn === "Follow On" ? true : false
    const CurrentInnings = matchData?.currentInnings
    let superOverCountEven = matchData?.superOverCount ? matchData?.superOverCount % 2 === 0 : undefined
    let FirstBattingTeamInnings = isTestMatch && !isFollowOn ? 3
        : isTestMatch && isFollowOn ? 4
            : !matchData?.superOverCount && CurrentInnings === 4 ? 4
                : matchData?.superOverCount && superOverCountEven && CurrentInnings === 3 ? 3 : 4

    let SecondBattingTeamInnings = isTestMatch && !isFollowOn ? 4
        : isTestMatch && isFollowOn ? 3
            : !matchData?.superOverCount && CurrentInnings === 3 ? 3
                : matchData?.superOverCount && superOverCountEven && CurrentInnings === 3 ? 4 : 3

    const SuperOverTeam = commentarys === 0 ? FirstBattingTeamInnings : commentarys === 1 ? SecondBattingTeamInnings : ''

    let completedover = commentarys === 0 && matchData?.firstInnings && matchData?.firstInnings?.Currentover?.[0]?.legalBall ? matchData?.firstInnings?.Completedovers?.length - 1
        : commentarys === 0 && matchData?.firstInnings ? matchData?.firstInnings?.Completedovers?.length - 2
            : commentarys === 1 && matchData?.secondInnings && matchData?.secondInnings?.Currentover?.[0]?.legalBall ? matchData?.secondInnings?.Completedovers?.length - 1
                : commentarys === 1 && matchData?.secondInnings ? matchData?.secondInnings?.Completedovers?.length - 2
                    : []

    let completedlegalballs = commentarys === 0 && matchData?.firstInnings && matchData?.firstInnings?.Currentover?.[0] && matchData?.firstInnings?.Currentover?.[0]?.legalBall ? matchData?.firstInnings?.Currentover?.[0]?.legalBall
        : commentarys === 0 && matchData?.firstInnings && matchData?.firstInnings?.Currentover?.[0] && !matchData?.firstInnings?.Currentover?.[0]?.legalBall ? matchData?.firstInnings?.Completedovers?.[matchData?.firstInnings?.Completedovers?.length - 2]?.totalBall
            : commentarys === 1 && matchData?.secondInnings && matchData?.secondInnings?.Currentover?.[0] && matchData?.secondInnings?.Currentover?.[0]?.legalBall ? matchData?.secondInnings?.Currentover?.[0]?.legalBall
                : commentarys === 1 && matchData?.secondInnings && matchData?.secondInnings?.Currentover?.[0] && !matchData?.secondInnings?.Currentover?.[0]?.legalBall ? matchData?.secondInnings?.Completedovers?.[matchData?.secondInnings?.Completedovers?.length - 2]?.totalBall
                    : 6

    let completedballs = commentarys === 0 && matchData?.firstInnings && matchData?.firstInnings?.Currentover?.[0] && matchData?.firstInnings?.Currentover?.[0]?.totalBall > 6 ? matchData?.firstInnings?.Currentover?.[0]?.totalBall
        : commentarys === 0 && matchData?.firstInnings && matchData?.firstInnings?.Currentover?.[0] ? completedlegalballs || 0
            : commentarys === 1 && matchData?.secondInnings && matchData?.secondInnings?.Currentover?.[0] && matchData?.secondInnings?.Currentover?.[0]?.totalBall > 6 ? matchData?.secondInnings?.Currentover?.[0]?.totalBall
                : commentarys === 1 && matchData?.secondInnings && matchData?.secondInnings?.Currentover?.[0] ? completedlegalballs || 0
                    : 0

    let SecondInningsTitleCondition = innings <= 2 ? false : innings === 4 ? true : FirstBattingTeamInnings === 3 && innings === 3 && commentarys === 0 ? true : SecondBattingTeamInnings === 3 && innings === 3 && commentarys === 1 ? true : false

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
    }, [matchData, team_data])

    useEffect(() => {
        let team1player = playerData?.filter(item => item?.teamId === team1?.id);
        let team1XIplayer = matchData?.selectedPlayer?.team1;
        let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
        let team2player = playerData?.filter(item => item?.teamId === team2?.id);
        let team2XIplayer = matchData?.selectedPlayer?.team2;
        let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
        const matchPlayers = [...commonPlayerTeam1, ...commonPlayerTeam2];
        setMatchPlayers(matchPlayers);
    }, [playerData, team1, team2])

    useEffect(() => {
        setInnings(matchData?.currentInnings)
    }, [matchData, matchData?.currentInnings])

    useEffect(() => {
        setCommentary(matchData?.Commentary)
    }, [matchData?.Commentary, matchData])

    useEffect(() => {
        const winnerSide = matchData?.toss?.selectSide;
        const tossWinner = matchData?.toss?.tossWinner;
        let teams = [team1, team2]
        if (tossWinner && winnerSide) {
            let battingTeam, bowlingTeam;
            if (winnerSide === 'Bat') {
                battingTeam = teams.find((team) => team.id === tossWinner) || team1;
                bowlingTeam = teams.find((team) => team.id !== tossWinner) || team2;
            } else {
                bowlingTeam = teams.find((team) => team.id === tossWinner) || team1;
                battingTeam = teams.find((team) => team.id !== tossWinner) || team2;
            }

            setTossWinner({
                tossWinner: tossWinner,
                battingSide: battingTeam?.team_name,
                bowlingSide: bowlingTeam?.team_name,
            });
        }
    }, [team1, team2, matchData, matchData?.toss]);

    useEffect(() => {
        const commentary = [];
        if (innings === 1) {
            setCommentarys(0)
            commentary.push(tossWinner?.battingSide);
        } else if (innings === 2 || innings === 3 || innings === 4) {
            commentary.push(tossWinner?.battingSide, tossWinner?.bowlingSide);
            if ((FirstBattingTeamInnings === 3 && innings === 3) || (FirstBattingTeamInnings === 4 && innings === 4)) {
                setCommentarys(0)
            } else if ((SecondBattingTeamInnings === 3 && innings === 3) || (SecondBattingTeamInnings === 4 && innings === 4)) {
                setCommentarys(1)
            }
        }
        // else if (innings === 3 || innings === 4) {
        //     setCommentarys(2)
        //     commentary.push(tossWinner?.battingSide, tossWinner?.bowlingSide);
        //     commentary.push(`${matchData?.superOverCount && superOverCountEven ? tossWinner?.battingSide : tossWinner?.bowlingSide} Superover`);
        //     if (innings === 4) {
        //         setCommentarys(3)
        //         commentary.push(`${matchData?.superOverCount && !superOverCountEven ? tossWinner?.battingSide : tossWinner?.bowlingSide} Superover`);
        //     }
        // }
        setInningsCommentary(commentary);
    }, [innings, tossWinner]);

    return (
        <Box>
            <Box className={`commentary_main_section  ${type === 'live' ? 'islive' : ''}`}>
                <Box className='commentary_title_section'>
                    {/* <Typography variant="body2" >{CommonText.Commentary}</Typography> */}
                    {/* <FormControl className="commentary_team_select" >
                        <InputSelect
                            value={commentarys}
                            onChange={(e) => setCommentarys(e.target.value)}
                        >
                            {
                                inningsCommentary.map((items, i) => {
                                    return (
                                        <MenuItem value={i} key={i}>{items}</MenuItem>
                                    )
                                })
                            }
                        </InputSelect>
                    </FormControl> */}
                    <SwitchSelect options={inningsCommentary} defaultSelected={commentarys} onChange={(val) => setCommentarys(val)} />
                </Box>
                <Box className={`${type === 'live' ? '' : Commentary.length > 0 ? 'commentryMaxHeight' : ''}`}>
                    {
                        Array.isArray(Commentary) && Commentary.length > 0 ? (
                            [...Commentary]
                                .reverse()
                                .filter((item, index, self) => {
                                    if (item?.oppteam) {
                                        return item;
                                    }
                                    if (!item.score) {
                                        return false;
                                    }
                                    return self.findIndex((i) =>
                                        i.ballNo === item.ballNo &&
                                        i.bowler === item.bowler &&
                                        i.overNo === item.overNo &&
                                        i.innings === item.innings
                                    ) === index;
                                }).map((items, i) => {

                                    const battername = matchPlayers?.find(item => item.id === items.batter)
                                    const bowlername = matchPlayers?.find(item => item.id === items.bowler);
                                    const fieldername = matchPlayers?.find(item => item.id === items.fielder);
                                    const runoutbattername = matchPlayers?.find(item => item.id === items.batterout);

                                    const getBallSize = () => {
                                        if (items?.score?.includes("WD") || items?.score?.includes("NB")) {
                                            return '7px';
                                        }
                                        return '9px';
                                    };

                                    const getBallColor = () => {
                                        if ((items?.score === "-1" || items?.score === "-2" || items?.score === "-3" || items?.score === "-4" || items?.score === "-5" || items?.score === "-6") && items?.reason) {
                                            return 'var(--wicket)'
                                        }
                                        if (items?.score === "4" || items?.score === "6") {
                                            return 'var(--boundary)';
                                        }
                                        if (items?.score?.includes("WD") || items?.score?.includes("NB")) {
                                            return 'var(--extra-run)';
                                        }
                                        if (items?.score?.includes("W")) {
                                            return 'var(--wicket)';
                                        }
                                        if ((items?.score === "1" || items?.score === "2" || items?.score === "3" || items?.score === "4" || items?.score === "5" || items?.score === "6") && items?.reason) {
                                            return 'var(--boundary)'
                                        }
                                        return 'var(--normal-ball)';
                                    };

                                    const score = (scr, reason) => {
                                        if (scr === "0") {
                                            return " no run"
                                        } else if (scr?.includes("WD+W") || scr?.includes("NB+W")) {
                                            const runType = scr?.includes("WD") ? ' wide' : ' (no-ball)';
                                            const runs = parseInt(scr.split('+')[0].slice(0, -1)) || 0;
                                            const runMessage = runs > 0 ? `${runs} run${runs > 1 ? 's' : ''}, ` : '';
                                            return ` ${runType}, ${runMessage} ${CommonText.RunOut} ${fieldername?.playerName}, ${runoutbattername?.playerName} out!`;
                                        } else if (scr?.includes("WD") || scr?.includes("NB")) {
                                            const runType = scr?.includes("WD") ? ' wide' : ' (no-ball)';
                                            const runCount = parseInt(scr) || (parseInt(items.score) || 0);
                                            if (runCount > 0) {
                                                return `${runType}, ${runCount} run${runCount > 1 ? 's' : ''}`;
                                            } else {
                                                return runType;
                                            }
                                        } else if (scr === "4" || scr === "6") {
                                            return `${scr === '4' ? `${CommonText.TimingAndRunScore}` : `${CommonText.SixCrowdGoesWild}`}`
                                        } else if (scr?.includes("LB")) {
                                            const runCount = parseInt(scr) || 1;
                                            return ` leg bye, ${runCount} run${runCount > 1 ? 's' : ''}`;
                                        } else if (scr === "W") {
                                            const dismissalMessages = {
                                                'LBW': `${CommonText.BowlerStrikesAndBatterWalkOff}`,
                                                'Bowled': `${CommonText.BallStumpsBowledBattersOut}`,
                                                'Catch': ` ${bowlername?.playerName} bowls, ${fieldername?.playerName} ${CommonText.CatchBatterdismissed}`,
                                                'Stumped': ` ${CommonText.StumpedOut} ${fieldername?.playerName}, batter gone!`,
                                                'Run Out': ` ${CommonText.RunOut} ${fieldername?.playerName}, ${runoutbattername?.playerName} out!`,
                                                'Hit Wicket': ` ${battername?.playerName} hits the stumps, as if saying, 'I didn’t sign up for this!' while ${bowlername?.playerName} claims the wicket.`
                                            };
                                            return dismissalMessages[reason] || "";
                                        } else if (scr.startsWith("W+")) {
                                            const runs = parseInt(scr.slice(2));
                                            return ` ${runs} run${runs > 1 ? 's' : ''}, ${CommonText.RunOut} ${fieldername?.playerName}, ${runoutbattername?.playerName} out`;
                                        } else {
                                            return ` ${scr} ${scr === '1' ? 'run' : 'runs'}`
                                        }
                                    }

                                    const penaltyScores = (scr, reason, team, oppteam) => {
                                        if (reason && scr !== 'W' && !scr.includes('W+') && !scr.includes('WD+W') && !scr.includes('NB+W')) {
                                            if (scr === "1" || scr === "2" || scr === "3" || scr === "4" || scr === "5" || scr === "6") {
                                                return `${team} has been awarded extra runs because ${oppteam} committed foul for ${reason}`
                                            } else {
                                                return `${team} has been penalized with negative runs for ${reason}`
                                            }
                                        }
                                    }

                                    const ballColor = getBallColor(items?.score);
                                    const TextSize = getBallSize(items?.score);
                                    const scores = score(items?.score, items?.reason)
                                    const penaltyscores = penaltyScores(items?.score, items?.reason, items?.team, items?.oppteam)

                                    return (
                                        <React.Fragment key={i}>
                                            {
                                                CurrentInnings > 2 && SecondInningsTitleCondition && i === 0 &&
                                                <>
                                                    <Typography className="commentary_superover_title">{isTestMatch ? 'Second Innings' : 'Superover'}</Typography>
                                                    <Box className="commentary_superover_lineargradient"></Box>
                                                </>
                                            }
                                            {
                                                CurrentInnings > 2 && items?.innings === SuperOverTeam &&
                                                <Box className='commentary_info_main_section' >
                                                    {items.score || items?.oppteam ? <Typography variant="body2">{items.overNo}.{items.ballNo}</Typography> : ""}
                                                    {items?.score !== null &&
                                                        <Box className='commentary_info_section'>
                                                            <Box
                                                                className='commentary_info'
                                                                style={{
                                                                    backgroundColor: ballColor,
                                                                    fontSize: TextSize,
                                                                }}
                                                            >
                                                                {items?.score !== null && items?.score}
                                                            </Box>
                                                            <Box className="line-container">
                                                                <Box className="score-gradient-line"></Box>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    {bowlername && battername && <Typography variant="body2" >{bowlername?.playerName} to {battername?.playerName},
                                                        {scores}
                                                    </Typography>}
                                                    {items?.oppteam && <Typography variant="body2" >{penaltyscores}</Typography>}
                                                </Box>
                                            }
                                            {
                                                CurrentInnings > 2 && items.innings === commentarys + 1 && (parseInt(items?.ballNo) === parseInt(completedballs)) && parseInt(items?.overNo) === parseInt(completedover) &&
                                                <>
                                                    <Typography className="commentary_superover_title">{isTestMatch ? 'First Innings' : 'Regular Innings'}</Typography>
                                                    <Box className="commentary_superover_lineargradient"></Box>
                                                </>
                                            }
                                            {
                                                items.innings === commentarys + 1 && <Box className='commentary_info_main_section' >
                                                    {items.score || items?.oppteam ? <Typography variant="body2">{items.overNo}.{items.ballNo}</Typography> : ""}
                                                    {items?.score !== null &&
                                                        <Box className='commentary_info_section'>
                                                            <Box

                                                                className='commentary_info'
                                                                style={{
                                                                    backgroundColor: ballColor,
                                                                    fontSize: TextSize,
                                                                }}
                                                            >
                                                                {items?.score !== null && items?.score}
                                                            </Box>
                                                            <Box className="line-container">
                                                                <Box className="score-gradient-line"></Box>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    {bowlername && battername && <Typography variant="body2" >{bowlername?.playerName} to {battername?.playerName},
                                                        {scores}
                                                    </Typography>}
                                                    {items?.oppteam && <Typography variant="body2" >{penaltyscores}</Typography>}
                                                </Box>
                                            }
                                        </React.Fragment>
                                    );
                                })
                        ) : (
                            <Typography sx={{ textAlign: 'center' }}>{CommonText.NoCommentaryAvailable}</Typography>
                        )
                    }
                </Box>
            </Box>
        </Box >
    )

}

export default CommentaryPage