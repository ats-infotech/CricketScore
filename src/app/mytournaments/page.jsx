'use client'
import Tournament from "@/pages/Tournament/Tournament";
import { matchesState } from "@/redux/slices/matchSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyTournament = () => {
    const [tournamentData, setTournamentData] = useState([])
    const [matchData, setmatchData] = useState([])

    const tornament_data = useSelector(tournamentState);
    const match_data = useSelector(matchesState);
    const router = useRouter()

    useEffect(() => {
        setTournamentData(tornament_data?.data)
        setmatchData(match_data?.data)
    }, [tornament_data]);

    return (
        <>
            <Tournament type={'admin'} tournamentData={tournamentData || []} matchData={matchData} openDrawer={() => router.push('registeredTornaments')} />
        </>
    )
}

export default MyTournament