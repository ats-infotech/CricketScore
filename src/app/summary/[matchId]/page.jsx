'use client'
import { calculateMVPPoints } from "@/components/common/commomFunction"
import SummaryPage from "@/pages/Summary/Summary"
import { matchesState } from "@/redux/slices/matchSlice"
import { playersState } from "@/redux/slices/playersSlice"
import { teamsState } from "@/redux/slices/teamSlice"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// const calculateMVPPoints = (player, wickets, economy, team1, team2) => {
//   let battingPoints = 0;
//   let bowlingPoints = 0;
//   let fieldingPoints = 0;
//   let battingrun = 0;
//   let bowlingrun = 0;
//   let battingball = 0;
//   let bowlingball = 0;
//   let four = 0;
//   let six = 0;
//   let sr = 0;
//   let eco = 0;
//   let maiden = 0;
//   let over = 0;
//   let bowlerwickets = 0;
//   let team = team1?.id === player.teamId ? team1?.team_name : team2?.team_name;
//   let teamletter = team1?.id === player.teamId ? team1?.letter : team2?.letter;
//   let teamcolor = team1?.id === player.teamId ? team1?.team_color : team2?.team_color;
//   let team1Logo = team1?.team_logo ? team1?.team_logo : null
//   let team2Logo = team2?.team_logo ? team2?.team_logo : null
//   let teamthumbnail = team1?.id === player.teamId ? team1Logo : team2Logo;
//   let playerthumbnail = player?.playerImage

//   // Batting Points Calculation
//   const playerscores = wickets?.filter(wicket => wicket.BatterId === player.id);
//   playerscores.forEach(wicket => {
//     // 1 point for every 2 runs
//     battingPoints += Math.floor(wicket.run / 2);
//     battingrun += parseInt(wicket.run)
//     four += parseInt(wicket.four)
//     six += parseInt(wicket.six)
//     battingball += parseInt(wicket.balls)
//     sr = parseInt((wicket.run / wicket.balls) * 100)

//     // Half-century and century points
//     if (wicket.run >= 50 && wicket.run < 100) battingPoints += 5;
//     if (wicket.run >= 100) battingPoints += 10;

//     // Strike rate points
//     if ((wicket.run / wicket.balls) * 100 >= 80 && (wicket.run / wicket.balls) * 100 < 100) battingPoints += 2;
//     if ((wicket.run / wicket.balls) * 100 > 100) battingPoints += 4;

//     // Boundary points
//     battingPoints += wicket.four;
//     battingPoints += 2 * wicket.six;
//   });

//   const bowlerTotalScore = economy.filter(data => data.bowlerId === player.id);
//   const bowlerOverLength = economy
//     .filter(data => data.bowlerId === player.id)
//     .reduce((totalOvers, data) => {
//       if (data.legalBall === 6) {
//         return totalOvers + 1;
//       } else {
//         return totalOvers + (data.legalBall / 10);
//       }
//     }, 0);
//   const roundedBowlerOverLength = Math.round(bowlerOverLength * 10) / 10;
//   const targetBowlerId = player.id;
//   over += roundedBowlerOverLength

//   bowlerTotalScore.forEach(bowler => {
//     if (bowler.bowlerId === targetBowlerId) {
//       bowlingrun = bowler.bowlerrun
//       bowlerwickets = bowler.bowlerwicket
//       bowlingball += bowler.legalBall;
//     }
//   });

//   bowlingPoints += bowlerwickets * 10
//   if (bowlerwickets >= 3 && bowlerwickets < 5) bowlingPoints += 5
//   if (bowlerwickets >= 5) bowlingPoints += 10
//   const economyRate = bowlingrun / roundedBowlerOverLength;
//   eco = economyRate.toString().slice(0, 5)
//   if (economyRate < 2) bowlingPoints += 10;
//   if (economyRate > 2 && economyRate <= 5) bowlingPoints += 8;
//   if (economyRate > 5 && economyRate <= 7) bowlingPoints += 6;
//   if (economyRate > 7 && economyRate <= 10) bowlingPoints += 4;
//   if (economyRate > 10) bowlingPoints += 2;

//   const bowlerScores = economy.filter(data => data.bowlerId === player.id);

