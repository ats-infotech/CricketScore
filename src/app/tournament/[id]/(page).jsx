'use client'
import TournamentBanner from "@/pages/Tournament/TournamentBanner/TournamentBanner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const Tournament = () => {
    const params = useParams()
    const router = useRouter()
    const tournamentData = useSelector(state => state?.tournament?.data || [])
    const [getTournament, setGetTournament] = useState(null)

    useEffect(() => {
        if (!params?.id || !Array.isArray(tournamentData)) return;

        let result = tournamentData.find((d, i) => d?.id === params?.id)
        setGetTournament(result);
    }, [params?.id, tournamentData]);

    const handleNavigation = (value) => {
        router.push(`/tournament/${params.id}/${value}`);
    };

    return (
        <TournamentBanner
            data={getTournament}
            handleNavigation={handleNavigation}
            params={params}
            type='userTournament'
            back={'home'}
        />
    )
}

export default Tournament