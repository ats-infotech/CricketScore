import { Box, useMediaQuery } from "@mui/material";
import './WagonWheel.css';

const WagonWheel = ({ shots, onClick, type }) => {
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 430px)')
    const size = sm ? '300' : md ? '330' : lg ? '360' : '400'
    const shotsColors = {
        0: 'var(--shot-dots)',
        1: 'var(--shot-singles)',
        2: 'var(--shot-doubles)',
        3: 'var(--shot-triples)',
        4: 'var(--shot-fours)',
        5: 'var(--shot-fives)',
        6: 'var(--shot-sixes)',
        7: 'var(--shot-others)',
    };

    return (
        <Box>
            <Box className={type === "graph" ? 'graph_wagon_wheel' : 'wagon_wheel'}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 400 400"
                    onClick={onClick}
                    style={{
                        backgroundColor: "#388e3c",
                        borderRadius: "50%",
                        border: "2px solid #888",
                        cursor: type === "graph" ? 'auto' : "crosshair",
                    }}
                >
                    {/* Outer Ground */}
                    <circle cx="200" cy="200" r="180" fill="#388e3c" stroke="white" strokeWidth="4" />

                    {/* 30 Yard Circle */}
                    <ellipse cx="200" cy="200" rx="110" ry="110" fill="none" stroke="white" strokeWidth="2" />

                    {/* Pitch */}
                    <rect x="180" y="125" width="40" height="145" fill="#c7a17a" stroke="#8d6e63" strokeWidth="2" rx="5" />

                    {/* Shots */}
                    {shots.map((shot, index) => {
                        const startX = 200;
                        const startY = 140;
                        const adjustedAngle = shot.angle + Math.PI / 2;
                        const dx = Math.cos(adjustedAngle);
                        const dy = Math.sin(adjustedAngle);
                        const radius = 180;

                        let endX = shot.clickX;
                        let endY = shot.clickY;

                        if (shot.currentShot === 4 || shot.currentShot === 6) {
                            const vx = startX - 200;
                            const vy = startY - 200;
                            const A = dx * dx + dy * dy;
                            const B = 2 * (vx * dx + vy * dy);
                            const C = vx * vx + vy * vy - radius * radius;
                            const discriminant = B * B - 4 * A * C;
                            let t = 0;
                            if (discriminant >= 0) {
                                const sqrtDisc = Math.sqrt(discriminant);
                                const t1 = (-B + sqrtDisc) / (2 * A);
                                const t2 = (-B - sqrtDisc) / (2 * A);
                                t = Math.max(t1, t2);
                            }

                            const extendLength = shot.currentShot === 4 ? 15 : -10;
                            const scale = t + (shot.currentShot === 4 ? extendLength : -extendLength) / Math.sqrt(dx * dx + dy * dy);
                            endX = startX + dx * scale;
                            endY = startY + dy * scale;

                            const midX = (startX + endX) / 2;
                            const midY = (startY + endY) / 2;
                            const curveShift = 100;
                            const controlX = midX;
                            const controlY = midY - curveShift;

                            return (
                                <g key={index}>
                                    {shot.currentShot === 6 ? (
                                        <path
                                            d={`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`}
                                            stroke={shotsColors[shot.currentShot]}
                                            strokeWidth={2}
                                            fill="none"
                                        />
                                    ) : (
                                        <line
                                            x1={startX}
                                            y1={startY}
                                            x2={endX}
                                            y2={endY}
                                            stroke={shotsColors[shot.currentShot]}
                                            strokeWidth={1.5}
                                            strokeLinecap="round"
                                        />
                                    )}
                                </g>
                            );
                        }

                        // For other shots (not 4 or 6), draw directly to click point
                        return (
                            <g key={index}>
                                <line
                                    x1={startX}
                                    y1={startY}
                                    x2={endX}
                                    y2={endY}
                                    stroke={shot.currentShot > 6 ? shotsColors[7] : shotsColors[shot.currentShot]}
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                />
                            </g>
                        );
                    })}

                    {/* Batter Position */}
                    <circle cx="200" cy="140" r="5" fill="blue" />
                </svg>
            </Box>
        </Box>
    );
};

export default WagonWheel;