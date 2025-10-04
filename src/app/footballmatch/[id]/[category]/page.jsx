'use client'
import Loader from "@/components/common/commonUi/Loader";
import FootballLineups from "@/pages/Football/FootballLineups/FootballLineups";
import FootballStatistics from "@/pages/Football/FootballStatistics/FootballStatistics";
import FootballSummary from "@/pages/Football/FootballSummary/FootballSummary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FootballCategory = () => {
  const { category = 'summary', params } = useParams();
  const { liveFootballMatches } = useSelector(state => state.footballData)
  const [matchType, setMatchType] = useState('')

  useEffect(() => {
    const filterLiveMatch = liveFootballMatches?.find(item => item?.id === parseInt(params?.id))
    if (!filterLiveMatch) {
      setMatchType('past')
    } else {
      setMatchType('live')
    }
  }, [liveFootballMatches])

  const RenderContent = () => {
    switch (category) {
      case 'summary':
        return <FootballSummary type={matchType} />;
      case 'statistics':
        return <FootballStatistics type={matchType} />;
      case 'lineups':
        return <FootballLineups type={matchType} />;
      default:
        return null;
    }
  };

  return (
    <RenderContent />
  )
}

export default FootballCategory