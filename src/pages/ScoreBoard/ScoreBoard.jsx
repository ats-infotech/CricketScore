'use client'
import CustomSelectInput from "@/components/common/commonUi/CustomSelectInput";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import CustomeTags from "@/components/common/commonUi/CustomeTags";
import InputSelect from "@/components/common/commonUi/InputSelect";
import { breakType } from "@/components/common/json/commonJson";
import ScorePage from "@/pages/Score/Score";
import {
    AddCommentary, AddExtra, AddInnings, AddOver, AddSecondInnings, AddSecondInningsExtra, AddSecondInningsOver, AddSecondInningsWicket, AddSuperOverExtra,
    AddSuperOverInnings, AddSuperOverSecondInnings, AddSuperOverSecondInningsExtra, AddSuperOverSecondInningsWicket, AddSuperOverWicket, AddWicket, ChangeInnings,
    ChangeMatchTarget, ChangePlayer, ChangeStatus, DescreaseMatchOvers, MatchBreakSchedule, matchesState, MatchTerminate, RemoveExtra, RemoveOver, RemoveSecondInningsExtra,
    RemoveSecondInningsWicket, RemoveSuperOverExtra, RemoveSuperOverSecondInningsExtra, RemoveSuperOverSecondInningsWicket, RemoveSuperOverWicket, RemoveWicket, ReplaceBattingOrder,
    ReplaceMatchSchedule, ReplaceSecondInningsBattingOrder, ReplaceSuperOverBattingOrder, ReplaceSuperOverSecondInningsBattingOrder
} from "@/redux/slices/matchSlice";
import { playersState, updatePlayersStats } from "@/redux/slices/playersSlice";
import { teamsState, updateTeamStats } from "@/redux/slices/teamSlice";
import { updateTournamentStats } from "@/redux/slices/tournamentSlice";
import { Close } from "@mui/icons-material";
import { Box, Dialog, FormControl, MenuItem, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './ScoreBoard.css';
import { calculateDLSTarget } from "@/components/common/commomFunction";

const calculatePlayerStats = (player, wickets, economy) => {
    let battingrun = 0;
    let battingball = 0;
    let battingfour = 0;
    let battingsix = 0;
    let battingdot = 0;
    let battingout = 0;
    let innings = 1;
    let bowlingrun = 0;
    let bowlingball = 0;
    let bowlingover = 0;
    let bowlingwickets = 0;
    let bowlingdot = 0;

    // Batting Score Calculation
    const playerscores = wickets?.filter(wicket => wicket.BatterId === player.id);
    playerscores.forEach(wicket => {
        battingout = wicket?.reason === 'Not Out' ? 0 : 1
        battingrun = parseInt(wicket.run)
        battingfour = parseInt(wicket.four)
        battingsix = parseInt(wicket.six)
        battingball = parseInt(wicket.balls)
    });

    // Bowling Score Calculation
    const bowlerTotalScore = economy.filter(data => data.bowlerId === player.id);
    bowlerTotalScore.forEach(bowler => {
        bowlingrun += bowler.bowlerrun
        bowlingwickets += bowler.bowlerwicket
        bowlingball += bowler.legalBall;
    });

    return {
        playerId: player.id,
        battingrun,
        battingball,
        battingfour,
        battingsix,
        battingdot,
        battingout,
        bowlingrun,
        bowlingball,
        bowlingwickets,
        bowlingover,
        bowlingdot,
        innings
    };
};

const calculateMatchStats = (wicket, economy, finalOvers, firstInningswickets, secondInningswickets, Extras) => {
    let matches = 1;
    let innings = 2;
    let runs = 0;
    let wickets = 0;
    let balls = 0;
    let extras = 0;
    let fours = 0;
    let sixes = 0;
    let fiftys = 0;
    let hundreds = 0;
    let fiftypartnerships = 0;
    let hundredspartnerships = 0;
    let maidens = 0;
    let dotballs = 0;
    let catches = 0;
    let stumpings = 0;
    let prevPartnership = 0;
    let partnershipRun = 0;
    let lastNotOutPartnershipFirstInnings = 0;
    let lastNotOutPartnershipSecondInnings = 0;

    economy?.forEach(score => {
        balls += score.legalBall;
    });

    Extras.forEach(extra => {
        extras += extra?.runs
    })

    wicket.forEach(score => {
        fiftys += score?.run > 50 && 1;
        hundreds += score?.run > 100 && 1;
        fours += score?.four;
        sixes += score?.six;
        catches += score?.reason === 'Catch' && 1;
        stumpings += score?.reason === 'Stumped' && 1;
    });

    firstInningswickets.forEach((score, index) => {
        if (score.reason !== "Not Out") {
            partnershipRun = score.partnership - prevPartnership;
            prevPartnership = score.partnership;
            if (partnershipRun > 50) {
                fiftypartnerships += 1;
            }

            if (partnershipRun > 100) {
                hundredspartnerships += 1;
            }
        } else {
            partnershipRun = score.partnership - prevPartnership;
            prevPartnership = score.partnership;

            if (index === wicket.length - 1 || wicket[index + 1]?.reason === "Not Out") {
                if (partnershipRun > 50) {
                    if (lastNotOutPartnershipFirstInnings === 0) {
                        fiftypartnerships += 1;
                        lastNotOutPartnershipFirstInnings = 1;
                    }
                }
                if (partnershipRun > 100) {
                    if (lastNotOutPartnershipFirstInnings === 1) {
                        hundredspartnerships += 1;
                        lastNotOutPartnershipFirstInnings = 1;
                    }
                }
            }
        }
    });
    secondInningswickets.forEach((score, index) => {
        if (score.reason !== "Not Out") {
            partnershipRun = score.partnership - prevPartnership;
            prevPartnership = score.partnership;
            if (partnershipRun > 50) {
                fiftypartnerships += 1;
            }
            if (partnershipRun > 100) {
                hundredspartnerships += 1;
            }
        } else {
            partnershipRun = score.partnership - prevPartnership;
            prevPartnership = score.partnership;

            if (index === wicket.length - 1 || wicket[index + 1]?.reason === "Not Out") {
                if (partnershipRun > 50) {
                    if (lastNotOutPartnershipSecondInnings === 0) {
                        fiftypartnerships += 1;
                        lastNotOutPartnershipSecondInnings = 1;
                    }
                }
                if (partnershipRun > 100) {
                    if (lastNotOutPartnershipSecondInnings === 1) {
                        hundredspartnerships += 1;
                        lastNotOutPartnershipSecondInnings = 1;
                    }
                }
            }
        }
    });

    if (economy) {
        economy.forEach(bowlerScore => {
            const intKeysValues = Object.keys(bowlerScore)
                .filter(key => !isNaN(key))
                .map(key => bowlerScore[key]);

            const dots = intKeysValues.filter(value => value === "0" || value === "W" || value.includes("LB"));

            if (intKeysValues.every(value => (value === "0" || value === "W" || value.includes("LB")))) {
                maidens += 1;
            }
            if (dots.length > 0) {
                dotballs += dots.length;
            }
        });
    }

    finalOvers.forEach(score => {
        runs += score?.runs !== null ? score?.runs : 0;
        wickets += score?.wicket !== null ? score?.wicket : 0;
    });

    return {
        matches,
        innings,
        runs,
        wickets,
        balls,
        extras,
        fours,
        sixes,
        fiftys,
        hundreds,
        fiftypartnerships,
        hundredspartnerships,
        maidens,
        dotballs,
        catches,
        stumpings,
    };
};

const CommonInput = React.memo(({ value, onchange, loop, title, disabled, type, minWidth }) => {
    return (
        <FormControl className="scoreboard_form">
            <InputSelect
                value={value}
                onChange={onchange}
                disabled={disabled}
                minWidth={minWidth}
                sx={{
                    backgroundColor: 'var(--blue-background)',
                    color: 'var(--text-white)',
                    '& .MuiSvgIcon-root': {
                        color: 'var(--text-white)',
                    },
                    '&.Mui-focused': {
                        border: 'none',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&:hover': {
                        border: 'none',
                    },
                }}
            >
                <MenuItem value={0}>{title}</MenuItem>
                {
                    loop.map((items, i) => {
                        return (
                            <MenuItem key={i} value={i + 1} >{type === "reason" ? items : items.playerName}</MenuItem>
                        )
                    })
                }
            </InputSelect>
        </FormControl>
    )
})

const SelectionOptionSection = React.memo(({ title, value, option, firstoption, onchange, width, className }) => {
    return (
        <Box className={`scoreboard_common_section ${width && 'active'} ${className}`}>
            <Box>
                <Typography variant="body2">{title}</Typography>
            </Box>
            <Box sx={{ width: width ? width : '60%' }}>
                <CustomSelectInput label={firstoption} options={option.map(player => ({ key: player.id, name: player.playerName }))} onChange={onchange} value={value} />
            </Box>
        </Box>
    )
})

const RenderButton = React.memo(({ onClick, title, disabled }) => {
    return (
        <CustomeButton
            onClick={onClick}
            bgColor={'var(--text-white)'}
            color={'var(--primary-color)'}
            hover={'none'}
            title={title}
            width={'100%'}
            height={'44px'}
            disabled={disabled}
        />
    )
});

const ScoreBoard = () => {

    const reason = ['LBW', 'Bowled', 'Catch', 'Hit Wicket', 'Stumped', 'Run Out']

    const runtype = ['0', '1', '2', '3', '4', '6', '5,7', 'WD', 'NB', 'LB', 'W', 'RNO', 'STO', 'PR', 'NR'];

    const Tied = ['Superover', 'Tied']

    const MatchTermination = ['Disqualify Team', 'Rain Interruption']

    const RainConclusion = ['Share Points', 'Zero Points']

    const [initailscore, setInitialscore] = useState({
        run: 0,
        wicket: 0
    });
    const [active, setActive] = useState({
        active: false,
        data: "",
        secondactive: ""
    });
    const [ball, setBall] = useState({
        overNo: 0,
        ballNo: 0
    });
    const [target, setTarget] = useState({
        runs: 0,
        overs: 0,
        totalruns: 0,
        totalballs: 0
    })
    const [length, setLength] = useState(6);
    const [ballScores, setBallScores] = useState(Array(length).fill(null));
    const [legalBallCount, setLegalBallCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [wicketReason, setWicketReason] = useState({
        bowler: "",
        reason: 0,
        batter: "",
        newBatter: "",
        fielder: "",
        penalty: "",
        penaltyto: 0,
        overtype: 0,
        scoreTo: 0,
        superover: 0,
        runs: ''
    })
    const [currentMatch, setCurrentMatch] = useState([])
    const [bowlerchange, setBowlerchange] = useState(false)
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [team1player, setTeam1player] = useState([])
    const [team2player, setTeam2player] = useState([])
    const [team1XIplayer, setTeam1XIplayer] = useState([])
    const [team2XIplayer, setTeam2XIplayer] = useState([])
    const [rno, setRno] = useState(false)
    const [penalty, setPenalty] = useState(false)
    const [wicket, setWicket] = useState(false)
    const [playerselection, setPlayerselection] = useState({
        striker: "",
        nonStriker: "",
        bowler: "",
    })
    const [tossWinner, setTossWinner] = useState({
        tossWinner: "",
        battingSide: "",
        bowlingSide: ""
    })

    const [inning, setInning] = useState(0)
    const [activeStrike, setActiveStrike] = useState(1)
    const [maxOver, setMaxOver] = useState()
    const [batterScores, setBatterScores] = useState({
        batter1run: 0,
        batter1balls: 0,
        batter1dot: 0,
        batter1four: 0,
        batter1six: 0,
        batter1sr: "",
        batter2run: 0,
        batter2balls: 0,
        batter2dot: 0,
        batter2four: 0,
        batter2six: 0,
        batter2sr: ""
    })
    const [battingOrder, setBattingOrder] = useState([])
    const [bowlerScore, setBowlerScore] = useState({
        overNo: 0,
        ballNo: 0,
        wd: 0,
        nb: 0,
        dot: 0,
        eco: "",
        wicket: 0,
        run: 0
    })
    const [wicketPlayes, setWicketPlayers] = useState([])
    const [OverPerBowler, setOverPerBowler] = useState()
    const [battinglength, setBattinglength] = useState()
    const [InningsComplete, setInningsComplete] = useState(false)
    const [superOver, setSuperOver] = useState(false)
    const [firstInningsScore, setFirstInningsScore] = useState({
        run: 0,
        wicket: 0,
        ball: 0,
        over: 0
    })
    const [secondInningsScore, setSecondInningsScore] = useState({
        run: 0,
        wicket: 0,
        ball: 0,
        over: 0
    })
    const [winningTeam, setWinningTeam] = useState()
    const [winningSituation, setWinningSituation] = useState("")
    const [dot, setDot] = useState()
    const [allOut, setAllOut] = useState(false)
    const [matchPlayers, setMatchPlayers] = useState([])
    const params = useParams()
    const dispatch = useDispatch()
    const hasRunRef = useRef(false);
    const hasRunwinningRef = useRef(false)
    const hasbatterpassed = useRef(false)
    const router = useRouter()
    const [oversFinished, setOverFinished] = useState(false)
    const [gif, setGif] = useState({
        gif: false,
        type: ''
    })
    const [changeBatter, setChangeBatter] = useState(false)
    const [retiredHurt, setRetiredHurt] = useState(false)
    const [Extras, setExtras] = useState({
        WD: 0,
        NB: 0,
        LB: 0,
        PR: 0,
        NR: 0
    })
    const [undo, setUndo] = useState(false)
    const [customRun, setCustomRun] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [playersPost, setPlayersPost] = useState({
        team1Captain: '',
        team1WicketKeeper: '',
        team2Captain: '',
        team2WicketKeeper: ''
    })

    // Break state
    const [breakStart, setBreakStart] = useState(false)
    const [selectBreakType, setSelectBreakType] = useState('')
    const [matchTerminate, setMatchTerminate] = useState({
        terminate: false,
        mainreason: 0,
        pointsdistribution: 0,
        reason: "",
        disqualified: 0
    })
    const [reviseTarget, setReviseTarget] = useState({
        revise: false,
        over: "",
        type: ""
    })
    const [Team1Data, setTeam1Data] = useState([])
    const [Team2Data, setTeam2Data] = useState([])
    const [partnership, setPartnerShip] = useState({
        batter1run: 0,
        batter1balls: 0,
        batter2run: 0,
        batter2balls: 0,
    })

    // Redux Data
    const match_data = useSelector(matchesState)
    const team_data = useSelector(teamsState)
    const player_data = useSelector(playersState)
    let CurrentInnings = currentMatch?.currentInnings
    let matchFirstInnings = currentMatch?.firstInnings
    let matchSecondInnings = currentMatch?.secondInnings
    let matchThirdInnings = currentMatch?.superOverFirstInnings
    let matchFourthInnings = currentMatch?.superOverSecondInnings
    const inningsMap = {
        1: 'firstInnings',
        2: 'secondInnings',
        3: 'superOverFirstInnings',
        4: 'superOverSecondInnings',
    };
    let innings = inningsMap[CurrentInnings] || 'firstInnings';
    let filterBatterWithHurt = currentMatch?.[innings]?.Wickets?.filter(item => item.reason === "Retired Hurt")?.length || 0;

    useEffect(() => {
        let Extra = currentMatch?.[innings]?.Extras
        let WDs = Extra?.filter((items) => items.reason === "WD")
        let LBs = Extra?.filter((items) => items.reason === "LB")
        let NBs = Extra?.filter((items) => items.reason === "NB")
        let PRs = Extra?.filter((items) => items.reason === "PR")
        let NRs = Extra?.filter((items) => items.reason === "NR")
        let totalWDRuns = WDs?.reduce((sum, item) => sum + item.runs, 0);
        let totalLBRuns = LBs?.reduce((sum, item) => sum + item.runs, 0);
        let totalNBRuns = NBs?.reduce((sum, item) => sum + item.runs, 0);
        let totalPRRuns = PRs?.reduce((sum, item) => sum + item.runs, 0);
        let totalNRRuns = NRs?.reduce((sum, item) => sum + item.runs, 0);
        setExtras({
            WD: totalWDRuns,
            NB: totalNBRuns,
            LB: totalLBRuns,
            PR: totalPRRuns,
            NR: totalNRRuns
        })
    }, [currentMatch?.[innings]?.Extras])

    useEffect(() => {
        // setLoading(true)
        let startedMatch = match_data.data?.find((item) => item?.id === params.matchId)
        setCurrentMatch(startedMatch)
        // setLoading(false)
    }, [params, match_data?.data]);

    useEffect(() => {
        let team1player = player_data?.data?.filter(item => item?.teamId === team1?.id);
        let team1XIplayer = currentMatch?.selectedPlayer?.team1;
        let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
        let team2player = player_data?.data?.filter(item => item?.teamId === team2?.id);
        let team2XIplayer = currentMatch?.selectedPlayer?.team2;
        let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
        const matchPlayers = [...commonPlayerTeam1, ...commonPlayerTeam2];
        setTeam1player(team1player)
        setTeam2player(team2player)
        setTeam1XIplayer(commonPlayerTeam1)
        setTeam2XIplayer(commonPlayerTeam2)
        setMatchPlayers(matchPlayers)
    }, [player_data, team1, team2])

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === currentMatch?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === currentMatch?.team2?.id)
        setTeam1(currentMatch?.team1)
        setTeam2(currentMatch?.team2)
        setTeam1Data(team1)
        setTeam2Data(team2)
        const Team1Captain = player_data?.data?.filter(player => player.id === currentMatch?.post?.team1Captain)?.[0]
        const Team1WicketKeeper = player_data?.data?.filter(player => player.id === currentMatch?.post?.team1WicketKeeper)?.[0]
        const Team2Captain = player_data?.data?.filter(player => player.id === currentMatch?.post?.team2Captain)?.[0]
        const Team2WicketKeeper = player_data?.data?.filter(player => player.id === currentMatch?.post?.team2WicketKeeper)?.[0]
        setPlayerselection({
            striker: currentMatch?.playerselection?.striker,
            nonStriker: currentMatch?.playerselection?.nonStriker,
            bowler: currentMatch?.playerselection?.bowler
        })
        const filterBatterWickets = currentMatch?.[innings]?.Wickets
        const CurrentBatters = [currentMatch?.playerselection?.striker, currentMatch?.playerselection?.nonStriker]
        if ((!filterBatterWickets || filterBatterWickets.length === 0)) {
            setBattingOrder(CurrentBatters)
            const createNewObj = {
                id: currentMatch?.id,
                [innings]: {
                    BattingOrder: CurrentBatters
                }
            };
            handleBatterOrder(createNewObj)
        }
        if (CurrentInnings === 2 || CurrentInnings === 1) {
            setMaxOver(parseInt(currentMatch?.totalovers))
        } else if (CurrentInnings === 3 || CurrentInnings === 4) {
            setMaxOver(1)
        }
        setOverPerBowler(parseInt(currentMatch?.overPerBowler))
        setPlayersPost({
            team1Captain: Team1Captain,
            team1WicketKeeper: Team1WicketKeeper,
            team2Captain: Team2Captain,
            team2WicketKeeper: Team2WicketKeeper
        })
    }, [currentMatch, player_data, team_data])

    const handleBatterOrder = (createNewObj) => {
        if (CurrentInnings && !hasbatterpassed.current && currentMatch?.[innings]?.BattingOrder?.length === 0) {
            const action = CurrentInnings === 3 ? ReplaceSuperOverBattingOrder : CurrentInnings === 2 ? ReplaceSecondInningsBattingOrder : CurrentInnings === 1 ? ReplaceBattingOrder : CurrentInnings === 4 ? ReplaceSuperOverSecondInningsBattingOrder : '';
            dispatch(action(createNewObj))
            hasbatterpassed.current = true
        }
    }

    useEffect(() => {
        const winnerSide = currentMatch?.toss?.selectSide;
        const tossWinner = currentMatch?.toss?.tossWinner;
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

            const superOverCountEven = currentMatch?.superOverCount % 2 === 0
            if (currentMatch?.superOverCount && CurrentInnings === 3 ? !superOverCountEven : currentMatch?.superOverCount && CurrentInnings === 4 ? superOverCountEven : CurrentInnings === 2 || CurrentInnings === 3) {
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
    }, [team1, team2, currentMatch, currentMatch?.toss, currentMatch?.superOverCount]);

    useEffect(() => {
        if (wicket && battinglength + filterBatterWithHurt === initailscore.wicket + 1) {
            setInningsComplete(true)
        } else if (battinglength + filterBatterWithHurt === initailscore.wicket) {
            setInningsComplete(true)
        } else {
            setInningsComplete(false)
            setAllOut(false)
        }
    }, [currentMatch])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setRno(false)
            setPenalty(false)
            setBowlerchange(false)
            setWicket(false)
            setChangeBatter(false)
            setRetiredHurt(false)
            setCustomRun(false)
            setBreakStart(false)
            setMatchTerminate({
                terminate: false,
                mainreason: 0,
                pointsdistribution: 0,
                reason: "",
                disqualified: 0
            })
            setReviseTarget({
                revise: false,
                over: "",
                type: ""
            })
            if (active.data !== 'PR' && active.data !== 'NR') {
                if ((wicketReason.batter === "" || wicketReason.fielder === "") || ((wicketReason.batter !== '' || wicketReason.fielder !== '') && !allOut && wicketReason.newBatter === '')) {
                    setActive({
                        active: false,
                        data: "",
                        secondactive: ""
                    })
                    if (active.data === "WD" || active.data === "NB") {
                        setLength(length - 1)
                        setBowlerScore((prev) => ({
                            ...prev,
                            run: prev.run - 1
                        }))
                    }
                    setInningsComplete(false)
                    setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
                    setAllOut(false)
                } else if (allOut && (active.data === "RNO" || active.secondactive === "RNO")) {
                    setAllOut(false)
                    setInningsComplete(false)
                } else {
                    if (wicketReason.newBatter !== "" || wicketReason.batter !== "" || wicketReason.fielder !== "") {
                        if (active.data === "WD" || active.data === "NB") {
                            setLength(length - 1)
                            setBowlerScore((prev) => ({
                                ...prev,
                                run: prev.run - 1
                            }))
                        }
                        setActive({
                            active: false,
                            data: "",
                            secondactive: ""
                        })
                        setRno(false)
                    }
                    setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
                }
            }
            if (active.data === 'PR' || active.data === 'NR') {
                setActive({
                    active: false,
                    data: "",
                    secondactive: ""
                })
                setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
            }
            if (battinglength + filterBatterWithHurt === initailscore.wicket + 1) {
                setInningsComplete(false)
                setAllOut(false)
            } else if (battinglength + filterBatterWithHurt === initailscore.wicket) {
                setInningsComplete(true)
                setAllOut(true)
            }
            if (active.active === false) {
                setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
            }
        }, 100);
    };

    const handlePenalty = () => {
        if (wicketReason.penalty === "") {
            setActive({
                active: false,
                data: "",
                secondactive: ""
            })
        }
        setOpen(false)
        setPenalty(false)
    }

    const handleChangeStrike = () => {
        if (activeStrike === 1) {
            setActiveStrike(2)
        } else {
            setActiveStrike(1)
        }
    }

    const handleWicketUpdate = () => {
        if (active.data === "WD" && active.secondactive === "STO" && wicketReason.newBatter !== "") {
            let updatedBowlerScore = { ...bowlerScore };
            updatedBowlerScore.wicket += 1;
            setBowlerScore(updatedBowlerScore);
            addBall()
            addWicket();
            let newBallScores = [...ballScores];
            newBallScores[ball.ballNo] = `WD+W`;
            setBallScores(newBallScores);
            handlePlayerWicket(activeStrike === 1 ? playerselection.striker : activeStrike === 2 ? playerselection.nonStriker : '', '0', 'WD+W', 'wide');
            setGif((prev) => ({
                ...prev,
                gif: true,
                type: 'W'
            }));
            setInitialscore((prev) => ({
                ...prev,
                run: prev.run + 1
            }))
            const giftimer = setTimeout(() => {
                setGif((prev) => ({
                    ...prev,
                    gif: false,
                    type: ''
                }));
            }, 1120);
            setTimeout(() => {
                clearTimeout(giftimer);
            }, 1120);
            setOpen(false)
            setWicket(false)
            setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
            setActive({
                active: false,
                data: '',
                secondactive: ''
            })
        } else if (wicketReason.reason !== 0 && wicketReason.newBatter !== "" && active.data !== "RNO" && active.active !== true) {
            let updatedBowlerScore = { ...bowlerScore };
            updatedBowlerScore.wicket += 1;
            updatedBowlerScore.run += 0;
            setBowlerScore(updatedBowlerScore);
            addWicket();
            let newBallScores = [...ballScores];
            newBallScores[ball.ballNo] = `W`;
            setBallScores(newBallScores);
            addBall();
            setLegalBallCount(legalBallCount + 1);
            handlePlayerWicket();
            handleClose()
            setGif((prev) => ({
                ...prev,
                gif: true,
                type: 'W'
            }));
            const giftimer = setTimeout(() => {
                setGif((prev) => ({
                    ...prev,
                    gif: false,
                    type: ''
                }));
            }, 1120);
            setTimeout(() => {
                clearTimeout(giftimer);
            }, 1120);
        }
        else if (wicketReason.reason !== 0 && active.data !== "RNO" && active.active !== true) {
            let updatedBowlerScore = { ...bowlerScore };
            updatedBowlerScore.wicket += 1;
            updatedBowlerScore.run += 0;
            setBowlerScore(updatedBowlerScore);
            addWicket();
            let newBallScores = [...ballScores];
            newBallScores[ball.ballNo] = `W`;
            setBallScores(newBallScores);
            addBall();
            setLegalBallCount(legalBallCount + 1);
            handlePlayerWicket();
            handleClose()
            setGif((prev) => ({
                ...prev,
                gif: true,
                type: 'W'
            }));
            const giftimer = setTimeout(() => {
                setGif((prev) => ({
                    ...prev,
                    gif: false,
                    type: ''
                }));
            }, 1120);
            setTimeout(() => {
                clearTimeout(giftimer);
            }, 1120);
        } else if (active.data === "RNO" || active.secondactive === "RNO") {
            setRno(false)
            setOpen(false)
            setWicket(false)
        }
    };

    const addBall = () => {
        if (legalBallCount < 6) {
            setBall((prev) => ({
                ...prev,
                ballNo: prev.ballNo + 1
            }));
        }
    };

    const handlePlayerChange = (striker, nonStriker, bowler) => {
        const createNewObj = {
            id: currentMatch?.id,
            striker: striker,
            nonStriker: nonStriker,
            bowler: bowler,
        }
        dispatch(ChangePlayer(createNewObj));
    }

    const handleInnChange = async () => {
        const nextInning = inning !== 4 ? inning + 1 : 3;
        const innings = CurrentInnings
        const superOverCount = currentMatch?.superOverCount ? currentMatch?.superOverCount + 1 : 2

        if (innings === 4) {
            const createNewObj1 = {
                ...currentMatch,
                superOverCount: superOverCount,
                superOverFirstInnings: {
                    battingside: tossWinner.battingSide,
                    bowlingside: tossWinner.bowlingSide,
                    Currentover: [],
                    Wickets: []
                },
                superOverSecondInnings: {
                    battingside: tossWinner.bowlingSide,
                    bowlingside: tossWinner.battingSide,
                    Currentover: [],
                    Wickets: []
                }
            }
            const createNewObj = {
                id: currentMatch?.id,
                currentInnings: nextInning,
            };

            await dispatch(ReplaceMatchSchedule(createNewObj1))
            await dispatch(ChangeInnings(createNewObj));
        } else {
            const createNewObj = {
                id: currentMatch?.id,
                currentInnings: nextInning
            };
            await dispatch(ChangeInnings(createNewObj));

        }
    };

    const handleChangeBatter = (name, type) => {
        if (type === 'edit') {
            setChangeBatter(true)
        } else if (type === 'ro') {
            setRetiredHurt(true)
        }
        setOpen(true)
        setWicketReason((prev) => ({
            ...prev,
            batter: name
        }))
    }

    const handleBatterChanged = () => {
        const selectedbatter = player_data?.data?.find((items) => items?.playerName === wicketReason.batter)?.id;
        const filterBatterOrder = currentMatch?.[innings]?.BattingOrder?.[0] || [];
        const updatedBatterOrder = [...filterBatterOrder];
        const batterIndex = updatedBatterOrder.findIndex(batter => batter === selectedbatter);
        const isNewBatterOut = currentMatch?.[innings]?.Wickets?.some(wicket => wicket.BatterId === wicketReason.newBatter);
        const isSelectedBatterOut = currentMatch?.[innings]?.Wickets?.some(wicket => wicket.BatterId === wicketReason.batter);
        if (!isSelectedBatterOut && batterIndex !== -1) {
            updatedBatterOrder.splice(batterIndex, 1);
        }
        const action = CurrentInnings === 3 ? ReplaceSuperOverBattingOrder : CurrentInnings === 2 ? ReplaceSecondInningsBattingOrder : CurrentInnings === 1 ? ReplaceBattingOrder : ReplaceSuperOverSecondInningsBattingOrder;
        if (!isNewBatterOut) {
            updatedBatterOrder.push(wicketReason.newBatter);
            setBattingOrder(updatedBatterOrder);
        }
        const createNewBatterObj = {
            id: currentMatch?.id,
            [innings]: {
                BattingOrder: updatedBatterOrder
            }
        };
        dispatch(action(createNewBatterObj));

        const actions = CurrentInnings === 3 ? RemoveSuperOverWicket : CurrentInnings === 2 ? RemoveSecondInningsWicket : CurrentInnings === 1 ? RemoveWicket : CurrentInnings === 4 ? RemoveSuperOverSecondInningsWicket : '';
        if (playerselection.striker === selectedbatter) {
            handleBatterPrevStats(wicketReason.newBatter, 1, updatedBatterOrder)
            handlePlayerChange(wicketReason.newBatter, playerselection.nonStriker, playerselection.bowler)
        } else if (playerselection.nonStriker === selectedbatter) {
            handleBatterPrevStats(wicketReason.newBatter, 2, updatedBatterOrder)
            handlePlayerChange(playerselection.striker, wicketReason.newBatter, playerselection.bowler)
        }

        const createNewObj = {
            id: currentMatch?.id,
            BatterId: wicketReason.newBatter
        };
        if (CurrentInnings?.Wickets) {
            dispatch(actions(createNewObj));
        }
        setOpen(false)
        setChangeBatter(false)
        setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
    }

    const handleRetiredHurt = () => {
        const batter = player_data?.data?.find((items) => items?.playerName === wicketReason.batter)?.id
        const innings = CurrentInnings === 4 ? 'superOverSecondInnings' : CurrentInnings === 3 ? 'superOverFirstInnings' : CurrentInnings === 2 ? 'secondInnings' : 'firstInnings';
        const WicketObject = {
            BatterId: batter,
            reason: 'Retired Hurt',
            run: batter && playerselection.striker === batter ? batterScores.batter1run : batter && playerselection.nonStriker === batter ? batterScores.batter2run : 0,
            balls: batter && playerselection.striker === batter ? batterScores.batter1balls : batter && playerselection.nonStriker === batter ? batterScores.batter2balls : 0,
            dot: batter && playerselection.striker === batter ? batterScores.batter1dot : batter && playerselection.nonStriker === batter ? batterScores.batter2dot : 0,
            four: batter && playerselection.striker === batter ? batterScores.batter1four : batter && playerselection.striker !== batter ? batterScores.batter2four : 0,
            six: batter && playerselection.striker === batter ? batterScores.batter1six : batter && playerselection.striker !== batter ? batterScores.batter2six : 0,
            sr: batter && playerselection.striker === batter ? batterScores.batter1sr : batter && playerselection.striker !== batter ? batterScores.batter2sr : 0,
            partnership: initailscore.run,
            newBatter: wicketReason.newBatter,
            batter1Contribution: partnership.batter1run,
            batter1balls: partnership.batter1balls,
            batter1Id: playerselection.striker,
            batter2Contribution: partnership.batter2run,
            batter2balls: partnership.batter2balls,
            batter2Id: playerselection.nonStriker
        }

        const filterBatterOrder = currentMatch?.[innings]?.BattingOrder?.[0] || [];
        const updatedBatterOrder = [...filterBatterOrder];
        const wasBatterOut = currentMatch?.[innings]?.Wickets?.some(wicket => wicket.BatterId === wicketReason.batter);
        if (!wasBatterOut) {
            const batterIndex = updatedBatterOrder.indexOf(wicketReason.batter);
            if (batterIndex !== -1) {
                updatedBatterOrder.splice(batterIndex, 1);
            }
        }

        if (!updatedBatterOrder.includes(wicketReason.newBatter)) {
            updatedBatterOrder.push(wicketReason.newBatter);
        }
        setBattingOrder(updatedBatterOrder);
        const createNewBatterObj = {
            id: currentMatch?.id,
            [innings]: {
                BattingOrder: updatedBatterOrder
            }
        };
        const Batteraction = CurrentInnings === 3 ? ReplaceSuperOverBattingOrder :
            CurrentInnings === 2 ? ReplaceSecondInningsBattingOrder :
                CurrentInnings === 1 ? ReplaceBattingOrder :
                    ReplaceSuperOverSecondInningsBattingOrder;
        dispatch(Batteraction(createNewBatterObj));

        const wicketData = {
            id: currentMatch?.id,
            [innings]: {
                Wickets: WicketObject
            }
        };

        setPartnerShip({
            batter1run: 0,
            batter1balls: 0,
            batter2run: 0,
            batter2balls: 0,
        })

        const action = CurrentInnings === 4 ? AddSuperOverSecondInningsWicket : CurrentInnings === 3 ? AddSuperOverWicket : CurrentInnings === 2 ? AddSecondInningsWicket : AddWicket;
        const actions = CurrentInnings === 3 ? RemoveSuperOverWicket : CurrentInnings === 2 ? RemoveSecondInningsWicket : CurrentInnings === 1 ? RemoveWicket : RemoveSuperOverSecondInningsWicket;
        dispatch(action(wicketData));

        if (playerselection.striker === batter) {
            handleBatterPrevStats(wicketReason.newBatter, 1)
            handlePlayerChange(wicketReason.newBatter, playerselection.nonStriker, playerselection.bowler)
        } else if (playerselection.nonStriker === batter) {
            handleBatterPrevStats(wicketReason.newBatter, 2)
            handlePlayerChange(playerselection.striker, wicketReason.newBatter, playerselection.bowler)
        }
        const createNewObj = {
            id: currentMatch?.id,
            BatterId: wicketReason.newBatter
        };
        dispatch(actions(createNewObj));
        setOpen(false)
        setChangeBatter(false)
        setRetiredHurt(false)
        setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
    }

    console.log(currentMatch);
    

    const handlePlayerWicket = (batter, data, score, wide) => {
        const innings = CurrentInnings === 4 ? 'superOverSecondInnings' : CurrentInnings === 3 ? 'superOverFirstInnings' : CurrentInnings === 2 ? 'secondInnings' : 'firstInnings';
        const reason =
            wicketReason.reason === 1 ? 'LBW' :
                wicketReason.reason === 2 ? 'Bowled' :
                    wicketReason.reason === 3 ? 'Catch' :
                        wicketReason.reason === 4 ? 'Hit Wicket' :
                            wicketReason.reason === 5 ? 'Stumped' :
                                'Run Out';

        const Commentary = {
            overNo: ball.overNo,
            ballNo: ball.ballNo + 1,
            score: score ? score : 'W',
            bowler: playerselection.bowler,
            batter: activeStrike === 1 ? playerselection.striker : playerselection.nonStriker,
            reason: reason,
            innings: CurrentInnings
        }
        if (reason === "Run Out") {
            Commentary.batterout = wicketReason.batter; // ignore this ... it is working fine only
        }

        const getBatterId = () => {
            return batter ? batter : (activeStrike === 1 ? playerselection.striker : playerselection.nonStriker);
        };

        const getRun = () => {
            if (!batter) return activeStrike === 1 ? batterScores.batter1run : batterScores.batter2run;

            if (playerselection.striker === batter) {
                return activeStrike === 1 ? batterScores.batter1run + parseInt(data) : batterScores.batter1run;
            } else {
                return activeStrike === 2 ? batterScores.batter2run + parseInt(data) : batterScores.batter2run;
            }
        };

        const getBalls = () => {
            if (wide === "wide") {
                return batter && playerselection.striker === batter ? batterScores.batter1balls :
                    batter && playerselection.striker !== batter ? batterScores.batter2balls :
                        activeStrike === 1 ? batterScores.batter1balls + 1 : batterScores.batter2balls + 1;
            }

            return batter && playerselection.striker === batter ? batterScores.batter1balls + 1 :
                batter && playerselection.striker !== batter ? batterScores.batter2balls + 1 :
                    activeStrike === 1 ? batterScores.batter1balls + 1 : batterScores.batter2balls + 1;
        };

        const getDot = () => {
            if (wide === 'wide') {
                return batter && playerselection.striker === batter && data === '0' ? batterScores.batter1dot :
                    batter && playerselection.striker !== batter && data === '0' ? batterScores.batter2dot :
                        activeStrike === 1 && batter && playerselection.striker !== batter && data === '0' ? batterScores.batter2dot :
                            batter && playerselection.striker !== batter && data === '0' ? batterScores.batter2dot + 1 :
                                batter && playerselection.striker === batter && data === '0' ? batterScores.batter1dot + 1 : batterScores.batter2dot;
            }

            return batter && playerselection.striker === batter && data === '0' ? batterScores.batter1dot :
                batter && playerselection.striker !== batter && data === '0' ? batterScores.batter2dot :
                    batter && playerselection.striker !== batter && data !== '0' ? batterScores.batter2dot :
                        activeStrike === 1 ? batterScores.batter1dot : batterScores.batter2dot;
        };

        const getScore = (scoreType) => {
            return batter && playerselection.striker === batter ? batterScores[`batter1${scoreType}`] :
                batter && playerselection.striker !== batter ? batterScores[`batter2${scoreType}`] :
                    activeStrike === 1 ? batterScores[`batter1${scoreType}`] : batterScores[`batter2${scoreType}`];
        };

        const filterBatterOrder = currentMatch?.[innings]?.BattingOrder?.[0] || [];
        const updatedBatterOrder = [...filterBatterOrder];
        const wasBatterOut = currentMatch?.[innings]?.Wickets?.some(wicket => wicket.BatterId === wicketReason.batter);
        if (!wasBatterOut) {
            const batterIndex = updatedBatterOrder.indexOf(wicketReason.batter);
            if (batterIndex !== -1) {
                updatedBatterOrder.splice(batterIndex, 1);
            }
        }

        if (!updatedBatterOrder.includes(wicketReason.newBatter)) {
            updatedBatterOrder.push(wicketReason.newBatter);
        }
        setBattingOrder(updatedBatterOrder);
        const createNewBatterObj = {
            id: currentMatch?.id,
            [innings]: {
                BattingOrder: updatedBatterOrder
            }
        };
        const Batteraction = CurrentInnings === 3 ? ReplaceSuperOverBattingOrder :
            CurrentInnings === 2 ? ReplaceSecondInningsBattingOrder :
                CurrentInnings === 1 ? ReplaceBattingOrder :
                    ReplaceSuperOverSecondInningsBattingOrder;
        dispatch(Batteraction(createNewBatterObj));

        const WicketObject = {
            BatterId: getBatterId(),
            reason: reason,
            run: getRun(),
            balls: getBalls(),
            dot: getDot(),
            four: getScore('four'),
            six: getScore('six'),
            sr: getScore('sr'),
            partnership: initailscore.run,
            newBatter: wicketReason.newBatter,
            newBatter: wicketReason.newBatter,
            batter1Contribution: partnership.batter1run,
            batter1balls: partnership.batter1balls,
            batter1Id: playerselection.striker,
            batter2Contribution: partnership.batter2run,
            batter2balls: partnership.batter2balls,
            batter2Id: playerselection.nonStriker
        };

        if (reason === 'Catch' || reason === "Stumped" || reason === "Run Out") {
            WicketObject.fielder = wicketReason.fielder;
            Commentary.fielder = wicketReason.fielder
        }
        if (reason !== 'Run Out') {
            WicketObject.bowler = playerselection.bowler;
        }

        const wicketData = {
            id: currentMatch?.id,
            [innings]: {
                Wickets: WicketObject
            }
        };

        setPartnerShip({
            batter1run: 0,
            batter1balls: 0,
            batter2run: 0,
            batter2balls: 0,
        })

        handleCommentary(Commentary)

        const action = CurrentInnings === 4 ? AddSuperOverSecondInningsWicket : CurrentInnings === 3 ? AddSuperOverWicket : CurrentInnings === 2 ? AddSecondInningsWicket : AddWicket;
        const actions = CurrentInnings === 3 ? RemoveSuperOverWicket : CurrentInnings === 2 ? RemoveSecondInningsWicket : CurrentInnings === 1 ? RemoveWicket : RemoveSuperOverSecondInningsWicket;
        dispatch(action(wicketData));
        if (reason !== 'Run Out') {
            if (activeStrike === 1) {
                handleBatterPrevStats(wicketReason.newBatter, 1)
                handlePlayerChange(wicketReason.newBatter, playerselection.nonStriker, playerselection.bowler)
            } else if (activeStrike === 2) {
                handleBatterPrevStats(wicketReason.newBatter, 2)
                handlePlayerChange(playerselection.striker, wicketReason.newBatter, playerselection.bowler)
            }
        } else if (reason === "Run Out") {
            if (playerselection.striker === batter) {
                handleBatterPrevStats(wicketReason.newBatter, 1)
                handlePlayerChange(wicketReason.newBatter, playerselection.nonStriker, playerselection.bowler)
            } else if (playerselection.nonStriker === batter) {
                handleBatterPrevStats(wicketReason.newBatter, 2)
                handlePlayerChange(playerselection.striker, wicketReason.newBatter, playerselection.bowler)
            }
        }
        const createNewObj = {
            id: currentMatch?.id,
            BatterId: wicketReason.newBatter
        };
        dispatch(actions(createNewObj));
    }

    const handleAllOut = async () => {
        handleClose()
        if (active.data === 'RNO' || active.secondactive === "RNO") {
            setInningsComplete(false)
        } else {
            handleWicketUpdate()
        }
    }

    const handleChangeBowler = () => {
        setBowlerchange(true)
        setOpen(true)
    }

    const handleOverChanged = () => {
        if (maxOver > 1 + ball.overNo && legalBallCount === 6) {
            setBall((prev) => ({
                ...prev,
                ballNo: 0,
                overNo: prev.overNo + 1
            }));
            setLegalBallCount(0);
            setBallScores([]);
            setLength(6)
            handleChangeStrike()
            handleAddOver()
            handlePlayerChange(playerselection.striker, playerselection.nonStriker, wicketReason.bowler)
            if (CurrentInnings === 1 || CurrentInnings === 2) {
                handleBowlerPrevStats(wicketReason.bowler)
            }
            setBowlerchange(false)
            if (wicketReason.bowler) {
                handleMatchBowlData({
                    bowlerId: wicketReason.bowler,
                    runs: initailscore.run,
                    wicket: initailscore.wicket,
                    batter1run: batterScores.batter1run,
                    batter1balls: batterScores.batter1balls,
                    batter1dot: batterScores.batter1dot,
                    batter1four: batterScores.batter1four,
                    batter1six: batterScores.batter1six,
                    batter1sr: batterScores.batter1sr,
                    batter2run: batterScores.batter2run,
                    batter2balls: batterScores.batter2balls,
                    batter2dot: batterScores.batter2dot,
                    batter2four: batterScores.batter2four,
                    batter2six: batterScores.batter2six,
                    batter2sr: batterScores.batter2sr,
                    strike: activeStrike === 1 ? 2 : 1
                });
                setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
            }
        } else if (ball.ballNo === 0 && legalBallCount === 0) {
            if (initailscore.run === 0 && initailscore.wicket === 0 && ball.ballNo === 0 && legalBallCount === 0) {
                handleMatchInningData()
            }
            handlePlayerChange(playerselection.striker, playerselection.nonStriker, wicketReason.bowler)
            if (CurrentInnings === 1 || CurrentInnings === 2) {
                handleBowlerPrevStats(wicketReason.bowler)
            }
            if (wicketReason.bowler) {
                handleMatchBowlData({
                    bowlerId: wicketReason.bowler,
                    runs: initailscore.run,
                    wicket: initailscore.wicket,
                    batter1run: batterScores.batter1run,
                    batter1balls: batterScores.batter1balls,
                    batter1dot: batterScores.batter1dot,
                    batter1four: batterScores.batter1four,
                    batter1six: batterScores.batter1six,
                    batter1sr: batterScores.batter1sr,
                    batter2run: batterScores.batter2run,
                    batter2balls: batterScores.batter2balls,
                    batter2dot: batterScores.batter2dot,
                    batter2four: batterScores.batter2four,
                    batter2six: batterScores.batter2six,
                    batter2sr: batterScores.batter2sr,
                    strike: activeStrike
                });
                setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
            }
            setBowlerchange(false)
            handleClose()
        } else {
            alert("Complete Whole Over")
        }
        setOpen(false)
    }

    const handleOverChangeClicked = () => {
        if (maxOver > 1 + ball.overNo) {
            setBowlerchange(true)
            setOpen(true)
            setOverFinished(false)
        } else {
            setInningsComplete(true)
            setOverFinished(true)
        }
    };

    const addRun = (runs) => {
        if (initailscore.run === 0) {
            setInitialscore((prev) => ({
                ...prev,
                run: runs
            }))
        } else {
            setInitialscore((prev) => ({
                ...prev,
                run: prev.run + runs
            }));
        }
    };

    const addWicket = () => {
        setInitialscore((prev) => ({
            ...prev,
            wicket: prev.wicket + 1
        }));
    };

    const handleTied = async () => {
        const createStatusNewObj = {
            id: currentMatch?.id,
            status: 4
        };
        await dispatch(ChangeStatus(createStatusNewObj));

        handleInningsComplete()

        const allWickets = [
            ...(currentMatch?.firstInnings?.Wickets ?? []),
            ...(currentMatch?.secondInnings?.Wickets ?? [])
        ];
        const Economy = [
            ...(currentMatch?.firstInnings?.Completedovers ?? []),
            ...(currentMatch?.secondInnings?.Completedovers ?? [])
        ]
        const finalOvers = [
            (currentMatch?.firstInnings?.Currentover?.[0] ?? []),
            (currentMatch?.secondInnings?.Currentover?.[0] ?? [])
        ]
        const firstInningswickets = [
            ...(currentMatch?.firstInnings?.Wickets ?? [])
        ]
        const secondInningswickets = [
            ...(currentMatch?.secondInnings?.Wickets ?? [])
        ]
        const Extras = [
            ...(currentMatch?.firstInnings?.Extras ?? []),
            ...(currentMatch?.secondInnings?.Extras ?? [])
        ]

        let players = []
        let matches = []

        const playersStats = matchPlayers.map(player => {
            const playerStat = calculatePlayerStats(player, allWickets, Economy);
            return playerStat;
        });
        players = playersStats
        await dispatch(updatePlayersStats({ players }));

        const matchStats = calculateMatchStats(allWickets, Economy, finalOvers, firstInningswickets, secondInningswickets, Extras);
        matches = matchStats

        const id = currentMatch?.tournamentId
        await dispatch(updateTournamentStats({ id, matches }))
        const team1payload = {
            teamId: team1?.id,
            match: 1,
            point: matchTerminate.pointsdistribution === 2 ? 0 : 1,
            win: 0,
            lose: 0,
            tie: matchTerminate.mainreason === 2 ? 0 : 1,
            nrr: 0,
            noreason: matchTerminate.mainreason === 2 ? 1 : 0
        }
        const team2payload = {
            teamId: team2?.id,
            match: 1,
            point: matchTerminate.pointsdistribution === 2 ? 0 : 1,
            win: 0,
            lose: 0,
            tie: matchTerminate.mainreason === 2 ? 0 : 1,
            nrr: 0,
            noreason: matchTerminate.mainreason === 2 ? 1 : 0
        }
        const teams = [team1payload, team2payload]
        dispatch(updateTeamStats({ teams }));

        if (matchTerminate.mainreason === 2) {
            const newObj = {
                id: currentMatch?.id,
                terminate: {
                    mainreason: 'rain',
                    pointsharing: matchTerminate.pointsdistribution === 1 ? "Shared" : "Zero"
                }
            }
            await dispatch(MatchTerminate(newObj))
        }

        router.push(`/summary/${currentMatch?.id}`)
    }

    const updateBatterScores = (batter, data) => {
        const isZeroRun = data === "0";
        const isFourRun = data === "4";
        const isSixRun = data === "6";
        const isWicketorLB = active.data === "LB" || data === "W" || data === "STO";
        const isNonRunNonBall = active.data === "PR" || active.data === "NR" || data === "PR" || data === "NR" || data === "NB" || data === "WD" || active.data === "WD" || data === "LB" || data === "RNO";
        const isActiveNoBall = active.data === "NB"
        const isRunout = active.data === 'RNO'

        let runs = 0, balls = 0, dots = 0, fours = 0, sixes = 0;

        if (isNonRunNonBall) {
            balls = 0;
            runs = 0;
        } else if (isActiveNoBall) {
            runs = parseInt(data);
            balls = 0;
        } else if (isWicketorLB) {
            balls = 1;
            runs = 0;
        } else if (isRunout) {
            balls = 1;
            runs = parseInt(data);
        } else if (isFourRun) {
            runs = 4;
            fours = 1;
            balls = 1;
        } else if (isSixRun) {
            runs = 6;
            sixes = 1;
            balls = 1;
        } else if (isZeroRun) {
            dots = 1;
            balls = 1;
        } else if (!isActiveNoBall) {
            runs = parseInt(data);
            balls = 1;
        }

        setBatterScores(prev => ({
            ...prev,
            [`${batter}run`]: prev[`${batter}run`] + runs,
            [`${batter}balls`]: prev[`${batter}balls`] + balls,
            [`${batter}dot`]: prev[`${batter}dot`] + dots,
            [`${batter}four`]: prev[`${batter}four`] + fours,
            [`${batter}six`]: prev[`${batter}six`] + sixes,
            [`${batter}sr`]: prev[`${batter}sr`],
        }));

        setPartnerShip(prev => ({
            ...prev,
            [`${batter}run`]: prev[`${batter}run`] + runs,
            [`${batter}balls`]: prev[`${batter}balls`] + balls,
        }));
    };

    const handleCustomRun = () => {
        handleScore(wicketReason.runs)
        setOpen(false)
        setCustomRun(false)
        setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
    }
    const handleScore = async (data) => {
        const action = CurrentInnings === 4 ? AddSuperOverSecondInningsExtra : CurrentInnings === 3 ? AddSuperOverExtra : CurrentInnings === 2 ? AddSecondInningsExtra : AddExtra;
        if (legalBallCount < 6) {
            let newBallScores = [...ballScores];
            let updatedBowlerScore = { ...bowlerScore };
            if (['WD', 'NB', 'LB', 'RNO', 'PR', 'NR', '5,7'].includes(data)) {
                if (data === '5,7') {
                    setOpen(true)
                    setCustomRun(true)
                }
                if (['WD', 'NB'].includes(data)) {
                    setLength(length + 1)
                    updatedBowlerScore.wd += 1;
                    updatedBowlerScore.run += 1;
                }
                if (['PR', 'NR'].includes(data)) {
                    setOpen(true);
                    setPenalty(true);
                }
                if (data === "RNO") {
                    if (battinglength + filterBatterWithHurt === initailscore.wicket + 1) {
                        setInningsComplete(true)
                        setAllOut(true)
                    }
                    setOpen(true);
                    setRno(true);
                    setWicket(true)
                    setWicketReason((prev) => ({
                        ...prev,
                        reason: 6
                    }))
                }
                if ((active.data === "WD" || active.data === "NB") && (active.secondactive !== "RNO" && active.secondactive !== "W" && active.secondactive !== "STO")) {
                    setActive({
                        active: true,
                        data: active.data,
                        secondactive: data
                    });
                } else if (data !== '5,7') {
                    setActive({
                        active: true,
                        data: data,
                        secondactive: ""
                    });
                }
            } else if (active.active && (active.data === "PR" || active.data === "NR")) {
                if (data !== '5,7' && (active.data === "PR" || active.data === "NR")) {
                    if (active.data === 'PR') {
                        addRun(parseInt(data));
                    } else {
                        addRun(-parseInt(data));
                    }
                    const ExtraObject = {
                        Bowler: playerselection.bowler,
                        reason: active.data === "PR" ? "PR" : "NR",
                        runs: parseInt(data)
                    };
                    const ExtraData = {
                        id: currentMatch?.id,
                        [innings]: {
                            Extras: ExtraObject
                        }
                    };
                    const Commentary = {
                        overNo: ball.overNo,
                        ballNo: ball.ballNo,
                        score: active.data === "PR" ? data : `-${data}`,
                        reason: wicketReason.penalty,
                        innings: currentMatch?.currentInnings,
                        team: tossWinner.battingSide,
                        oppteam: tossWinner.bowlingSide
                    }
                    handleCommentary(Commentary);
                    await dispatch(action(ExtraData));
                    setActive({ active: false, data: '' });
                    setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
                }
            } else if (active.active && active.data === "RNO" && active.secondactive === "") {
                if (data !== '5,7') {
                    if (activeStrike === 1) {
                        updateBatterScores("batter1", data);
                    } else if (activeStrike === 2) {
                        updateBatterScores("batter2", data);
                    }
                    addRun(parseInt(data));
                    addWicket();
                    setActive({ active: false, data: parseInt(data) });
                    newBallScores[ball.ballNo] = data === "0" ? "W" : "W+" + data;
                    setBallScores(newBallScores);
                    addBall();
                    setLegalBallCount(legalBallCount + 1);
                    const score = data === "0" ? "W" : "W+" + data
                    if (activeStrike === 1) {
                        if (wicketReason.batter.toString() === playerselection.striker.toString()) {
                            handlePlayerWicket(wicketReason.batter, data, score)
                        } else {
                            handlePlayerWicket(wicketReason.batter, data, score, 'wide')
                        }
                    } else if (activeStrike === 2) {
                        if (wicketReason.batter.toString() === playerselection.nonStriker.toString()) {
                            handlePlayerWicket(wicketReason.batter, data, score)
                        } else {
                            handlePlayerWicket(wicketReason.batter, data, score, 'wide')
                        }
                    }
                    setGif((prev) => ({
                        ...prev,
                        gif: true,
                        type: 'W'
                    }));
                    const giftimer = setTimeout(() => {
                        setGif((prev) => ({
                            ...prev,
                            gif: false,
                            type: ''
                        }));
                    }, 1120);
                    setTimeout(() => {
                        clearTimeout(giftimer);
                    }, 1120);
                    setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
                    if (battinglength + filterBatterWithHurt === initailscore.wicket) {
                        setInningsComplete(true)
                    }
                }
            } else if (active.active && active.secondactive === "RNO" && (active.data === "WD" || active.data === "NB")) {
                if (data !== '5,7') {
                    if (active.data === "NB") {
                        if (activeStrike === 1) {
                            updateBatterScores("batter1", data);
                        } else if (activeStrike === 2) {
                            updateBatterScores("batter2", data);
                        }
                        const ExtraObject = {
                            Bowler: playerselection.bowler,
                            reason: "NB",
                            runs: 1
                        };
                        const ExtraData = {
                            id: currentMatch?.id,
                            [innings]: {
                                Extras: ExtraObject
                            }
                        };
                        dispatch(action(ExtraData));
                    } else {
                        const ExtraObject = {
                            Bowler: playerselection.bowler,
                            reason: "WD",
                            runs: parseInt(data) + 1
                        };
                        const ExtraData = {
                            id: currentMatch?.id,
                            [innings]: {
                                Extras: ExtraObject
                            }
                        };
                        dispatch(action(ExtraData));
                    }
                    addRun(1 + parseInt(data));
                    addWicket();
                    setActive({
                        active: false,
                        data: data,
                        secondactive: ""
                    });
                    newBallScores[ball.ballNo] = data === "0" ? active.data + "+W" : data + active.data + "+W";
                    const score = data === "0" ? active.data + "+W" : data + active.data + "+W"
                    setBallScores(newBallScores);
                    if (active.data === "NB") {
                        handlePlayerWicket(wicketReason.batter, data, score, 'wide')
                    } else {
                        handlePlayerWicket(wicketReason.batter, '0', score, 'wide')
                    }
                    addBall();
                    setWicketReason({ bowler: "", reason: 0, batter: "", newBatter: "", fielder: "", penalty: "", penaltyto: 0, overtype: 0, scoreTo: 0, superover: 0, runs: '' })
                    setGif((prev) => ({
                        ...prev,
                        gif: true,
                        type: 'W'
                    }));
                    const giftimer = setTimeout(() => {
                        setGif((prev) => ({
                            ...prev,
                            gif: false,
                            type: ''
                        }));
                    }, 1120);
                    setTimeout(() => {
                        clearTimeout(giftimer);
                    }, 1120);
                    if (battinglength + filterBatterWithHurt === initailscore.wicket) {
                        setInningsComplete(true)
                    }
                }
            } else if (active.data === "LB") {
                if (data !== '5,7') {
                    addRun(parseInt(data));
                    setActive({ active: false, data: data });
                    newBallScores[ball.ballNo] = data + "LB";
                    setBallScores(newBallScores);
                    addBall();
                    setLegalBallCount(legalBallCount + 1);
                    const ExtraObject = {
                        Bowler: playerselection.bowler,
                        reason: "LB",
                        runs: parseInt(data)
                    };
                    const ExtraData = {
                        id: currentMatch?.id,
                        [innings]: {
                            Extras: ExtraObject
                        }
                    };
                    dispatch(action(ExtraData));
                }
            } else if (active.active && active.data === "WD" && data === "STO") {
                if (battinglength + filterBatterWithHurt === initailscore.wicket + 1) {
                    setInningsComplete(true)
                    setAllOut(true)
                }
                setActive((prev) => ({
                    ...prev,
                    secondactive: "STO"
                }))
                setOpen(true)
                setWicket(true)
                setWicketReason((prev) => ({ ...prev, reason: 5 }))
            } else if (active.active && (data !== "W" || data !== "RNO" || data !== "STO")) {
                if (data !== '5,7') {
                    if (active.data === "NB") {
                        const ExtraObject = {
                            Bowler: playerselection.bowler,
                            reason: "NB",
                            runs: 1
                        };
                        const ExtraData = {
                            id: currentMatch?.id,
                            [innings]: {
                                Extras: ExtraObject
                            }
                        };
                        dispatch(action(ExtraData));
                    } else if (active.data === "WD") {
                        const ExtraObject = {
                            Bowler: playerselection.bowler,
                            reason: "WD",
                            runs: parseInt(data) + 1
                        };
                        const ExtraData = {
                            id: currentMatch?.id,
                            [innings]: {
                                Extras: ExtraObject
                            }
                        };
                        dispatch(action(ExtraData));
                    }
                    addRun(1 + parseInt(data));
                    setActive({ active: false, data: data });
                    newBallScores[ball.ballNo] = data === "0" ? active.data : data + active.data;
                    setBallScores(newBallScores);
                    addBall();
                }
            } else if (data === 'W' || data === "STO") {
                if (battinglength + filterBatterWithHurt === initailscore.wicket + 1) {
                    setInningsComplete(true)
                    setAllOut(true)
                }
                setActive((prev) => ({
                    ...prev,
                    data: data
                }))
                setOpen(true);
                setWicket(true)
                if (data === "STO") { setWicketReason((prev) => ({ ...prev, reason: 5 })) }
            } else {
                addRun(parseInt(data));
                addBall();
                setLegalBallCount(legalBallCount + 1);
                newBallScores[ball.ballNo] = data;
                setBallScores(newBallScores);
            }
            if (activeStrike === 1) {
                if ((data !== "W" && data !== 'STO' && active.data !== "RNO" && active.secondactive !== "RNO" && data !== '5,7' && data !== "RNO")) {
                    updateBatterScores("batter1", data);
                }
            } else if (activeStrike === 2) {
                if ((data !== "W" && data !== 'STO' && active.data !== "RNO" && active.secondactive !== "RNO" && data !== '5,7') && data !== "RNO") {
                    updateBatterScores("batter2", data);
                }
            }
            if (data !== "W" && data !== 'RNO' && data !== "STO" && data !== 'WD' && data !== 'NB' && data !== "LB" && active.data !== "LB" && active.data !== "PR" && active.data !== "NR" && data !== "PR" && data !== "NR" && active.data !== "RNO" && data !== '5,7') {
                updatedBowlerScore.run += parseInt(data);
            }
            if (active.data === "RNO" && data !== '5,7') {
                updatedBowlerScore.run += parseInt(data);
            }
            if (data === '0' || data === "LB" || data === 'W' || data === "STO" && data !== '5,7') {
                updatedBowlerScore.dot += 1;
            }
            setBowlerScore(updatedBowlerScore);
            if (data === '0') {
                setDot(0)
            }
            if (active.data !== "RNO" && data !== "RNO" && active.secondactive !== "RNO" && active.secondactive !== "STO" && data !== "STO") {
                const oddRuns = parseInt(data) % 2 !== 0;
                if ((['1', '3', '5'].includes(data) || oddRuns)) {
                    if (active.data !== 'PR' && active.data !== 'NR' && data !== '5,7') {
                        setActive((prev) => ({
                            ...prev,
                            data: data
                        }))
                    }
                }
            }
            if (['4', '6'].includes(data) && active.data !== 'PR' && active.data !== 'NR') {
                let seconds = data === '6' ? 3440 : 3440
                setGif((prev) => ({
                    ...prev,
                    gif: true,
                    type: data
                }))
                const giftimer = setTimeout(() => {
                    setGif((prev) => ({
                        ...prev,
                        gif: false,
                        type: ''
                    }))
                }, seconds);
                return () => {
                    clearTimeout(giftimer)
                }
            }
        } else {
            setOverFinished(true)
        }
    };

    useEffect(() => {
        let battingLength;
        if (CurrentInnings === 3 || CurrentInnings === 4) {
            battingLength = 2 + filterBatterWithHurt;
        } else {
            const teamPlayers = tossWinner?.battingSide === team1?.team_name && inning === 1 ? team1XIplayer.length : team2XIplayer.length;
            battingLength = teamPlayers + filterBatterWithHurt - 1;
        }
        setBattinglength(battingLength);
    }, [tossWinner, inning, CurrentInnings, currentMatch]);

    useEffect(() => {
        StoreTeamScore()
    }, [CurrentInnings, currentMatch, initailscore.run, tossWinner])

    const StoreTeamScore = () => {
        const currentInnings = CurrentInnings;
        const firstInningsCompletedOver = currentMatch?.firstInnings?.Completedovers?.[currentMatch?.firstInnings?.Completedovers.length - 1];
        const thirdInningsCompletedOver = matchThirdInnings?.Currentover?.[0];

        const inningsScore = { run: initailscore.run, wicket: initailscore.wicket, ball: legalBallCount === 6 ? 0 : legalBallCount, over: legalBallCount === 6 ? ball.overNo + 1 : ball.overNo };
        const getInningsData = (completedOver) => ({
            run: completedOver?.runs ? completedOver?.runs : 0,
            wicket: completedOver?.wicket ? completedOver?.wicket : 0,
            ball: !completedOver?.legalBall ? 0 : completedOver?.legalBall === 6 ? 0 : completedOver?.legalBall,
            over: !completedOver?.legalBall || !completedOver ? 0
                : completedOver?.legalBall === 6 && (currentInnings === 1 || currentInnings === 2) ? currentMatch?.firstInnings?.Completedovers?.length
                    : completedOver?.legalBall !== 6 && (currentInnings === 1 || currentInnings === 2) ? currentMatch?.firstInnings?.Completedovers?.length - 1
                        : completedOver?.legalBall === 6 && (currentInnings === 4 || currentInnings === 3) ? 1
                            : currentMatch?.thirdInningsCompletedOver?.length,
        });

        const setInningsScore = (isTeam1Batting, completedOver) => {
            const firstInningsData = getInningsData(completedOver);
            setFirstInningsScore(isTeam1Batting ? inningsScore : firstInningsData);
            setSecondInningsScore(isTeam1Batting ? firstInningsData : inningsScore);
        };

        if (currentInnings === 1) {
            const isTeam1Batting = tossWinner?.battingSide === team1?.team_name;
            setInningsScore(isTeam1Batting, null);
        } else if (currentInnings === 2) {
            const isTeam1Batting = tossWinner?.battingSide === team1?.team_name;
            setInningsScore(isTeam1Batting, firstInningsCompletedOver);
        } else if (currentInnings === 3) {
            const isTeam1Batting = tossWinner?.battingSide === team1?.team_name;
            setInningsScore(isTeam1Batting, null);
        } else if (currentInnings === 4) {
            const isTeam1Batting = tossWinner?.battingSide === team1?.team_name;
            setInningsScore(isTeam1Batting, thirdInningsCompletedOver);
        }
    };

    useEffect(() => {

        const currentInnings = CurrentInnings
        const currentOver = currentInnings === 4 ? matchFourthInnings?.Currentover?.[0] : currentInnings === 3 ? matchThirdInnings?.Currentover?.[0] : currentInnings === 2 ? matchSecondInnings?.Currentover?.[0] : matchFirstInnings?.Currentover?.[0];
        const completedOver = currentInnings === 2 ? matchSecondInnings?.Completedovers : currentInnings === 1 ? matchFirstInnings?.Completedovers : 0;
        const target = currentInnings === 4 ? matchThirdInnings?.Currentover?.[0]?.runs : matchFirstInnings?.Completedovers?.[matchFirstInnings?.Completedovers.length - 1]?.runs;
        const winner = currentMatch?.matchWinner
        const BattingOrder = currentInnings === 4 ? matchFourthInnings?.BattingOrder?.[0] : currentInnings === 3 ? matchThirdInnings?.BattingOrder?.[0] : currentInnings === 2 ? matchSecondInnings?.BattingOrder?.[0] : currentInnings === 1 ? matchFirstInnings?.BattingOrder?.[0] : ''

        if (currentInnings !== undefined) {
            StoreTeamScore()

            if (completedOver && !hasRunRef.current) {
                setBall((prev) => ({
                    ...prev,
                    overNo: currentInnings === 2 && currentMatch?.matchWinner ? completedOver.length - 1 : completedOver.length ?? 0,
                }));
            }

            if (!hasRunRef.current && winner !== undefined) {
                // setWinningTeam(winner)
            }

            if (!hasRunRef.current && BattingOrder) {
                setBattingOrder(BattingOrder)
            }

            if (target && !hasRunRef.current && (currentInnings !== 1 || currentInnings !== 4)) {
                // setTarget({
                //     runs: target + 1,
                //     overs: parseInt(currentMatch?.totalovers) * 6,
                //     totalruns: target + 1,
                //     totalballs: parseInt(currentMatch?.totalovers) * 6
                // })
            }

            if (currentOver && !hasRunRef.current) {
                const ballLength =
                    Object.keys(currentOver).length === 1 ? Object.keys(currentOver).length - 1 :
                        (Object.keys(currentOver).length === 16 ? Object.keys(currentOver).length - 16 : Object.keys(currentOver).length - 26)

                setInning(CurrentInnings);
                if (currentOver?.legalBall !== undefined) {
                    const excludedKeys = [
                        'bowlerId', 'legalBall', 'runs', 'wicket', 'totalBall', 'batter1run', 'batter1balls',
                        'batter1dot', 'batter1four', 'batter1six', 'batter1sr', 'batter2run', 'batter2balls', 'batter2dot',
                        'batter2four', 'batter2six', 'batter2sr', 'bowleroverNo', 'bowlerballNo', 'bowlerwd', 'bowlernb',
                        'bowlerdot', 'bowlereco', 'bowlerwicket', 'bowlerrun', 'strike'
                    ];

                    const updatedBallScores = [...ballScores];
                    Object.keys(currentOver).forEach((key) => {
                        if (!excludedKeys.includes(key)) {
                            updatedBallScores[parseInt(key) - 1] = currentOver[key];
                        }
                    });
                    setBallScores(updatedBallScores);
                }
                setActiveStrike(currentOver?.strike ?? 1)
                setBall((prev) => ({ ...prev, ballNo: ballLength ?? 0 }));
                setLength(currentOver?.totalBall ?? length);
                setLegalBallCount(currentOver?.legalBall ?? 0);
                setInitialscore({
                    run: currentOver?.runs ?? 0,
                    wicket: currentOver?.wicket ?? 0,
                });

                if (ballLength === 0 && (currentInnings === 1 || currentInnings === 2)) {
                    handleBowlerPrevStats(currentOver?.bowlerId)
                } else {
                    setBowlerScore({
                        overNo: currentOver?.bowleroverNo ? currentOver?.bowleroverNo : 0,
                        ballNo: currentOver?.bowlerballNo ? currentOver?.bowlerballNo : 0,
                        wd: currentOver?.bowlerwd ? currentOver?.bowlerwd : 0,
                        nb: currentOver?.bowlernb ? currentOver?.bowlernb : 0,
                        dot: currentOver?.bowlerdot ? currentOver?.bowlerdot : 0,
                        eco: currentOver?.bowlereco ? currentOver?.bowlereco : "",
                        wicket: currentOver?.bowlerwicket ? currentOver?.bowlerwicket : 0,
                        run: currentOver?.bowlerrun ? currentOver?.bowlerrun : 0,
                    });
                }
                setBatterScores({
                    batter1run: currentOver?.batter1run ?? 0,
                    batter1balls: currentOver?.batter1balls ?? 0,
                    batter1dot: currentOver?.batter1dot ?? 0,
                    batter1four: currentOver?.batter1four ?? 0,
                    batter1six: currentOver?.batter1six ?? 0,
                    batter1sr: currentOver?.batter1sr ?? "",
                    batter2run: currentOver?.batter2run ?? 0,
                    batter2balls: currentOver?.batter2balls ?? 0,
                    batter2dot: currentOver?.batter2dot ?? 0,
                    batter2four: currentOver?.batter2four ?? 0,
                    batter2six: currentOver?.batter2six ?? 0,
                    batter2sr: currentOver?.batter2sr ?? ""
                });
                setPartnerShip({
                    batter1run: currentOver?.batter1run ?? 0,
                    batter1balls: currentOver?.batter1balls ?? 0,
                    batter2run: currentOver?.batter2run ?? 0,
                    batter2balls: currentOver?.batter2balls ?? 0,
                });

                hasRunRef.current = true;
            }
        }
    }, [currentMatch]);

    useEffect(() => {
        if (winningTeam) {
            setOverFinished(true)
            const createNewObj = {
                ...currentMatch,
                matchWinner: winningTeam,
                winSituation: winningSituation
            }
            dispatch(ReplaceMatchSchedule(createNewObj))
        }
    }, [winningTeam, winningSituation])

    useEffect(() => {
        if (currentMatch?.superOverSecondInnings?.Currentover?.[0]?.runs === initailscore.run && target.totalruns <= initailscore.run
            && winningTeam && CurrentInnings === 4 && currentMatch?.superOverSecondInnings?.Wickets?.filter(player => player.reason === "Not Out").length < 2) {
            handleInningsComplete();
            hasRunwinningRef.current = true;
        } else if (target.totalruns > initailscore.run && maxOver >= 1 + ball.overNo && CurrentInnings === 4 &&
            currentMatch?.superOverSecondInnings?.Currentover?.[0]?.runs === initailscore.run && winningTeam &&
            currentMatch?.superOverSecondInnings?.Currentover[0]?.legalBall === legalBallCount &&
            currentMatch?.superOverSecondInnings?.Wickets?.filter(player => player.reason === "Not Out").length < 2) {
            handleInningsComplete();
            hasRunwinningRef.current = true;
        } else if (currentMatch?.secondInnings?.Currentover?.[0]?.runs === initailscore.run && target.totalruns <= initailscore.run && CurrentInnings === 2 && winningTeam
            && currentMatch?.secondInnings?.Currentover[0]?.bowlerId !== currentMatch?.secondInnings?.Completedovers?.[currentMatch?.secondInnings?.Completedovers.length - 1]?.bowlerId) {
            handleInningsComplete();
            hasRunwinningRef.current = true;
        } else if (target.totalruns > initailscore.run && maxOver >= 1 + ball.overNo && CurrentInnings === 2 && currentMatch?.secondInnings?.Currentover?.[0]?.runs === initailscore.run
            && winningTeam && currentMatch?.secondInnings?.Currentover[0]?.legalBall === legalBallCount &&
            currentMatch?.secondInnings?.Currentover[0]?.bowlerId !== currentMatch?.secondInnings?.Completedovers?.[currentMatch?.secondInnings?.Completedovers.length - 1]?.bowlerId) {
            handleInningsComplete();
            hasRunwinningRef.current = true;
        }
    }, [winningTeam, currentMatch, initailscore.run, initailscore.wicket])

    useEffect(() => {
        let reason = ""
        let winTeam = team1?.id === winningTeam ? team1?.team_name : team2?.team_name
        if (tossWinner.battingSide === winTeam && CurrentInnings === 4 && winningTeam) {
            const balls = matchFourthInnings?.Currentover?.[0].legalBall
            const winningballs = 6 - balls
            reason = (`won superover (${winningballs} balls left)`)
        } else if (tossWinner.bowlingSide === winTeam && CurrentInnings === 4 && winningTeam) {
            const winningruns = matchThirdInnings?.Currentover?.[0]?.runs - matchFourthInnings?.Currentover?.[0]?.runs
            reason = (`won superover by ${winningruns} runs`)
        } else if (tossWinner.battingSide === winTeam && CurrentInnings === 2 && winningTeam) {
            const balls = currentMatch?.secondInnings?.Currentover?.[0].legalBall === 6 ? 0 : currentMatch?.secondInnings?.Currentover?.[0].legalBall
            const overs = currentMatch?.secondInnings?.Currentover?.[0].legalBall === 6 ? currentMatch?.secondInnings?.Completedovers?.length : currentMatch?.secondInnings?.Completedovers?.length - 1
            const totalovers = parseInt(currentMatch?.target?.overs) - overs
            const winningballs = (totalovers * 6) - balls
            const totalWickets = parseInt(currentMatch?.perteamplayers) - initailscore.wicket - 1
            reason = (`won by ${totalWickets} wickets (${winningballs} balls left) ${currentMatch?.target?.dls === true ? '(DLS Method)' : ''}`)
        } else if (tossWinner.bowlingSide === winTeam && CurrentInnings === 2 && winningTeam) {
            const winningruns = currentMatch?.firstInnings?.Currentover?.[0]?.runs - currentMatch?.secondInnings?.Currentover?.[0]?.runs
            reason = (`won by ${winningruns} runs ${currentMatch?.target?.dls === true ? '(DLS Method)' : ''}`)
        }

        let battingTeamId = tossWinner.battingSide === team1?.team_name ? team1?.id : team2?.id
        let bowlingTeamId = tossWinner.bowlingSide === team1?.team_name ? team1?.id : team2?.id

        if (target.totalruns <= initailscore.run && (inning === 2 || inning === 4)) {
            if (target.totalruns > 0) {
                setInningsComplete(true)
                setWinningTeam(battingTeamId)
                setWinningSituation(reason)
            } else if (target.totalruns === 0 && target.totalruns + 1 <= initailscore.run) {
                setInningsComplete(true)
                setWinningTeam(battingTeamId)
                setWinningSituation(reason)
            }
        } else if ((target.totalruns - 1 === initailscore.run && maxOver === 1 + ball.overNo && legalBallCount === 6) && (inning === 2 || inning === 4)) {
            if (initailscore.run > 0 || legalBallCount > 0) {
                setSuperOver(true)
                setOpen(true)
            }
        } else if (initailscore.wicket === battinglength + filterBatterWithHurt && target.totalruns - 1 === initailscore.run && (inning === 2 || inning === 4)) {
            setSuperOver(true)
            setOpen(true)
        } else if (target.totalruns > initailscore.run && maxOver >= 1 + ball.overNo && (inning === 2 || inning === 4) && InningsComplete && initailscore.wicket === battinglength + filterBatterWithHurt) {
            setWinningTeam(bowlingTeamId)
            setWinningSituation(reason)
        } else if (target.totalruns > initailscore.run && maxOver === 1 + ball.overNo && legalBallCount === 6 && (inning === 2 || inning === 4)) {
            setInningsComplete(true)
            setWinningTeam(bowlingTeamId)
            setWinningSituation(reason)
        }
    }, [currentMatch, target, InningsComplete, initailscore.run, initailscore.wicket, winningTeam])

    useEffect(() => {
        const inningsMap = {
            1: matchFirstInnings?.Wickets,
            2: matchSecondInnings?.Wickets,
            3: matchThirdInnings?.Wickets,
            4: matchFourthInnings?.Wickets,
        };
        setWicketPlayers(inningsMap[CurrentInnings] || []);
    }, [CurrentInnings, matchFirstInnings?.Wickets, matchSecondInnings?.Wickets, matchThirdInnings?.Wickets]);

    const filterLastDynamicKey = (currentOver) => {
        const dynamicKeys = Object.keys(currentOver).filter(key => {
            return !['bowlerId', 'legalBall', 'runs', 'wicket', 'totalBall', 'batter1run', 'batter1balls', 'batter1dot', 'batter1four', 'batter1six', 'batter1sr', 'batter2run', 'batter2balls', 'batter2dot', 'batter2four', 'batter2six', 'batter2sr', 'bowleroverNo', 'bowlerballNo', 'bowlerwd', 'bowlernb', 'bowlerdot', 'bowlereco', 'bowlerwicket', 'bowlerrun', 'strike'].includes(key);
        });
        if (dynamicKeys.length > 0) {
            const lastDynamicKey = dynamicKeys[dynamicKeys.length - 1];
            const { [lastDynamicKey]: _, ...remaining } = currentOver;
            return remaining;
        }
        return currentOver;
    };

    useEffect(() => {
        const {
            batter1run, batter1balls, batter1dot, batter1four, batter1six,
            batter2run, batter2balls, batter2dot, batter2four, batter2six,
        } = batterScores;

        const {
            overNo, ballNo, wd, nb, dot, wicket, run
        } = bowlerScore;
        const isValidCondition =
            active.data !== 'PR' &&
            active.data !== "NR" &&
            active.data !== "WD" &&
            active.data !== "NB" &&
            active.data !== "RNO" &&
            active.secondactive !== "RNO";

        const stringData = String(active?.data);
        const numericData = stringData.replace(/[^\d]/g, '');
        const isNumericValid = numericData && !isNaN(numericData) && parseInt(numericData) > 0;
        const isOddAndRunValid = isNumericValid && parseInt(numericData) % 2 !== 0 && initailscore.run !== 0;

        const currentInnings = CurrentInnings
        const currentOver = currentInnings === 4 ? matchFourthInnings?.Currentover?.[0] : currentInnings === 3 ? matchThirdInnings?.Currentover?.[0] : currentInnings === 2 ? matchSecondInnings?.Currentover?.[0] : matchFirstInnings?.Currentover?.[0];
        if (ball.ballNo > 0 || initailscore.run > 0 || initailscore.wicket > 0 || legalBallCount > 0) {
            const matchData = {
                ...currentOver,
                ...(ball.ballNo > 0 && {
                    [ball.ballNo]: ballScores[ball.ballNo - 1]
                }),
                legalBall: legalBallCount,
                runs: initailscore.run,
                wicket: initailscore.wicket,
                // totalBall: length,
                ...(active.data !== "WD" && active.data !== "NB" && { totalBall: length }),
                batter1run, batter1balls, batter1dot, batter1four, batter1six,
                batter1sr: (batter1run / batter1balls) * 100,
                batter2run, batter2balls, batter2dot, batter2four, batter2six,
                batter2sr: (batter2run / batter2balls) * 100,
                bowleroverNo: overNo,
                bowlerballNo: ballNo,
                bowlerwd: wd,
                bowlernb: nb,
                bowlerdot: dot,
                bowlereco: bowlerScore.run / bowlerScore.overNo,
                strike: ball.ballNo === 0 ? activeStrike : activeStrike === 1 && isValidCondition && isOddAndRunValid ? 2 : activeStrike === 2 && isValidCondition && isOddAndRunValid ? 1 : activeStrike,
                bowlerwicket: wicket,
                // bowlerrun: run,
                ...(active.data !== "WD" && active.data !== "NB" && { bowlerrun: run }),
            };
            const updatedOver = filterLastDynamicKey(matchData);
            handleMatchBowlData(undo ? updatedOver : matchData);
            setUndo(false)
        }

        // Commentary Logic
        const Commentary = {
            overNo: ball.overNo,
            ballNo: ball.ballNo,
            score: ballScores[ball.ballNo - 1],
            bowler: playerselection.bowler,
            batter: activeStrike === 1 ? playerselection.striker : playerselection.nonStriker,
            innings: currentInnings
        }
        const invalidScores = [
            'W',
            /W\+\d+/,
            /WD\+W/,
            /\d+WD\+W/,
            /NB\+W/,
            /\d+NB\+W/
        ];
        if (!invalidScores.some((pattern) =>
            typeof pattern === 'string'
                ? pattern === Commentary.score
                : pattern.test(Commentary.score)
        )) {
            handleCommentary(Commentary);
        } else if (Commentary.score === 'W' && active.data !== "WD" && active.data !== "NB" && active.data !== "LB") {
            setActive((prev) => ({
                ...prev,
                data: ""
            }))
        }

        // Strike Change Logic
        // if (active.data !== 'PR' && active.data !== "NR" && active.data !== "WD" && active.data !== "NB" && active.data !== "RNO" && active.secondactive !== "RNO") {
        //     const stringData = String(active?.data);
        //     const numericData = stringData.replace(/[^\d]/g, '');
        //     if (numericData && !isNaN(numericData) && parseInt(numericData) > 0) {
        //         const isOdd = parseInt(numericData) % 2 !== 0;
        //         if (isOdd && initailscore.run !== 0) {
        //             handleChangeStrike();
        //             setActive((prev) => ({
        //                 ...prev,
        //                 data: ""
        //             }));
        //         }
        //     }
        // }

        if (isValidCondition && isOddAndRunValid) {
            handleChangeStrike();
            setActive((prev) => ({
                ...prev,
                data: ""
            }));
        }

        if (dot) {
            setDot("")
        }
        StoreTeamScore()
    }, [initailscore, dot, winningTeam, batterScores]);

    useEffect(() => {
        const currentInnings = CurrentInnings
        if (!currentMatch?.target && CurrentInnings === 2) {
            const newObj = {
                id: currentMatch?.id,
                target: {
                    runs: matchFirstInnings?.Currentover?.[0]?.runs + 1,
                    overs: currentMatch?.totalovers
                }
            }
            dispatch(ReplaceMatchSchedule(newObj))
        }
        const totalballs = parseInt(currentMatch?.target?.overs) * 6
        const target = currentInnings === 4 ? matchThirdInnings?.Currentover?.[0]?.runs : currentMatch?.target?.runs;
        const overs = ball.overNo === 0 ? legalBallCount : ball.overNo * 6 + legalBallCount
        StoreTeamScore()
        if (currentInnings === 2) {
            setTarget((prev) => ({
                ...prev,
                runs: target - initailscore.run,
                overs: totalballs - overs,
                totalruns: target,
                totalballs: totalballs
            }));
        } else if (currentInnings === 4) {
            setTarget((prev) => ({
                ...prev,
                runs: (target + 1) - initailscore.run,
                overs: 6 - legalBallCount,
                totalruns: target + 1,
                totalballs: totalballs
            }));
        }
    }, [initailscore.run, ball, CurrentInnings, currentMatch]);

    const handleCommentary = (Commentary) => {
        const newObject = {
            id: currentMatch?.id,
            Commentary: Commentary
        }
        dispatch(AddCommentary(newObject))
    }

    const handleMatchBowlData = async (newOvers) => {
        const innings = CurrentInnings === 4 ? 'superOverSecondInnings' : CurrentInnings === 3 ? 'superOverFirstInnings' : CurrentInnings === 2 ? 'secondInnings' : 'firstInnings';
        const inningsData = {
            id: currentMatch?.id,
            [innings]: {
                Currentover: newOvers
            }
        };
        const action = CurrentInnings === 4 ? AddSuperOverSecondInnings : CurrentInnings === 3 ? AddSuperOverInnings : CurrentInnings === 2 ? AddSecondInnings : AddInnings;
        await dispatch(action(inningsData));
    };

    const handleChange = (field) => event => {
        setWicketReason(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleMatchTerminationChange = (field) => event => {
        setMatchTerminate(prev => ({ ...prev, [field]: event.target.value }))
    }

    const handleMatchInningData = () => {
        const inningData = {
            1: {
                key: 'firstInnings',
                additionalData: {
                    currentInnings: 1,
                    Commentary: []
                }
            },
            2: {
                key: 'secondInnings',
                additionalData: {}
            },
            3: {
                key: 'superOverFirstInnings',
                additionalData: {}
            },
            4: {
                key: 'superOverSecondInnings',
                additionalData: {}
            }
        };

        const currentInning = inningData[CurrentInnings] || inningData[1];
        setInning(CurrentInnings);

        const createNewObj = {
            ...currentMatch,
            [currentInning.key]: {
                battingside: tossWinner?.battingSide,
                bowlingside: tossWinner?.bowlingSide,
                Currentover: [],
                Completedovers: CurrentInnings === 1 || CurrentInnings === 2 ? [] : undefined,
                Wickets: [],
                Extras: [],
                BattingOrder: []
            },
            ...currentInning.additionalData
        };

        dispatch(ReplaceMatchSchedule(createNewObj));

        if (currentMatch?.status === 2) {
            const createStatusNewObj = {
                id: currentMatch?.id,
                status: 3
            };
            dispatch(ChangeStatus(createStatusNewObj));
        }
        handleMatchBowlData({
            bowlerId: playerselection.bowler
        });

        const payload = {
            id: currentMatch.id,
            breaktype: ''
        }
        dispatch(MatchBreakSchedule(payload))
    };

    const handleAddOver = () => {
        if (CurrentInnings === 2 || CurrentInnings === 1) {
            const innings = CurrentInnings === 2 ? 'secondInnings' : 'firstInnings';
            const completedOvers = currentMatch?.[innings]?.Currentover[0];

            const createNewObj = {
                id: currentMatch?.id,
                [innings]: {
                    Completedovers: completedOvers
                }
            };

            const action = CurrentInnings === 2 ? AddSecondInningsOver : AddOver;
            dispatch(action(createNewObj));
        }
    };

    const handleStartInnings = () => {
        handleMatchInningData()
    }

    const handleBatterPrevStats = (id, strike, battingorder) => {
        const innings = CurrentInnings === 4 ? 'superOverSecondInnings' : CurrentInnings === 3 ? 'superOverFirstInnings' : CurrentInnings === 2 ? 'secondInnings' : 'firstInnings';
        const wicketBatterScores = currentMatch?.[innings]?.Wickets?.filter((items) => items.BatterId === id)?.[0]

        if (strike === 1) {
            setBatterScores((prev) => ({
                ...prev,
                batter1run: wicketBatterScores?.run ? wicketBatterScores?.run : 0,
                batter1balls: wicketBatterScores?.balls ? wicketBatterScores?.balls : 0,
                batter1dot: wicketBatterScores?.dot ? wicketBatterScores?.dot : 0,
                batter1four: wicketBatterScores?.four ? wicketBatterScores?.four : 0,
                batter1six: wicketBatterScores?.six ? wicketBatterScores?.six : 0,
                batter1sr: wicketBatterScores?.sr ? wicketBatterScores?.sr : ""
            }))
            setPartnerShip((prev) => ({
                ...prev,
                batter1run: wicketBatterScores?.run ? wicketBatterScores?.run : 0,
                batter1balls: wicketBatterScores?.balls ? wicketBatterScores?.balls : 0,
            }))
        } else if (strike === 2) {
            setBatterScores((prev) => ({
                ...prev,
                batter2run: wicketBatterScores?.run ? wicketBatterScores?.run : 0,
                batter2balls: wicketBatterScores?.balls ? wicketBatterScores?.balls : 0,
                batter2dot: wicketBatterScores?.dot ? wicketBatterScores?.dot : 0,
                batter2four: wicketBatterScores?.four ? wicketBatterScores?.four : 0,
                batter2six: wicketBatterScores?.six ? wicketBatterScores?.six : 0,
                batter2sr: wicketBatterScores?.sr ? wicketBatterScores?.sr : ""
            }))
            setPartnerShip((prev) => ({
                ...prev,
                batter2run: wicketBatterScores?.run ? wicketBatterScores?.run : 0,
                batter2balls: wicketBatterScores?.balls ? wicketBatterScores?.balls : 0,
            }))
        }
    }

    const handleBowlerPrevStats = (id) => {
        const overNo = CurrentInnings === 2 ? matchSecondInnings?.Completedovers?.filter(item => item.bowlerId === id).length : matchFirstInnings?.Completedovers?.filter(item => item.bowlerId === id).length;
        const overs = CurrentInnings === 2 ? matchSecondInnings?.Completedovers?.filter(item => item.bowlerId === id) : matchFirstInnings?.Completedovers?.filter(item => item.bowlerId === id);
        const lastItem = overs?.[overs.length - 1];

        const run = lastItem ? lastItem.bowlerrun : 0;
        const wd = lastItem ? lastItem.bowlerwd : 0;
        const dot = lastItem ? lastItem.bowlerdot : 0;
        const nb = lastItem ? lastItem.bowlernb : 0;
        const wicket = lastItem ? lastItem.bowlerwicket : 0;
        const eco = lastItem ? lastItem.bowlereco : 0
        setBowlerScore({
            overNo: overNo ?? 0,
            ballNo: 0,
            wd: wd ?? 0,
            nb: nb ?? 0,
            dot: dot ?? 0,
            eco: eco ?? "",
            wicket: wicket ?? 0,
            run: run ?? 0
        })
    }

    const matchFinished = async () => {
        const FirstInningslegalBall = matchFirstInnings?.Completedovers?.[matchFirstInnings?.Completedovers?.length - 1]?.legalBall
        const FirstInningsOver = FirstInningslegalBall === 6 ? matchFirstInnings?.Completedovers?.length : matchFirstInnings?.Completedovers?.length - 1 + (FirstInningslegalBall / 10)
        const FirstInningsRuns = matchFirstInnings?.Completedovers[matchFirstInnings?.Completedovers.length - 1]?.runs
        const SecondInningslegalBall = matchSecondInnings?.Completedovers?.[matchSecondInnings?.Completedovers?.length - 1]?.legalBall
        const SecondInningsOver = SecondInningslegalBall === 6 ? matchSecondInnings?.Completedovers?.length : matchSecondInnings?.Completedovers?.length - 1 + (SecondInningslegalBall / 10)
        const SecondInningsRuns = matchSecondInnings?.Completedovers[matchSecondInnings?.Completedovers.length - 1]?.runs
        const battingside = (SecondInningsRuns / SecondInningsOver) - (FirstInningsRuns / FirstInningsOver)
        const bowlingside = (FirstInningsRuns / FirstInningsOver) - (SecondInningsRuns / SecondInningsOver)

        const createStatusNewObj = {
            id: currentMatch?.id,
            status: 4
        };
        await dispatch(ChangeStatus(createStatusNewObj));

        const allWickets = [
            ...(currentMatch?.firstInnings?.Wickets ?? []),
            ...(currentMatch?.secondInnings?.Wickets ?? [])
        ];

        const Economy = [
            ...(currentMatch?.firstInnings?.Completedovers ?? []),
            ...(currentMatch?.secondInnings?.Completedovers ?? [])
        ]

        const finalOvers = [
            (currentMatch?.firstInnings?.Currentover?.[0] ?? []),
            (currentMatch?.secondInnings?.Currentover?.[0] ?? [])
        ]

        const firstInningswickets = [
            ...(currentMatch?.firstInnings?.Wickets ?? [])
        ]

        const secondInningswickets = [
            ...(currentMatch?.secondInnings?.Wickets ?? [])
        ]

        const Extras = [
            ...(currentMatch?.firstInnings?.Extras ?? []),
            ...(currentMatch?.secondInnings?.Extras ?? [])
        ]

        let players = []
        let matches = []

        const playersStats = matchPlayers.map(player => {
            const playerStat = calculatePlayerStats(player, allWickets, Economy);
            return playerStat;
        });
        players = playersStats
        await dispatch(updatePlayersStats({ players }));

        const matchStats = calculateMatchStats(allWickets, Economy, finalOvers, firstInningswickets, secondInningswickets, Extras);
        matches = matchStats

        const id = currentMatch?.tournamentId
        await dispatch(updateTournamentStats({ id, matches }))

        const filterWinningTeam = team1?.id === winningTeam ? team1?.team_name : team2?.team_name
        const sideWin = filterWinningTeam === tossWinner.battingSide
        const WinningTeam = {
            teamId: team1?.id === winningTeam ? team1?.id : team2?.id,
            match: 1,
            point: 2,
            win: 1,
            lose: 0,
            tie: 0,
            nrr: sideWin ? battingside : bowlingside,
            noreason: 0
        }
        const LossingTeam = {
            teamId: !team1?.id === winningTeam ? team1?.id : team2?.id,
            match: 1,
            point: 0,
            win: 0,
            lose: 1,
            tie: 0,
            nrr: sideWin ? bowlingside : battingside,
            noreason: 0
        }
        const teams = [WinningTeam, LossingTeam]
        dispatch(updateTeamStats({ teams }));

        router.push(`/summary/${currentMatch?.id}`);
    }

    const handleInningsComplete = () => {
        if (CurrentInnings === 2 || CurrentInnings === 1) {
            handleAddOver()
        }
        const action = CurrentInnings === 3 ? AddSuperOverWicket : CurrentInnings === 2 ? AddSecondInningsWicket : CurrentInnings === 1 ? AddWicket : AddSuperOverSecondInningsWicket;
        const innings = CurrentInnings === 3 ? 'superOverFirstInnings' : CurrentInnings === 2 ? 'secondInnings' : CurrentInnings === 1 ? 'firstInnings' : "superOverSecondInnings"
        const createNotOutObject = (batterId, batterStats) => ({
            BatterId: batterId,
            reason: "Not Out",
            run: batterStats.run,
            balls: batterStats.balls,
            dot: batterStats.dot,
            four: batterStats.four,
            six: batterStats.six,
            sr: batterStats.sr,
            partnership: batterStats.partnership,
            newBatter: wicketReason.newBatter,
            batter1Contribution: partnership.batter1run,
            batter1balls: partnership.batter1balls,
            batter1Id: playerselection.striker,
            batter2Contribution: partnership.batter2run,
            batter2balls: partnership.batter2balls,
            batter2Id: playerselection.nonStriker
        });
        const dispatchWicket = async (batterId, batterStats) => {
            const notOutObject = createNotOutObject(batterId, batterStats);
            const createNewObj = {
                id: currentMatch?.id,
                [innings]: {
                    Wickets: notOutObject,
                }
            };
            await dispatch(action(createNewObj));
        };
        if (playerselection.striker !== "") {
            dispatchWicket(playerselection.striker, {
                run: batterScores.batter1run,
                balls: batterScores.batter1balls,
                dot: batterScores.batter1dot,
                four: batterScores.batter1four,
                six: batterScores.batter1six,
                sr: batterScores.batter1sr,
                partnership: initailscore.run
            });
        }
        if (playerselection.nonStriker !== "") {
            dispatchWicket(playerselection.nonStriker, {
                run: batterScores.batter2run,
                balls: batterScores.batter2balls,
                dot: batterScores.batter2dot,
                four: batterScores.batter2four,
                six: batterScores.batter2six,
                sr: batterScores.batter2sr,
                partnership: initailscore.run
            });
        }
    }

    const handleInningsChange = async () => {
        setLegalBallCount(0);
        handleInnChange()
        handleInningsComplete()
        setBallScores([]);
        setLength(6)
        handlePlayerChange("", "", "")
        const payload = {
            id: currentMatch.id,
            breaktype: 'innings'
        }
        let res = await dispatch(MatchBreakSchedule(payload))
        if (res) {
            router.push(`/playerboard/${currentMatch?.id}`)
        }
    };

    // Undo Score
    const updateScoresForRun = (runValue, lastScore) => {
        setInitialscore(prev => ({ ...prev, run: prev.run - runValue }));
        setBowlerScore(prev => ({
            ...prev,
            run: prev.run - runValue,
            ballNo: prev.ballNo - 1,
            dot: lastScore === '0' ? prev.dot - 1 : prev.dot,
        }));
    };

    const updateBatterScore = (runValue, lastScore, batterKey) => {
        const noballPattern = /^(\d*)NB$/;
        const noballMatch = lastScore.match(noballPattern);
        const noball = noballMatch !== null;
        const noballRuns = noball ? (noballMatch[1] ? parseInt(noballMatch[1]) : 0) : 0;
        const isBoundary = lastScore === '4' || lastScore === '6';
        const isDotBall = lastScore === '0';
        setBatterScores(prev => ({
            ...prev,
            [`${batterKey}run`]: noball ? prev[`${batterKey}run`] - noballRuns : prev[`${batterKey}run`] - runValue,
            [`${batterKey}balls`]: noball ? prev[`${batterKey}balls`] : prev[`${batterKey}balls`] - 1,
            [`${batterKey}${isBoundary ? (lastScore === '4' ? 'four' : 'six') : (isDotBall ? 'dot' : '')}`]:
                isBoundary || isDotBall
                    ? prev[`${batterKey}${isBoundary ? (lastScore === '4' ? 'four' : 'six') : 'dot'}`] - 1
                    : prev[`${batterKey}${isDotBall ? 'dot' : ''}`] - 1
        }));
        setPartnerShip(prev => ({
            ...prev,
            [`${batterKey}run`]: noball ? prev[`${batterKey}run`] - noballRuns : prev[`${batterKey}run`] - runValue,
            [`${batterKey}balls`]: noball ? prev[`${batterKey}balls`] : prev[`${batterKey}balls`] - 1,
        }));
    };

    const updateForWideOrNoBall = (lastScore) => {
        const scoreValue = lastScore === "WD" || lastScore === "NB" ? 1 : parseInt(lastScore.replace(/[^0-9]/g, '')) + 1;
        setBowlerScore((prev) => ({
            ...prev,
            run: prev.run - scoreValue,
        }))
        setInitialscore((prev) => ({
            ...prev,
            run: prev.run - scoreValue
        }))
        setLength(prevLength => prevLength - 1);
    };

    const handleUndoScore = async () => {
        let newBallScores = [...ballScores];
        const currentInnings = CurrentInnings
        const inningsMap = [matchFirstInnings, matchSecondInnings, matchThirdInnings, matchFourthInnings];
        const wickets = inningsMap[currentInnings - 1]?.Wickets?.slice(-1)[0]
        const filterBatterOrder = currentMatch?.[innings]?.BattingOrder?.[0] || [];
        const updatedBatterOrder = [...filterBatterOrder];
        const wasBatterOut = currentMatch?.[innings]?.Wickets?.some(
            (wicket) => wicket.BatterId === wickets?.BatterId && wickets?.reason !== 'Retired Hurt'
        );
        if (wasBatterOut) {
            const batterIndex = updatedBatterOrder.indexOf(wickets?.BatterId);
            if (batterIndex !== -1) {
                updatedBatterOrder.splice(batterIndex, 1);
            }
        }
        setBattingOrder(updatedBatterOrder);
        const createNewBatterObj = {
            id: currentMatch?.id,
            [innings]: {
                BattingOrder: updatedBatterOrder
            }
        };
        const Batteraction = CurrentInnings === 3 ? ReplaceSuperOverBattingOrder : CurrentInnings === 2 ? ReplaceSecondInningsBattingOrder : CurrentInnings === 1 ? ReplaceBattingOrder : ReplaceSuperOverSecondInningsBattingOrder;

        const action = CurrentInnings === 3 ? RemoveSuperOverWicket : CurrentInnings === 2 ? RemoveSecondInningsWicket : CurrentInnings === 1 ? RemoveWicket : RemoveSuperOverSecondInningsWicket;
        const ExtraRemoveAction = CurrentInnings === 3 ? RemoveSuperOverExtra : CurrentInnings === 2 ? RemoveSecondInningsExtra : CurrentInnings === 1 ? RemoveExtra : RemoveSuperOverSecondInningsExtra;
        for (let i = newBallScores.length - 1; i >= 0; i--) {
            if (newBallScores[i] !== null) {
                setInningsComplete(false)
                setOverFinished(false)
                setUndo(true)
                const lastScore = newBallScores[i];
                if (winningTeam) {
                    hasRunwinningRef.current = false;
                    setWinningTeam()
                    const createNewObj = {
                        ...currentMatch,
                        matchWinner: '',
                        winSituation: ''
                    }
                    await dispatch(ReplaceMatchSchedule(createNewObj))
                    if (currentInnings === 2) {
                        await dispatch(RemoveOver({ id: currentMatch?.id }))
                    }
                    const getNotOutPlayer = currentMatch?.[innings]?.Wickets?.filter(
                        (wicket) => wicket?.reason === 'Not Out'
                    );
                    getNotOutPlayer?.forEach(async (player) => {
                        const createNewObj = {
                            id: currentMatch?.id,
                            BatterId: player?.BatterId
                        };
                        await dispatch(action(createNewObj));
                    });
                }
                const runValue = parseInt(lastScore);
                const illegalScoresPattern = /^(\d+)(WD|NB)(\+W)?$/;
                const regex = /^[13579]\d*[WD|LB|NB]+(\+W)?$/;
                const numbers = lastScore.match(/\d+/g);
                const isOdd = regex.test(lastScore)
                const oddRuns = parseInt(lastScore) % 2 !== 0;
                const runoutValues = lastScore.includes('W+') && parseInt(lastScore.slice(2))
                const wideRunoutValues = lastScore === 'WD+W' ? 1 : parseInt(numbers);
                const noballRunoutValues = lastScore === 'NB+W' ? 1 : parseInt(numbers) + 1;
                const noballBatterRuns = lastScore === "NB+W" ? 0 : parseInt(numbers);
                const oddRunoutValues = parseInt(numbers) % 2 !== 0;

                if (legalBallCount > 0 || ball.ballNo > 0) {
                    if (lastScore === "W" && wickets?.reason !== 'Run Out') {
                        setInitialscore(prev => ({ ...prev, wicket: prev.wicket - 1 }));
                        setBowlerScore(prev => ({ ...prev, ballNo: prev.ballNo - 1, wicket: prev.wicket - 1 }));
                        if (activeStrike === 1) {
                            handlePlayerChange(wickets?.BatterId, playerselection.nonStriker, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: wickets?.run,
                                batter1balls: wickets?.balls - 1,
                                batter1dot: wickets?.dot,
                                batter1four: wickets?.four,
                                batter1six: wickets?.six
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: wickets?.run,
                                batter1balls: wickets?.balls - 1,
                            }))
                        } else if (activeStrike === 2) {
                            handlePlayerChange(playerselection.striker, wickets?.BatterId, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter2run: wickets?.run,
                                batter2balls: wickets?.balls - 1,
                                batter2dot: wickets?.dot,
                                batter2four: wickets?.four,
                                batter2six: wickets?.six
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter2run: wickets?.run,
                                batter2balls: wickets?.balls - 1,
                            }))
                        }
                        const createNewObj = {
                            id: currentMatch?.id,
                            BatterId: wickets?.BatterId
                        };
                        await dispatch(Batteraction(createNewBatterObj));
                        await dispatch(action(createNewObj));
                    } else if ((lastScore.includes('W+') || lastScore.includes('W')) && wickets?.reason === 'Run Out' && !lastScore.includes('WD+W') && !lastScore.includes('NB+W')) {
                        const runs = runoutValues;
                        setInitialscore(prev => ({ ...prev, wicket: prev.wicket - 1, run: prev.run - runs }));
                        setBowlerScore(prev => ({ ...prev, ballNo: prev.ballNo - 1, run: prev.run - runs }));
                        if (wickets?.newBatter.toString() === playerselection.striker.toString()) {
                            handlePlayerChange(wickets?.BatterId, playerselection.nonStriker, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: lastScore === 'W' ? wickets?.run - runs : activeStrike === 1 && !oddRunoutValues ? wickets?.run - runs : activeStrike === 2 && oddRunoutValues ? wickets?.run - runs : wickets?.run,
                                batter1balls: lastScore === 'W' ? wickets?.balls - 1 : activeStrike === 1 && !oddRunoutValues ? wickets?.balls - 1 : activeStrike === 2 && oddRunoutValues ? wickets?.balls - 1 : wickets?.balls,
                                batter1dot: wickets?.dot,
                                batter1four: wickets?.four,
                                batter1six: wickets?.six,
                                batter2run: lastScore === 'W' ? prev.batter2run : activeStrike === 2 && !oddRunoutValues ? prev.batter2run - runs : activeStrike === 1 && oddRunoutValues ? prev.batter2run - runs : prev.batter2run,
                                batter2balls: lastScore === 'W' ? prev.batter2balls : activeStrike === 2 && !oddRunoutValues ? prev.batter2balls - 1 : activeStrike === 1 && oddRunoutValues ? prev.batter2balls - 1 : prev.batter2balls,
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: lastScore === 'W' ? wickets?.run - runs : activeStrike === 1 && !oddRunoutValues ? wickets?.run - runs : activeStrike === 2 && oddRunoutValues ? wickets?.run - runs : wickets?.run,
                                batter1balls: lastScore === 'W' ? wickets?.balls - 1 : activeStrike === 1 && !oddRunoutValues ? wickets?.balls - 1 : activeStrike === 2 && oddRunoutValues ? wickets?.balls - 1 : wickets?.balls,
                                batter2run: lastScore === 'W' ? prev.batter2run : activeStrike === 2 && !oddRunoutValues ? prev.batter2run - runs : activeStrike === 1 && oddRunoutValues ? prev.batter2run - runs : prev.batter2run,
                                batter2balls: lastScore === 'W' ? prev.batter2balls : activeStrike === 2 && !oddRunoutValues ? prev.batter2balls - 1 : activeStrike === 1 && oddRunoutValues ? prev.batter2balls - 1 : prev.batter2balls,
                            }))
                        } else if (wickets?.newBatter.toString() === playerselection.nonStriker.toString()) {
                            handlePlayerChange(playerselection.striker, wickets?.BatterId, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: lastScore === 'W' ? prev.batter1run : activeStrike === 1 && !oddRunoutValues ? prev.batter1run - runs : activeStrike === 2 && oddRunoutValues ? prev.batter1run - runs : prev.batter1run,
                                batter1balls: lastScore === 'W' ? prev.batter1balls : activeStrike === 1 && !oddRunoutValues ? prev.batter1balls - 1 : activeStrike === 2 && oddRunoutValues ? prev.batter1balls - 1 : prev.batter1balls,
                                batter2run: lastScore === 'W' ? wickets?.run - runs : activeStrike === 2 && !oddRunoutValues ? wickets?.run - runs : activeStrike === 1 && oddRunoutValues ? wickets?.run - runs : wickets?.run,
                                batter2balls: lastScore === 'W' ? wickets?.balls - 1 : activeStrike === 2 && !oddRunoutValues ? wickets?.balls - 1 : activeStrike === 1 && oddRunoutValues ? wickets?.balls - 1 : wickets?.balls,
                                batter2dot: wickets?.dot,
                                batter2four: wickets?.four,
                                batter2six: wickets?.six
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: lastScore === 'W' ? prev.batter1run : activeStrike === 1 && !oddRunoutValues ? prev.batter1run - runs : activeStrike === 2 && oddRunoutValues ? prev.batter1run - runs : prev.batter1run,
                                batter1balls: lastScore === 'W' ? prev.batter1balls : activeStrike === 1 && !oddRunoutValues ? prev.batter1balls - 1 : activeStrike === 2 && oddRunoutValues ? prev.batter1balls - 1 : prev.batter1balls,
                                batter2run: lastScore === 'W' ? wickets?.run - runs : activeStrike === 2 && !oddRunoutValues ? wickets?.run - runs : activeStrike === 1 && oddRunoutValues ? wickets?.run - runs : wickets?.run,
                                batter2balls: lastScore === 'W' ? wickets?.balls - 1 : activeStrike === 2 && !oddRunoutValues ? wickets?.balls - 1 : activeStrike === 1 && oddRunoutValues ? wickets?.balls - 1 : wickets?.balls,
                            }))
                        }
                        const createNewObj = {
                            id: currentMatch?.id,
                            BatterId: wickets?.BatterId
                        };
                        await dispatch(Batteraction(createNewBatterObj));
                        await dispatch(action(createNewObj));
                    } else if (lastScore.includes('WD+W') && (wickets?.reason === 'Run Out' || wickets?.reason === "Stumped")) {
                        const runs = wideRunoutValues + 1;
                        setLength(prevLength => prevLength - 1);
                        setInitialscore(prev => ({ ...prev, wicket: prev.wicket - 1, run: wickets?.reason === 'Stumped' ? prev.run - 1 : prev.run - runs }));
                        setBowlerScore(prev => ({ ...prev, ballNo: prev.ballNo - 1, run: wickets?.reason === 'Stumped' ? prev.run - 1 : prev.run - runs, wicket: wickets?.reason === 'Stumped' ? prev.wicket - 1 : prev.wicket }));
                        if (wickets?.newBatter.toString() === playerselection.striker.toString()) {
                            handlePlayerChange(wickets?.BatterId, playerselection.nonStriker, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: wickets?.run,
                                batter1balls: wickets?.balls,
                                batter1dot: wickets?.dot,
                                batter1four: wickets?.four,
                                batter1six: wickets?.six,
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: wickets?.run,
                                batter1balls: wickets?.balls
                            }))
                        } else if (wickets?.newBatter.toString() === playerselection.nonStriker.toString()) {
                            handlePlayerChange(playerselection.striker, wickets?.BatterId, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter2run: wickets?.run,
                                batter2balls: wickets?.balls,
                                batter2dot: wickets?.dot,
                                batter2four: wickets?.four,
                                batter2six: wickets?.six
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter2run: wickets?.run,
                                batter2balls: wickets?.balls,
                            }))
                        }
                        const createNewObj = {
                            id: currentMatch?.id,
                            BatterId: wickets?.BatterId
                        };
                        await dispatch(Batteraction(createNewBatterObj));
                        await dispatch(action(createNewObj));
                        await dispatch(ExtraRemoveAction({ id: currentMatch?.id }))
                    } else if (lastScore.includes('NB+W') && wickets?.reason === 'Run Out') {
                        const runs = noballRunoutValues;
                        const batterruns = noballBatterRuns
                        setLength(prevLength => prevLength - 1);
                        setInitialscore(prev => ({ ...prev, wicket: prev.wicket - 1, run: prev.run - runs }));
                        setBowlerScore(prev => ({ ...prev, ballNo: prev.ballNo - 1, run: prev.run - runs }));
                        if (wickets?.newBatter.toString() === playerselection.striker.toString()) {
                            handlePlayerChange(wickets?.BatterId, playerselection.nonStriker, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: activeStrike === 1 && !oddRunoutValues ? wickets?.run - batterruns : activeStrike === 2 && oddRunoutValues ? wickets?.run - batterruns : wickets?.run,
                                batter1balls: wickets?.balls,
                                batter1dot: wickets?.dot,
                                batter1four: wickets?.four,
                                batter1six: wickets?.six,
                                batter2run: activeStrike === 2 && !oddRunoutValues ? prev.batter2run - batterruns : activeStrike === 1 && oddRunoutValues ? prev.batter2run - batterruns : prev.batter2run,
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: activeStrike === 1 && !oddRunoutValues ? wickets?.run - batterruns : activeStrike === 2 && oddRunoutValues ? wickets?.run - batterruns : wickets?.run,
                                batter1balls: wickets?.balls,
                                batter2run: activeStrike === 2 && !oddRunoutValues ? prev.batter2run - batterruns : activeStrike === 1 && oddRunoutValues ? prev.batter2run - batterruns : prev.batter2run,
                            }))
                        } else if (wickets?.newBatter.toString() === playerselection.nonStriker.toString()) {
                            handlePlayerChange(playerselection.striker, wickets?.BatterId, playerselection.bowler)
                            setBatterScores((prev) => ({
                                ...prev,
                                batter1run: activeStrike === 1 && !oddRunoutValues ? prev.batter1run - batterruns : activeStrike === 2 && oddRunoutValues ? prev.batter1run - batterruns : prev.batter1run,
                                batter2run: activeStrike === 2 && !oddRunoutValues ? wickets?.run - batterruns : activeStrike === 1 && oddRunoutValues ? wickets?.run - batterruns : wickets?.run,
                                batter2balls: wickets?.balls,
                                batter2dot: wickets?.dot,
                                batter2four: wickets?.four,
                                batter2six: wickets?.six
                            }))
                            setPartnerShip((prev) => ({
                                ...prev,
                                batter1run: activeStrike === 1 && !oddRunoutValues ? prev.batter1run - batterruns : activeStrike === 2 && oddRunoutValues ? prev.batter1run - batterruns : prev.batter1run,
                                batter2run: activeStrike === 2 && !oddRunoutValues ? wickets?.run - batterruns : activeStrike === 1 && oddRunoutValues ? wickets?.run - batterruns : wickets?.run,
                                batter2balls: wickets?.balls,
                            }))
                        }
                        const createNewObj = {
                            id: currentMatch?.id,
                            BatterId: wickets?.BatterId
                        };
                        await dispatch(Batteraction(createNewBatterObj));
                        await dispatch(action(createNewObj));
                        await dispatch(ExtraRemoveAction({ id: currentMatch?.id }))
                    }
                    setBall(prev => ({ ...prev, ballNo: prev.ballNo - 1 }));

                    if (!illegalScoresPattern.test(lastScore)) {
                        if (!lastScore.includes("WD") && !lastScore.includes('NB')) {
                            setLegalBallCount(prev => prev - 1);
                        }
                    }

                    if (!isNaN(lastScore) && Number(lastScore) >= 0) {
                        updateScoresForRun(runValue, lastScore);
                        const batterKey = activeStrike === 1 && oddRuns ? 'batter2' : activeStrike === 1 && !oddRuns ? 'batter1' : activeStrike === 2 && oddRuns ? 'batter1' : 'batter2';
                        updateBatterScore(runValue, lastScore, batterKey);
                    }

                    // Wide Ball (WD)
                    if (/^\d*WD$/.test(lastScore)) {
                        await dispatch(ExtraRemoveAction({ id: currentMatch?.id }))
                        await updateForWideOrNoBall(lastScore);
                    }

                    // No Ball (NB)
                    if (/^\d*NB$/.test(lastScore)) {
                        await dispatch(ExtraRemoveAction({ id: currentMatch?.id }))
                        await updateForWideOrNoBall(lastScore);
                        const batterKey = activeStrike === 1 && oddRunoutValues ? 'batter2' : activeStrike === 1 && !oddRunoutValues ? 'batter1' : activeStrike === 2 && oddRunoutValues ? 'batter1' : 'batter2';
                        await updateBatterScore(runValue, lastScore, batterKey);
                    }

                    // Leg Byes (LB)
                    if (/^\d*LB$/.test(lastScore)) {
                        await dispatch(ExtraRemoveAction({ id: currentMatch?.id }))
                        const legByes = parseInt(lastScore.replace('LB', ''));
                        setInitialscore(prev => ({ ...prev, run: prev.run - legByes }));
                        setBowlerScore(prev => ({ ...prev, ballNo: prev.ballNo - 1, dot: prev.dot - 1 }));
                        const batterKey = activeStrike === 1 && isOdd ? 'batter2' : activeStrike === 1 && !isOdd ? 'batter1' : activeStrike === 2 && isOdd ? 'batter1' : 'batter2';
                        setBatterScores(prev => ({ ...prev, [`${batterKey}balls`]: prev[`${batterKey}balls`] - 1 }));
                        setPartnerShip(prev => ({ ...prev, [`${batterKey}balls`]: prev[`${batterKey}balls`] - 1 }));
                    }

                    // Change Strike for odd runs
                    if (oddRunoutValues && (lastScore !== "WD" && lastScore !== "NB" && lastScore !== "W" && lastScore !== "WD+W" && lastScore !== "NB+W")) {
                        handleChangeStrike();
                    }

                    newBallScores.splice(i, 1);
                    break;
                }
            }
        }
        setBallScores(newBallScores);
    };

    const getEligibleBowlers = (tossWinner, team1, team2, team1XIplayer, team2XIplayer, playerselection, currentMatch, CurrentInnings, OverPerBowler) => {
        const bowlingTeam = tossWinner?.bowlingSide === team1?.team_name ? team1XIplayer : team2XIplayer;
        const innings = CurrentInnings === 1 ? currentMatch?.firstInnings : currentMatch?.secondInnings;
        const lastBowlerId = innings?.Completedovers?.length > 0 && (innings?.Currentover?.[0]?.legalBall === 0 || !innings?.Currentover?.[0]?.legalBall) ? innings.Completedovers[innings.Completedovers.length - 1]?.bowlerId : null;

        const eligibleBowlers = bowlingTeam.filter(player => {
            if (player.id === playerselection.bowler || player.id === lastBowlerId) {
                return false;
            }
            const bowlerCompletedOvers = innings?.Completedovers?.filter(over => over.bowlerId === player.id).length || 0;
            return bowlerCompletedOvers < OverPerBowler;
        });
        return eligibleBowlers;
    };

    const getAvailablePlayers = (teamPlayers) => {
        return teamPlayers.filter(player =>
            player.id !== playerselection.striker &&
            player.id !== playerselection.nonStriker &&
            (!wicketPlayes?.some(wicket => wicket.BatterId === player.id) ||
                wicketPlayes?.some(wicket => wicket.BatterId === player.id && wicket.reason === 'Retired Hurt')
            )
        );
    };

    const isDisabledForChangeBatter = wicketReason.newBatter === '';
    // const isDisabledForAllOut = active.data === "RNO" && (wicketReason.batter === '' || wicketReason.fielder === '') || wicketReason.reason === 0;
    const isDisabledForAllOut = active.data === "RNO" ? active.data === "RNO" && (wicketReason.batter === '' || wicketReason.fielder === '') : wicketReason.reason === 3 || wicketReason.reason === 5 ? wicketReason.fielder === '' : wicketReason.reason === 0;
    const isDisabledForSuperOver = wicketReason.superover === 0;
    const isDisabledForCustomRuns = wicketReason.runs === ''
    const isReviseDisable = reviseTarget.over === ""
    const isTerminateDisable = matchTerminate.mainreason === 0 || (matchTerminate.mainreason === 1 && (matchTerminate.reason === "" || matchTerminate.disqualified === 0)) || (matchTerminate.mainreason === 2 && matchTerminate.pointsdistribution === 0)
    const isDisabled = () => {
        if (penalty) {
            return wicketReason.penalty === "";
        }
        if (rno) {
            return (wicketReason.batter === "" || wicketReason.newBatter === "" || wicketReason.fielder === "");
        }
        if (bowlerchange) {
            return wicketReason.bowler === "";
        }
        if (wicketReason.reason === 3) {
            return (wicketReason.newBatter === "" || wicketReason.fielder === "");
        }
        return wicketReason.reason === 0 || wicketReason.newBatter === "";
    };

    const handleClick = () => {
        if (bowlerchange) return handleOverChanged;
        if (wicket) return handleWicketUpdate;
        if (penalty) return handlePenalty;
        return handleClose;
    };

    useEffect(() => {
        if (wicketReason.reason === 6) {
            setRno(true)
            if (active.data !== 'WD' && active.data !== "NB") {
                setActive((prev) => ({
                    ...prev,
                    active: true,
                    data: 'RNO',
                    secondactive: ""
                }))
            } else {
                setActive((prev) => ({
                    ...prev,
                    active: true,
                    secondactive: 'RNO'
                }))
            }
        } else if (wicketReason.reason !== 6 && wicketReason.reason !== 0) {
            if (active.data !== "WD" && active.data !== "NB") {
                setActive((prev) => ({
                    ...prev,
                    active: false,
                    data: wicketReason.reason === 5 ? "STO" : "W",
                    secondactive: ""
                }))
            } else if (wicketReason.reason === 5 && active.data === "WD") {
                setActive((prev) => ({
                    ...prev,
                    active: true,
                    secondactive: "STO"
                }))
            }
            setRno(false)
        }
    }, [wicketReason.reason])

    // break flow
    const handleBreakOpen = () => {
        setSelectBreakType('')
        setBreakStart(true)
        setOpen(true)
    }

    const handleBreakSelect = (value, key) => {
        if (value) {
            setSelectBreakType(key)
        }
    }

    const handleBreakStart = async () => {
        if (selectBreakType) {
            const payload = {
                id: currentMatch.id,
                breaktype: selectBreakType
            }
            let res = await dispatch(MatchBreakSchedule(payload))
            if (res) {
                currentMatch?.tournamentId &&
                    router.push(`/mytournament/${currentMatch?.tournamentId}/match`)
            }
        }
    }

    const handleMatchTerminate = () => {
        setOpen(true)
        setMatchTerminate({
            terminate: true,
            mainreason: 0,
            pointsdistribution: 0,
            reason: "",
            disqualified: 0
        })
    }


    const ConfirmTerminateMatch = async () => {
        if (matchTerminate.mainreason === 2) {
            handleTied()
        } else if (matchTerminate.mainreason === 1) {
            const createStatusNewObj = {
                id: currentMatch?.id,
                status: 4
            };
            await dispatch(ChangeStatus(createStatusNewObj));

            let players = []
            let matches = []

            if (matchTerminate.disqualified === 2) {
                const allWickets = [
                    ...(currentMatch?.firstInnings?.Wickets ?? []),
                ];
                const Economy = [
                    ...(currentMatch?.firstInnings?.Completedovers ?? []),
                ]
                const finalOvers = [
                    (currentMatch?.firstInnings?.Currentover?.[0] ?? []),
                ]
                const firstInningswickets = [
                    ...(currentMatch?.firstInnings?.Wickets ?? [])
                ]
                const Extras = [
                    ...(currentMatch?.firstInnings?.Extras ?? []),
                ]
                const playersStats = matchPlayers.map(player => {
                    const playerStat = calculatePlayerStats(player, allWickets, Economy);
                    return playerStat;
                });
                players = playersStats
                const matchStats = calculateMatchStats(allWickets, Economy, finalOvers, firstInningswickets, [], Extras);
                matches = matchStats
            } else if (matchTerminate.disqualified === 1) {
                const allWickets = [
                    ...(currentMatch?.secondInnings?.Wickets ?? [])
                ];
                const Economy = [
                    ...(currentMatch?.secondInnings?.Completedovers ?? [])
                ]
                const finalOvers = [
                    (currentMatch?.secondInnings?.Currentover?.[0] ?? [])
                ]
                const secondInningswickets = [
                    ...(currentMatch?.secondInnings?.Wickets ?? [])
                ]
                const Extras = [
                    ...(currentMatch?.secondInnings?.Extras ?? [])
                ]
                const playersStats = matchPlayers.map(player => {
                    const playerStat = calculatePlayerStats(player, allWickets, Economy);
                    return playerStat;
                });
                players = playersStats
                const matchStats = calculateMatchStats(allWickets, Economy, finalOvers, [], secondInningswickets, Extras);
                matches = matchStats
            }
            await dispatch(updatePlayersStats({ players }));
            const id = currentMatch?.tournamentId
            await dispatch(updateTournamentStats({ id, matches }))
            const WinningTeam = {
                teamId: matchTerminate.disqualified === 2 ? team1?.id : team2?.id,
                match: 1,
                point: 2,
                win: 1,
                lose: 0,
                tie: 0,
                nrr: 0,
                noreason: 0
            }
            const LossingTeam = {
                teamId: !matchTerminate.disqualified === 2 ? team1?.id : team2?.id,
                match: 1,
                point: 0,
                win: 0,
                lose: 1,
                tie: 0,
                nrr: 0,
                noreason: 0
            }
            const teams = [WinningTeam, LossingTeam]
            dispatch(updateTeamStats({ teams }));
            const newObj = {
                id: currentMatch?.id,
                terminate: {
                    mainreason: 'disqualify',
                    teamdisqualify: matchTerminate.disqualified === 1 ? team1?.id : team2?.id,
                    reason: matchTerminate?.reason
                }
            }
            await dispatch(MatchTerminate(newObj))
            handleInningsComplete();
            router.push(`/summary/${currentMatch?.id}`);
        }
    }

    const handleReviseTarget = (type) => {
        setOpen(true)
        setReviseTarget({
            revise: true,
            over: "",
            type: type
        })
    }

    const ConfirmReviseTarget = () => {
        if (reviseTarget.type === "DLS") {
            const Team1Run = matchFirstInnings?.Currentover?.[0]?.runs
            const Team1Over = parseInt(currentMatch?.totalovers)
            const target = calculateDLSTarget(Team1Run, Team1Over, reviseTarget.over, initailscore.wicket)
            const newObj = {
                id: currentMatch?.id,
                target: {
                    runs: target,
                    overs: reviseTarget.over.toString(),
                    dls: true
                }
            }
            dispatch(ChangeMatchTarget(newObj))
        } else if (reviseTarget.type === "Overs") {
            const newObj = {
                id: currentMatch?.id,
                totalovers: (parseInt(currentMatch?.totalovers) - reviseTarget.over).toString()
            }
            dispatch(DescreaseMatchOvers(newObj))
        }
        handleClose()
    }

    const buttonConfigs = [
        {
            condition: !InningsComplete && !superOver && !changeBatter && !retiredHurt && !customRun && !breakStart && !matchTerminate.terminate && !reviseTarget.revise,
            onClick: handleClick(),
            title: 'Update Scoreboard',
            disabled: isDisabled(),
        },
        {
            condition: changeBatter || retiredHurt,
            onClick: changeBatter ? handleBatterChanged : retiredHurt ? handleRetiredHurt : undefined,
            title: 'Update Scoreboard',
            disabled: isDisabledForChangeBatter,
        },
        {
            condition: InningsComplete && allOut,
            onClick: handleAllOut,
            title: 'All Out',
            disabled: isDisabledForAllOut,
        },
        {
            condition: !allOut && superOver,
            onClick: wicketReason.superover === 1 ? handleInningsChange : wicketReason.superover === 2 ? handleTied : undefined,
            title: 'Conclude',
            disabled: isDisabledForSuperOver,
        },
        {
            condition: customRun,
            onClick: handleCustomRun,
            title: 'Update Scoreboard',
            disabled: isDisabledForCustomRuns
        },
        {
            condition: breakStart,
            onClick: handleBreakStart,
            title: 'Confirm',
            disabled: !selectBreakType
        },
        {
            condition: reviseTarget.revise,
            onClick: ConfirmReviseTarget,
            title: reviseTarget.type === "DLS" ? "Revise Target" : "Revise Overs",
            disabled: isReviseDisable
        },
        {
            condition: matchTerminate.terminate,
            onClick: ConfirmTerminateMatch,
            title: "Terminate Match",
            disabled: isTerminateDisable
        },
    ];

    return (
        <>
            <ScorePage
                match={currentMatch}
                team1={team1}
                team2={team2}
                initailscore={initailscore}
                handleScore={handleScore}
                runtype={runtype}
                balls={ball}
                active={active}
                addBall={handleOverChangeClicked}
                length={length}
                ballScores={ballScores}
                legalBallCount={legalBallCount}
                inningsChange={handleInningsChange}
                target={target}
                startInnings={handleStartInnings}
                currentinnings={CurrentInnings ? CurrentInnings : inning}
                playerselection={playerselection}
                players={player_data?.data}
                activeStrike={activeStrike}
                batterScore={batterScores}
                bowlerScore={bowlerScore}
                inningsComplete={InningsComplete}
                winner={winningTeam}
                matchComplete={matchFinished}
                team1Score={firstInningsScore}
                team2Score={secondInningsScore}
                overChanged={oversFinished}
                gif={gif}
                tossWinner={tossWinner}
                scoreBack={handleUndoScore}
                ChangeBowler={handleChangeBowler}
                ChangeBatter={handleChangeBatter}
                battinglength={battinglength ? (battinglength + filterBatterWithHurt) - 1 : 3}
                Extras={Extras}
                ChangeStrike={handleChangeStrike}
                post={playersPost}
                handleBreakOpen={handleBreakOpen}
                terminateMatch={handleMatchTerminate}
                reviseTarget={handleReviseTarget}
                winSituation={winningSituation}
                team1Data={Team1Data}
                team2Data={Team2Data}
            />

            <Dialog open={open} onClose={() => { }} className="scoreboard_dialog_section">
                {!superOver && <Close sx={{ color: 'var(--text-white)', cursor: 'pointer', position: 'absolute', right: '2%', top: '3%' }} onClick={handleClose} />}
                <Box>
                    {/* Revise Match Overs & DLS */}
                    {
                        reviseTarget.revise &&
                        <>
                            <Typography className="declare_warning" sx={{ marginBottom: '15px' }}>
                                {reviseTarget.type === "Overs" ? 'Are you sure you want to reduce match overs. Once process is done it can not be undo'
                                    : 'Are you sure you want to revise target. Once process is done it can not be undo'}
                            </Typography>
                            <Box className="custom_run_section">
                                <Typography variant="body2">
                                    {reviseTarget.type === "Overs" ? `${currentMatch?.totalovers} Ovs -`
                                        : 'Overs Left'}
                                </Typography>
                                <input
                                    className="runs_input_field"
                                    type="number"
                                    value={reviseTarget.over}
                                    max={reviseTarget.type === "DLS" ? target.overs / 6 : parseInt(currentMatch?.totalovers)}
                                    onChange={(e) => setReviseTarget((prev) => ({ ...prev, over: e.target.value }))}
                                />
                                <Typography variant="body2">
                                    {reviseTarget.type === "Overs" ? `= ${parseInt(currentMatch?.totalovers) - (reviseTarget.over ? reviseTarget.over : 0)} Ovs`
                                        : `${reviseTarget.over ? calculateDLSTarget(matchFirstInnings?.Currentover?.[0]?.runs, parseInt(currentMatch?.totalovers), parseInt(reviseTarget.over), initailscore.wicket) : target.runs} runs`}
                                </Typography>
                            </Box>
                        </>
                    }

                    {/* Match Terminate */}
                    {
                        matchTerminate.terminate &&
                        <>
                            <Typography className="declare_warning" sx={{ marginBottom: '15px' }}>Are you sure you want to terminate this match. Once process is done it can not be undo</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CommonInput minWidth={'175px'} type="reason" value={matchTerminate.mainreason} loop={MatchTermination} onchange={handleMatchTerminationChange('mainreason')} title="Reason" />
                            </Box>
                            {
                                matchTerminate.mainreason === 1 &&
                                <>
                                    <Box className="custom_team_section">
                                        <Typography variant="body2">Team Disquilified</Typography>
                                        <CommonInput type="reason" value={matchTerminate.disqualified} loop={[team1?.team_name, team2?.team_name]} onchange={handleMatchTerminationChange('disqualified')} title="Select" />
                                    </Box>
                                    <Box className="custom_run_section">
                                        <Typography variant="body2">Reason</Typography>
                                        <input
                                            className="reason_input_field"
                                            type="text"
                                            value={matchTerminate.reason}
                                            onChange={(e) => setMatchTerminate((prev) => ({ ...prev, reason: e.target.value }))}
                                        />
                                    </Box>
                                </>
                            }
                            {
                                matchTerminate.mainreason === 2 && <Box sx={{ marginTop: "20px" }} className="custom_run_section">
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CommonInput minWidth={'175px'} type="reason" value={matchTerminate.pointsdistribution} loop={RainConclusion} onchange={handleMatchTerminationChange('pointsdistribution')} title="Points Distribution" />
                                    </Box>
                                </Box>
                            }
                        </>
                    }

                    {/* Custom Run Input */}
                    {customRun &&
                        <Box className="custom_run_section">
                            <input
                                className="runs_input_field"
                                type="number"
                                value={wicketReason?.runs}
                                onChange={(e) => setWicketReason((prev) => ({ ...prev, runs: e.target.value }))}
                            />
                            <Typography variant="body2">runs</Typography>
                        </Box>
                    }

                    {/* Change Batter or Retired Hurt */}
                    {(changeBatter || retiredHurt) && !wicket && (
                        <Box>
                            <Typography sx={{ color: 'var(--text-white)', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>
                                {retiredHurt ? 'Retired Hurt' : 'Change Batter'}
                            </Typography>
                            <SelectionOptionSection
                                title="New Batter"
                                value={wicketReason.newBatter}
                                option={tossWinner?.battingSide === team1?.team_name ? getAvailablePlayers(team1XIplayer) : getAvailablePlayers(team2XIplayer)}
                                firstoption="Batter"
                                onchange={handleChange('newBatter')}
                                width={'auto'}
                            />
                        </Box>
                    )}

                    {/* Wicket Section */}
                    {wicket && !rno && (
                        <Box>
                            <Box className={`scoreboard_dialog_wicket_section ${wicketReason.reason === 5 ? 'reason' : ''}`}>
                                {active.data !== "WD" && active.data !== "NB" && (
                                    <CommonInput type="reason" value={wicketReason.reason} loop={reason} onchange={handleChange('reason')} title="Reason" />
                                )}
                                {(wicketReason.reason === 3 || wicketReason.reason === 5) && (
                                    <Typography sx={{ fontWeight: 600, color: 'var(--text-white)' }}>
                                        {/* {wicketReason.reason === 5 ? "Stumping By" : "By"} */}
                                        By
                                    </Typography>
                                )}
                                {(wicketReason.reason === 3 || wicketReason.reason === 5) && (
                                    <SelectionOptionSection
                                        value={wicketReason.fielder}
                                        option={
                                            wicketReason.reason === 5
                                                ? (tossWinner?.bowlingSide === team1?.team_name
                                                    ? team1player.filter(player => player.id !== playerselection.bowler)
                                                    : team2player.filter(player => player.id !== playerselection.bowler))
                                                : (tossWinner?.bowlingSide === team1?.team_name ? team1player : team2player)
                                        }
                                        firstoption={wicketReason.reason === 5 ? "WK" : "Fielder"}
                                        onchange={handleChange('fielder')}
                                        className='isCatch'
                                    />
                                )}
                            </Box>
                            {!InningsComplete && (
                                <SelectionOptionSection
                                    title="New Batter"
                                    value={wicketReason.newBatter}
                                    option={tossWinner?.battingSide === team1?.team_name ? getAvailablePlayers(team1XIplayer) : getAvailablePlayers(team2XIplayer)}
                                    firstoption="Batter"
                                    onchange={handleChange('newBatter')}
                                    width={'auto'}
                                />
                            )}
                        </Box>
                    )}

                    {/* Bowler Change Section */}
                    {bowlerchange && (
                        <Box>
                            <SelectionOptionSection
                                title="Bowler"
                                value={wicketReason.bowler}
                                option={getEligibleBowlers(tossWinner, team1, team2, team1XIplayer, team2XIplayer, playerselection, currentMatch, CurrentInnings, OverPerBowler)}
                                firstoption="Bowler"
                                onchange={handleChange('bowler')}
                                width={'auto'}
                            />
                        </Box>
                    )}

                    {/* Run Out Section */}
                    {rno && (
                        <Box>
                            {active.data !== "WD" && active.data !== "NB" && (
                                <Box sx={{ maxWidth: '110px', margin: '0 auto' }}>
                                    <CommonInput type="reason" value={wicketReason.reason} loop={reason} onchange={handleChange('reason')} title="Reason" />
                                </Box>
                            )}
                            <SelectionOptionSection
                                title="Run Out By"
                                value={wicketReason.fielder}
                                option={tossWinner?.bowlingSide === team1?.team_name ? team1player : team2player}
                                firstoption="Fielder"
                                onchange={handleChange('fielder')}
                                width='auto'
                            />
                            <SelectionOptionSection
                                title="Batter Out"
                                value={wicketReason.batter}
                                option={
                                    tossWinner?.battingSide === team1?.team_name
                                        ? team1XIplayer.filter(player => player.id === playerselection.striker || player.id === playerselection.nonStriker)
                                        : team2XIplayer.filter(player => player.id === playerselection.striker || player.id === playerselection.nonStriker)
                                }
                                firstoption="Batter"
                                onchange={handleChange('batter')}
                                width='auto'
                            />
                            {!InningsComplete && (
                                <SelectionOptionSection
                                    title="New Batter"
                                    value={wicketReason.newBatter}
                                    option={tossWinner?.battingSide === team1?.team_name ? getAvailablePlayers(team1XIplayer) : getAvailablePlayers(team2XIplayer)}
                                    firstoption="Batter"
                                    onchange={handleChange('newBatter')}
                                    width='auto'
                                />
                            )}
                        </Box>
                    )}

                    {/* Penalty Section */}
                    {penalty && (
                        <Box className="scoreboard_dialog_penalty_section">
                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <Typography sx={{ color: 'var(--text-white)', fontWeight: 600 }}>Reason</Typography>
                                <textarea
                                    className="scoreboard_dialog_penalty_textarea"
                                    type="text"
                                    onChange={(e) => setWicketReason((prev) => ({ ...prev, penalty: e.target.value }))}
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Super Over Section */}
                    {superOver && !allOut && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CommonInput type="reason" value={wicketReason.superover} loop={Tied} onchange={handleChange('superover')} title="Select" />
                        </Box>
                    )}

                    {/* break Buttons */}
                    {breakStart && (
                        <Box>
                            <Typography sx={{ color: 'var(--text-white)', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>
                                Select Break Type
                            </Typography>
                            <CustomeTags
                                label={''}
                                data={breakType}
                                value={selectBreakType}
                                // error={error}
                                keyName={'break'}
                                onClick={handleBreakSelect}
                            />
                        </Box>
                    )}

                    {/* Button Section */}
                    <Box className="scoreboard_dialog_button_section">
                        {buttonConfigs.map(({ condition, onClick, title, disabled }, index) => (
                            condition && <RenderButton key={index} onClick={onClick} title={title} disabled={disabled} />
                        ))}
                    </Box>

                </Box>
            </Dialog>
        </>
    );
};

export default ScoreBoard;