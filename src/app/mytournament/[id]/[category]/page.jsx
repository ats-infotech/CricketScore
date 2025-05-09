'use client'
import { debounce, leaderBoardShorting } from "@/components/common/commomFunction";
import { getMainContainerDimensions, getWindowDimensions } from "@/components/common/maxHeightFunction";
import AuctionMVP from "@/pages/Auction/Auctionmvp/AuctionMVP";
import AuctionPage from "@/pages/Auction/Auctionpage/AuctionPage";
import AuctionPlayerPage from "@/pages/Auction/Auctionplayer/AuctionPlayerPage";
import Leaderboard from "@/pages/Leaderboard/Leaderboard";
import PointTable from "@/pages/PointTable/PointTable";
import Stats from "@/pages/Stats/Stats";
import AboutPage from "@/pages/Tournament/AboutPage/AboutPage";
import Matches from "@/pages/Tournament/Matches/Matches";
import TeamPage from "@/pages/Tournament/TeamPage/TeamPage";
import { auctionState } from "@/redux/slices/auctionSlice";
import { matchesState } from "@/redux/slices/matchSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const TournamentCategory = () => {
  const { id, category = 'about' } = useParams();
  const tournament_data = useSelector(tournamentState);
  const match_data = useSelector(matchesState);
  const teams = useSelector(teamsState);
  const player_data = useSelector(playersState);
  const auction_data = useSelector(auctionState)
  const [teamData, setTeamData] = useState([]);
  const [matchData, setMatchData] = useState([])
  const [tournamentData, setTournamentData] = useState({})
  const [auctionData, setAuctionData] = useState({})
  const [playerData, setPlayerData] = useState([])
  const [windowDimensions, setWindowDimensions] = useState(getMainContainerDimensions());
  const [bannerHeight, setBannerHeight] = useState(0)

  useEffect(() => {
    if (!id || !tournament_data?.data?.length) return;
    let tournament = tournament_data.data.find((item) => item?.id === id)
    setTournamentData(tournament);
    setTeamData(teams.data.filter((item) => item?.tournamentId === id));
    setMatchData(match_data.data.filter((item) => item?.tournamentId === id));
    setAuctionData(auction_data?.data.find((item) => item?.tournamentId === tournament?.id))

    const filteredPlayers = player_data.data.filter((item) => item?.tournamentId === id);
    setPlayerData(leaderBoardShorting(filteredPlayers));
  }, [id, tournament_data?.data, teams?.data, match_data?.data, player_data?.data, auction_data?.data]);


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

  const commonProps = {
    tournamentData,
    teamData,
    playerData,
  };

  const componentMap = {
    about: <AboutPage {...commonProps} />,
    stats: <Stats tournamentData={tournamentData} />,
    teams: <TeamPage tournamentData={tournamentData} tournamenId={id} teamData={teamData} type="about" />,
    pointable: <PointTable teamData={teamData} tournamentData={tournamentData} matchData={matchData} />,
    match: <Matches />,
    leaderboard: <Leaderboard playerData={playerData} teamData={teamData} />,
    auction: <AuctionPage tournamentData={tournamentData} />,
    players: <AuctionPlayerPage tournamentData={tournamentData} playerData={playerData} />,
    mvp: <AuctionMVP auctionData={auctionData} teamData={teamData} playerData={playerData} />,
  };

  const RenderContent = useMemo(() => componentMap[category] ?? null, [
    category,
    id,
    tournamentData,
    teamData,
    matchData,
    playerData,
    auctionData,
  ]);

  // const RenderContent = useMemo(() => {
  //   switch (category) {
  //     case 'about':
  //       return <AboutPage tournamentData={tournamentData} teamData={teamData} playerData={playerData} />;
  //     case 'stats':
  //       return <Stats tournamentData={tournamentData} />
  //     case 'teams':
  //       return <TeamPage tournamentData={tournamentData} tournamenId={id} teamData={teamData} type={'about'} />;
  //     case 'pointable':
  //       return <PointTable teamData={teamData} tournamentData={tournamentData} matchData={matchData} />;
  //     case 'match':
  //       return <Matches />;
  //     case 'leaderboard':
  //       return <Leaderboard playerData={playerData} teamData={teamData} />;
  //     case 'auction':
  //       return <AuctionPage tournamentData={tournamentData} />;
  //     case 'players':
  //       return <AuctionPlayerPage tournamentData={tournamentData} playerData={playerData} />
  //     case 'mvp':
  //       return <AuctionMVP auctionData={auctionData} teamData={teamData} playerData={playerData} />
  //     default:
  //       return null;
  //   }
  // }, [category, id, tournamentData, teamData, matchData, playerData]);

  let contentHeight = windowDimensions?.height - bannerHeight;

  return (
    <Box className='AlltabBox'
      // sx={{
      //   minHeight: `${contentHeight - 80}px`,
      //   overflowY: "auto"
      // }}
      id='alltabBoxMain'>
      {RenderContent}
    </Box>
  )
}

export default TournamentCategory