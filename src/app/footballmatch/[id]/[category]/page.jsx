'use client'
import FootballLineups from "@/pages/Football/FootballLineups/FootballLineups";
import FootballStatistics from "@/pages/Football/FootballStatistics/FootballStatistics";
import FootballSummary from "@/pages/Football/FootballSummary/FootballSummary";
import { useParams } from "next/navigation";

const FootballCategory = () => {
  const { category = 'summary' } = useParams();

  const RenderContent = () => {
    switch (category) {
      case 'summary':
        return <FootballSummary />;
      case 'statistics':
        return <FootballStatistics/>;
      case 'lineups':
        return <FootballLineups />;
      default:
        return null;
    }
  };

  return (
    <RenderContent />
  )
}

export default FootballCategory