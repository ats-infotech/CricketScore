import { Box, Typography } from '@mui/material'
import './ExtraSection.css'

const ExtraRunSection = ({totalLBRuns, totalNBRuns, totalWDRuns, totalPRRuns, totalNRRuns, totalBYERuns, type}) => {
    return (
        <>
            {
                (totalLBRuns > 0 || totalNBRuns > 0 || totalWDRuns > 0 || totalPRRuns > 0 || totalNRRuns > 0 || totalBYERuns > 0) &&
                <Box className={`extra_run_section ${type === 'scorecard' && 'scores'}`}>
                    <Typography variant="body2">{`Extras:`}</Typography>
                    {totalNBRuns > 0 && <Typography variant="body2">{`NB: ${totalNBRuns}`}</Typography>}
                    {totalWDRuns > 0 && <Typography variant="body2">{`WD: ${totalWDRuns}`}</Typography>}
                    {totalLBRuns > 0 && <Typography variant="body2">{`LB: ${totalLBRuns}`}</Typography>}
                    {totalBYERuns > 0 && <Typography variant="body2">{`BYE: ${totalBYERuns}`}</Typography>}
                    {totalPRRuns > 0 && <Typography variant="body2">{`P: +${totalPRRuns} -${totalNRRuns}`}</Typography>}
                    <Typography variant="body2">{`Total: ${totalNBRuns + totalWDRuns + totalBYERuns + totalLBRuns + totalPRRuns - totalNRRuns}`}</Typography>
                </Box>
            }
        </>
    )
}

export default ExtraRunSection