'use client'

import InternationalBanner from "@/pages/InternationalCricketMatch/InternationalBanner";
import { getLiveMatchesScorecard, getLiveMatchesStatistics, getPastMatchesScorecard, getPastMatchesStatistics } from "@/redux/internationalMatchesSlices/matchesSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const InternationalTournament = () => {
    const { liveMatches, recentMatches } = useSelector(state => state.matchData)
    const dispatch = useDispatch()
    const params = useParams()
    const router = useRouter()
    const handleNavigation = (value) => {
        router.push(`/internationalmatch/${params.matchId}/${value}`);
    };

    useEffect(() => {
        const handleApiCall = async () => {
            const currentMatch = Array.isArray(liveMatches?.response?.items)
            ? liveMatches.response.items.find(item => item?.match_id === parseInt(params?.matchId))
            : null;
            
            const pastMatch = Array.isArray(recentMatches?.response?.items)
            ? recentMatches.response.items.find(item => item?.match_id === parseInt(params?.matchId))
            : null;
        
            if (currentMatch) {
                await dispatch(getLiveMatchesScorecard(params?.matchId));
                await dispatch(getLiveMatchesStatistics(params?.matchId));
            } else if (pastMatch) {
                await dispatch(getPastMatchesScorecard(params?.matchId));
                await dispatch(getPastMatchesStatistics(params?.matchId))
            }
        };

        handleApiCall();
    }, [liveMatches, recentMatches, params?.matchId, dispatch]);

    return (
        <InternationalBanner
            params={params}
            handleNavigation={handleNavigation}
        />
    )
}

export default InternationalTournament