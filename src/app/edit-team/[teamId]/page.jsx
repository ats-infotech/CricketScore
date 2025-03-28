'use client'
import Team from "@/pages/Teams/Team"
import { teamsState } from "@/redux/slices/teamSlice"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"


const EditTeam = () => {
    const params = useParams()
    const [teamData, setTeamData] = useState(null)
    const team_data = useSelector(teamsState)

    useEffect(() => {
        if (params?.teamId) {
            let team = team_data.data.find(item => item?.id === params?.teamId);
            setTeamData(team);
        }
    }, [params]);

    return (
        <Team type={'edit'} teamData={teamData} />
    )
}

export default EditTeam