'use client';

import React from 'react';
import './FootballPitch.css';
import { Box } from '@mui/material';
import SvgIcon from '@/assets/icons/SvgIcon';

const parseFormation = (formation = '4-3-3') => {
  return formation?.split('-').map(Number);
};

const FootballPitch = ({
  players,
  formation,
  jerseyColor,
  jerseyNumberColor,
  goalkeeperJerseyColor,
  goalkeeperJerseyNumberColor
}) => {
  const starters = players?.map((item) => item?.player) || [];

  if (!starters.length) return null;

  const formationLayout = parseFormation(formation);
  const totalOutfieldPlayers = formationLayout?.reduce((a, b) => a + b, 0);

  const goalkeeper = starters?.find((p) => p.pos === 'G') || starters[0];
  const outfieldPlayers = starters?.filter((p) => p.id !== goalkeeper.id)?.slice(0, totalOutfieldPlayers);

  const renderPlayer = (player, x, y, size = 8) => {
    const isGoalkeeper = player.pos === 'G';
    const jerseyCol = isGoalkeeper ? goalkeeperJerseyColor : jerseyColor;
    const jerseyNumCol = isGoalkeeper ? goalkeeperJerseyNumberColor : jerseyNumberColor;

    return (
      <g key={player.id} transform={`translate(${x}, ${y})`}>
        <foreignObject
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SvgIcon
              id={'tshirt'}
              style={{
                width: '100%',
                height: '100%',
                color: `#${jerseyCol}`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                fontSize: `${size * 0.3}px`,
                fontWeight: 'bold',
                color: `#${jerseyNumCol}`,
                lineHeight: 1,
              }}
            >
              {player.number}
            </Box>
          </Box>
        </foreignObject>
      </g>
    );
  };

  const renderLine = (playersInLine, lineIndex, totalLines) => {
    const yPaddingTop = 10; // padding from top of pitch
    const yPaddingBottom = 10; // padding from bottom of pitch
    const pitchHeight = 100 - yPaddingTop - yPaddingBottom;
    const yStep = pitchHeight / (totalLines - 1);
    const y = yPaddingTop + lineIndex * yStep;

    return playersInLine.map((player, i) => {
      const x = ((i + 1) * 100) / (playersInLine.length + 1); // even horizontal spacing
      return renderPlayer(player, x, y);
    });
  };

  // Build player lines from formation (excluding goalkeeper)
  const playerLines = [];
  let currentIndex = 0;

  for (let i = 0; i < formationLayout?.length; i++) {
    const count = formationLayout[i];
    const linePlayers = outfieldPlayers.slice(currentIndex, currentIndex + count);
    playerLines.push(linePlayers);
    currentIndex += count;
  }

  // Add goalkeeper as the last line (at the bottom)
  const allLines = [...playerLines, [goalkeeper]];

  return (
    <div className="football-pitch-container">
      <svg viewBox="0 0 100 100" className="football-pitch">
        {/* Pitch layout */}
        <rect x="0" y="0" width="100" height="100" fill="#228B22" />
        {/* Goal Boxes */}
        <rect x="40" y="3" width="20" height="8" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="40" y="89" width="20" height="8" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Center Circle */}
        <circle cx="50" cy="50" r="8" stroke="white" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="1" stroke="white" strokeWidth="0.5" fill="white" />
        <line x1="3" y1="50" x2="97" y2="50" stroke="white" strokeWidth="0.5" />
        {/* Penalty Boxes */}
        <rect x="30" y="3" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="30" y="82" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="3" y="3" width="94" height="94" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Players */}
        {allLines.map((linePlayers, i) => renderLine(linePlayers, i, allLines.length))}
      </svg>
    </div>
  );
};

export default FootballPitch;
