'use client'

import CreateTournament from "@/pages/Tournament/CreateTournament/CreateTournament"
import { tournamentState } from "@/redux/slices/tournamentSlice"
import { Box } from "@mui/material"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const EditTournament = () => {

    const [tournament, setTournament] = useState([])
    const tournament_data = useSelector(tournamentState)
    const params = useParams()

    useEffect(() => {
        const filterCurrentTournament = tournament_data?.data?.filter((items) => items?.id === params?.tournamentId)?.[0]
        setTournament(filterCurrentTournament)
    }, [tournament_data])

    return (
        <CreateTournament tournamentData={tournament} />
    )
}

export default EditTournament