'use client'
import { debounce, leaderBoardShorting } from "@/components/common/commomFunction";
import Loader from "@/components/common/commonUi/Loader";
import { getWindowDimensions } from "@/components/common/maxHeightFunction";
import AuctionPage from "@/pages/Auction/Auctionpage/AuctionPage";
import Leaderboard from "@/pages/Leaderboard/Leaderboard";
import PointTable from "@/pages/PointTable/PointTable";
import Stats from "@/pages/Stats/Stats";
import AboutPage from "@/pages/Tournament/TeamPage/TeamPage";
import About from "@/pages/UserUi/About/About";
import MatchPage from "@/pages/UserUi/Match/Match";
import { matchesState } from "@/redux/slices/matchSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";


const TournamentCategory = () => {
  const { id, category = 'match' } = useParams();
  const teams = useSelector(teamsState);
  const tournament_data = useSelector(tournamentState);
  const match_data = useSelector(matchesState);
  const player_data = useSelector(playersState);

  const [teamData, setTeamData] = useState([]);
  const [matchData, setMatchData] = useState([])
  const [tournamentData, setTournamentData] = useState({})
  const [playerData, setPlayerData] = useState([])
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [bannerHeight, setBannerHeight] = useState(0)

  useEffect(() => {
    if (!id || !tournament_data?.data?.length) return;

    setTournamentData(tournament_data.data.find((item) => item?.id === id));
    setTeamData(teams.data.filter((item) => item?.tournamentId === id));
    setMatchData(match_data.data.filter((item) => item?.tournamentId === id));

    const filteredPlayers = player_data.data.filter((item) => item?.tournamentId === id);
    setPlayerData(leaderBoardShorting(filteredPlayers));
  }, [id, tournament_data?.data, teams?.data, match_data?.data, player_data?.data]);

  useEffect(() => {
    const handleResize = () => {
      updateHeight();
    };
    const debouncedResize = debounce(handleResize, 300);
    updateHeight();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const updateHeight = () => {
    const pageElement = document.getElementById("tournament-Banner");
    setBannerHeight(pageElement ? pageElement.offsetHeight : 0);
    setWindowDimensions(getWindowDimensions());
  };

  const RenderContent = useMemo(() => {
    switch (category) {
      case 'about':
        return <About tournamentData={tournamentData} />;
      case 'stats':
        return <Stats tournamentData={tournamentData} />
      case 'teams':
        return <AboutPage tournamenId={id} teamData={teamData} type={'userteams'} />;
      case 'pointable':
        return <PointTable teamData={teamData} tournamentData={tournamentData} />;
      case 'match':
        return <MatchPage teamData={teamData} tournamentData={tournamentData} matchData={matchData} tournamenId={id} />;
      case 'leaderboard':
        return <Leaderboard playerData={playerData} teamData={teamData} />;
      case 'auction':
        return <AuctionPage tournamentData={tournamentData} isUser={true} />;
      default:
        return null;
    }
  }, [category, id, tournamentData, teamData, matchData, playerData]);

  let contentHeight = windowDimensions?.height - bannerHeight;

  return (
    // <Box sx={{ minHeight: `${contentHeight - 80}px`, overflowY: "auto"}}>
    <Box>
      {RenderContent}
    </Box>
  )
}

export default TournamentCategory