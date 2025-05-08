'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { CommonText } from "@/components/common/commonText"
import ExtraRunSection from "@/components/common/commonUi/ExtrasSection/ExtraSection"
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import './Scorecard.css'
import SwitchSelect from "@/components/common/commonUi/SwitchSelect/SwitchSelect"
import { teamsState } from "@/redux/slices/teamSlice"
import { useSelector } from "react-redux"

const BattingTable = ({ header, strikerdata, nonstrikerdata, strikeplayer, nonstrikeplayer, playerstats, outbatterdata, playerdata, outplayerstats, show, length, onClick, status, Extras, winner, BattingOrder, post, playingPlayers }) => {

    const strikebatter = playerdata?.filter(players => players?.playerName === strikeplayer)[0]
    const nonstrikebatter = playerdata?.filter(players => players?.playerName === nonstrikeplayer)[0]
    const topBatters = BattingOrder && BattingOrder?.length > 0 && BattingOrder?.slice(0, 3);
    let visibleOutPlayerStats = outplayerstats;
    if (!show && status === 4) {
        visibleOutPlayerStats = outplayerstats?.filter((player) => topBatters?.includes(player.BatterId));
    } else if (!show) {
        visibleOutPlayerStats = outplayerstats?.slice(0, length);
    }
    const WDs = Extras ? Extras?.filter((items) => items.reason === 'WD') : [];
    const LBs = Extras ? Extras?.filter((items) => items.reason === 'LB') : [];
    const BYEs = Extras ? Extras?.filter((items) => items.reason === 'BYE') : [];
    const NBs = Extras ? Extras?.filter((items) => items.reason === 'NB') : [];
    const PRs = Extras ? Extras?.filter((items) => items.reason === 'PR') : [];
    const NRs = Extras ? Extras?.filter((items) => items.reason === 'NR') : [];
    let totalWDRuns = WDs?.reduce((sum, item) => sum + item.runs, 0);
    let totalLBRuns = LBs?.reduce((sum, item) => sum + item.runs, 0);
    let totalBYERuns = BYEs?.reduce((sum, item) => sum + item.runs, 0);
    let totalNBRuns = NBs?.reduce((sum, item) => sum + item.runs, 0);
    let totalPRRuns = PRs?.reduce((sum, item) => sum + item.runs, 0);
    let totalNRRuns = NRs?.reduce((sum, item) => sum + item.runs, 0);

    const allBatters = [
        ...((status !== 4 && !winner) && strikebatter ? [{ ...strikebatter, type: 'striker' }] : []),
        ...((status !== 4 && !winner) && nonstrikebatter ? [{ ...nonstrikebatter, type: 'nonstriker' }] : []),
        ...(visibleOutPlayerStats?.map((items) => {
            const playerName = playerdata?.find((p) => p.id === items.BatterId)?.playerName || {};
            const sr = (items?.run / items?.balls) * 100;
            return { ...items, playerName, sr, type: 'out' };
        }) || [])
    ];

    const sortedBatters = allBatters
        ?.map((batter) => {
            const isNotOut = batter?.reason === "Not Out";
            const wasNotOut = !visibleOutPlayerStats?.some((player) => player.BatterId === batter.id);
            const shouldHaveAsterisk = isNotOut || (wasNotOut && batter?.type !== "out");

            return {
                ...batter,
                id: batter?.id || batter?.BatterId,
                playerName: shouldHaveAsterisk ? `${batter?.playerName}*` : batter?.playerName
            };
        })
        ?.sort((a, b) => {
            const indexA = BattingOrder?.indexOf(a.id);
            const indexB = BattingOrder?.indexOf(b.id);

            return (indexA === -1 ? BattingOrder?.length : indexA) -
                (indexB === -1 ? BattingOrder?.length : indexB);
        });

    return (
        <Box className='user_scorecard_table_section'>
            <TableContainer className="user_scorecard_table_container">
                <Table className="user_scorecard_table" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {header.map((item, index) => (
                                <TableCell key={index} className="user_scorecard_table-cell">
                                    {item.icon && <SvgIcon id={item.icon} />}
                                    {item.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            sortedBatters.map((batter, i) => {
                                const dataHeader = batter.type === "striker" ? strikerdata
                                    : batter.type === "nonstriker" ? nonstrikerdata
                                        : outbatterdata;

                                return (
                                    <React.Fragment key={i}>
                                        <TableRow>
                                            {dataHeader.map((field) => {
                                                let cellContent;

                                                if (field === 'playerName') {
                                                    const isCaptain = [post.team1Captain, post.team2Captain].some(captain => captain?.playerName === batter?.playerName);
                                                    const isWicketKeeper = [post.team1WicketKeeper, post.team2WicketKeeper].some(wk => wk?.playerName === batter?.playerName);

                                                    cellContent = (
                                                        <Box className="user_post_image_main_section">
                                                            <Typography className="player-name">
                                                                {`${batter?.playerName}${isCaptain ? ' (C)' : ''}${isWicketKeeper ? ' (Wk)' : ''}`}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                } else if (field === 'batter1sr' && batter.type === 'striker') {
                                                    cellContent = Math.floor(playerstats?.batter1sr || 0);
                                                } else if (field === 'batter2sr' && batter.type === 'nonstriker') {
                                                    cellContent = Math.floor(playerstats?.batter2sr || 0);
                                                } else if (field === 'sr') {
                                                    cellContent = Math.floor(batter?.sr || 0);
                                                } else {
                                                    cellContent = batter.type === 'striker' || batter.type === 'nonstriker' ? playerstats?.[field] || 0 : batter?.[field] || 0;
                                                }

                                                return (
                                                    <TableCell key={field} className="user_scorecard_table-cell data">{cellContent}</TableCell>
                                                );
                                            })}
                                        </TableRow>
                                        {batter?.type === 'out' && batter?.reason !== 'Not Out' && (
                                            <TableRow>
                                                <TableCell colSpan={dataHeader.length} sx={{ padding: '0px 6px 5px 6px' }} className="user_scorecard_out_table-cell data">
                                                    {(() => {

                                                        const bowler = playerdata.find((p) => p.id === batter.bowler)?.playerName || 'bowler';
                                                        const fielder = playerdata.find((p) => p.id === batter.fielder)?.playerName || 'fielder';
                                                        const fielderName = fielder
                                                            ? playingPlayers?.includes(fielder)
                                                                ? fielder
                                                                : `(sub) ${fielder}`
                                                            : 'fielder';

                                                        switch (batter?.reason) {
                                                            case "LBW":
                                                                return `lbw b ${bowler}`;
                                                            case "Catch":
                                                                return `${fielderName === bowler ? `c & b ${bowler}` : `c ${fielderName} b ${bowler}`}`;
                                                            case "Stumped":
                                                                return `st ${fielderName} b ${bowler}`;
                                                            case "Run Out":
                                                                return `run out ${fielderName}`;
                                                            case "Bowled":
                                                                return `b ${bowler}`;
                                                            case "Hit Wicket":
                                                                return `hit wicket b ${bowler}`;
                                                            case "Retired Hurt":
                                                                return "Retired Hurt";
                                                            default:
                                                                return "";
                                                        }
                                                    })()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <ExtraRunSection totalLBRuns={totalLBRuns} totalWDRuns={totalWDRuns} totalBYERuns={totalBYERuns} totalNBRuns={totalNBRuns} totalPRRuns={totalPRRuns} totalNRRuns={totalNRRuns} type={'scorecard'} />
            {outplayerstats?.length > length && (
                <Button onClick={onClick} className="user_scorecard_button">
                    {show ? 'Show Less' : 'Show More'}
                    {show ? <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} style={{ transform: 'rotate(180deg)' }} /> : <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} />}
                </Button>
            )}
        </Box>
    );
};

const BowlingTable = ({ header, data, currentOver, completedOver, playerdata, currentbowler, show, length, onClick, status, post }) => {

    const calculateMaiden = (bowlerId) => {
        let maidenCount = 0;
        if (Array.isArray(completedOver)) {
            completedOver?.forEach((overData) => {
                if (overData.bowlerId === bowlerId && overData.legalBall === 6) {
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
                        maidenCount += 1;
                    }
                }
            });
        }
        return isNaN(maidenCount) ? 0 : maidenCount;
    };
    const visibleOverPlayerStats = !show ? completedOver?.slice(0, length) : completedOver;
    const uniqueBowlersCount = !completedOver ? 1 : new Set(completedOver?.map(over => over.bowlerId)).size;

    return (
        <Box className='user_scorecard_table_section'>
            <TableContainer className="user_scorecard_table_container">
                <Table className="user_scorecard_table" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {header.map((item, index) => (
                                <TableCell key={index} className="user_scorecard_table-cell">
                                    {item.icon && <SvgIcon id={item.icon} />}
                                    {item.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {
                                (status !== 4) && currentOver !== undefined && data.map((field) => {
                                    const economy = currentOver?.bowlerrun / (currentOver?.bowleroverNo + (currentOver?.legalBall === 6 ? 1 : currentOver?.legalBall / 10));
                                    let maiden = 0;

                                    if (Array.isArray(completedOver)) {
                                        completedOver?.forEach((overData) => {
                                            if (overData.bowlerId === currentOver?.bowlerId) {
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
                                                    maiden += 1;
                                                }
                                            }
                                        });
                                    }
                                    const OverNo = currentOver?.legalBall === 6 ? currentOver?.bowleroverNo + 1 : currentOver?.bowleroverNo || 0
                                    const BallNo = currentOver?.legalBall === 6 ? 0 : currentOver?.legalBall || 0

                                    return (
                                        <TableCell key={field} className="user_scorecard_table-cell data">
                                            {field === 'playerName' ?
                                                <Box className='user_post_image_main_section'>
                                                    <Typography className="player-name">
                                                        {`${currentbowler}*${(currentbowler === post.team1Captain?.playerName || currentbowler === post.team2Captain?.playerName) ? ' (C)' : ''}${(currentbowler === post.team1WicketKeeper?.playerName || currentbowler === post.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}`}
                                                    </Typography>
                                                </Box>
                                                : field === 'maiden' ? maiden === NaN ? 0 : maiden
                                                    : field === 'bowlereco'
                                                        ? (economy ? economy.toFixed(2) : 0)
                                                        : field === 'bowleroverNo' && OverNo + (BallNo / 10) > 0 ? OverNo + (BallNo / 10)
                                                            : field === 'bowleroverNo' && OverNo + (BallNo / 10) < 0 ? 0 : currentOver?.[field] || 0
                                            }
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                        {
                            Array.isArray(visibleOverPlayerStats) && visibleOverPlayerStats?.length > 0 && visibleOverPlayerStats?.reduce((acc, items) => {
                                const existingBowler = acc.find(item => item?.bowlerId === items?.bowlerId);
                                if (!existingBowler && (status !== 4 && items?.bowlerId !== currentOver?.bowlerId)) {
                                    acc.push(items);
                                } else if (status === 4 && !existingBowler) {
                                    acc.push(items);
                                }
                                return acc;
                            }, []).map((items, i) => {
                                const playerName = playerdata?.filter((item) => item?.id === items?.bowlerId)[0]?.playerName;
                                const lastOver = completedOver?.filter((bowler) => bowler.bowlerId === items.bowlerId).pop();
                                const overlength = lastOver.legalBall === 6 ? completedOver?.filter((bowler) => bowler.bowlerId === items.bowlerId)?.length
                                    : (completedOver?.filter((bowler) => bowler.bowlerId === items.bowlerId)?.length - 1) + (lastOver?.legalBall / 10);
                                const economy = lastOver?.bowlerrun / overlength;
                                const maiden = calculateMaiden(items?.bowlerId);

                                return (
                                    <TableRow key={i}>
                                        {data.map((field) => (
                                            <TableCell key={field} className="user_scorecard_table-cell data">
                                                {field === 'playerName' ? (
                                                    <Box className='user_post_image_main_section'>
                                                        <Typography className="player-name">
                                                            {`${playerName}${(playerName === post.team1Captain?.playerName || playerName === post.team2Captain?.playerName) ? ' (C)' : ''}${(playerName === post.team1WicketKeeper?.playerName || playerName === post.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}`}
                                                        </Typography>
                                                    </Box>
                                                ) : field === 'maiden' ? (
                                                    maiden === NaN ? 0 : maiden
                                                ) : field === 'bowlereco' ? (
                                                    economy ? economy.toFixed(2) : 0
                                                ) : field === 'bowleroverNo' ? overlength : (
                                                    lastOver?.[field] || 0
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {uniqueBowlersCount > length && (
                <Button onClick={onClick} className="user_scorecard_button">
                    {show ? 'Show Less' : 'Show More'}
                    {show ? <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} style={{ transform: 'rotate(180deg)' }} /> : <SvgIcon id={'down-arrow'} height={18} width={18} color={'var(--text-lightgrey)'} />}
                </Button>
            )}
        </Box>
    );
}

const Scorecard = ({ matchData, teamData, playerData, tournamentData }) => {

    const [currentTeam, setCurrentTeam] = useState(0)
    const [inningsTeam, setInningsTeam] = useState([]);
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const [tossWinner, setTossWinner] = useState({
        tossWinner: '',
        battingSide: '',
        bowlingSide: ''
    })
    const [innings, setInnings] = useState()
    const [showAllBatter, setShowAllBatter] = useState(false);
    const [showAllBowler, setShowAllBowler] = useState(false);
    const [playingPlayers, setPlayingPlayers] = useState([])
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
    const [playersPost, setPlayersPost] = useState({
        team1Captain: '',
        team1WicketKeeper: '',
        team2Captain: '',
        team2WicketKeeper: ''
    })
    const teamRef = useRef(null);
    const team_data = useSelector(teamsState)
    const CurrentInnings = matchData?.currentInnings
    let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
    const firstInnings = matchData?.firstInnings
    const secondInnings = matchData?.secondInnings
    const thirdInnings = matchData?.superOverFirstInnings
    const fourthInnings = matchData?.superOverSecondInnings
    let superOverCountEven = matchData?.superOverCount ? matchData?.superOverCount % 2 === 0 : undefined
    let isFirstBattingTeamPlayingSuperover = isTestMatch && matchData?.followOn !== "Follow On" && CurrentInnings === 3 ? true
        : isTestMatch && matchData?.followOn === "Follow On" && CurrentInnings === 3 ? false
            : isTestMatch && matchData?.followOn !== "Follow On" && CurrentInnings === 4 ? false
                : isTestMatch && matchData?.followOn === "Follow On" && CurrentInnings === 4 ? true
                    : (CurrentInnings === 2 || CurrentInnings === 1) ? false
                        : !matchData?.superOverCount && CurrentInnings === 4 ? true
                            : matchData?.superOverCount && superOverCountEven && CurrentInnings === 3 ? false
                                : true

    let isSecondBattingTeamPlayingSuperover = isTestMatch && matchData?.followOn !== "Follow On" && CurrentInnings === 3 ? false
        : isTestMatch && matchData?.followOn === "Follow On" && CurrentInnings === 3 ? true
            : isTestMatch && matchData?.followOn !== "Follow On" && CurrentInnings === 4 ? true
                : isTestMatch && matchData?.followOn === "Follow On" && CurrentInnings === 4 ? false
                    : (CurrentInnings === 2 || CurrentInnings === 1) ? false
                        : !matchData?.superOverCount && CurrentInnings === 3 ? true
                            : matchData?.superOverCount && superOverCountEven && CurrentInnings === 3 ? true : false

    const CurrentOverScore = matchData?.status === 4 && CurrentInnings === 2 ? secondInnings?.Completedovers[secondInnings?.Completedovers?.length - 1] :
        CurrentInnings === 1 ? firstInnings?.Currentover?.[0] :
            CurrentInnings === 2 ? secondInnings?.Currentover?.[0] :
                CurrentInnings === 3 ? thirdInnings?.Currentover?.[0] :
                    CurrentInnings === 4 ? fourthInnings?.Currentover?.[0] : []

    const overlength = matchData?.status === 4 && CurrentInnings === 2 && !isTestMatch ? secondInnings?.Completedovers :
        CurrentInnings === 1 ? firstInnings?.Completedovers :
            CurrentInnings === 2 ? secondInnings?.Completedovers :
                isTestMatch && CurrentInnings === 3 ? thirdInnings?.Completedovers :
                    isTestMatch && CurrentInnings === 4 ? fourthInnings?.Completedovers : []

    const Wicketlength = CurrentInnings === 1 ? firstInnings?.Wickets :
        CurrentInnings === 2 ? secondInnings?.Wickets :
            CurrentInnings === 3 ? thirdInnings?.Wickets :
                CurrentInnings === 4 ? fourthInnings?.Wickets : []

    const Extras = CurrentInnings === 1 ? firstInnings?.Extras :
        CurrentInnings === 2 ? secondInnings?.Extras :
            CurrentInnings === 3 ? thirdInnings?.Extras :
                CurrentInnings === 4 ? fourthInnings?.Extras : []

    const BattingOrder = CurrentInnings === 1 ? firstInnings?.BattingOrder?.[0] :
        CurrentInnings === 2 ? secondInnings?.BattingOrder?.[0] :
            CurrentInnings === 3 ? thirdInnings?.BattingOrder?.[0] :
                CurrentInnings === 4 ? fourthInnings?.BattingOrder?.[0] : []

    useEffect(() => {
        let team1player = playerData?.filter(item => item?.teamId === team1?.id);
        let team1XIplayer = matchData?.selectedPlayer?.team1;
        let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
        let team2player = playerData?.filter(item => item?.teamId === team2?.id);
        let team2XIplayer = matchData?.selectedPlayer?.team2;
        let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
        let playersId = [...commonPlayerTeam1.map(player => player.playerName), ...commonPlayerTeam2.map(player => player.playerName)]
        setPlayingPlayers(playersId)
    }, [playerData, team1, team2])

    useEffect(() => {
        if (teamRef.current) {
            teamRef.current.scrollTop = 0;
            setShowAllBatter(false)
            setShowAllBowler(false)
        }
    }, [currentTeam]);

    const handleShowMoreBatter = () => {
        setShowAllBatter(!showAllBatter);
    };

    const handleShowMoreBowler = () => {
        setShowAllBowler(!showAllBowler);
    };

    useEffect(() => {
        const Team1Captain = playerData.filter(player => player.id === matchData?.post?.team1Captain)?.[0]
        const Team1WicketKeeper = playerData.filter(player => player.id === matchData?.post?.team1WicketKeeper)?.[0]
        const Team2Captain = playerData.filter(player => player.id === matchData?.post?.team2Captain)?.[0]
        const Team2WicketKeeper = playerData.filter(player => player.id === matchData?.post?.team2WicketKeeper)?.[0]
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
        setPlayersPost({
            team1Captain: Team1Captain,
            team1WicketKeeper: Team1WicketKeeper,
            team2Captain: Team2Captain,
            team2WicketKeeper: Team2WicketKeeper
        })
    }, [matchData, team_data])

    useEffect(() => {
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

    }, [matchData?.playerselection])

    useEffect(() => {
        setInnings(matchData?.currentInnings)
    }, [matchData, matchData?.currentInnings])

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
        const teams = [];
        if (innings === 1) {
            setCurrentTeam(0)
            teams.push(tossWinner?.battingSide)
        } else if (innings === 2 || innings === 3 || innings === 4) {
            if (innings === 2) {
                setCurrentTeam(1)
            } else if (isFirstBattingTeamPlayingSuperover) {
                setCurrentTeam(0)
            } else if (isSecondBattingTeamPlayingSuperover) {
                setCurrentTeam(1)
            }
            teams.push(tossWinner?.battingSide, tossWinner?.bowlingSide)
        }
        setInningsTeam(teams)
    }, [innings, tossWinner, matchData]);

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
    const outbatterdata = ['playerName', 'run', 'balls', 'four', 'six', 'sr']

    const currentBattingTableProps = {
        header: batterheader,
        nonstrikerdata: batter2data,
        strikerdata: batter1data,
        strikeplayer: playerOnField.striker,
        nonstrikeplayer: playerOnField.nonStriker,
        show: showAllBatter,
        length: (matchData?.status !== 4 && !matchData?.matchWinner) ? 1 : 3,
        playerstats: CurrentOverScore,
        playerdata: playerData,
        outbatterdata: outbatterdata,
        outplayerstats: Wicketlength,
        status: matchData?.status,
        onClick: handleShowMoreBatter,
        Extras: Extras,
        winner: matchData?.matchWinner,
        BattingOrder: BattingOrder,
        post: playersPost,
        playingPlayers: playingPlayers
    };

    const completedBattingTableProps = {
        header: batterheader,
        outbatterdata: outbatterdata,
        winner: matchData?.matchWinner,
        post: playersPost,
        status: matchData?.status,
        outplayerstats: currentTeam === 0 && firstInnings?.Wickets ? firstInnings?.Wickets : currentTeam === 1 && secondInnings?.Wickets ? secondInnings?.Wickets : [],
        playerdata: playerData,
        show: showAllBatter,
        length: 3,
        onClick: handleShowMoreBatter,
        BattingOrder: currentTeam === 0 ? firstInnings?.BattingOrder?.[0] : currentTeam === 1 ? secondInnings?.BattingOrder?.[0] : [],
        Extras: currentTeam === 0 && firstInnings?.Extras ? firstInnings?.Extras : currentTeam === 1 && secondInnings?.Extras ? secondInnings?.Extras : [],
        playingPlayers: playingPlayers
    };

    const completedSuperOverBattingTableProps = {
        header: batterheader,
        outbatterdata: outbatterdata,
        winner: matchData?.matchWinner,
        post: playersPost,
        status: matchData?.status,
        outplayerstats: thirdInnings?.Wickets ? thirdInnings?.Wickets : [],
        playerdata: playerData,
        show: showAllBatter,
        length: 3,
        onClick: handleShowMoreBatter,
        BattingOrder: thirdInnings?.BattingOrder?.[0],
        Extras: thirdInnings?.Extras ? thirdInnings?.Extras : [],
        playingPlayers: playingPlayers
    };

    const currentBowlingTableProps = {
        header: bowlerheader,
        data: bowlerdata,
        currentOver: CurrentOverScore,
        playerdata: playerData,
        post: playersPost,
        completedOver: isTestMatch && (CurrentInnings === 3 || CurrentInnings === 4) ? overlength : CurrentInnings === 1 || CurrentInnings === 2 ? overlength : CurrentInnings === 3 ? thirdInnings?.Currentover : CurrentInnings === 4 && matchData?.status === 4 ? fourthInnings?.Currentover : '',
        currentbowler: playerOnField.bowler,
        show: showAllBowler,
        length: matchData?.status === 4 ? 2 : 1,
        onClick: handleShowMoreBowler,
        status: matchData?.status,
        playingPlayers: playingPlayers
    }

    const completedBowlingTableProps = {
        header: bowlerheader,
        data: bowlerdata,
        playerdata: playerData,
        post: playersPost,
        completedOver: currentTeam === 0 ? firstInnings?.Completedovers : currentTeam === 1 ? secondInnings?.Completedovers : [],
        show: showAllBowler,
        length: 2,
        onClick: handleShowMoreBowler,
        playingPlayers: playingPlayers
    }

    const completedSuperoverBowlingTableProps = {
        header: bowlerheader,
        data: bowlerdata,
        playerdata: playerData,
        post: playersPost,
        completedOver: isTestMatch ? thirdInnings?.Completedovers : thirdInnings?.Currentover,
        show: showAllBowler,
        length: 1,
        onClick: handleShowMoreBowler,
        playingPlayers: playingPlayers
    }

    const FirstBattingTeam = CurrentInnings === 1 ? currentBattingTableProps : completedBattingTableProps
    const SecondBattingTeam = CurrentInnings === 2 ? currentBattingTableProps : completedBattingTableProps
    const FirstBowlingTeam = CurrentInnings === 1 ? currentBowlingTableProps : completedBowlingTableProps
    const SecondBowlingTeam = CurrentInnings === 2 ? currentBowlingTableProps : completedBowlingTableProps
    const FirstBattingTeamSuperover = isFirstBattingTeamPlayingSuperover ? currentBattingTableProps : completedSuperOverBattingTableProps
    const SecondBattingTeamSuperover = isSecondBattingTeamPlayingSuperover ? currentBattingTableProps : completedSuperOverBattingTableProps
    const FirstBowlingTeamSuperover = isSecondBattingTeamPlayingSuperover ? currentBowlingTableProps : completedSuperoverBowlingTableProps
    const SecondBowlingTeamSuperover = isFirstBattingTeamPlayingSuperover ? currentBowlingTableProps : completedSuperoverBowlingTableProps

    return (
        <Box className='user_scorecard_main_section'>
            <Box className='commentary_team_select_section'>
                <SwitchSelect options={inningsTeam} defaultSelected={currentTeam} onChange={(val) => setCurrentTeam(val)} />
            </Box>
            <Box ref={teamRef} className='user_currentteam_score'>
                {
                    currentTeam === 0 &&
                    <>
                        {isTestMatch && <Box className="scorecard_first_section">
                            <Typography variant="p">{'First Innings'}</Typography>
                            <Box className='scorecard_superover_lineargradient'></Box>
                        </Box>}
                        <BattingTable {...FirstBattingTeam} />
                        <BowlingTable {...FirstBowlingTeam} />
                        {
                            (isFirstBattingTeamPlayingSuperover || CurrentInnings === 4) &&
                            <Box className="scorecard_superover_section">
                                <Typography variant="p">{isTestMatch ? 'Second Innings' : 'Superover'}</Typography>
                                <Box className='scorecard_superover_lineargradient'></Box>
                                <BattingTable {...FirstBattingTeamSuperover} />
                                <BowlingTable {...SecondBowlingTeamSuperover} />
                            </Box>
                        }
                    </>
                }
                {
                    currentTeam === 1 &&
                    <>
                        {isTestMatch && <Box className="scorecard_first_section">
                            <Typography variant="p">{'First Innings'}</Typography>
                            <Box className='scorecard_superover_lineargradient'></Box>
                        </Box>}
                        <BattingTable {...SecondBattingTeam} />
                        <BowlingTable {...SecondBowlingTeam} />
                        {
                            (isSecondBattingTeamPlayingSuperover || CurrentInnings === 4) &&
                            <Box className="scorecard_superover_section">
                                <Typography variant="p">{isTestMatch ? 'Second Innings' : 'Superover'}</Typography>
                                <Box className='scorecard_superover_lineargradient'></Box>
                                <BattingTable {...SecondBattingTeamSuperover} />
                                <BowlingTable {...FirstBowlingTeamSuperover} />
                            </Box>
                        }
                    </>
                }
            </Box>
        </Box>
    )
}

export default Scorecard