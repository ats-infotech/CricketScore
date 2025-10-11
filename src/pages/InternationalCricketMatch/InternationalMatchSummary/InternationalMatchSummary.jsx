'use client'
import { Box, Card, CardContent, Typography } from "@mui/material"
import './InternationalMatchSummary.css'
import { useSelector } from "react-redux"

const InternationalMatchSummary = () => {
    const { liveMatchScoreboard } = useSelector(state => state.matchData)
    const team = liveMatchScoreboard.response.scorecard;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Box className="internationalMatchsummary_main_section">
            <Box className="internationalMatchsummary_sub_section">
                {/* 🔹 Match Summary Card */}
                <Card className="match_card_sum">
                    <CardContent>
                        <Typography variant="h6" className="innings_title">Match Summary</Typography>
                        <Box className="internationalMatchsummary-gradient-line"></Box>

                        <Typography variant="body1" className="info">
                            {`${team.short_title}, ${team.title}`}
                        </Typography>

                        <Typography variant="body2" className="info">
                            {`${formatDate(team.date_start)}, ${team.venue.location}, ${team.venue?.name} Stadium`}
                        </Typography>

                        <Typography variant="body2" className="info">
                            {`${team.toss.text}`}
                        </Typography>

                        <Typography variant="body2" className="info">{team.result}</Typography>

                        {(
                            <Typography variant="body2" className="info">
                                {team.player_of_the_match && `MVP: ${team.player_of_the_match.name}`}
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {team.match_notes?.map((innings, index) => {
                    const data = innings.slice(1).join('\n'); 
                    return (
                        <Card key={index} className="match_card_sum">
                            <CardContent>
                                <Typography variant="h6" className="innings_title">
                                    {innings[0]}
                                </Typography>
                                <Box className="internationalMatchsummary-gradient-line"></Box>

                                <Typography variant="body2" className="info">
                                    {data}
                                </Typography>
                            </CardContent>
                        </Card>
                    )
                })}


            </Box>
        </Box>
    )
}

export default InternationalMatchSummary

