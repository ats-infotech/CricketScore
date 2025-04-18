import { CheckTournamentIsRunning, DateFormat } from "@/components/common/commomFunction"
import Banner from "@/components/common/commonUi/Banner/Banner"
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar"
import Loader from "@/components/common/commonUi/Loader"
import ScrollableTabs from "@/components/common/commonUi/ScrollableTabs/ScrollableTabs"
import CommonBack from "@/components/common/commonUi/commonBack"
import { breakType, TestBreakType } from "@/components/common/json/commonJson"
import { auctionState } from "@/redux/slices/auctionSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import './TournamentBanner.css'

const auctionbuttonGroups = [
    { title: 'Auction', icon: 'auction-thor', value: 'auction' },
    { title: 'Teams', icon: 'teams2', value: 'teams' },
    { title: 'players', icon: 'add-player', value: 'players' },
    { title: 'MVP', icon: 'mvp', value: 'mvp' },
    { title: 'About', icon: 'about', value: 'about' },
];

const buttonGroups = [
    { title: 'Auction', icon: 'auction-thor', value: 'auction' },
    { title: 'Match', icon: 'striker', value: 'match' },
    { title: 'Leaderboard', icon: 'leaderboard', value: 'leaderboard' },
    { title: 'Points Table', icon: 'pointable', value: 'pointable' },
    { title: 'Stats', icon: 'stats', value: 'stats' },
    { title: 'Teams', icon: 'teams2', value: 'teams' },
    { title: 'About', icon: 'about', value: 'about' },
];

const matchButtonGroups = [
    { title: 'Live', icon: 'live', value: 'live' },
    { title: 'Summary', icon: 'scorecard', value: 'summary' },
    { title: 'Scorecard', icon: 'scorecard', value: 'scorecard' },
    { title: 'Commentary', icon: 'commentary', value: 'commentary' },
    { title: 'Analysis', icon: 'analysis', value: 'analysis' },
    { title: 'Cricket Box', icon: 'mvp', value: 'cricketbox' },
    { title: 'MVP', icon: 'mvp', value: 'mvp' },
    { title: 'Teams', icon: 'teams2', value: 'teams' },
]

