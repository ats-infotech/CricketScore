'use client'
import { leaderBoardShorting } from "@/components/common/commomFunction";
import AuctionMVP from "@/pages/Auction/Auctionmvp/AuctionMVP";
import { auctionState } from "@/redux/slices/auctionSlice";
import { playersState } from "@/redux/slices/playersSlice";
import { teamsState } from "@/redux/slices/teamSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AuctionMvp = () => {
    const { auctionId } = useParams()
    const teams = useSelector(teamsState);
    const player_data = useSelector(playersState);
    const auction_data = useSelector(auctionState)

    const [auctionData, setAuctionData] = useState({})
    const [playerData, setPlayerData] = useState([])
    const [teamData, setTeamData] = useState([]);

    useEffect(() => {
        if (!auctionId) return;
        const auction = auction_data?.data.find((item) => item?.id === auctionId)
        setAuctionData(auction)
        setTeamData(teams.data.filter((item) => item?.tournamentId === auction?.tournamentId));
        const filteredPlayers = player_data.data.filter((item) => item?.tournamentId === auction?.tournamentId);
        setPlayerData(leaderBoardShorting(filteredPlayers));
    }, [auctionId, teams?.data, player_data?.data, auction_data?.data]);

    return (
        <AuctionMVP auctionData={auctionData} teamData={teamData} playerData={playerData} type='page'/>
    )
}

export default AuctionMvp