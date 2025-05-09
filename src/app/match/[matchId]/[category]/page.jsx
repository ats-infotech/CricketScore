'use client'
import Loader from "@/components/common/commonUi/Loader";
import CommentaryPage from "@/pages/Commentary/Commentary";
import ScoreAnalysis from "@/pages/UserUi/Analysis/Analysis";
import LiveMatch from "@/pages/UserUi/Live/Live";
import MatchSummary from "@/pages/UserUi/MatchSummary/MatchSummary";
import Mvp from "@/pages/UserUi/MVP/Mvp";
import Scorecard from "@/pages/UserUi/Scorecard/Scorecard";
import Teams from "@/pages/UserUi/Teams/Teams";
import { matchesState } from "@/redux/slices/matchSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const MatchCategory = () => {
  const { category = 'live', matchId } = useParams();
  const [teamData, setTeamData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [tournamentData, setTournamentData] = useState([])
  const teams = useSelector(teamsState);
  const match_data = useSelector(matchesState);
  const player_data = useSelector(playersState);
  const tournament_data = useSelector(tournamentState)

  useEffect(() => {
    let result = match_data?.data.find((d, i) => d?.id === matchId)
    setMatchData(result);
    const filterTournament = tournament_data.data.find((items) => items?.id === result?.tournamentId)
    const filteredTeams = teams.data.filter((item) => item?.tournamentId === result?.tournamentId);
    const filteredPlayer = player_data.data.filter((item) => item?.tournamentId === result?.tournamentId);
    setTournamentData(filterTournament)
    setTeamData(filteredTeams);
    setPlayerData(filteredPlayer);
  }, [matchId]);

  const commonProps = {
    matchData,
    playerData,
    teamData,
    tournamentData,
  };

  const componentMap = useMemo(() => ({
    live: <LiveMatch {...commonProps} />,
    summary: <MatchSummary {...commonProps} />,
    scorecard: <Scorecard {...commonProps} />,
    commentary: <CommentaryPage {...commonProps} />,
    analysis: <ScoreAnalysis matchData={matchData} tournamentData={tournamentData} />,
    cricketbox: <Mvp {...commonProps} />,
    mvp: <Mvp {...commonProps} type="mvp" />,
    teams: <Teams matchData={matchData} playerData={playerData} />,
  }), [matchData, playerData, teamData, tournamentData])
  
  const RenderContent = () => componentMap[category] ?? <Loader />;
  // const RenderContent = () => {
  //   switch (category) {
  //     case 'live':
  //       return <LiveMatch matchData={matchData} playerData={playerData} teamData={teamData} tournamentData={tournamentData} />;
  //     case 'summary':
  //       return <MatchSummary matchData={matchData} playerData={playerData} teamData={teamData} tournamentData={tournamentData} />
  //     case 'scorecard':
  //       return <Scorecard matchData={matchData} teamData={teamData} playerData={playerData} tournamentData={tournamentData} />
  //     case 'commentary':
  //       return <CommentaryPage matchData={matchData} teamData={teamData} playerData={playerData} tournamentData={tournamentData} />;
  //     case 'analysis':
  //       return <ScoreAnalysis matchData={matchData} tournamentData={tournamentData} />
  //     case 'cricketbox':
  //       return <Mvp matchData={matchData} playerData={playerData} teamData={teamData} tournamentData={tournamentData} />;
  //     case 'mvp':
  //       return <Mvp matchData={matchData} playerData={playerData} type={'mvp'} teamData={teamData} tournamentData={tournamentData} />;
  //     case 'teams':
  //       return <Teams matchData={matchData} playerData={playerData} />;
  //     default:
  //       return <Loader />;
  //   }
  // };

  return (
    <RenderContent />
  )
}

export default MatchCategory