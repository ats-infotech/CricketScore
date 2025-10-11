'use client'
import CommonBack from "@/components/common/commonUi/commonBack"
import FootballBanner from "@/components/common/commonUi/FootballBanner/FootballBanner"
import Loader from "@/components/common/commonUi/Loader"
import ScrollableTabs from "@/components/common/commonUi/ScrollableTabs/ScrollableTabs"
import { getLiveFootballMatchData, getPastFootballMatchData, getPremiumFootballLeaguePastMatchData } from "@/redux/footballMatchesSlices/footballSlice"
import { Box } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

function getScore(goals = []) {
    let homeGoals = 0;
    let awayGoals = 0;

    for (const goal of goals) {
        if (goal.info === 'home') {
            homeGoals += 1;
        } else if (goal.info === 'away') {
            awayGoals += 1;
        }
    }

    return { homeGoals, awayGoals };
}

const TeamScoreBanner = () => {
    const { particularMatchData, liveFootballMatches, liveMatchData, premiumLeaguesPastMatchData } = useSelector(state => state.footballData)
    const { leagueType } = useSelector(state => state.footballLocal)
    const params = useParams()
    const [tabValue, setTabValue] = useState(params?.category);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const isLiveMatch = liveFootballMatches?.response?.find((items) => items?.fixture?.id === parseInt(params?.id))
    const matchData= leagueType === 'PremiumLeague' ? premiumLeaguesPastMatchData?.result?.[0] : isLiveMatch ? liveMatchData?.response?.[0] : particularMatchData?.response?.[0] || []
    const premiumLeagueScores = getScore(matchData?.goalscorers)

    useEffect(() => {
        const handleApiCall = async () => {
            if (leagueType === 'ExtraLeague') {

            } else if (leagueType === 'PremiumLeague') {
                await dispatch(getPremiumFootballLeaguePastMatchData(params?.id))
            } else if (isLiveMatch && leagueType === '') {
                await dispatch(getLiveFootballMatchData(params?.id))
            } else if (leagueType === '') {
                await dispatch(getPastFootballMatchData(params?.id))
            }
        }
        handleApiCall()
    }, [leagueType])

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
                    image1={leagueType === 'PremiumLeague' ? matchData?.home_team_logo : matchData?.teams?.home?.logo}
                    image2={leagueType === 'PremiumLeague' ? matchData?.away_team_logo : matchData?.teams?.away?.logo}
                    team1Name={leagueType === 'PremiumLeague' ? matchData?.event_home_team : matchData?.teams?.home?.name}
                    team2Name={leagueType === 'PremiumLeague' ? matchData?.event_away_team : matchData?.teams?.away?.name}
                    team1score={leagueType === 'PremiumLeague' ? premiumLeagueScores?.homeGoals : matchData?.goals?.home}
                    team2score={leagueType === 'PremiumLeague' ? premiumLeagueScores?.awayGoals : matchData?.goals?.away}
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