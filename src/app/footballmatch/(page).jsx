'use client'
import CommonBack from "@/components/common/commonUi/commonBack"
import FootballBanner from "@/components/common/commonUi/FootballBanner/FootballBanner"
import Loader from "@/components/common/commonUi/Loader"
import ScrollableTabs from "@/components/common/commonUi/ScrollableTabs/ScrollableTabs"
import { getPastFootballMatchData, getPastFootballMatchLineups, getPastFootballMatchStatistics, getPastFootballMatchSummary } from "@/redux/footballMatchesSlices/footballSlice"
import { Box } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const TeamScoreBanner = () => {
    const { liveFootballMatches } = useSelector(state => state.footballData)
    const params = useParams()
    const [tabValue, setTabValue] = useState(params?.category);
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const imageBaseUrl = process.env.NEXT_PUBLIC_FOOTBALL_IMAGE_BASE_URL
    const router = useRouter()

    useEffect(() => {
        const filterLiveMatch = liveFootballMatches?.find(item => item?.id === parseInt(params?.id))
        if (!filterLiveMatch) {
            const handleApiCall = async () => {
                let response = await dispatch(getPastFootballMatchData(params?.id))
                setData(response?.payload?.[0])
            }
            handleApiCall()
        } else {
            setData(filterLiveMatch)
        }
    }, [liveFootballMatches])

    useEffect(() => {
        const matchId = parseInt(params?.id);
        const isLive = liveFootballMatches?.some(item => item?.id === matchId);
        if (tabValue === 'summary') {
            if (!isLive) {
                dispatch(getPastFootballMatchSummary(matchId))
            }
        } else if (tabValue === 'statistics') {
            if (!isLive) {
                dispatch(getPastFootballMatchStatistics(matchId))
            }
        } else if (tabValue === 'lineups') {
            if (data) {
                dispatch(getPastFootballMatchLineups(data?.lineups_id))
            }
        }
    }, [tabValue, data])

    const handleTabChange = (val) => {
        setLoading(true)
        setTabValue(val);
        router.push(`/footballmatch/${params?.id}/${val}`)
        setTimeout(() => {
            setLoading(false)
        }, 300);
    }

    const buttonGroups = [
        { title: 'Summary', icon: 'summary', value: 'summary' },
        { title: 'Statistics', icon: 'statistics', value: 'statistics' },
        { title: 'Line-ups', icon: 'lineup', value: 'lineups' },
    ];

    return (
        loading ? <Loader />
            : <Box position={'relative'}>
                <CommonBack onClick={() => router.push('/football')} />
                <FootballBanner
                    image1={`${imageBaseUrl}${data?.home_team_hash_image}.png`}
                    image2={`${imageBaseUrl}${data?.away_team_hash_image}.png`}
                    team1Name={data?.home_team_name}
                    team2Name={data?.away_team_name}
                    team1score={data?.home_team_score?.display}
                    team2score={data?.away_team_score?.display}
                />
                <Box sx={{ position: 'absolute', bottom: '0', zIndex: '99', left: '0', right: '0' }}>
                    <ScrollableTabs
                        buttonGroups={buttonGroups}
                        tabActive={tabValue}
                        handleChange={handleTabChange}
                        type={'football'}
                    />
                </Box>
            </Box>
    )
}

export default TeamScoreBanner