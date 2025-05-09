import ExtraRunSection from '@/components/common/commonUi/ExtrasSection/ExtraSection';
import { SwapHoriz } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import CommonPlayerSection from './CommonPlayerSection';

const PlayerScoreBoard = ({
    battinglength,
    initailscore,
    playerOnField,
    batterScore,
    bowlerScore,
    balls,
    legalBallCount,
    Extras,
    ChangeStrike,
    ChangeBatter,
    ChangeBowler,
    activeStrike,
    post,
    runBallLength,
    ballScores
}) => {
    const getBallColor = (score) => {
        if (score === "4" || score === "6") {
            return 'var(--cricket-boundary)';
        }
        if (score.includes("WD") || score.includes("NB")) {
            return 'var(--cricket-extra-run)';
        }
        if (score.includes("W")) {
            return 'var(--cricket-wicket)';
        }
        return 'var(--cricket-ball)';
    };

    const getBallSize = (score) => {
        if (score.includes("WD+W") || score.includes("NB+W")) {
            return "7px";
        }
        return '9px'
    }

    const ballCircles = [];

    for (let i = 0; i < runBallLength; i++) {
        const score = ballScores[i];
         
        const ballColor = score ? getBallColor(score) : 'lightgray';
        const TextSize = score ? getBallSize(score) : '10px'

        ballCircles.push(
            <div
                key={i}
                style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    backgroundColor: i < balls.ballNo ? ballColor : 'lightgray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: i < balls.ballNo ? TextSize : '10px',
                    overflow: 'hidden'
                }}
            >
                {score !== null ? score : ''}
            </div>
        );
    }
    
    return (
        <Box>
            <Box className='score_player_card_sub_section'>
                <Box className='score_batter_player_card'>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '5px',
                            alignItems: 'center'
                        }}
                    >
                        <CommonPlayerSection
                            length={battinglength}
                            wickets={initailscore.wicket}
                            name={playerOnField.striker}
                            icon="striker"
                            onClick={ChangeBatter}
                            run={batterScore.batter1run}
                            ball={batterScore.batter1balls}
                            activeStrike={activeStrike === 1}
                            post={post}
                        />
                        <SwapHoriz
                            sx={{ color: 'var(--color-white)', cursor: 'pointer' }}
                            onClick={ChangeStrike}
                        />
                        <CommonPlayerSection
                            length={battinglength}
                            wickets={initailscore.wicket}
                            type="non-striker"
                            icon="striker"
                            onClick={ChangeBatter}
                            name={playerOnField.nonStriker}
                            run={batterScore.batter2run}
                            ball={batterScore.batter2balls}
                            activeStrike={activeStrike === 2}
                            post={post}
                        />
                    </Box>
                    <Box className='silver-gradient-line'></Box>
                    <Box>
                        <CommonPlayerSection
                            post={post}
                            balls={balls}
                            onClick={ChangeBowler}
                            type="bowler"
                            name={playerOnField.bowler}
                            run={`${bowlerScore.run} / ${bowlerScore.wicket}`}
                            ball={
                                legalBallCount === 6
                                    ? `${bowlerScore.overNo + 1}.0`
                                    : `${bowlerScore.overNo}.${legalBallCount}`
                            }
                            icon="ball"
                        />
                    </Box>
                </Box>
            </Box>

            <Box className='score_balls_section'>
                <Box className="score-gradient-line"></Box>
                <Box className='score_balls' sx={{ paddingInline: '10px' }}>
                    {ballCircles}
                </Box>
                <Box className="score-gradient-line"></Box>
            </Box>

            <ExtraRunSection
                totalLBRuns={Extras?.LB}
                totalNBRuns={Extras?.NB}
                totalBYERuns={Extras?.BYE}
                totalWDRuns={Extras?.WD}
                totalPRRuns={Extras?.PR}
                totalNRRuns={Extras?.NR}
            />
        </Box>
    )
}

export default React.memo(PlayerScoreBoard)