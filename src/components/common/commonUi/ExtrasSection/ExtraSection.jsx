import { Box, Typography } from '@mui/material';
import React from 'react';
import './ExtraSection.css';

const ExtraRunSection = ({ totalLBRuns, totalNBRuns, totalWDRuns, totalPRRuns, totalNRRuns, totalBYERuns, type }) => {

    const hasExtras = (
        totalLBRuns > 0 ||
        totalNBRuns > 0 ||
        totalWDRuns > 0 ||
        totalPRRuns > 0 ||
        totalNRRuns > 0 ||
        totalBYERuns > 0
    )

    const totalExtras = (
        totalNBRuns +
        totalWDRuns +
        totalBYERuns +
        totalLBRuns +
        totalPRRuns -
        totalNRRuns
    )

    if (!hasExtras) return null;

    return (
        <Box className={`extra_run_section ${type === 'scorecard' && 'scores'}`}>
            <Typography variant="body2">{`Extras:`}</Typography>
            {totalNBRuns > 0 && <Typography variant="body2">{`NB: ${totalNBRuns}`}</Typography>}
            {totalWDRuns > 0 && <Typography variant="body2">{`WD: ${totalWDRuns}`}</Typography>}
            {totalLBRuns > 0 && <Typography variant="body2">{`LB: ${totalLBRuns}`}</Typography>}
            {totalBYERuns > 0 && <Typography variant="body2">{`BYE: ${totalBYERuns}`}</Typography>}
            {totalPRRuns > 0 && <Typography variant="body2">{`P: +${totalPRRuns} -${totalNRRuns}`}</Typography>}
            <Typography variant="body2">{`Total: ${totalExtras}`}</Typography>
        </Box>
    )
}

export default React.memo(ExtraRunSection)