const TournamentBanner = ({ data, handleNavigation, params, type, back, tournamentData }) => {
    // const [openDrawer, setOpenDrawer] = useState(false)
    const [tabValue, setTabValue] = useState(params?.category);
    const [team1Score, setTeam1Score] = useState({
        run: 0,
        wicket: 0,
        over: 0,
        ball: 0,
    })
    const [team2Score, setTeam2Score] = useState({
        run: 0,
        wicket: 0,
        over: 0,
        ball: 0
    })
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [tossWinner, setTossWinner] = useState({
        tossWinner: "",
        battingSide: "",
        bowlingSide: ""
    })
    const [target, setTarget] = useState({
        runs: 0,
        balls: 0,
        totalballs: 0,
        totalruns: 0
    })
    const [winner, setWinner] = useState()
    const [superover, setSuperover] = useState(false)
    const [team1SOScore, setTeam1SOScore] = useState({
        run: 0,
        ball: 0,
        wicket: 0,
        over: 0
    })
    const [team2SOScore, setTeam2SOScore] = useState({
        run: 0,
        ball: 0,
        wicket: 0,
        over: 0
    })
    const [loading, setLoading] = useState(false)
    const [matchStartDate, setMatchStartDate] = useState()
    const [CurrentRunningDay, setCurrentRunningDay] = useState()
    const [legalBallCount, setLegalBallCount] = useState(0)
    const [Team1Lead, setTeam1Lead] = useState({
        lead: false,
        run: 0
    })
    const [Over, setOver] = useState(true)
    const team_data = useSelector(teamsState)
    const auctionData = useSelector(auctionState)?.data?.find(item => item?.tournamentId === data?.id) || null
    const router = useRouter()
    const tData = data || {};
    const bannerImage = tData?.tournament_banner;
    const logoImage = tData?.tournament_image;
    const tournamentLetter = tData?.letter
    const tournamentColor = tData?.tournament_logo_color
    const CurrentDate = new Date()
    let matchDate = new Date(matchStartDate?.getFullYear(), matchStartDate?.getMonth(), matchStartDate?.getDate());
    let currentDay = new Date(CurrentDate?.getFullYear(), CurrentDate?.getMonth(), CurrentDate?.getDate());
    let dayDifference = (currentDay - matchDate) / (1000 * 60 * 60 * 24);
    let Innings1Declare = tData?.firstInnings?.declare === "yes" ? true : false
    let Innings2Declare = tData?.secondInnings?.declare === "yes" ? true : false
    let Innings3Declare = tData?.superOverFirstInnings?.declare === "yes" ? true : false

    useEffect(() => {
        const startDate = new Date(tData?.match_start_time);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 4);
        setMatchStartDate(startDate)
    }, [tData])

    useEffect(() => {
        setCurrentRunningDay(`Day ${dayDifference + 1}`);
    }, [dayDifference, currentDay, matchDate])

    // const handleOpen = () => setOpenDrawer(true)
    // const handleClose = () => setOpenDrawer(false)
    const team1Logo = team1?.team_logo
    const team2Logo = team2?.team_logo
    const team1Name = team1?.team_name
    const team2Name = team2?.team_name
    const team1Letter = team1?.letter
    const team1Color = team1?.team_color
    const team2Letter = team2?.letter
    const team2Color = team2?.team_color
    const isPastTournament = CheckTournamentIsRunning(tData?.tournament_start_date, tData?.tournament_end_date) === 'completed'
    let isTestMatch = tournamentData && tournamentData?.match_type === "Test Match" ? true : false
    let matchGroups = tData?.status === 4 ? matchButtonGroups.filter((items) => items?.value !== 'live') : tData?.status === 2 || tData?.status === 3 ? matchButtonGroups.filter((items) => items?.value !== 'cricketbox' && items?.value !== 'mvp' && items?.value !== 'summary' && items?.value !== 'analysis') : matchButtonGroups
    // let pastMatchGroups = isPastTournament ? buttonGroups.filter((items) => items.value !== 'about') : buttonGroups
    const pastMatchGroups = (!data?.auction && auctionData?.auctionStatus !== 3) ? buttonGroups.filter(item => item?.value !== 'auction') : auctionData?.auctionStatus !== 3 ? auctionbuttonGroups : buttonGroups;
    let matchFirstInnings = tData?.firstInnings
    let matchSecondInnings = tData?.secondInnings
    let matchThirdInnings = tData?.superOverFirstInnings
    let matchFourthInnings = tData?.superOverSecondInnings
    let CurrentInnings = tData?.currentInnings
    let isStumps = tData?.stumps !== undefined && tData?.stumps === 0 ? true : false
    let isBreakStart = isTestMatch && !tData?.matchWinner ? TestBreakType?.find(type => type?.key_name === tData?.breaktype)?.title : !tData?.matchWinner && breakType?.find(type => type?.key_name === tData?.breaktype)?.title || ''
    const firstInnings = tData?.firstInnings?.Currentover[0];
    const secondInnings = tData?.status !== 4
        ? tData?.secondInnings?.Currentover[0]
        : tData?.secondInnings?.Completedovers[tData?.secondInnings?.Completedovers?.length - 1];
    const thirdInnings = tData?.superOverFirstInnings?.Currentover[0];
    const fourthInnings = tData?.superOverSecondInnings?.Currentover[0];
    let initailscore = CurrentInnings === 2 ? secondInnings : CurrentInnings === 3 ? thirdInnings : CurrentInnings === 4 ? fourthInnings : 0

    useEffect(() => {
        if (CurrentInnings === 1) {
            setLegalBallCount(matchFirstInnings?.Currentover?.[0]?.legalBall ?? 0)
        } else if (CurrentInnings === 2) {
            setLegalBallCount(matchSecondInnings?.Currentover?.[0]?.legalBall ?? 0)
        } else if (CurrentInnings === 3) {
            setLegalBallCount(matchThirdInnings?.Currentover?.[0]?.legalBall ?? 0)
        } else if (CurrentInnings === 4) {
            setLegalBallCount(matchFourthInnings?.Currentover?.[0]?.legalBall ?? 0)
        }
    }, [CurrentInnings, matchFirstInnings, matchSecondInnings, matchThirdInnings, matchFourthInnings])

    // let matchGroups = tData?.status === 4 ? matchButtonGroups.filter((items) => items?.value !== 'live') 
    // : tData?.status === 2 || tData?.status === 3 ? matchButtonGroups.filter((items) => items?.value !== 'cricketbox' && items?.value !== 'mvp') 
    // : matchButtonGroups
    // let pastMatchGroups = isPastTournament ? buttonGroups.filter((items) => items.value !== 'about') : buttonGroups

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === tData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === tData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
    }, [tData])

    useEffect(() => {
        const winnerSide = tData?.toss?.selectSide;
        const tossWinner = tData?.toss?.tossWinner;
        let teams = [team1, team2]
        if (tossWinner && winnerSide) {
            let battingTeam, bowlingTeam;
            if (winnerSide === 'Bat') {
                battingTeam = teams?.find((team) => team?.id === tossWinner) || team1;
                bowlingTeam = teams?.find((team) => team?.id !== tossWinner) || team2;
            } else {
                bowlingTeam = teams?.find((team) => team?.id === tossWinner) || team1;
                battingTeam = teams?.find((team) => team?.id !== tossWinner) || team2;
            }
            const CurrentInnings = tData?.currentInnings;
            const superOverCountEven = tData?.superOverCount % 2 === 0
            if (!isTestMatch) {
                if (tData?.superOverCount && CurrentInnings === 3 ? !superOverCountEven : tData?.superOverCount && CurrentInnings !== 3 ? superOverCountEven : CurrentInnings === 2 || CurrentInnings === 3) {
                    setTossWinner({
                        tossWinner: tossWinner,
                        battingSide: bowlingTeam?.team_name,
                        bowlingSide: battingTeam?.team_name,
                    });
                } else {
                    setTossWinner({
                        tossWinner: tossWinner,
                        battingSide: battingTeam?.team_name,
                        bowlingSide: bowlingTeam?.team_name,
                    });
                }
            } else if (isTestMatch) {
                if ((CurrentInnings === 2 || (CurrentInnings === 4 && tData?.followOn !== "Follow On")) || (CurrentInnings === 3 && tData?.followOn === "Follow On")) {
                    setTossWinner({
                        tossWinner: tossWinner,
                        battingSide: bowlingTeam?.team_name,
                        bowlingSide: battingTeam?.team_name,
                    });
                } else {
                    setTossWinner({
                        tossWinner: tossWinner,
                        battingSide: battingTeam?.team_name,
                        bowlingSide: bowlingTeam?.team_name,
                    });
                }
            }
        }
    }, [tData?.currentInnings, tData?.toss?.selectSide, tData?.toss?.tossWinner, team1, team2]);

    // const category = useMemo(() => {
    //     if (!params?.category) return null;
    //     return type === 'match'
    //         ? matchGroups.find(val => val?.value === params?.category)?.value
    //         : pastMatchGroups.find(val => val?.value === params?.category)?.value;
    // }, [params?.category, type, matchGroups, pastMatchGroups]);

    useEffect(() => {
        if (type === 'match' && tData?.status === 4 && tabValue === 'live') {
            setTabValue('summary');
        }
    }, [tData?.status, tabValue, type]);

    // useEffect(() => {
    //     if (category) {
    //         setTabValue(category);
    //     } else {
    //         const MatchTab = type === 'match' && tData?.status === 4 ? 'cricketbox' : 'live'
    //         const navigate = type === 'match'
    //             ? `/match/${params?.matchId}/${MatchTab}`
    //             : type === 'adminTournament' ? `/mytournament/${params?.id}/match` : type === 'userTournament' ? `/tournament/${params?.id}/match` : '/';
    //         if (router.pathname !== navigate) {
    //             router.push(navigate);
    //         }
    //     }
    // }, [category, params?.id, type, tData?.status]);

    const handleTabChange = (val) => {
        setLoading(true)
        setTabValue(val);
        handleNavigation(val);
        setTimeout(() => {
            setLoading(false)
        }, 300);
    };

    useEffect(() => {
        const currentInnings = tData?.currentInnings;
        const totalOvers = parseInt(tData?.totalovers)
        const isTeam1Batting = tossWinner?.battingSide === team1?.team_name;
        const isTeam2Batting = tossWinner?.battingSide === team2?.team_name
        const matchStatus = tData?.status
        const matchwinner = tData?.matchWinner
        const isTeam1BattingFirstInnings = (tData?.toss?.tossWinner === team1?.id && tData?.toss?.selectSide === "Bat") || (tData?.toss?.tossWinner !== team1?.id && tData?.toss?.selectSide !== "Bat")
        const getScore = (innings, completedOvers, currentinnings) => ({
            run: innings?.runs ? innings?.runs : 0,

            ball: !innings?.legalBall ? 0 : innings?.legalBall === 6 ? 0 : innings?.legalBall,

            wicket: innings?.wicket ? innings?.wicket : 0,

            over: (currentInnings === 3 || currentInnings === 4) && innings?.legalBall !== 6 && tData?.status !== 4 && !isTestMatch ? 0
                : (currentInnings === 3 || currentInnings === 4) && innings?.legalBall === 6 && tData?.status !== 4 && !isTestMatch ? 1
                    : currentInnings === currentinnings && !completedOvers?.length && innings?.legalBall === 6 ? 1
                        : currentInnings === currentinnings && !completedOvers?.length ? 0
                            : innings?.legalBall !== 6 && currentInnings !== currentinnings ? completedOvers?.length - 1
                                : (matchStatus === 4 || matchwinner) && innings?.legalBall !== 6 ? completedOvers?.length - 1
                                    : innings?.legalBall === 6 && currentInnings === currentinnings && (!matchwinner && matchStatus !== 4) ? completedOvers?.length + 1 : completedOvers?.length || 0,
        });

        // const firstInnings = tData?.firstInnings?.Currentover[0];
        // const secondInnings = tData?.status !== 4
        //     ? tData?.secondInnings?.Currentover[0]
        //     : tData?.secondInnings?.Completedovers[tData?.secondInnings?.Completedovers?.length - 1];
        // const thirdInnings = tData?.superOverFirstInnings?.Currentover[0];
        // const fourthInnings = tData?.superOverSecondInnings?.Currentover[0];
        // initailscore = CurrentInnings === 2 ? secondInnings : CurrentInnings === 3 ? thirdInnings : CurrentInnings === 4 ? fourthInnings : 0

        const firstInningsCompletedOvers = tData?.firstInnings?.Completedovers;
        const secondInningsCompletedOvers = tData?.secondInnings?.Completedovers;
        const superOverFirstInningsCompletedOvers = tData?.superOverFirstInnings?.Completedovers;
        const superOverSecondInningsCompletedOvers = tData?.superOverSecondInnings?.Completedovers;

        if (isTestMatch) {
            const dayNumber = CurrentRunningDay !== "NaN" && CurrentRunningDay !== undefined ? CurrentRunningDay?.split(" ")[1] : 0;
            const totalOversLeft = currentInnings === 4 && tData?.targetedOver ? tData?.targetedOver - (superOverSecondInningsCompletedOvers ? superOverSecondInningsCompletedOvers?.length : 0) : dayNumber !== "NaN" && tData?.perDayOver ? ((5 - parseInt(dayNumber)) * 90) + (90 - (tData?.perDayOver[`day${dayNumber}`])) : 0
            const FinalBallShow = totalOversLeft > 20 ? totalOversLeft - 1 : totalOversLeft * 6 - legalBallCount
            const totalballs = currentInnings === 4 ? FinalBallShow : parseInt(tData?.totalovers) * 6
            const target = currentInnings === 4 && tData?.followOn === "Follow On" ? (matchThirdInnings?.Currentover?.[0]?.runs + matchSecondInnings?.Currentover?.[0]?.runs) - matchFirstInnings?.Currentover?.[0]?.runs
                : currentInnings === 4 ? (matchThirdInnings?.Currentover?.[0]?.runs + matchFirstInnings?.Currentover?.[0]?.runs) - matchSecondInnings?.Currentover?.[0]?.runs
                    : currentInnings === 3 && matchFirstInnings?.Currentover?.[0]?.runs - matchSecondInnings?.Currentover?.[0]?.runs > 0 && tData?.followOn === "Follow On" ? matchFirstInnings?.Currentover?.[0]?.runs - matchSecondInnings?.Currentover?.[0]?.runs
                        : currentInnings === 3 && matchFirstInnings?.Currentover?.[0]?.runs - matchSecondInnings?.Currentover?.[0]?.runs < 0 ? matchSecondInnings?.Currentover?.[0]?.runs - matchFirstInnings?.Currentover?.[0]?.runs
                            : currentInnings === 3 ? 0
                                : matchFirstInnings?.Currentover?.[0]?.runs;
            const overs = totalOversLeft > 20 && currentInnings === 4 ? ball.overNo : ball.overNo === 0 ? legalBallCount : ball.overNo * 6 + legalBallCount
            if (totalOversLeft > 20 && isTestMatch) {
                setOver(true)
            } else {
                setOver(false)
            }
            if (currentInnings !== 1) {
                setTarget((prev) => ({
                    ...prev,
                    runs: target + 1 !== 0 && currentInnings === 4 ? (target + 1) - initailscore?.runs : target + 1 !== 0 ? target - initailscore?.runs : 0,
                    balls: currentInnings === 4 ? totalballs : totalballs - overs,
                    totalballs: totalballs,
                    totalruns: currentInnings === 4 ? target + 1 : target,
                }));
            }
            if (currentInnings === 3 && matchFirstInnings?.Currentover?.[0]?.runs - matchSecondInnings?.Currentover?.[0]?.runs > 0 && (!tData?.followOn || tData?.followOn === "Bat Again")) {
                setTeam1Lead({
                    lead: true,
                    run: (matchFirstInnings?.Currentover?.[0]?.runs - matchSecondInnings?.Currentover?.[0]?.runs) + initailscore.runs
                })
            }
        }

        if (isTestMatch && isTeam1BattingFirstInnings && tData?.status === 4) {
            const team1Score = getScore(firstInnings, firstInningsCompletedOvers, 1)
            const team2Score = getScore(secondInnings, secondInningsCompletedOvers, 2)
            setTeam1Score(team1Score)
            setTeam2Score(team2Score)
        } else if (isTestMatch && !isTeam1BattingFirstInnings && tData?.status === 4) {
            const team1Score = getScore(firstInnings, firstInningsCompletedOvers, 1)
            const team2Score = getScore(secondInnings, secondInningsCompletedOvers, 2)
            setTeam1Score(team2Score)
            setTeam2Score(team1Score)
        } else if (currentInnings === 1) {
            const team1Score = getScore(firstInnings, firstInningsCompletedOvers, 1);
            const team2Score = getScore(firstInnings, firstInningsCompletedOvers, 1);
            if (isTeam1Batting) {
                setTeam1Score(team1Score)
                setTeam2Score({
                    run: 0,
                    wicket: 0,
                    over: 0,
                    ball: 0
                })
            } else if (isTeam2Batting) {
                setTeam2Score(team2Score)
                setTeam1Score({
                    run: 0,
                    wicket: 0,
                    over: 0,
                    ball: 0
                })
            }
        } else if (currentInnings === 2 || tData?.status === 4) {
            const team1Score = isTeam1Batting
                ? getScore(secondInnings, secondInningsCompletedOvers, 2)
                : getScore(firstInnings, firstInningsCompletedOvers, 1);
            const team2Score = isTeam1Batting
                ? getScore(firstInnings, firstInningsCompletedOvers, 1)
                : getScore(secondInnings, secondInningsCompletedOvers, 2);
            setTeam1Score(team1Score);
            setTeam2Score(team2Score);
            const bowl = tData?.secondInnings?.Completedovers?.length < 0 ? secondInnings?.legalBall : (tData?.secondInnings?.Completedovers?.length * 6) + secondInnings?.legalBall
            if (!isTestMatch) {
                setTarget({
                    runs: tData?.target?.runs ? tData?.target?.runs - secondInnings?.runs : firstInnings?.runs + 1,
                    balls: tData?.target?.overs ? (tData?.target?.overs * 6) - bowl : bowl ? (totalOvers * 6) - bowl : totalOvers * 6,
                    totalballs: 0,
                    totalruns: 0
                })
            }
        } else if (isTestMatch && (currentInnings === 3 || currentInnings === 4)) {
            const team1Score = isTeam1BattingFirstInnings
                ? getScore(firstInnings, firstInningsCompletedOvers, 1)
                : getScore(secondInnings, secondInningsCompletedOvers, 2);
            const team2Score = isTeam1BattingFirstInnings
                ? getScore(secondInnings, secondInningsCompletedOvers, 2)
                : getScore(firstInnings, firstInningsCompletedOvers, 1);
            setTeam1Score(team1Score);
            setTeam2Score(team2Score);
        } else if (currentInnings === 3 && tData?.status !== 4 && !isTestMatch) {
            const team1Score = getScore(thirdInnings, superOverFirstInningsCompletedOvers, 3);
            const team2Score = getScore(thirdInnings, superOverFirstInningsCompletedOvers, 3);
            if (isTeam1Batting) {
                setTeam1Score(team1Score)
                setTeam2Score({
                    run: 0,
                    wicket: 0,
                    over: 0,
                    ball: 0
                })
            } else if (isTeam2Batting) {
                setTeam2Score(team2Score)
                setTeam1Score({
                    run: 0,
                    wicket: 0,
                    over: 0,
                    ball: 0
                })
            }
        } else if (currentInnings === 4 && tData?.status !== 4 && !isTestMatch) {
            const team1Score = isTeam1Batting ? getScore(fourthInnings, superOverSecondInningsCompletedOvers, 4) : getScore(thirdInnings, superOverFirstInningsCompletedOvers, 4);
            const team2Score = isTeam1Batting ? getScore(thirdInnings, superOverFirstInningsCompletedOvers, 4) : getScore(fourthInnings, superOverSecondInningsCompletedOvers, 4);
            setTeam1Score(team1Score);
            setTeam2Score(team2Score);
            const bowl = tData?.superOverSecondInnings?.Completedovers?.length < 0 ? fourthInnings?.legalBall : (tData?.superOverSecondInnings?.Completedovers?.length * 6) + fourthInnings?.legalBall
            if (!isTestMatch) {
                setTarget({
                    runs: fourthInnings?.runs ? (thirdInnings?.runs + 1) - fourthInnings?.runs : thirdInnings?.runs + 1,
                    balls: bowl ? 6 - bowl : 6,
                    totalballs: 0,
                    totalruns: 0
                })
            }
        }
    }, [tossWinner, tData?.currentInnings, team1, team2]);

    const handleBack = () => {
        if (back === 'home') {
            router.push(`/`)
        } else if (back === 'mytournaments') {
            router.push('/mytournaments')
        } else if (type === 'match') {
            router.push(`/tournament/${tData?.tournamentId}/match`)
        } else {
            router.back(-1)
        }
    }

    useEffect(() => {
        if (tData?.currentInnings === 3 || tData?.currentInnings === 4) {
            setSuperover(true);
            const superfirstinningsballs = matchThirdInnings?.Currentover?.[0].legalBall === 6 ? 0 : matchThirdInnings?.Currentover?.[0].legalBall || 0
            const superfirstinningsruns = matchThirdInnings?.Currentover?.[0]?.runs || 0
            const superfirstinningswickets = matchThirdInnings?.Currentover?.[0]?.wicket || 0
            const superfirstinningsover = isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall === 6 && CurrentInnings === 3 && tData?.status !== 4 ? matchThirdInnings?.Completedovers?.length + 1 || 0
                : isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall === 6 ? matchThirdInnings?.Completedovers?.length || 0
                    : isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall !== 6 && matchThirdInnings?.Completedovers?.length > 0 && (tData?.matchWinner || CurrentInnings !== 3) ? matchThirdInnings?.Completedovers?.length - 1 || 0
                        : isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall !== 6 && matchThirdInnings?.Completedovers?.length > 0 ? matchThirdInnings?.Completedovers?.length || 0
                            : matchThirdInnings?.Currentover?.[0].legalBall === 6 ? 1 : 0
            const supersecondinningsballs = matchFourthInnings?.Currentover?.[0].legalBall === 6 ? 0 : matchFourthInnings?.Currentover?.[0].legalBall || 0
            const supersecondinningsruns = matchFourthInnings?.Currentover?.[0]?.runs || 0
            const supersecondinningswickets = matchFourthInnings?.Currentover?.[0]?.wicket || 0
            const supersecondinningsover = isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall === 6 && CurrentInnings === 4 && tData?.status !== 4 ? matchFourthInnings?.Completedovers?.length + 1 || 0
                : isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall === 6 ? matchFourthInnings?.Completedovers?.length || 0
                    : isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall !== 6 && !tData?.matchWinner ? matchFourthInnings?.Completedovers?.length || 0
                        : isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall !== 6 && (tData?.status === 4 || tData?.matchWinner) ? matchFourthInnings?.Completedovers?.length - 1 || 0
                            : matchFourthInnings?.Currentover?.[0].legalBall === 6 ? 1 : 0
            const FirstInningsbatting = matchThirdInnings?.battingside === tData?.team1?.team_name;

            if (FirstInningsbatting) {
                setTeam1SOScore({
                    run: superfirstinningsruns,
                    ball: superfirstinningsballs,
                    wicket: superfirstinningswickets,
                    over: superfirstinningsover
                })
                setTeam2SOScore({
                    run: supersecondinningsruns,
                    ball: supersecondinningsballs,
                    wicket: supersecondinningswickets,
                    over: supersecondinningsover
                })
            } else if (!FirstInningsbatting) {
                setTeam1SOScore({
                    run: supersecondinningsruns,
                    ball: supersecondinningsballs,
                    wicket: supersecondinningswickets,
                    over: supersecondinningsover
                })
                setTeam2SOScore({
                    run: superfirstinningsruns,
                    ball: superfirstinningsballs,
                    wicket: superfirstinningswickets,
                    over: superfirstinningsover
                })
            }
        }

        const winningTeam = team_data?.data?.find((items) => items?.id === tData?.matchWinner)?.team_name
        const terminatedTeam = team_data?.data?.find((items) => items?.id === tData?.terminate?.teamdisqualify)?.team_name

        if (tData?.status === 4) {
            if (tData?.terminate) {
                if (tData?.terminate?.mainreason === "rain") {
                    setWinner(`Match abandoned due to ${tData?.terminate?.mainreason}`)
                } else {
                    setWinner(`Match abandoned as ${terminatedTeam} was disqualified`)
                }
            } else if (tData?.matchWinner === undefined && isTestMatch) {
                setWinner("Match Draw")
            } else if (!tData?.matchWinner && !isTestMatch) {
                setWinner('Match Tied')
            } else if (tData?.winSituation) {
                setWinner(`${winningTeam} ${tData?.winSituation}`)
            }
        }
    }, [tData, tData?.matchWinner, matchThirdInnings, matchFourthInnings, team1, team2])

    useEffect(() => {
        const pageElement = document.getElementById("tournament-Banner");
        const mainContainer = document.getElementById("mainContainer");
        const tabElement = document.getElementById("tab-list");

        if (!tabElement || !pageElement || !mainContainer) return;

        const handleScroll = () => {
            // const scrollY = window.scrollY
            const scrollY = mainContainer.scrollTop
            const tabTop = tabElement.getBoundingClientRect().top;
            const pageBottom = pageElement.getBoundingClientRect().bottom;
            if (tabTop <= 0) {
                tabElement.classList.add("sticky-tab-list");
                if (tabElement.classList.contains("sticky-tab-list")) {
                    pageElement.style.zIndex = '0'
                }
            } else {
                tabElement.classList.remove("sticky-tab-list");
                if (!tabElement.classList.contains("sticky-tab-list")) {
                    pageElement.style.zIndex = '99'
                }
            }

            if (pageBottom >= scrollY) {
                tabElement.classList.remove("sticky-tab-list");
                if (!tabElement.classList.contains("sticky-tab-list")) {
                    pageElement.style.zIndex = '99'
                }
            }
        };

        mainContainer.addEventListener("scroll", handleScroll);
        return () => mainContainer.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
        }
    }, [tabValue]);



    return (
        <Box position={'relative'}>
            {
                loading && <Loader />
            }
            <Box
                id='tournament-Banner'
                className='tournamentBanner activeAnimation'
                sx={{
                    backgroundImage: `url('${bannerImage}')`,
                    backgroundColor: `${!bannerImage ? tournamentColor : ''}`
                }}
            >
                <CommonBack onClick={handleBack} />
                {type !== 'match' &&
                    <Box>
                        {/* <Box className='menu-open-box'>
                        <SvgIcon id={'three-line-menu'} onClick={handleOpen} />
                    </Box> */}
                        <Box className='tournament_profile'>
                            <Box className={!logoImage ? 'avatar_logo' : 'tournament_logo_img'}>
                                {logoImage && <Image src={`${logoImage}`} alt="logo image" unoptimized width={70} height={70} />}
                                {!logoImage && <ImageAvatar bgColor={tournamentColor} meduimHeight={'100%'} meduimWidth={'100%'} text={tournamentLetter} width={'100%'} height={'100%'} borderRadius={'10px'}
                                    smallWidth={'100%'} smallHeight={'100%'} fontSize={'var(--small)'} />}
                            </Box>
                            <Box className='tournament_details'>
                                <Typography variant="h6">{tData?.tournament_name + ' ' + `( ${tData?.city} )`}</Typography>
                                <Typography variant="body2">{DateFormat(tData?.tournament_start_date)} {' To '} {DateFormat(tData?.tournament_end_date)}</Typography>
                            </Box>
                        </Box>
                    </Box>
                }
                {
                    type === 'match' &&
                    <Box>
                        <Box className='tournament_target_section'>
                            {
                                isTestMatch && tData.status !== 4 &&
                                <Typography>{isBreakStart ? '' : isStumps ? 'Stumps' : `${team1?.team_name} vs ${team2?.team_name} Test Match ${CurrentRunningDay}`}</Typography>
                            }
                            {
                                isBreakStart &&
                                <Typography>{isBreakStart}</Typography>
                            }
                            <Typography>
                                {winner ? `${winner}`
                                    : isTestMatch && target?.runs > 0 && (tData?.currentInnings !== 1 && tData?.currentInnings === 4) ? `${tossWinner?.battingSide === team1?.team_name ? team1?.team_name : team2?.team_name} needs ${target?.runs < 0 ? 0 : target?.runs} runs in ${target?.balls}${Over ? `.${6 - legalBallCount}` : ""} ${Over ? 'Overs' : 'Balls'} to Win`
                                        : isTestMatch && (tData?.currentInnings === 2 || tData?.currentInnings === 3) ? `${tossWinner?.battingSide === team1?.team_name ? team1?.team_name : team2?.team_name} ${Team1Lead.lead ? 'lead' : target?.runs < 0 ? 'lead' : 'trail'} by ${Team1Lead.lead ? Team1Lead.run : target?.runs < 0 ? initailscore?.runs - target?.totalruns : target?.runs || 0} runs`
                                            : !isTestMatch && (tData?.currentInnings === 2 || tData?.currentInnings === 4) ? `${tossWinner?.battingSide === team1?.team_name ? team1?.team_name : team2?.team_name} needs ${target.runs < 0 ? 0 : target.runs} In ${target.balls} Balls to Win`
                                                : !isTestMatch && tData?.currentInnings === 3 ? 'Superover'
                                                    : `${tData?.toss?.tossWinner === tData?.team1?.id ? team1?.team_name : team2?.team_name} won the toss and decided to ${tData?.toss?.selectSide}`
                                }
                            </Typography>
                        </Box>
                        <Banner
                            image1={team1Logo ? `/${team1Logo}` : null}
                            image2={team2Logo ? `/${team2Logo}` : null}
                            type={'score'}
                            team1score={team1Score}
                            team2score={team2Score}
                            superover={superover}
                            soteam1score={team1SOScore}
                            soteam2score={team2SOScore}
                            team1name={team1Name}
                            team2name={team2Name}
                            team1color={team1Color}
                            team1letter={team1Letter}
                            team2color={team2Color}
                            team2letter={team2Letter}
                            soteam1scorehidden={!isTestMatch && (CurrentInnings === 3 || CurrentInnings === 4) && (!tData?.matchWinner || tData?.status !== 4) ? true : CurrentInnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? false : true}
                            soteam2scorehidden={!isTestMatch && (CurrentInnings === 3 || CurrentInnings === 4) && (!tData?.matchWinner || tData?.status !== 4) ? true : CurrentInnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? true : false}
                            team1Declare={!isTestMatch ? false : tData?.firstInnings?.battingside === tData?.team1?.team_name ? Innings1Declare : Innings2Declare}
                            team2Declare={!isTestMatch ? false : tData?.firstInnings?.battingside === tData?.team2?.team_name ? Innings1Declare : Innings2Declare}
                            team1SuperOverDeclare={!isTestMatch ? false : CurrentInnings === 4 && tossWinner?.battingSide === team1?.team_name ? false : Innings3Declare}
                            team2SuperOverDeclare={!isTestMatch ? false : CurrentInnings === 4 && tossWinner?.battingSide === team2?.team_name ? false : Innings3Declare}
                        />
                    </Box>
                }
                {/* <Menubar open={openDrawer} handleClose={handleClose} /> */}
            </Box>
            <Box sx={{ position: 'absolute', bottom: '0', zIndex: '99', left: '0', right: '0' }}>
                <ScrollableTabs
                    buttonGroups={type === 'match' ? matchGroups : pastMatchGroups}
                    tabActive={tabValue}
                    handleChange={handleTabChange}
                />
            </Box>
        </Box>
    )
}

export default React.memo(TournamentBanner)