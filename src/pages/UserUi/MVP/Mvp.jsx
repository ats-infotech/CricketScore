'use client'
import { calculateMVPPoints } from "@/components/common/commomFunction";
import SummaryPage from "@/pages/Summary/Summary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Matchstats from "../Matchstats/Matchstats";
import { useSelector } from "react-redux";
import { teamsState } from "@/redux/slices/teamSlice";

// const calculateMVPPoints = (player, wickets, economy, team1, team2) => {
//     let battingPoints = 0;
//     let bowlingPoints = 0;
//     let fieldingPoints = 0;
//     let battingrun = 0;
//     let bowlingrun = 0;
//     let battingball = 0;
//     let bowlingball = 0;
//     let four = 0;
//     let six = 0;
//     let sr = 0;
//     let eco = 0;
//     let maiden = 0;
//     let over = 0;
//     let bowlerwickets = 0;
//     let team = team1?.id === player.teamId ? team1?.team_name : team2?.team_name;
//     let teamletter = team1?.id === player.teamId ? team1?.letter : team2?.letter;
//     let teamcolor = team1?.id === player.teamId ? team1?.team_color : team2?.team_color;
//     let team1Logo = team1?.team_logo ? team1?.team_logo : null
//     let team2Logo = team2?.team_logo ? team2?.team_logo : null
//     let teamthumbnail = team1?.id === player.teamId ? team1Logo : team2Logo;
//     let playerthumbnail = player?.playerImage

//     // Batting Points Calculation
//     const playerscores = wickets?.filter(wicket => wicket.BatterId === player.id);

//     playerscores.forEach(wicket => {

//         // 1 point for every 2 runs
//         battingPoints += Math.floor(wicket.run / 2);
//         battingrun += parseInt(wicket.run)
//         four += parseInt(wicket.four)
//         six += parseInt(wicket.six)
//         battingball += parseInt(wicket.balls)
//         sr = parseInt((wicket.run / wicket.balls) * 100)

//         // Half-century and century points
//         if (wicket.run >= 50 && wicket.run < 100) battingPoints += 5;
//         if (wicket.run >= 100) battingPoints += 10;

//         // Strike rate points
//         if ((wicket.run / wicket.balls) * 100 >= 80 && (wicket.run / wicket.balls) * 100 < 100) battingPoints += 2;
//         if ((wicket.run / wicket.balls) * 100 > 100) battingPoints += 4;

//         // Boundary points
//         battingPoints += wicket.four;
//         battingPoints += 2 * wicket.six;
//     });


//     const bowlerTotalScore = economy.filter(data => data.bowlerId === player.id);
//     const bowlerOverLength = economy
//         .filter(data => data.bowlerId === player.id)
//         .reduce((totalOvers, data) => {
//             if (data.legalBall === 6) {
//                 return totalOvers + 1;
//             } else {
//                 return totalOvers + (data.legalBall / 10);
//             }
//         }, 0);
//     const roundedBowlerOverLength = Math.round(bowlerOverLength * 10) / 10;
//     const targetBowlerId = player.id;
//     over += roundedBowlerOverLength

//     bowlerTotalScore.forEach(bowler => {
//         if (bowler.bowlerId === targetBowlerId) {
//             bowlingrun = bowler.bowlerrun
//             bowlerwickets = bowler.bowlerwicket
//             bowlingball += bowler.legalBall;
//         }
//     });

//     bowlingPoints += bowlerwickets * 10
//     if (bowlerwickets >= 3 && bowlerwickets < 5) bowlingPoints += 5
//     if (bowlerwickets >= 5) bowlingPoints += 10
//     const economyRate = bowlingrun / roundedBowlerOverLength;
//     eco = economyRate.toString().slice(0, 5)         
//     if (economyRate < 2) bowlingPoints += 10;
//     if (economyRate > 2 && economyRate <= 5) bowlingPoints += 8;
//     if (economyRate > 5 && economyRate <= 7) bowlingPoints += 6;
//     if (economyRate > 7 && economyRate <= 10) bowlingPoints += 4;
//     if (economyRate > 10) bowlingPoints += 2;

//     const bowlerScores = economy.filter(data => data.bowlerId === player.id);

//     if (bowlerScores) {
//         bowlerScores.forEach(bowlerScore => {
//             const intKeysValues = Object.keys(bowlerScore)
//                 .filter(key => !isNaN(key))
//                 .map(key => bowlerScore[key]);

//             if (intKeysValues.every(value => (value === "0" || value === "W" || value === "LB" || value === "1LB" || value === "2LB" || value === "3LB" || value === "4LB" || value === "5LB" || value === "6LB"))) {
//                 maiden += 1;
//             }
//         });
//     }

//     bowlingPoints += maiden * 2

//     // Fielding Points Calculation
//     const fieldingScore = wickets?.filter(wicket => wicket.fielder === player.id);
//     fieldingScore.forEach(() => {
//         fieldingPoints += 10;
//     });


//     return {
//         playerName: player.playerName,
//         playerthumbnail,
//         playerletter: player.letter,
//         playercolor: player.playerColor,
//         team,
//         teamthumbnail,
//         teamletter,
//         teamcolor,
//         battingrun,
//         battingball,
//         four,
//         six,
//         sr,
//         bowlingrun,
//         bowlingball,
//         bowlerwickets,
//         eco,
//         maiden,
//         over,
//         bowlingPoints,
//         battingPoints,
//         fieldingPoints,
//         totalPoints: battingPoints + bowlingPoints + fieldingPoints,
//     };
// };

