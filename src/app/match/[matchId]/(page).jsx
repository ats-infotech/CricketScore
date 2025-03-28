'use client'
import TournamentBanner from "@/pages/Tournament/TournamentBanner/TournamentBanner";
import { matchesState } from "@/redux/slices/matchSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const Match = () => {
    const params = useParams()
    const router = useRouter()
    const [getMatch, setGetMatch] = useState(null)
    const [tournamentData, setTournamentData] = useState([])
    const tournament_data = useSelector(tournamentState)
    const match_data = useSelector(matchesState);

    useEffect(() => {
        let result = match_data?.data.find((d, i) => d?.id === params?.matchId)
        const filterTournament = tournament_data.data.find((items) => items?.id === result?.tournamentId)
        setTournamentData(filterTournament)
        setGetMatch(result);
    }, [params]);

    const handleNavigation = (value) => {
        router.push(`/match/${params.matchId}/${value}`);
    };

    return (
        <TournamentBanner
            data={getMatch}
            handleNavigation={handleNavigation}
            params={params}
            type={'match'}
            back={'tournament'}
            tournamentData={tournamentData}
        />
    )
}

export default Match