//   if (bowlerScores) {
//     bowlerScores.forEach(bowlerScore => {
//       if (bowlerScore.bowlerId === targetBowlerId && bowlerScore.legalBall === 6) {
//         const intKeysValues = Object.keys(bowlerScore)
//           .filter(key => !isNaN(key))
//           .map(key => bowlerScore[key]);

//         if (intKeysValues.every(value => (value === "0" || value === "W" || value === "LB" || value === "1LB" || value === "2LB" || value === "3LB" || value === "4LB" || value === "5LB" || value === "6LB"))) {
//           maiden += 1;
//         }
//       }
//     });
//   }

//   bowlingPoints += maiden * 2

//   // Fielding Points Calculation
//   const fieldingScore = wickets?.filter(wicket => wicket.fielder === player.id);
//   fieldingScore.forEach(() => {
//     fieldingPoints += 10;
//   });


//   return {
//     playerName: player.playerName,
//     playerthumbnail,
//     playerletter: player.letter,
//     playercolor: player.playerColor,
//     team,
//     teamthumbnail,
//     teamletter,
//     teamcolor,
//     battingrun,
//     battingball,
//     four,
//     six,
//     sr,
//     bowlingrun,
//     bowlingball,
//     bowlerwickets,
//     eco,
//     maiden,
//     over,
//     bowlingPoints,
//     battingPoints,
//     fieldingPoints,
//     totalPoints: battingPoints + bowlingPoints + fieldingPoints,
//   };
// };

