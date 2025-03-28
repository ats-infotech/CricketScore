'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import CommentaryPage from "@/pages/Commentary/Commentary"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import './Live.css'
import { useRouter } from "next/navigation"
import ExtraRunSection from "@/components/common/commonUi/ExtrasSection/ExtraSection"


const CommonTable = ({ header, data, playerscore, playerName, data2, playerName2, activeStrike, type, icon, maiden, post }) => {

    const OverNo = playerscore?.legalBall === 6 ? playerscore?.bowleroverNo + 1 : playerscore?.bowleroverNo
    const BallNo = playerscore?.legalBall === 6 ? 0 : playerscore?.legalBall
    const FinalBowingling = OverNo + (BallNo / 10)
    const Economy = FinalBowingling && playerscore?.bowlerrun ? (playerscore?.bowlerrun / FinalBowingling) : 0

    return (
        <Box className='live_table_section'>
            <TableContainer className="live_table_container">
                <Table className="live_table" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {header.map((item, index) => (
                                <TableCell key={index} className="table-cell">
                                    {item.icon && <SvgIcon id={item.icon} />}
                                    {item.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {data.map((field) => (
                                <TableCell key={field} className="table-cell data">
                                    {field === 'playerName' ?
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {activeStrike === 1 && <Box className={`live_player_table_icon_section ${type !== 'bowler' && activeStrike === 1 && 'active'}`} >
                                                <SvgIcon id={icon} style={{ color: type !== 'bowler' && activeStrike === 1 ? "white" : "black" }} />
                                            </Box>}
                                            {/* <Typography className="player-name">{playerName ? playerName : 'TBD'}</Typography> */}
                                            <Typography className="player-name">{playerName ? `${playerName}${(playerName === post?.team1Captain?.playerName || playerName === post?.team2Captain?.playerName) ? ' (C)' : ''}${(playerName === post?.team1WicketKeeper?.playerName || playerName === post?.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}` : 'TBD'}</Typography>
                                        </Box>
                                        : field === 'maiden' ? maiden
                                            : (field === 'batter1sr' || field === 'batter2sr')
                                                ? Math.floor(playerscore?.[field] || 0)
                                                : field === 'bowlereco'
                                                    ? (Economy ? Economy.toFixed(2) : 0) :
                                                    field === 'bowleroverNo' && FinalBowingling ? FinalBowingling :
                                                        field === 'bowleroverNo' && !FinalBowingling ? 0 : playerscore?.[field] || 0
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {data2?.map((field) => (
                                <TableCell key={field} className="table-cell data">
                                    {field === 'playerName' ?
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {activeStrike === 2 && <Box className={`live_player_table_icon_section ${type !== 'bowler' && activeStrike === 2 && 'active'}`} >
                                                <SvgIcon id={icon} style={{ color: type !== 'bowler' && activeStrike === 2 ? "white" : "black" }} />
                                            </Box>}
                                            <Typography className="player-name">{playerName2 ? `${playerName2}${(playerName2 === post?.team1Captain?.playerName || playerName2 === post?.team2Captain?.playerName) ? ' (C)' : ''}${(playerName2 === post?.team1WicketKeeper?.playerName || playerName2 === post?.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}` : 'TBD'}</Typography>
                                        </Box>
                                        : (field === 'batter1sr' || field === 'batter2sr')
                                            ? Math.floor(playerscore?.[field] || 0)
                                            : playerscore?.[field] || 0
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const CommonPlayerSection = ({ name, run, ball, activeStrike, type, icon, post }) => {
    return (
        <Box className={`live_common_player_main_section ${type === 'non-striker' && 'nonstriker'}`} >
            <Box className='live_player_section'>
                <Box className={`live_player_icon_section ${type !== 'bowler' && activeStrike && 'active'}`} >
                    <SvgIcon id={icon} style={{ color: type !== 'bowler' && activeStrike ? "white" : "black" }} />
                </Box>
                <Box>
                    <Typography variant="body2">{`${name}${(name === post?.team1Captain?.playerName || name === post?.team2Captain?.playerName) ? ' (C)' : ''}${(name === post?.team1WicketKeeper?.playerName || name === post?.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}`}</Typography>
                    <Box className={`live_player_live_section ${type === 'bowler' && 'bowler'}`}>
                        <Typography variant="body2">{`${run}`}</Typography>
                        <Typography variant="body2">{`(${ball})`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const calculateMaidens = (firstInnings, playerData, playerOnField) => {
    let maidens = 0;

    const bowler = playerData?.find((item) => item.playerName === playerOnField);

    firstInnings.forEach((overData) => {
        if (overData?.bowlerId === bowler?.id) {
            const intKeysValues = Object.keys(overData)
                .filter(key => !isNaN(key))
                .map(key => overData[key]);

            if (intKeysValues.every(value =>
                value === "0" ||
                value === "W" ||
                value === "LB" ||
                value === "1LB" ||
                value === "2LB" ||
                value === "3LB" ||
                value === "4LB" ||
                value === "5LB" ||
                value === "6LB"
            )) {
                maidens += 1;
            }
        }
    });

    return maidens;
};


const LiveMatch = ({ matchData, playerData, teamData, tournamentData }) => {

    const [playerOnField, setPlayerOnField] = useState({
        striker: "",
        strikerimage: "",
        strikerletter: "",
        strikercolor: "",
        nonStriker: "",
        nonStrikerimage: "",
        nonStrikerletter: "",
        nonStrikercolor: "",
        bowler: "",
        bowlerimage: "",
        bowlerletter: "",
        bowlercolor: ""
    })
    const [maiden, setMaiden] = useState(0)
    const router = useRouter()
    const [Extras, setExtras] = useState({
        WD: 0,
        NB: 0,
        LB: 0,
        PR: 0,
        NR: 0
    })
    const [playersPost, setPlayersPost] = useState({
        team1Captain: '',
        team1WicketKeeper: '',
        team2Captain: '',
        team2WicketKeeper: ''
    })
    let CurrentInnings = matchData?.currentInnings
    let firstInning = matchData?.firstInnings
    let secondInning = matchData?.secondInnings
    let thirdInning = matchData?.superOverFirstInnings
    let fourthInning = matchData?.superOverSecondInnings
    let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false

    const overlength = matchData?.status === 4 ? secondInning?.Completedovers[secondInning?.Completedovers?.length - 1]?.totalBall :
        CurrentInnings === 1 && firstInning?.Currentover?.[0]?.totalBall ? firstInning?.Currentover?.[0]?.totalBall :
            CurrentInnings === 2 && secondInning?.Currentover?.[0]?.totalBall ? secondInning?.Currentover?.[0]?.totalBall :
                CurrentInnings === 3 && thirdInning?.Currentover?.[0]?.totalBall ? thirdInning?.Currentover?.[0]?.totalBall :
                    CurrentInnings === 4 && fourthInning?.Currentover?.[0]?.totalBall ? fourthInning?.Currentover?.[0]?.totalBall : 6

    useEffect(() => {
        if (matchData?.status !== 4) {
            const striker = playerData.filter(player => player.id === matchData?.playerselection?.striker)
            const nonStriker = playerData.filter(player => player.id === matchData?.playerselection?.nonStriker)
            const bowler = playerData.filter(player => player.id === matchData?.playerselection?.bowler)
            setPlayerOnField({
                striker: striker[0]?.playerName,
                strikerimage: striker[0]?.playerImage,
                strikerletter: striker[0]?.letter,
                strikercolor: striker[0]?.playerColor,
                nonStriker: nonStriker[0]?.playerName,
                nonStrikerimage: nonStriker[0]?.playerImage,
                nonStrikerletter: nonStriker[0]?.letter,
                nonStrikercolor: nonStriker[0]?.playerColor,
                bowler: bowler[0]?.playerName,
                bowlerimage: bowler[0]?.playerImage,
                bowlerletter: bowler[0]?.letter,
                bowlercolor: bowler[0]?.playerColor
            })
        }
        // else if (matchData?.status === 4) {
        //     router.push(`/match/${matchData?.id}/cricketbox`)
        // }

    }, [matchData?.playerselection])

    useEffect(() => {
        const Team1Captain = playerData.filter(player => player.id === matchData?.post?.team1Captain)?.[0]
        const Team1WicketKeeper = playerData.filter(player => player.id === matchData?.post?.team1WicketKeeper)?.[0]
        const Team2Captain = playerData.filter(player => player.id === matchData?.post?.team2Captain)?.[0]
        const Team2WicketKeeper = playerData.filter(player => player.id === matchData?.post?.team2WicketKeeper)?.[0]
        setPlayersPost({
            team1Captain: Team1Captain,
            team1WicketKeeper: Team1WicketKeeper,
            team2Captain: Team2Captain,
            team2WicketKeeper: Team2WicketKeeper
        })
    }, [matchData])

    useEffect(() => {
        const ExtraRuns = CurrentInnings === 1 ? firstInning?.Extras
            : CurrentInnings === 2 ? secondInning?.Extras
                : CurrentInnings === 3 ? thirdInning?.Extras
                    : fourthInning?.Extra
        let WDs = ExtraRuns?.filter((items) => items.reason === "WD")
        let LBs = ExtraRuns?.filter((items) => items.reason === "LB")
        let NBs = ExtraRuns?.filter((items) => items.reason === "NB")
        let PRs = ExtraRuns?.filter((items) => items.reason === "PR")
        let NRs = ExtraRuns?.filter((items) => items.reason === "NR")
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
    }, [CurrentInnings])

    const CurrentOverScore = matchData?.status === 4 && !isTestMatch ? secondInning?.Completedovers[secondInning?.Completedovers?.length - 1] :
        CurrentInnings === 1 ? firstInning?.Currentover?.[0] :
            CurrentInnings === 2 ? secondInning?.Currentover?.[0] :
                CurrentInnings === 3 ? thirdInning?.Currentover?.[0] :
                    CurrentInnings === 4 ? fourthInning?.Currentover?.[0] : 6

    useEffect(() => {
        if (matchData?.status !== 4) {
            const firstInnings = [
                ...(firstInning?.Completedovers ?? []),
                ...(secondInning?.Completedovers ?? [])
            ];

            const secondInnings = [
                ...(thirdInning?.Completedovers ?? []),
                ...(fourthInning?.Completedovers ?? [])
            ]

            if (playerOnField.bowler !== '' && playerData && (CurrentInnings < 3 || !isTestMatch)) {
                const maidens = calculateMaidens(firstInnings, playerData, playerOnField.bowler)
                setMaiden(maidens)
            }
            if (playerOnField.bowler !== '' && playerData && CurrentInnings > 2 && isTestMatch) {
                const maidens = calculateMaidens(secondInnings, playerData, playerOnField.bowler)
                setMaiden(maidens)
            }
        } else if (matchData?.status === 4) {
            router.push(`/match/${matchData?.id}/summary`)
        }
    }, [playerOnField.bowler])

    const getBallColor = (score) => {
        if (score === "4" || score === "6") {
            return 'var(--boundary)';
        }
        if (score.includes("WD") || score.includes("NB")) {
            return 'var(--extra-run)';
        }
        if (score.includes("W")) {
            return 'var(--wicket)';
        }
        return 'var(--normal-ball)';
    };

    const getBallSize = (score) => {
        if (score.includes("WD+W") || score.includes("NB+W")) {
            return "7px";
        }
        return '9px'
    }

    const ballCircles = [];

    for (let i = 0; i < overlength; i++) {
        const score = CurrentOverScore ? CurrentOverScore[i + 1] : '';

        const ballColor = score ? getBallColor(score) : 'lightgray';
        const TextSize = score ? getBallSize(score) : '10px'

        ballCircles.push(
            <div
                key={i}
                style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    backgroundColor: i < overlength ? ballColor : 'lightgray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: i < overlength ? TextSize : '10px',
                }}
            >
                {score !== null ? score : ''}
            </div>
        );
    }

    const activeStrike = CurrentOverScore?.strike

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

    const batter1data = ['playerName', 'batter1run', 'batter1balls', 'batter1four', 'batter1six', 'batter1sr']
    const batter2data = ['playerName', 'batter2run', 'batter2balls', 'batter2four', 'batter2six', 'batter2sr']
    const bowlerdata = ['playerName', 'bowleroverNo', 'bowlerrun', 'maiden', 'bowlerwicket', 'bowlereco']

    return (
        <>
            {matchData?.status !== 4 && <Box className='live_main_section activeAnimation'>

                <Box className='live_batter_player_card'>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <CommonPlayerSection name={playerOnField.striker ?? 'TBD'} post={playersPost} icon={"striker"} run={CurrentOverScore?.batter1run ?? 0} ball={CurrentOverScore?.batter1balls ?? 0} activeStrike={activeStrike === 1} />
                        <CommonPlayerSection type={"non-striker"} icon={"striker"} post={playersPost} name={playerOnField.nonStriker ?? 'TBD'} run={CurrentOverScore?.batter2run ?? 0} ball={CurrentOverScore?.batter2balls ?? 0} activeStrike={activeStrike === 2} />
                    </Box>
                    <Box className='silver-gradient-line'></Box>
                    <Box>
                        <CommonPlayerSection type={"bowler"} name={playerOnField.bowler ?? 'TBD'} post={playersPost}
                            run={`${CurrentOverScore?.bowlerrun ?? 0} / ${CurrentOverScore?.bowlerwicket ?? 0}`}
                            ball={`${(CurrentOverScore?.bowleroverNo === 0 || CurrentOverScore?.bowleroverNo) && CurrentOverScore?.legalBall === 6 ? CurrentOverScore?.bowleroverNo + 1 : CurrentOverScore?.bowleroverNo && CurrentOverScore?.legalBall !== 6 ? CurrentOverScore?.bowleroverNo : 0}.${CurrentOverScore?.legalBall && CurrentOverScore?.legalBall !== 6 ? CurrentOverScore?.legalBall : 0}`}
                            icon={"ball"} />
                    </Box>
                </Box>

                <Box className='live_balls_section'>
                    <Box className="live-gradient-line"></Box>
                    <Box className='live_balls' sx={{ paddingInline: '10px' }}>{ballCircles}</Box>
                    <Box className="live-gradient-line"></Box>
                </Box>

                <ExtraRunSection totalLBRuns={Extras?.LB} totalNBRuns={Extras.NB} totalWDRuns={Extras.WD} totalNRRuns={Extras.NR} totalPRRuns={Extras.PR} />

                <CommonTable header={batterheader} data={batter1data} playerscore={CurrentOverScore} post={playersPost} playerName={playerOnField.striker} data2={batter2data} playerName2={playerOnField.nonStriker} activeStrike={activeStrike} icon={"striker"} />

                <CommonTable header={bowlerheader} data={bowlerdata} playerscore={CurrentOverScore} post={playersPost} playerName={playerOnField.bowler} type={"bowler"} icon={"ball"} maiden={maiden} />

                <CommentaryPage matchData={matchData} teamData={teamData} playerData={playerData} type={'live'} tournamentData={tournamentData} />

            </Box>}
        </>
    )
}

export default LiveMatch