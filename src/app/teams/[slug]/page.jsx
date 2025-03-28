'use client'
import Team from "@/pages/Teams/Team"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Teams = () => {
    const [tournamentData, setTournamentData] = useState(null)
    const params = useParams()
    const tournament_data = useSelector(tournamentState)

    useEffect(() => {
        let result = tournament_data.data.find(item => item?.id === params.slug)
        setTournamentData(result);
    }, [params])

    return (
        tournamentData && <Team tournamentData={tournamentData} type='add'/>
    )
}

export default Teams