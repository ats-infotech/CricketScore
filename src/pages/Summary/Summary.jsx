'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import Banner from "@/components/common/commonUi/Banner/Banner"
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar"
import CommonBack from "@/components/common/commonUi/commonBack"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import './Summary.css'

const CommonTable = React.memo(({ header, data, highestPointsPlayer }) => {
    return (
        <Box className='summary_table_section'>
            <TableContainer className="summary_table_container" >
                <Table className="summary_table" aria-label="simple table">
                    <TableHead >
                        <TableRow>
                            {header.map((item, index) => (
                                <TableCell key={index} className="table-cell">
                                    {item.icon && (
                                        <SvgIcon id={item.icon} />
                                    )}
                                    {item.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {data.map((field) => (
                                <TableCell key={field} className="table-cell data">
                                    {highestPointsPlayer?.[field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
})

const CommonSection = React.memo(({ title, batterheader, batterdata, highestPointsPlayer, type, bowlerheader, bowlerdata }) => {
    return (
        <Box className='summary_common_section'>
            <Box className='summary_common_section_title'>
                <Typography variant="body2">{title}</Typography>
            </Box>

            <Box className={`summary_common_card_section ${type === 'mvp' && 'mvp'}`}>
                <Box className='summary_common_card_sub_section'>
                    <Box className='summary_common_card'>
                        {highestPointsPlayer?.playerthumbnail === '' ?
                            <Box className='summary_letter_main_section'>
                                <Box className='summary_letter_section' sx={{ backgroundColor: highestPointsPlayer?.playercolor }}>
                                    <Typography variant="body2">{highestPointsPlayer?.playerletter}</Typography>
                                </Box>
                            </Box>
                            :
                            <Image unoptimized src={`/${highestPointsPlayer?.playerthumbnail}`} width={1000} height={1000} alt="" />}
                        <Box className='summary_common_card_background_effect' ></Box>
                    </Box>
                    <Box className='summary_common_card_info'>
                        <Typography variant="body2">{highestPointsPlayer?.playerName}</Typography>
                        <Box className='summary_common_card_sub_info'>
                            {highestPointsPlayer?.teamthumbnail && <Image unoptimized src={`/${highestPointsPlayer?.teamthumbnail}`} width={500} height={500} alt="" />}
                            {!highestPointsPlayer?.teamthumbnail && <ImageAvatar text={highestPointsPlayer?.teamletter} bgColor={highestPointsPlayer?.teamcolor} width={'70px'}
                                height={'70px'} smallHeight={'70px'} smallWidth={'70px'} meduimHeight={'70px'} meduimWidth={'70px'} borderRadius={'10px'} />}
                            <Typography variant="body2" >{highestPointsPlayer?.team}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className='summary_stats_section'>
                    {(type === "mvp" || type === "batter") && batterheader && batterdata ? <CommonTable header={batterheader} highestPointsPlayer={highestPointsPlayer} data={batterdata} /> : null}
                    {(type === "mvp" || type === "bowler") && bowlerheader && bowlerdata ? <CommonTable header={bowlerheader} highestPointsPlayer={highestPointsPlayer} data={bowlerdata} /> : null}
                </Box>
            </Box>
        </Box>
    )
})

const SummaryPage = ({
    currentMatch,
    team1,
    team1Score,
    team2,
    team2Score,
    mvpPoints,
    type,
    tournamentData,
    tossWinner
}) => {

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
    let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
    let matchThirdInnings = currentMatch?.superOverFirstInnings
    let matchFourthInnings = currentMatch?.superOverSecondInnings
    let CurrentInnings = currentMatch?.currentInnings
    let Innings1Declare = currentMatch?.firstInnings?.declare === "yes" ? true : false
    let Innings2Declare = currentMatch?.secondInnings?.declare === "yes" ? true : false
    let Innings3Declare = currentMatch?.superOverFirstInnings?.declare === "yes" ? true : false

    const getBestBowlingPlayer = (players) => {
        return players.reduce((bestPlayer, currentPlayer) => {
            const currentEco = parseFloat(currentPlayer.eco);
            const bestEco = parseFloat(bestPlayer.eco);
            return currentEco < bestEco ? currentPlayer : bestPlayer;
        });
    };
    const highestPointsPlayer = mvpPoints.find(player => player.totalPoints === Math.max(...mvpPoints.map(p => p.totalPoints)));
    const highestBattingPoint = mvpPoints.find(player => player.battingPoints === Math.max(...mvpPoints.map(p => p.battingPoints)));
    const highestBowlingPointPlayers = mvpPoints.filter(player => player.bowlingPoints === Math.max(...mvpPoints.map(p => p.bowlingPoints)));
    const highestBowlingPoint = highestBowlingPointPlayers.length > 1 ? getBestBowlingPlayer(highestBowlingPointPlayers) : highestBowlingPointPlayers[0];
    const router = useRouter()

    const batterheader = [
        { label: 'Batting', icon: 'striker' },
        { label: 'R' },
        { label: 'B' },
        { label: "4's" },
        { label: "6's" },
        { label: 'SR' }
    ]
    const bowlerheader = [
        { label: 'Bowling', icon: 'whiteball' },
        { label: 'O' },
        { label: 'R' },
        { label: "M" },
        { label: "W" },
        { label: 'Eco' }
    ]
    
    const batterdata = ['playerName', 'battingrun', 'battingball', 'four', 'six', 'sr']
    const bowlerdata = ['playerName', 'over', 'bowlingrun', 'maiden', 'bowlerwickets', 'eco']

    useEffect(() => {
        if (CurrentInnings === 4 || CurrentInnings === 3) {
            setSuperover(true)
            const superfirstinningsballs = matchThirdInnings?.Currentover?.[0].legalBall === 6 ? 0 : matchThirdInnings?.Currentover?.[0].legalBall || 0
            const superfirstinningsruns = matchThirdInnings?.Currentover?.[0]?.runs || 0
            const superfirstinningswickets = matchThirdInnings?.Currentover?.[0]?.wicket || 0
            const superfirstinningsover = isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall === 6 ? matchThirdInnings?.Completedovers?.length
                : isTestMatch && matchThirdInnings?.Currentover?.[0].legalBall !== 6 ? matchThirdInnings?.Completedovers?.length - 1
                    : matchThirdInnings?.Currentover?.[0].legalBall === 6 ? 1 : 0
            const supersecondinningsballs = matchFourthInnings?.Currentover?.[0].legalBall === 6 ? 0 : matchFourthInnings?.Currentover?.[0].legalBall || 0
            const supersecondinningsruns = matchFourthInnings?.Currentover?.[0]?.runs || 0
            const supersecondinningswickets = matchFourthInnings?.Currentover?.[0]?.wicket || 0
            const supersecondinningsover = isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall === 6 ? matchFourthInnings?.Completedovers?.length
                : isTestMatch && matchFourthInnings?.Currentover?.[0].legalBall !== 6 ? matchFourthInnings?.Completedovers?.length - 1
                    : matchFourthInnings?.Currentover?.[0].legalBall === 6 ? 1 : 0
            const FirstInningsbatting = matchThirdInnings?.battingside === currentMatch?.team1?.team_name;

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

        if (currentMatch?.winSituation) {
            setWinner(`${currentMatch?.matchWinner === team1?.id ? team1?.team_name : team2?.team_name} ${currentMatch?.winSituation}`)
        } else if ((currentMatch?.matchWinner === undefined || !currentMatch?.matchWinner || currentMatch?.matchWinner === "") && isTestMatch) {
            setWinner("Match Draw")
        } else if (!isTestMatch && currentMatch?.terminate) {
            if (currentMatch?.terminate?.mainreason === "rain") {
                setWinner(`Match abandoned due to ${currentMatch?.terminate?.mainreason}`)
            } else {
                setWinner(`Match abandoned as ${team1?.id === currentMatch?.terminate?.teamdisqualify ? team1?.team_name
                    : team2?.team_name} was disqualified`)
            }
        } else if (!currentMatch?.matchWinner && !isTestMatch) {
            setWinner('Match Tied')
        }
    }, [currentMatch, team1, team2, currentMatch?.matchWinner, currentMatch?.winSituation])

    return (
        <Box sx={{ marginTop: type === 'user' && !currentMatch?.terminate ? '20px' : '0px' }}>
            {type !== 'user' && <Box sx={{ position: 'relative' }}>
                <CommonBack onClick={() => router.push(`/mytournament/${currentMatch?.tournamentId}/match`)} />
                <Banner type={'score'}
                    image1={team1?.team_logo ? `/${team1?.team_logo}` : null}
                    image2={team2?.team_logo ? `/${team2?.team_logo}` : null}
                    team1score={team1Score}
                    team2score={team2Score}
                    winnerName={winner || ''}
                    superover={superover}
                    soteam1score={team1SOScore}
                    soteam2score={team2SOScore}
                    team1name={team1?.team_name}
                    team2name={team2?.team_name}
                    team1letter={team1?.letter}
                    team1color={team1?.team_color}
                    team2letter={team2?.letter}
                    team2color={team2?.team_color}
                    soteam1scorehidden={CurrentInnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? false : true}
                    soteam2scorehidden={CurrentInnings === 4 ? false : tossWinner?.battingSide === team1?.team_name ? true : false}
                    team1Declare={currentMatch?.firstInnings?.battingside === currentMatch?.team1?.team_name ? Innings1Declare : Innings2Declare}
                    team2Declare={currentMatch?.firstInnings?.battingside === currentMatch?.team2?.team_name ? Innings1Declare : Innings2Declare}
                    team1SuperOverDeclare={CurrentInnings === 4 && tossWinner?.battingSide !== team1?.team_name ? Innings3Declare : false}
                    team2SuperOverDeclare={CurrentInnings === 4 && tossWinner?.battingSide !== team2?.team_name ? Innings3Declare : false}
                />
            </Box>}

            {
                currentMatch?.terminate && <Box className='no_result'>
                    <Typography variant="body2">
                        {
                            currentMatch?.terminate?.mainreason === "rain" ? "This match ended in no result as it was abandoned due to rain, which is why no player was awarded"
                                : `No player was awarded, as ${currentMatch?.team1?.id === currentMatch?.terminate?.teamdisqualify ? team1?.team_name
                                    : team2?.team_name} was found guilty of ${currentMatch?.terminate?.reason} As a result, 
                                ${currentMatch?.team1?.id !== currentMatch?.terminate?.teamdisqualify ? team1?.team_name : team2?.team_name} won the match`
                        }
                    </Typography>
                </Box>
            }

            {!currentMatch?.terminate && <Box className={`summary_max_height ${type === 'user' && 'user'}`} sx={{ marginTop: type !== 'user' ? '30px' : '0px' }}>
                <CommonSection title={"Player of the Match"}
                    batterheader={batterheader}
                    batterdata={batterdata}
                    highestPointsPlayer={highestPointsPlayer}
                    type={"mvp"}
                    bowlerheader={bowlerheader}
                    bowlerdata={bowlerdata}
                />

                <CommonSection
                    title={"Best Batter"}
                    type={"batter"}
                    highestPointsPlayer={highestBattingPoint}
                    batterdata={batterdata}
                    batterheader={batterheader}
                />

                <CommonSection
                    title={"Best Bowler"}
                    type={"bowler"}
                    highestPointsPlayer={highestBowlingPoint}
                    bowlerdata={bowlerdata}
                    bowlerheader={bowlerheader}
                />
            </Box>}

        </Box>
    )
}

export default React.memo(SummaryPage)