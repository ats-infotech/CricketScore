'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { CommonText } from "@/components/common/commonText";
import Banner from "@/components/common/commonUi/Banner/Banner";
import CommonBack from "@/components/common/commonUi/commonBack";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { Edit, SwapHoriz } from "@mui/icons-material";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import fourgif from '../../assets/img/score/four.gif';
import sixgif from '../../assets/img/score/six.gif';
import wicketgif from '../../assets/img/score/wicket.gif';
import './Score.css';
import ExtraRunSection from "@/components/common/commonUi/ExtrasSection/ExtraSection";

const CommonPlayerSection = ({ name, run, ball, activeStrike, type, icon, onClick, balls, length, wickets, post }) => {
    return (
        <Box className={`score_common_player_main_section ${type === 'non-striker' && 'nonstriker'}`} >
            <Box className='score_player_info_section'>
                <Box>
                    <Box className={`score_player_icon_section ${type !== 'bowler' && activeStrike && 'active'}`} >
                        <SvgIcon id={icon} style={{ color: type !== 'bowler' && activeStrike ? "white" : "black" }} />
                    </Box>
                    {type === 'bowler' && balls.ballNo === 0 &&
                        <Box className={`score_player_icon_section`} sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={onClick} >
                            <Edit />
                        </Box>
                    }
                    {
                        type !== 'bowler' && length !== wickets &&
                        <Box className={`score_player_icon_section`} sx={{ cursor: 'pointer', marginTop: '5px' }} onClick={run === 0 && ball === 0 ? () => onClick(name, 'edit') : run > 0 && ball > 0 ? () => onClick(name, 'ro') : undefined} >
                            {run === 0 && ball === 0 ?
                                <Edit />
                                :
                                <Typography variant="body2">RO</Typography>
                            }
                        </Box>
                    }
                </Box>
                <Box sx={{ flexShrink: '1' }}>
                    <Typography variant="body2">{`${name ? name : 'batter'}${(name === post?.team1Captain?.playerName || name === post?.team2Captain?.playerName) ? ' (C)' : ''}${(name === post?.team1WicketKeeper?.playerName || name === post?.team2WicketKeeper?.playerName) ? ' (Wk)' : ''}`}</Typography>
                    <Box className={`score_player_score_section ${type === 'bowler' && 'bowler'}`}>
                        <Typography variant="body2">{`${run}`}</Typography>
                        <Typography variant="body2">{`(${ball})`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const TestScorePage = ({
    match,
    handleScore,
    runtype,
    balls,
    active,
    addBall,
    length,
    ballScores,
    legalBallCount,
    inningsChange,
    startInnings,
    currentinnings,
    playerselection,
    players,
    activeStrike,
    batterScore,
    bowlerScore,
    inningsComplete,
    winner,
    matchComplete,
    team1,
    team2,
    team1Score,
    team2Score,
    team1FirstInningsScore,
    team2FirstInningsScore,
    overChanged,
    gif,
    tossWinner,
    target,
    back,
    ChangeBowler,
    ChangeBatter,
    battinglength,
    initailscore,
    Extras,
    ChangeStrike,
    post,
    declare,
    stumps,
    CurrentRunningDay,
    matchDraw,
    lead,
    Overs,
    winSituation,
    revise,
    handleBreakOpen,
    team1Data,
    team2Data
}) => {

    const router = useRouter()

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

    for (let i = 0; i < length; i++) {
        const score = ballScores[i];

        const ballColor = score ? getBallColor(score) : 'lightgray';
        const TextSize = score ? getBallSize(score) : '10px'

        ballCircles.push(
            <div
                key={i}
                style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    backgroundColor: i < balls.ballNo ? ballColor : 'lightgray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: i < balls.ballNo ? TextSize : '10px',
                    overflow: 'hidden'
                }}
            >
                {score !== null ? score : ''}
            </div>
        );
    }

    const isButtonsDisabled = currentinnings <= 0 || inningsComplete || overChanged || active.secondactive === "STO";

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
    const sm = useMediaQuery('(max-width: 354px)')
    const md = useMediaQuery('(max-width: 390px)')
    const lg = useMediaQuery('(max-width: 410px)')
    let Innings1Declare = match?.firstInnings?.declare === "yes" ? true : false
    let Innings2Declare = match?.secondInnings?.declare === "yes" ? true : false
    let Innings3Declare = match?.superOverFirstInnings?.declare === "yes" ? true : false

    useEffect(() => {
        const striker = players.filter(player => player.id === playerselection.striker)
        const nonStriker = players.filter(player => player.id === playerselection.nonStriker)
        const bowler = players.filter(player => player.id === playerselection.bowler)
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

    }, [playerselection])

    const bowlerthere = currentinnings === 2 ? match?.secondInnings?.Currentover?.[0]?.bowlerId : currentinnings === 3 ? match?.superOverFirstInnings?.Currentover?.[0]?.bowlerId : currentinnings === 4 ? match?.superOverSecondInnings?.Currentover?.[0]?.bowlerId : "";
    const isStartInnings = (
        currentinnings === 0 ||
        (currentinnings === 2 && !bowlerthere) ||
        (currentinnings === 3 && !bowlerthere) ||
        (currentinnings === 4 && !bowlerthere)
    )
    const isNextOver = (!inningsComplete && legalBallCount > 5)
    const isNextInning = (inningsComplete && (currentinnings !== 4))
    const isMatchComplete = winner;

    const RenderButton = () => {
        let title = (
            isStartInnings ? `${CommonText.StartInnings}` :
                isNextOver ? `${CommonText.NextOver}` :
                    isNextInning && !isMatchComplete ? `${CommonText.NextInning}` :
                        isMatchComplete ? `${CommonText.MatchComplete}` : `${CommonText.MatchRunning}`)
        let click = (
            isStartInnings ? startInnings :
                isNextOver ? addBall :
                    isNextInning && !isMatchComplete ? inningsChange :
                        isMatchComplete ? matchComplete : undefined
        )
        let disable = (
            isStartInnings || isNextOver || isNextInning || isMatchComplete
        )
        return <CustomeButton
            height={'50px'}
            title={title}
            width={'100%'}
            onClick={click}
            fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
            disabled={disable ? false : true}
        />
    };

    return (
        <Box>
            <Box sx={{ position: 'absolute', }}>
                <CommonBack onClick={() => router.push(`/mytournament/${match?.tournamentId}/match`)} />
            </Box>

            <Banner type={"score"}
                image1={team1Data?.team_logo ? `/${team1Data?.team_logo}` : null}
                image2={team2Data?.team_logo ? `/${team2Data?.team_logo}` : null}
                team1score={currentinnings > 2 ? team1FirstInningsScore : team1Score}
                team2score={currentinnings > 2 ? team2FirstInningsScore : team2Score}
                superover={currentinnings > 2 ? true : false}
                soteam1score={team1Score}
                soteam2score={team2Score}
                team1name={team1Data?.team_name}
                team2name={team2Data?.team_name}
                team1letter={team1Data?.letter}
                team1color={team1Data?.team_color}
                team2letter={team2Data?.letter}
                team2color={team2Data?.team_color}
                soteam1scorehidden={currentinnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? false : true}
                soteam2scorehidden={currentinnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? true : false}
                team1Declare={match?.firstInnings?.battingside === match?.team1?.team_name ? Innings1Declare : Innings2Declare}
                team2Declare={match?.firstInnings?.battingside === match?.team2?.team_name ? Innings1Declare : Innings2Declare}
                team1SuperOverDeclare={currentinnings === 4 && tossWinner?.battingSide !== team1?.team_name ? Innings3Declare : false}
                team2SuperOverDeclare={currentinnings === 4 && tossWinner?.battingSide !== team2?.team_name ? Innings3Declare : false}
            />

            <Box className='target_section'>
                <Typography>{CurrentRunningDay ? `${team1Data?.team_name} vs ${team2Data?.team_name} Test Match ${CurrentRunningDay}` : ''}</Typography>
                <Typography>
                    {winner ? `${winner === team1?.id ? team1Data?.team_name : team2Data?.team_name} ${winSituation}`
                        : target?.runs > 0 && (currentinnings !== 1 && currentinnings === 4) ? `${tossWinner?.battingSide === team1?.team_name ? team1Data?.team_name : team2Data?.team_name} needs ${target?.runs < 0 ? 0 : target?.runs} runs in ${target?.overs}${Overs ? `.${6 - legalBallCount}` : ''} ${Overs ? 'Overs' : 'Balls'} to Win`
                            : currentinnings === 2 || currentinnings === 3 ? `${tossWinner?.battingSide === team1?.team_name ? team1Data?.team_name : team2Data?.team_name} ${lead.lead ? 'lead' : target?.runs < 0 ? 'lead' : 'trail'} by ${lead.lead ? lead.run : target?.runs < 0 ? initailscore.run - target?.totalruns : target?.runs} runs`
                                : `${match?.toss?.tossWinner === match?.team1?.id ? team1Data?.team_name : team2Data?.team_name} won the toss and decided to ${match?.toss?.selectSide}`}
                </Typography>
            </Box>

            <Box className='score_main_section' >
                <Box className='score_player_card_section'>
                    <Box>
                        <Box className='score_player_card_sub_section'>
                            <Box className='score_batter_player_card'>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '5px', alignItems: 'center' }}>
                                    <CommonPlayerSection length={battinglength} wickets={initailscore.wicket} name={playerOnField.striker} icon={"striker"}
                                        onClick={ChangeBatter} run={batterScore.batter1run} ball={batterScore.batter1balls}
                                        activeStrike={activeStrike === 1} post={post} />
                                    <SwapHoriz sx={{ color: 'var(--text-white)', cursor: 'pointer' }} onClick={ChangeStrike} />
                                    <CommonPlayerSection length={battinglength} wickets={initailscore.wicket} type={"non-striker"} icon={"striker"}
                                        onClick={ChangeBatter} name={playerOnField.nonStriker} run={batterScore.batter2run} ball={batterScore.batter2balls}
                                        activeStrike={activeStrike === 2} post={post} />
                                </Box>
                                <Box className='silver-gradient-line'></Box>
                                <Box>
                                    <CommonPlayerSection post={post} balls={balls} onClick={ChangeBowler} type={"bowler"} name={playerOnField.bowler} run={`${bowlerScore.run} / ${bowlerScore.wicket}`} ball={`${legalBallCount === 6 ? bowlerScore.overNo + 1 : bowlerScore.overNo}.${legalBallCount === 6 ? 0 : legalBallCount}`} icon={"ball"} />
                                </Box>
                            </Box>
                        </Box>

                        <Box className='score_balls_section'>
                            <Box className="score-gradient-line"></Box>
                            <Box className='score_balls' sx={{ paddingInline: '10px' }}>{ballCircles}</Box>
                            <Box className="score-gradient-line"></Box>
                        </Box>

                        <ExtraRunSection totalLBRuns={Extras?.LB} totalNBRuns={Extras.NB} totalWDRuns={Extras.WD} totalPRRuns={Extras.PR} totalNRRuns={Extras.NR} />

                    </Box>

                    <Box className="score_section" >
                        {!gif.gif &&
                            <Box className="scoring_section">
                                <Box className="score_button_section">
                                    {
                                        runtype.map((items, i) => {
                                            const isPRActive = active.active && (active.data === "PR" || active.data === "NR" || active.data === "RNO");
                                            const isWide = active.active && active.data === "WD"
                                            const isNoBall = active.active && active.data === "NB"
                                            const islegbye = active.data === "LB" && active.active
                                            const isRunoutActive = active.secondactive === "RNO"
                                            const isButtonDisabled = (isRunoutActive && !['0', '1', '2', '3', '4', '5,7', '6'].includes(items)) || (isWide && !['0', '1', '2', '3', '4', '5,7', '6', 'RNO', 'STO'].includes(items)) || (isNoBall && !['0', '1', '2', '3', '4', '5,7', '6', 'RNO'].includes(items)) || isPRActive && !['0', '1', '2', '3', '4', '5,7', '6'].includes(items) || islegbye && !['1', '2', '3', '4', '5,7', '6'].includes(items) || isButtonsDisabled;

                                            return (
                                                <Button
                                                    className={`score_button ${active.active && 'active'}`}
                                                    key={i}
                                                    onClick={() => handleScore(items)}
                                                    disabled={(currentinnings === 2 || currentinnings === 3 || currentinnings === 4) && !bowlerthere ? true : isButtonDisabled}
                                                >
                                                    {items}
                                                </Button>
                                            );
                                        })
                                    }
                                </Box>
                                <Box className='test_score_render_button'>
                                    <RenderButton />
                                    <CustomeButton
                                        disabled={balls.ballNo === 0 || active.active ? true : false}
                                        title={"Undo"}
                                        width={'100%'}
                                        onClick={back}
                                        fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
                                        hover={'none'} />
                                    <CustomeButton
                                        title={"Break"}
                                        width={'100%'}
                                        height={'50px'}
                                        disabled={winner || balls.ballNo === 0 || active.active ? true : false}
                                        onClick={handleBreakOpen}
                                        fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
                                        hover={'none'} />
                                </Box>
                                <Box className='test_score_render_button'>
                                    <CustomeButton
                                        title={"Stumps"}
                                        width={'100%'}
                                        height={'50px'}
                                        onClick={stumps}
                                        disabled={winner ? true : false}
                                        fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
                                        hover={'none'} />
                                    <CustomeButton
                                        title={currentinnings === 4 ? "Revise Over" : "Declare"}
                                        width={'100%'}
                                        onClick={currentinnings === 4 ? revise : declare}
                                        height={'50px'}
                                        disabled={currentinnings === 4 ? false : (target?.runs > 0 && currentinnings !== 1) || winner}
                                        fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
                                        hover={'none'} />
                                    <CustomeButton
                                        title={"Match Draw"}
                                        width={'100%'}
                                        onClick={matchDraw}
                                        disabled={winner ? true : false}
                                        fontSize={sm ? '10px' : md ? '11px' : lg ? '13px' : '14px'}
                                        height={'50px'}
                                        hover={'none'} />
                                </Box>
                            </Box>
                        }
                        {
                            gif.gif &&
                            <Box className='score_gif_main_section'>
                                <Box className='score_gif_section'>
                                    <Image alt="gif" src={gif.type === '4' ? fourgif : gif.type === '6' ? sixgif : wicketgif} height={500} width={500} />
                                </Box>
                            </Box>
                        }
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default TestScorePage;