const Summary = () => {
  const params = useParams()
  // const router = useRouter()

  //Redux Data

  const match_data = useSelector(matchesState)
  const team_data = useSelector(teamsState)
  const player_data = useSelector(playersState)
  const tournament_data = useSelector(tournamentState)

  const [currentMatch, setCurrentMatch] = useState([])
  const [winnerTeam, setWinnerTeam] = useState([])
  const [tournamentData, setTournamentData] = useState([])
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
  // const [loading, setLoading] = useState(false)
  const [tossWinner, setTossWinner] = useState({
    tossWinner: "",
    battingSide: "",
    bowlingSide: ""
  })
  let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
  let CurrentInnings = currentMatch?.currentInnings

  useEffect(() => {
    // setLoading(true)
    let startedMatch = match_data.data?.find((item) => item?.id === params.matchId)
    let filterCurrentTournament = tournament_data?.data?.find((item) => item?.id === startedMatch?.tournamentId)
    setTournamentData(filterCurrentTournament)
    setCurrentMatch(startedMatch)
    // setLoading(false)
  }, [params, match_data, team_data]);

  useEffect(() => {
    let team1 = team_data?.data?.find((items) => items?.id === currentMatch?.team1?.id)
    let team2 = team_data?.data?.find((items) => items?.id === currentMatch?.team2?.id)
    setTeam1(team1)
    setTeam2(team2)
    if (currentMatch?.team1?.id === currentMatch?.matchWinner) {
      setWinnerTeam(team1)
    } else if (currentMatch?.team2?.id === currentMatch?.matchWinner) {
      setWinnerTeam(team2)
    }
  }, [currentMatch, team_data])

  useEffect(() => {
    let team1player = player_data?.data?.filter(item => item?.teamId === team1?.id);
    let team1XIplayer = currentMatch?.selectedPlayer?.team1;
    let commonPlayerTeam1 = team1player.filter(item => team1XIplayer?.includes(item?.id));
    let team2player = player_data?.data?.filter(item => item?.teamId === team2?.id);
    let team2XIplayer = currentMatch?.selectedPlayer?.team2;
    let commonPlayerTeam2 = team2player.filter(item => team2XIplayer?.includes(item?.id));
    const matchPlayers = [...commonPlayerTeam1, ...commonPlayerTeam2];
    setMatchPlayers(matchPlayers);
  }, [player_data, team1, team2])

  useEffect(() => {
    if (isTestMatch) {
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

        if ((CurrentInnings === 2 || (CurrentInnings === 4 && currentMatch?.followOn !== "Follow On")) || (CurrentInnings === 3 && currentMatch?.followOn === "Follow On")) {
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
  }, [team1, team2, currentMatch, currentMatch?.toss, currentMatch?.superOverCount]);

  const setScore = (innings, team, camedinnings) => {
    const completedOver = innings?.Completedovers?.[innings?.Completedovers.length - 1] || [];
    const isTeamBatting = (camedinnings === 1 && currentMatch?.toss?.tossWinner === team?.id && currentMatch?.toss?.selectSide === "Bat")
      || (camedinnings === 1 && currentMatch?.toss?.tossWinner !== team?.id && currentMatch?.toss?.selectSide !== "Bat")
      || (camedinnings === 2 && currentMatch?.toss?.tossWinner === team?.id && currentMatch?.toss?.selectSide !== "Bat")
      || (camedinnings === 2 && currentMatch?.toss?.tossWinner !== team?.id && currentMatch?.toss?.selectSide === "Bat")

    if (isTeamBatting) {
      return {
        run: completedOver?.runs || 0,
        wicket: completedOver?.wicket || 0,
        over: completedOver?.legalBall === 6 ? innings?.Completedovers?.length || 0 : innings?.Completedovers?.length - 1 || 0,
        ball: completedOver?.legalBall === 6 ? 0 : completedOver?.legalBall || 0
      };
    }
    return null;
  };

  useEffect(() => {
    const firstInningsScore1 = setScore(currentMatch?.firstInnings, team1, 1);
    const firstInningsScore2 = setScore(currentMatch?.firstInnings, team2, 1);
    const secondInningsScore1 = setScore(currentMatch?.secondInnings, team1, 2);
    const secondInningsScore2 = setScore(currentMatch?.secondInnings, team2, 2);

    if (firstInningsScore1) setTeam1Score(firstInningsScore1);
    if (firstInningsScore2) setTeam2Score(firstInningsScore2);
    if (secondInningsScore1) setTeam1Score(secondInningsScore1);
    if (secondInningsScore2) setTeam2Score(secondInningsScore2);
  }, [currentMatch?.firstInnings, currentMatch?.secondInnings, team1, team2, currentMatch?.toss]);

  // useEffect(() => {
  //   history.pushState(null, '', router.asPath);
  //   window.addEventListener('popstate', function (event) {
  //     history.pushState(null, '', router.push(`/mytournament/${currentMatch?.tournamentId}/match`));
  //   });
  // }, [])

  useEffect(() => {
    const allWickets = [
      ...(currentMatch?.firstInnings?.Wickets ?? []),
      ...(currentMatch?.secondInnings?.Wickets ?? []),
    ];

    const TestWickets = [
      ...(currentMatch?.firstInnings?.Wickets ?? []),
      ...(currentMatch?.secondInnings?.Wickets ?? []),
      ...(currentMatch?.superOverFirstInnings?.Wickets ?? []),
      ...(currentMatch?.superOverSecondInnings?.Wickets ?? []),
    ]

    const Economy = [
      ...(currentMatch?.firstInnings?.Completedovers ?? []),
      ...(currentMatch?.secondInnings?.Completedovers ?? [])
    ]

    const TestEconomy = [
      ...(currentMatch?.superOverFirstInnings?.Completedovers ?? []),
      ...(currentMatch?.superOverSecondInnings?.Completedovers ?? []),
    ]

    let winnerTeamIs = '';
    if (currentMatch?.matchWinner && team1 && team2) {
      winnerTeamIs = [team1, team2].find(item => item?.id === currentMatch?.matchWinner)
    }

    const playersWithPoints = matchPlayers.map(player => {
      const playerMVP = tournamentData?.match_type === "Test Match" ? calculateMVPPoints(player, TestWickets, Economy, team1, team2, winnerTeamIs, TestEconomy) : calculateMVPPoints(player, allWickets, Economy, team1, team2, winnerTeamIs);
      return playerMVP;
    });

    setMvpPoints(playersWithPoints);
  }, [matchPlayers, currentMatch]);

  // if (!loading && (!currentMatch || currentMatch?.status !== 4)) return <Custom404 />

  return (
    <SummaryPage
      winner={winnerTeam}
      currentMatch={currentMatch}
      team1={team1}
      team1Score={team1Score}
      team2={team2}
      team2Score={team2Score}
      mvpPoints={mvpPoints}
      tournamentData={tournamentData}
      tossWinner={tossWinner}
    />
  )
}

export default Summary