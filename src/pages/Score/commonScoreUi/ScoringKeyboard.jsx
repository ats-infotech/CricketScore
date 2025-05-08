'use client';
import { Box, Button } from '@mui/material';
import Image from 'next/image'; // Adjust import path

import fourgif from '@/assets/img/score/four.gif';
import sixgif from '@/assets/img/score/six.gif';
import wicketgif from '@/assets/img/score/wicket.gif';
import CustomeButton from '@/components/common/commonUi/CustomeButton';
import React from 'react';

const isScoreButtonEnabled = (item, activeType, active, secondActive, isGlobalDisable) => {
    const common = ['0', '1', '2', '3', '4', '5,7', '6'];
    const withRNO = [...common, 'RNO', 'STO'];
    const withNoBall = [...common, 'RNO'];
    const withLegBye = ['1', '2', '3', '4', '5,7', '6'];

    if (isGlobalDisable) return false;

    const isRunoutActive = secondActive === 'RNO';

    switch (true) {
        case isRunoutActive:
            return common.includes(item);
        case active && activeType === 'WD':
            return withRNO.includes(item);
        case active && activeType === 'NB':
            return withNoBall.includes(item);
        case active && ['PR', 'NR'].includes(activeType):
            return common.includes(item);
        case activeType === 'LB' || activeType === 'BYE':
            return withLegBye.includes(item);
        default:
            return true;
    }
};

const ScoringKeyboard = ({
    gif,
    runTypes,
    active,
    currentInnings,
    bowlerAvailable,
    handleScore,
    isButtonsDisabled,
    balls,
    onUndo,
    wagonWheel,
    winner,
    onShowMore,
    RenderButton
}) => {
    const showScoringUI = !gif?.gif;
    const activeType = active?.data;
    const secondActive = active?.secondactive;
    const isGlobalDisable = isButtonsDisabled || ((currentInnings >= 2) && !bowlerAvailable);

    return (
        <Box className="score_section">
            {showScoringUI ? (
                <Box className="scoring_section">
                    {/* Run buttons */}
                    <Box className="score_button_section">
                        {runTypes.map((item, index) => (
                            <Button
                                key={index}
                                className={`score_button ${active?.active ? 'active' : ''}`}
                                onClick={() => handleScore(item)}
                                disabled={!isScoreButtonEnabled(item, activeType, active?.active, secondActive, isGlobalDisable)}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>

                    {/* Render + Undo */}
                    <Box className="test_score_render_button">
                        <RenderButton />
                        <CustomeButton
                            title="Undo"
                            width="100%"
                            onClick={onUndo}
                            hover="none"
                            disabled={balls?.ballNo === 0 || active?.active || wagonWheel}
                        />
                    </Box>

                    {/* Shortcuts */}
                    <Box className="show_more_button">
                        <CustomeButton
                            height="50px"
                            width="100%"
                            title="Scoring Shortcuts"
                            hover="none"
                            onClick={onShowMore}
                            disabled={active?.active || wagonWheel || winner}
                        />
                    </Box>
                </Box>
            ) : (
                <Box className="score_gif_main_section">
                    <Box className="score_gif_section">
                        <Image
                            unoptimized
                            alt="gif"
                            src={gif.type === '4' ? fourgif : gif.type === '6' ? sixgif : wicketgif}
                            height={500}
                            width={500}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(ScoringKeyboard);
