'use client'

import InternationalMatchScoreAnalysis from "@/pages/InternationalCricketMatch/InternationalMatchAnalysis/InternationalMatchAnalysis";
import InternationalMatchesScoreboard from "@/pages/InternationalCricketMatch/InternationalMatchesScoreboard/InternationalMatchesScoreboard";
import InternationalMatchSummary from "@/pages/InternationalCricketMatch/InternationalMatchSummary/InternationalMatchSummary";
import InternationalTeams from "@/pages/InternationalCricketMatch/InternationalTeams/InternationalTeams";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ScoreCardCategory = () => {
  const { id, category = 'summary' } = useParams();  

  const componentMap = {
    scorecard: <InternationalMatchesScoreboard  />,
    summary: <InternationalMatchSummary />,
    teams: <InternationalTeams/>,
    analysis: <InternationalMatchScoreAnalysis/>
  };

  const RenderContent = useMemo(() => componentMap[category] ?? null, [
    category,
    id,
  ]);

  return (
    <Box>
      {RenderContent}
    </Box>
  )
}

export default ScoreCardCategory