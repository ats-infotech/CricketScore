import Banner from '@/components/common/commonUi/Banner/Banner'
import CommonBack from '@/components/common/commonUi/commonBack'
import ScrollableTabs from '@/components/common/commonUi/ScrollableTabs/ScrollableTabs'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const cricketScoreTabs = [
    { title: 'Summary', icon: 'scorecard', value: 'summary' },
    { title: 'Scorecard', icon: 'scorecard', value: 'scorecard' },
    { title: 'Analysis', icon: 'analysis', value: 'analysis' },
    { title: 'Teams', icon: 'teams2', value: 'teams' },
]

const InternationalBanner = ({ params, handleNavigation, }) => {
    const router = useRouter()
    const [tabValue, setTabValue] = useState(params?.category);
    const { liveMatchScoreboard } = useSelector(state => state.matchData)
    let liveScorecard = liveMatchScoreboard?.response?.scorecard?.innings
    let InningsLength = Object?.keys(liveScorecard || {})?.length
    let isExtraInnings = InningsLength > 2
    const isTeamABattingFirst = liveMatchScoreboard?.response?.scorecard?.teama?.team_id === liveMatchScoreboard?.response?.scorecard?.innings?.[0]?.batting_team_id
    let isTeam1PlayingThirdInnings = liveMatchScoreboard?.response?.scorecard?.teama?.team_id === liveMatchScoreboard?.response?.scorecard?.innings?.[2]?.batting_team_id
    const parseScoreFull = (scoreFull) => {
        if (!scoreFull) return { run: 0, wicket: 0, over: 0, ball: 0 };

        const match = scoreFull.match(/(\d+)\/(\d+)\s+\(([\d.]+)\s*ov\)/);
        if (!match) return { run: 0, wicket: 0, over: 0, ball: 0 };

        const [, run, wicket, overs] = match;
        const [over, ball = 0] = overs.split(".");

        return {
            run: +run,
            wicket: +wicket,
            over: +over,
            ball: +ball
        };
    };

    const handleTabChange = (val) => {
        setTabValue(val);
        handleNavigation(val);
    };
    const FirstInningsScores = parseScoreFull(liveScorecard?.[0]?.scores_full);
    const SecondInningsScores = parseScoreFull(liveScorecard?.[1]?.scores_full);
    const ThirdInningsScores = parseScoreFull(liveScorecard?.[2]?.scores_full);
    const FourthInningsScores = parseScoreFull(liveScorecard?.[3]?.scores_full);

    return (
        <Box position={'relative'}>
            <Box sx={{ position: 'absolute' }}>
                <CommonBack onClick={() => router.push(`/`)} />
            </Box>
            <Banner
                winnerName={liveMatchScoreboard?.response?.scorecard?.status_note}
                image1={liveMatchScoreboard?.response?.scorecard?.teama?.logo_url}
                image2={liveMatchScoreboard?.response?.scorecard?.teamb?.logo_url}
                team1score={isTeamABattingFirst ? FirstInningsScores : SecondInningsScores}
                team2score={isTeamABattingFirst ? SecondInningsScores : FirstInningsScores}
                superover={isExtraInnings}
                soteam1score={isTeam1PlayingThirdInnings ? ThirdInningsScores : FourthInningsScores}
                soteam2score={isTeam1PlayingThirdInnings ? FourthInningsScores : ThirdInningsScores}
                type={'score'}
                soteam1scorehidden={isTeam1PlayingThirdInnings ? false : !isTeam1PlayingThirdInnings && InningsLength > 3 ? false : true}
                soteam2scorehidden={isTeam1PlayingThirdInnings && InningsLength === 3 ? true : false}
            />

            <Box sx={{ position: 'absolute', bottom: '0', zIndex: '99', left: '0', right: '0' }}>
                <ScrollableTabs
                    buttonGroups={cricketScoreTabs}
                    tabActive={tabValue}
                    handleChange={handleTabChange}
                />
            </Box>
        </Box>
    )
}

export default InternationalBanner
