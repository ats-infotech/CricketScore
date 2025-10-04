'use client'

import React from 'react';
import './FootballPitch.css';
import { Box } from '@mui/material';
import SvgIcon from '@/assets/icons/SvgIcon';

const parseFormation = (formation = '4-3-3') => {
  return formation.split('-').map(Number);
};

const FootballPitch = ({ players, formation, jerseyColor, jerseyNumberColor }) => {
  const starters = players?.filter(player => !player.substitute);

  const groupedByPosition = {
    G: starters?.filter(p => p.position === 'G'),
    D: starters?.filter(p => p.position === 'D'),
    M: starters?.filter(p => p.position === 'M'),
    F: starters?.filter(p => p.position === 'F'),
  };

  const formationLayout = parseFormation(formation);

  const renderPlayer = (player, x, y, size = 8) => {
    return (
      <g key={player.player_id} transform={`translate(${x}, ${y})`}>
        <foreignObject
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgIcon
              id={'tshirt'}
              style={{
                width: "100%",
                height: "100%",
                color: `#${jerseyColor}`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                fontSize: `${size * 0.3}px`,
                fontWeight: "bold",
                color: `#${jerseyNumberColor}`,
                lineHeight: 1,
              }}
            >
              {player.shirt_number}
            </Box>
          </Box>
        </foreignObject>
      </g>
    );
  };

  const renderLine = (playersInLine, lineIndex, totalLines, isMidfieldLine = false) => {
    const yOffset = isMidfieldLine ? 2 : 0; // Adjust Y for midfield lines (a little deeper)
    const y = 100 - (lineIndex * (80 / (totalLines - 1))) - 10 + yOffset; // Dynamic Y based on the number of lines

    return playersInLine?.map((player, i) => {
      const x = (100 / (playersInLine.length + 1)) * (i + 1); // Even X positioning based on the number of players
      return renderPlayer(player, x, y);
    });
  };

  // Ordered layout: G, D, M, F
  const orderedPlayers = [
    groupedByPosition.G,
    ...formationLayout.map((count, i) => {
      const position = ['D', 'M', 'F'][i];
      return groupedByPosition[position] ? groupedByPosition[position].slice(0, count) : [];
    }),
  ];

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
        {/* Halfway Circle */}
        <circle cx="50" cy="50" r="1" stroke="white" strokeWidth="0.5" fill="white" />
        <line
          x1="3"
          y1="50"
          x2="97"
          y2="50"
          stroke="white"
          strokeWidth="0.5"
        />
        {/* Penalty Boxes */}
        <rect x="30" y="3" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="30" y="82" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" />
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
        />
        {/* Players */}
        {orderedPlayers.map((linePlayers, i) => {
          // Identify the midfield line to apply a different Y offset
          const isMidfieldLine = i === 1 || i === 2; // Midfield lines are either 2nd or 3rd
          return renderLine(linePlayers, i, orderedPlayers.length, isMidfieldLine);
        })}
      </svg>
    </div>
  );
};

export default FootballPitch;
