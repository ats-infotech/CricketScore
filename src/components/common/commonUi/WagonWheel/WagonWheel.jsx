import { Box, useMediaQuery } from "@mui/material";
import './WagonWheel.css';

const WagonWheel = ({ shots, onClick, type }) => {
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 430px)')
    const size = sm ? '300' : md ? '330' : lg ? '360' : '400'
    const shotsColors = {
        0: 'var(--dots)',
        1: 'var(--singles)',
        2: 'var(--doubles)',
        3: 'var(--triples)',
        4: 'var(--fours)',
        5: 'var(--fives)',
        6: 'var(--sixes)',
        7: 'var(--othershots)',
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

                        const centerX = 200;
                        const centerY = 200;
                        const radius = 180;

                        // Vector direction
                        const dx = Math.cos(adjustedAngle);
                        const dy = Math.sin(adjustedAngle);

                        // Shot origin to circle center vector
                        const vx = startX - centerX;
                        const vy = startY - centerY;

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

                        // Adjust endpoint:
                        const extendLength =
                            shot.currentShot === 4 ? 15 : // if shot is a FOUR, go a bit outside
                                shot.currentShot === 6 ? -10 : 10; // regular shots stop before circle, sixes are curved anyway

                        const scale = t + (shot.currentShot === 4 ? extendLength : -extendLength) / Math.sqrt(dx * dx + dy * dy);
                        const endX = startX + dx * scale;
                        const endY = startY + dy * scale;

                        // Midpoint and control point for 6s
                        const midX = (startX + endX) / 2;
                        const midY = (startY + endY) / 2;

                        // Create slight upward shift for the curve (keeping the same angle)
                        const curveShift = 100; // Adjust this value for how high you want the curve to be
                        const controlX = midX;
                        const controlY = midY - curveShift; // Shift upwards

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
                                        stroke={shot.currentShot > 6 ? shotsColors[7] : shotsColors[shot.currentShot]}
                                        strokeWidth={1.5}
                                        strokeLinecap="round"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Guide lines */}
                    {/* <line x1="170" x2="230" y1={"145"} y2={"145"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="180" x2="220" y1={"125"} y2={"125"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="220" x2="220" y1={"125"} y2={"145"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="210" x2="210" y1={"125"} y2={"145"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="180" x2="180" y1={"125"} y2={"145"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="190" x2="190" y1={"125"} y2={"145"} strokeWidth={2} y="130" stroke="var(--text-white)" />

                    <line x1="170" x2="230" y1={"250"} y2={"250"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="180" x2="220" y1={"270"} y2={"270"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="220" x2="220" y1={"250"} y2={"270"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="210" x2="210" y1={"250"} y2={"270"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="180" x2="180" y1={"250"} y2={"270"} strokeWidth={2} y="130" stroke="var(--text-white)" />
                    <line x1="190" x2="190" y1={"250"} y2={"270"} strokeWidth={2} y="130" stroke="var(--text-white)" /> */}

                    {/* Batter Position */}
                    <circle cx="200" cy="140" r="5" fill="blue" />

                    {/* Offside & Legside labels */}
                    {/* <text x="55" y="205" fill="white" fontSize="16" fontWeight="bold">OFFSIDE</text> */}
                    {/* <text x="275" y="205" fill="white" fontSize="16" fontWeight="bold">LEGSIDE</text> */}
                </svg>
            </Box>
        </Box>
    );
};

export default WagonWheel;