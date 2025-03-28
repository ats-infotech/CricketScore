'use client'
import { calculateMVPPoints } from "@/components/common/commomFunction"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { Box, Card, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import './MatchSummary.css'
import { teamsState } from "@/redux/slices/teamSlice"

const MatchSummary = ({ matchData, playerData, teamData, tournamentData }) => {

    const [tournament, setTournament] = useState([])
    const [winnermsg, setWinnermsg] = useState()
    const [matchplayers, setMatchPlayers] = useState([])
    const [playersPoints, setPlayersPoints] = useState([])
    const [mvpPlayerPoints, setMvpPlayerPoints] = useState([])
    const [secondInningsPoints, setSecondInningsPoints] = useState([])
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
    const tournament_data = useSelector(tournamentState)
    const team_data = useSelector(teamsState)
    let firstinnings = matchData?.firstInnings
    let secondinnings = matchData?.secondInnings
    let thirdinnings = matchData?.superOverFirstInnings
    let fourthinnings = matchData?.superOverSecondInnings
    let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
    let isFollowOn = isTestMatch && tournamentData?.followOn === "Follow On" ? true : false

    useEffect(() => {
        const currentTournament = tournament_data?.data?.filter((items) => items?.id === matchData?.tournamentId)?.[0]
        setTournament(currentTournament)
    }, [tournament_data])

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
        let winner = '';
        const winningTeam = team_data?.data?.find((items) => items?.id === matchData?.matchWinner)?.team_name
        const terminatedTeam = team_data?.data?.find((items) => items?.id === matchData?.terminate?.teamdisqualify)?.team_name
        const TeamWinByTermination = matchData?.team1?.id === matchData?.terminate?.teamdisqualify ? team_data?.data?.find((items) => items?.id === matchData?.team2?.id)?.team_name
            : team_data?.data?.find((items) => items?.id === matchData?.team1?.id)?.team_name

        if (matchData?.terminate) {
            if (matchData?.terminate?.mainreason === "rain") {
                winner = (`Match abandoned due to ${matchData?.terminate?.mainreason}`)
            } else {
                winner = (`Match abandoned as ${terminatedTeam} was found guilty of ${matchData?.terminate?.reason} As a result, ${TeamWinByTermination} won the match`)
            }
        } else if ((matchData?.matchWinner === undefined || !matchData?.matchWinner || matchData?.matchWinner === "") && isTestMatch) {
            winner = ("Match Draw")
        } else if (matchData?.matchWinner === undefined && !isTestMatch) {
            winner = ('Match Tied')
        } else if (matchData?.winSituation) {
            winner = (`${winningTeam} ${matchData?.winSituation}`)
        }
        setWinnermsg(winner)
    }, [matchData, isTestMatch, team_data])

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
        const allWickets = [
            ...(matchData?.firstInnings?.Wickets ?? []),
            ...(matchData?.secondInnings?.Wickets ?? [])
        ];

        const TestWickets = [
            ...(matchData?.firstInnings?.Wickets ?? []),
            ...(matchData?.secondInnings?.Wickets ?? []),
            ...(matchData?.superOverFirstInnings?.Wickets ?? []),
            ...(matchData?.superOverSecondInnings?.Wickets ?? []),
        ]

        const SecondInningsWicket = [
            ...(matchData?.superOverFirstInnings?.Wickets ?? []),
            ...(matchData?.superOverSecondInnings?.Wickets ?? []),
        ]

        const Economy = [
            ...(matchData?.firstInnings?.Completedovers ?? []),
            ...(matchData?.secondInnings?.Completedovers ?? [])
        ]

        const TestEconomy = [
            ...(matchData?.firstInnings?.Completedovers ?? []),
            ...(matchData?.secondInnings?.Completedovers ?? []),
            ...(matchData?.superOverFirstInnings?.Completedovers ?? []),
            ...(matchData?.superOverSecondInnings?.Completedovers ?? []),
        ]

        const SecondInningsEconomy = [
            ...(matchData?.superOverFirstInnings?.Completedovers ?? []),
            ...(matchData?.superOverSecondInnings?.Completedovers ?? []),
        ]

        let winnerTeamIs = '';
        if (matchData?.matchWinner) {
            winnerTeamIs = teamData.find(item => item?.team_name === matchData?.matchWinner)
        }

        const playersWithPoints = matchplayers.map(player => {
            const playerMVP = calculateMVPPoints(player, allWickets, Economy, team1, team2, winnerTeamIs);
            return playerMVP;
        });

        const mvpPlayerwithPoints = isTestMatch && matchplayers.map(player => {
            const playerMVP = calculateMVPPoints(player, TestWickets, TestEconomy, team1, team2, winnerTeamIs);
            return playerMVP;
        });

        const secondInningsPlayerwithPoints = isTestMatch && matchplayers.map(player => {
            const playerMVP = calculateMVPPoints(player, SecondInningsWicket, SecondInningsEconomy, team1, team2, winnerTeamIs);
            return playerMVP;
        });

        setMvpPlayerPoints(mvpPlayerwithPoints)
        setPlayersPoints(playersWithPoints);
        setSecondInningsPoints(secondInningsPlayerwithPoints)
    }, [matchplayers, matchData]);

    const getBestBowlingPlayer = (players) => {
        return players.reduce((bestPlayer, currentPlayer) => {
            const currentEco = parseFloat(currentPlayer.eco);
            const bestEco = parseFloat(bestPlayer.eco);
            return currentEco < bestEco ? currentPlayer : bestPlayer;
        });
    };

    const filterTeam1Playerpoints = playersPoints.filter((items) => items?.team === team1?.team_name)
    const filterTeam2Playerpoints = playersPoints.filter((items) => items?.team === team2?.team_name)
    const filterTeam1SecongInningsPlayerpoints = isTestMatch ? secondInningsPoints?.filter((items) => items?.team === team1?.team_name) : 0
    const filterTeam2SecongInningsPlayerpoints = isTestMatch ? secondInningsPoints?.filter((items) => items?.team === team2?.team_name) : 0
    const highestPointsPlayer = isTestMatch ? mvpPlayerPoints.find(player => player.totalPoints === Math.max(...mvpPlayerPoints.map(p => p.totalPoints))) : playersPoints.find(player => player.totalPoints === Math.max(...playersPoints.map(p => p.totalPoints)));

    const highestBattingTeam1Point = filterTeam1Playerpoints.find(player => player.battingPoints === Math.max(...filterTeam1Playerpoints.map(p => p.battingPoints)));
    const highestBowlingTeam1PointPlayers = filterTeam1Playerpoints.filter(player => player.bowlingPoints === Math.max(...filterTeam1Playerpoints.map(p => p.bowlingPoints)));
    const highestBowlingTeam1Point = highestBowlingTeam1PointPlayers.length > 1 ? getBestBowlingPlayer(highestBowlingTeam1PointPlayers) : highestBowlingTeam1PointPlayers[0];

    const highestBattingTeam2Point = filterTeam2Playerpoints.find(player => player.battingPoints === Math.max(...filterTeam2Playerpoints.map(p => p.battingPoints)));
    const highestBowlingTeam2PointPlayers = filterTeam2Playerpoints.filter(player => player.bowlingPoints === Math.max(...filterTeam2Playerpoints.map(p => p.bowlingPoints)));
    const highestBowlingTeam2Point = highestBowlingTeam2PointPlayers.length > 1 ? getBestBowlingPlayer(highestBowlingTeam2PointPlayers) : highestBowlingTeam2PointPlayers[0];

    const highestSecondInningsBattingTeam1Point = isTestMatch ? filterTeam1SecongInningsPlayerpoints?.find(player => player.battingPoints === Math.max(...filterTeam1SecongInningsPlayerpoints.map(p => p.battingPoints))) : 0;
    const highestSecondInningsBowlingTeam1PointPlayers = isTestMatch ? filterTeam1SecongInningsPlayerpoints?.filter(player => player.bowlingPoints === Math.max(...filterTeam1SecongInningsPlayerpoints.map(p => p.bowlingPoints))) : 0;
    const highestSecondInningsBowlingTeam1Point = highestSecondInningsBowlingTeam1PointPlayers.length > 1 ? getBestBowlingPlayer(highestSecondInningsBowlingTeam1PointPlayers) : highestSecondInningsBowlingTeam1PointPlayers[0];

    const highestSecondInningsBattingTeam2Point = isTestMatch ? filterTeam2SecongInningsPlayerpoints?.find(player => player.battingPoints === Math.max(...filterTeam2SecongInningsPlayerpoints.map(p => p.battingPoints))) : 0;
    const highestSecondInningsBowlingTeam2PointPlayers = isTestMatch ? filterTeam2SecongInningsPlayerpoints?.filter(player => player.bowlingPoints === Math.max(...filterTeam2SecongInningsPlayerpoints.map(p => p.bowlingPoints))) : 0;
    const highestSecondInningsBowlingTeam2Point = highestSecondInningsBowlingTeam2PointPlayers.length > 1 ? getBestBowlingPlayer(highestSecondInningsBowlingTeam2PointPlayers) : highestSecondInningsBowlingTeam2PointPlayers[0];

    return (
        <Box className="matchsummary_main_section">
            <Box className="matchsummary_sub_section">
                <Card className="match_card_sum">
                    <CardContent>
                        <Typography variant="h6" className="innings_title">Match Summary</Typography>
                        <Box className="matchsummary-gradient-line"></Box>
                        <Typography variant="body1" className="info">{`${team1?.team_name} vs ${team2?.team_name}, ${tournament?.tournament_name}`}</Typography>
                        <Typography variant="body2" className="info">{`${formatDate(matchData?.match_start_time)}, ${tournament?.city}, ${tournament?.ground}`}</Typography>
                        <Typography variant="body2" className="info">{`${matchData?.toss?.tossWinner === matchData?.team1?.id ? team1?.team_name : team2?.team_name} won the toss and decided to ${matchData?.toss?.selectSide}`}</Typography>
                        <Typography variant="body2" className="info">{winnermsg}</Typography>
                        {!matchData?.terminate && <Typography variant="body2" className="info">{`MVP: ${highestPointsPlayer?.playerName} ${highestPointsPlayer?.battingrun}(${highestPointsPlayer?.battingball}) and ${highestPointsPlayer?.bowlingrun}/${highestPointsPlayer?.bowlerwickets} in ${(highestPointsPlayer?.bowlingball / 6).toFixed(1)}`}</Typography>}
                    </CardContent>
                </Card>

                {!matchData?.terminate && [firstinnings, secondinnings].map((innings, index) => (
                    <Card key={index} className="match_card_sum">
                        <CardContent>
                            <Typography variant="h6" className="innings_title">{`${index === 0 ? "First" : "Second"} Innings (${index === 0 ? `${matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide === "Bat" ? team1?.team_name
                                : matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide !== "Bat" ? team1?.team_name
                                    : team2?.team_name}`
                                : `${matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide === "Bat" ? team1?.team_name
                                : matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide !== "Bat" ? team1?.team_name
                                    : team2?.team_name}`})`}</Typography>
                            <Box className="matchsummary-gradient-line"></Box>
                            <Typography variant="body2" className="info">{`Total Score: ${innings?.Currentover?.[0]?.runs}/${innings?.Currentover?.[0]?.wicket} in ${innings?.Currentover?.[0]?.legalBall === 6 ? innings?.Completedovers?.length : innings?.Completedovers?.length - 1}.${innings?.Currentover?.[0]?.legalBall === 6 ? 0 : innings?.Currentover?.[0]?.legalBall || 0}`}</Typography>
                            <Typography variant="body2" className="info">{`Best Batter: ${index === 0 ? highestBattingTeam1Point?.playerName : highestBattingTeam2Point?.playerName} ${index === 0 ? highestBattingTeam1Point?.battingrun : highestBattingTeam2Point?.battingrun}(${index === 0 ? highestBattingTeam1Point?.battingball : highestBattingTeam2Point?.battingball})`}</Typography>
                            <Typography variant="body2" className="info">{`Best Bowler: ${index === 0 ? highestBowlingTeam2Point?.playerName : highestBowlingTeam1Point?.playerName} ${index === 0 ? highestBowlingTeam2Point?.bowlingrun : highestBowlingTeam1Point?.bowlingrun}/${index === 0 ? highestBowlingTeam2Point?.bowlerwickets : highestBowlingTeam1Point?.bowlerwickets} in ${(highestBowlingTeam1Point?.bowlingball / 6).toFixed(1)}`}</Typography>
                        </CardContent>
                    </Card>
                ))}

                {isTestMatch && (matchData?.currentInnings === 3 || matchData?.currentInnings === 4) &&
                    <Card className="match_card_sum">
                        <CardContent>
                            <Typography variant="h6" className="innings_title">{`Third Innings (${matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide === "Bat" && !isFollowOn ? team1?.team_name
                                : matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide !== "Bat" && !isFollowOn ? team1?.team_name
                                    : team2?.team_name})`}</Typography>
                            <Box className="matchsummary-gradient-line"></Box>
                            <Typography variant="body2" className="info">{`Total Score: ${thirdinnings?.Currentover?.[0]?.runs}/${thirdinnings?.Currentover?.[0]?.wicket} in ${thirdinnings?.Currentover?.[0]?.legalBall === 6 ? thirdinnings?.Completedovers?.length : thirdinnings?.Completedovers?.length - 1}.${thirdinnings?.Currentover?.[0]?.legalBall === 6 ? 0 : thirdinnings?.Currentover?.[0]?.legalBall || 0}`}</Typography>
                            <Typography variant="body2" className="info">{`Best Batter: ${highestSecondInningsBattingTeam1Point?.playerName}(${highestSecondInningsBattingTeam1Point?.battingball})`}</Typography>
                            <Typography variant="body2" className="info">{`Best Bowler: ${highestSecondInningsBowlingTeam2Point?.playerName} ${highestSecondInningsBowlingTeam2Point?.bowlingrun}/${highestSecondInningsBowlingTeam2Point?.bowlerwickets}`}</Typography>
                        </CardContent>
                    </Card>
                }

                {isTestMatch && matchData?.currentInnings === 4 && 
                    <Card className="match_card_sum">
                        <CardContent>
                            <Typography variant="h6" className="innings_title">{`${"Fourth"} Innings (${matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide === "Bat" && isFollowOn ? team1?.team_name
                                : matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide !== "Bat" && isFollowOn ? team1?.team_name
                                    : team2?.team_name})`}</Typography>
                            <Box className="matchsummary-gradient-line"></Box>
                            <Typography variant="body2" className="info">{`Total Score: ${fourthinnings?.Currentover?.[0]?.runs}/${fourthinnings?.Currentover?.[0]?.wicket} in ${fourthinnings?.Currentover?.[0]?.legalBall === 6 ? fourthinnings?.Completedovers?.length : fourthinnings?.Completedovers?.length - 1}.${fourthinnings?.Currentover?.[0]?.legalBall === 6 ? 0 : fourthinnings?.Currentover?.[0]?.legalBall || 0}`}</Typography>
                            <Typography variant="body2" className="info">{`Best Batter: ${highestSecondInningsBattingTeam2Point?.playerName} ${highestSecondInningsBattingTeam2Point?.battingrun}(${highestSecondInningsBattingTeam2Point?.battingball})`}</Typography>
                            <Typography variant="body2" className="info">{`Best Bowler: ${highestSecondInningsBowlingTeam1Point?.playerName} ${highestSecondInningsBowlingTeam1Point?.bowlingrun}/${highestSecondInningsBowlingTeam1Point?.bowlerwickets}`}</Typography>
                        </CardContent>
                    </Card>
                }
            </Box>
        </Box>
    );
}

export default MatchSummary