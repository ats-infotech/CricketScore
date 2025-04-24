import { Box, useMediaQuery } from "@mui/material"
import './WagonWheel.css'

const WagonWheel = ({ shots, onClick }) => {

    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 430px)')
    const size = sm ? '300' : md ? '330' : lg ? '360' : '400'

    return (
        <Box>
            <Box className="wagon_wheel">
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 400 400"
                    onClick={onClick}
                    style={{
                        backgroundColor: "#388e3c",
                        borderRadius: "50%",
                        border: "2px solid #888",
                        cursor: "crosshair",
                    }}
                >
                    {/* Outer Ground */}
                    <circle cx="200" cy="200" r="180" fill="#388e3c" stroke="white" strokeWidth="4" />

                    {/* 30 Yard Circle */}
                    <ellipse cx="200" cy="200" rx="110" ry="110" fill="none" stroke="white" strokeWidth="2" />

                    {/* Pitch */}
                    <rect x="180" y="130" width="40" height="140" fill="#c7a17a" stroke="#8d6e63" strokeWidth="2" rx="5" />

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
                        const normalX = -(endY - startY);
                        const normalY = endX - startX;
                        const length = Math.sqrt(normalX ** 2 + normalY ** 2);
                        const normalUnitX = normalX / length;
                        const normalUnitY = normalY / length;

                        const bulge = 30;
                        const controlX = midX + normalUnitX * bulge;
                        const controlY = midY + normalUnitY * bulge;

                        return (
                            <g key={index}>
                                {shot.currentShot === 6 ? (
                                    <path
                                        d={`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`}
                                        stroke="red"
                                        strokeWidth={2}
                                        fill="none"
                                    />
                                ) : (
                                    <line
                                        x1={startX}
                                        y1={startY}
                                        x2={endX}
                                        y2={endY}
                                        stroke={shot.currentShot === 4 ? "orange" : "yellow"}
                                        strokeWidth={2}
                                        // strokeWidth={shot.currentShot === 4 || shot.currentShot === 6 ?  shot.currentShot : 3}
                                        strokeLinecap="round"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Batter Position */}
                    <circle cx="200" cy="140" r="5" fill="blue" />

                    {/* Offside & Legside labels */}
                    {/* <text x="55" y="205" fill="white" fontSize="16" fontWeight="bold">OFFSIDE</text> */}
                    {/* <text x="275" y="205" fill="white" fontSize="16" fontWeight="bold">LEGSIDE</text> */}
                </svg>
            </Box>
        </Box>
    )
}

export default WagonWheel