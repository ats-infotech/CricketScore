'use client'
import TournamentBanner from "@/pages/Tournament/TournamentBanner/TournamentBanner";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Tournament = () => {
    const params = useParams()
    const router = useRouter()
    const [getTournament, setGetTournament] = useState(null)

    const tornament_data = useSelector(tournamentState);

    useEffect(() => {
        let result = tornament_data.data.find((d, i) => d?.id === params?.id)
        setGetTournament(result || {});
    }, [params.id]);

    const handleNavigation = (value) => {
        router.push(`/mytournament/${params.id}/${value}`);
    };

    return (
        <TournamentBanner
            data={getTournament}
            handleNavigation={handleNavigation}
            params={params}
            type='adminTournament'
            back={'mytournaments'}
        />
    )
}

export default Tournament