const Mvp = ({ matchData, playerData, type, teamData, tournamentData }) => {
    const router = useRouter()
    const [winnerTeam, setWinnerTeam] = useState([])
    const [team1, setTeam1] = useState([])
    const [team2, setTeam2] = useState([])
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
    const [matchPlayers, setMatchPlayers] = useState([])
    const [mvpPoints, setMvpPoints] = useState([])
    const team_data = useSelector(teamsState)

    useEffect(() => {
        let team1 = team_data?.data?.find((items) => items?.id === matchData?.team1?.id)
        let team2 = team_data?.data?.find((items) => items?.id === matchData?.team2?.id)
        setTeam1(team1)
        setTeam2(team2)
        if (matchData?.team1?.id === matchData?.matchWinner) {
            setWinnerTeam(team1)
        } else if (matchData?.team2?.id === matchData?.matchWinner) {
            setWinnerTeam(team2)
        }
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
        const firstInningscompletedOver = matchData?.firstInnings?.Completedovers?.[matchData?.firstInnings?.Completedovers.length - 1];
        const secondInningscompletedOver = matchData?.secondInnings?.Completedovers?.[matchData?.secondInnings?.Completedovers.length - 1];
        const teamOneBattingFirst = (matchData?.toss?.tossWinner === team1?.id && matchData?.toss?.selectSide === "Bat") || (matchData?.toss?.tossWinner !== team1?.id && matchData?.toss?.selectSide !== "Bat")
        const teamTwoBattingFirst = (matchData?.toss?.tossWinner === team2?.id && matchData?.toss?.selectSide === "Bat") || (matchData?.toss?.tossWinner !== team2?.id && matchData?.toss?.selectSide !== "Bat")

        if (teamOneBattingFirst) {
            setTeam1Score({
                run: firstInningscompletedOver?.runs,
                wicket: firstInningscompletedOver?.wicket,
                over: firstInningscompletedOver?.legalBall === 6 ? matchData?.firstInnings?.Completedovers?.length : matchData?.firstInnings?.Completedovers?.length - 1,
                ball: firstInningscompletedOver?.legalBall === 6 ? 0 : firstInningscompletedOver?.legalBall
            })
        } else if (teamTwoBattingFirst) {
            setTeam2Score({
                run: firstInningscompletedOver?.runs,
                wicket: firstInningscompletedOver?.wicket,
                over: firstInningscompletedOver?.legalBall === 6 ? matchData?.firstInnings?.Completedovers?.length : matchData?.firstInnings?.Completedovers?.length - 1,
                ball: firstInningscompletedOver?.legalBall === 6 ? 0 : firstInningscompletedOver?.legalBall
            })
        }

        if (!teamOneBattingFirst) {
            setTeam1Score({
                run: secondInningscompletedOver?.runs,
                wicket: secondInningscompletedOver?.wicket,
                over: secondInningscompletedOver?.legalBall === 6 ? matchData?.secondInnings?.Completedovers?.length : matchData?.secondInnings?.Completedovers?.length - 1,
                ball: secondInningscompletedOver?.legalBall === 6 ? 0 : secondInningscompletedOver?.legalBall
            })
        } else if (!teamTwoBattingFirst) {
            setTeam2Score({
                run: secondInningscompletedOver?.runs,
                wicket: secondInningscompletedOver?.wicket,
                over: secondInningscompletedOver?.legalBall === 6 ? matchData?.secondInnings?.Completedovers?.length : matchData?.secondInnings?.Completedovers?.length - 1,
                ball: secondInningscompletedOver?.legalBall === 6 ? 0 : secondInningscompletedOver?.legalBall
            })
        }

    }, [matchData?.firstInnings, matchData?.secondInnings, team1, team2])

    useEffect(() => {
        history.pushState(null, '', router.asPath);
        window.addEventListener('popstate', function (event) {
            history.pushState(null, '', router.push('/'));
        });
    }, [])

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

        const Economy = [
            ...(matchData?.firstInnings?.Completedovers ?? []),
            ...(matchData?.secondInnings?.Completedovers ?? [])
        ]

        const TestEconomy = [
            ...(matchData?.superOverFirstInnings?.Completedovers ?? []),
            ...(matchData?.superOverSecondInnings?.Completedovers ?? []),
        ]

        let winnerTeamIs = '';
        if (matchData?.matchWinner) {
            winnerTeamIs = teamData.find(item => item?.team_name === matchData?.matchWinner)
        }

        const playersWithPoints = matchPlayers.map(player => {
            const playerMVP = tournamentData?.match_type === "Test Match" ? calculateMVPPoints(player, TestWickets, TestEconomy, team1, team2, winnerTeamIs, Economy) : calculateMVPPoints(player, allWickets, Economy, team1, team2, winnerTeamIs);
            return playerMVP;
        });

        setMvpPoints(playersWithPoints);
    }, [matchPlayers, matchData]);

    return (
        type === 'mvp' ?
            <Matchstats
                currentMatch={matchData}
                mvpPoints={mvpPoints}
            />
            :
            <SummaryPage
                currentMatch={matchData}
                team1={team1}
                team1Score={team1Score}
                team2={team2}
                team2Score={team2Score}
                mvpPoints={mvpPoints}
                type={'user'}
            />
    )

}

export default Mvp