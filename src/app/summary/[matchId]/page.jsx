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

const Summary = () => {
  const params = useParams()

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
  const [tossWinner, setTossWinner] = useState({
    tossWinner: "",
    battingSide: "",
    bowlingSide: ""
  })
  let isTestMatch = tournamentData?.match_type === "Test Match" ? true : false
  let CurrentInnings = currentMatch?.currentInnings

  useEffect(() => {
    let startedMatch = match_data.data?.find((item) => item?.id === params.matchId)
    let filterCurrentTournament = tournament_data?.data?.find((item) => item?.id === startedMatch?.tournamentId)
    setTournamentData(filterCurrentTournament)
    setCurrentMatch(startedMatch)
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