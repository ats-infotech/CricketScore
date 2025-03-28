'use client';

import { AutoProfileImageJson } from '@/components/common/json/AutoProfileImageJson';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Avtar.css';

const Avatar = ({ name, bgColor, onChange, type, index = 0 }) => {
    const [color, setColor] = useState(bgColor || null);
    const [initials, setInitials] = useState('');

    // Function to generate initials from the name
    const getInitials = (name) => {
        if (!name) return '';

        // Sanitize and split the name
        // const sanitizedName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
        // const split = sanitizedName.split(' ').filter(word => word.length > 0);
        const words = name.trim().split(/[\s-_]+/).filter(word => word.length > 0);
        let firstLetters = '';

        let firstChar = words[0][0] || "";
        let lastChar = words.length > 1 ? words[1][0] : words[0][1] || "";

        firstLetters = (firstChar + lastChar).toUpperCase()
        // First letter of the first word
        // if (split.length > 0) {
        //     // firstLetters += split[0].charAt(0).toUpperCase();
        //     for (let i = 1; i < split[0].length; i++) {
        //         if (/[0-9]/.test(split[0].charAt(i))) {
        //             firstLetters += split[0].charAt(i);
        //             break;
        //         }
        //     }
        // }

        // First letter of the second word (if available)
        // if (split.length > 3) {
        //     for (let i = 0; i < split[1].length; i++) {
        //         if (/[a-zA-Z0-9]/.test(split[1].charAt(i))) {
        //             firstLetters += split[1].charAt(i).toUpperCase();
        //             break;
        //         }
        //     }
        // }

        // if (split.length > 1) {
        //     for (let i = 0; i < split[1].length; i++) {
        //         if (/[a-zA-Z0-9]/.test(split[1].charAt(i))) {
        //             firstLetters += split[1].charAt(i).toUpperCase();
        //             break;
        //         }
        //     }
        // }

        // Handle cases where there is only one word
        // if (split.length === 1 && firstLetters.length === 1) {
        //     firstLetters += split[0].charAt(1)?.toUpperCase() || '';
        // }

        // Handle edge cases for short names
        return firstLetters.slice(0, 2);
    };

    // Effect to update initials and color on name change
    useEffect(() => {
        const firstLetters = getInitials(name);
        setInitials(firstLetters);

        if (!name && bgColor) {
            setColor(null); // Name empty hai to color bhi reset kar do

            if (onChange) {
                onChange({
                    letter: '',
                    [type === 'team' ? 'team_color' : type === 'tournament' ? 'tournament_logo_color' : 'playerColor']: '',
                }, index);
            }
            return; // Aage ki logic execute nahi hogi agar name empty hai
        }

        // If color is not already set, pick a random color
        if (!color) {
            const colorIndex = Math.floor(Math.random() * AutoProfileImageJson.length);
            const randomColor = AutoProfileImageJson[colorIndex];
            setColor(randomColor);

            // Trigger onChange to pass updated color and initials
            if (onChange) {
                if (type === 'players') {
                    onChange({
                        playerColor: randomColor,
                        letter: firstLetters,
                    }, index);
                } else {
                    onChange((prev) => ({
                        ...prev,
                        [type === 'team' ? 'team_color' : type === 'tournament' ? 'tournament_logo_color' : 'playerColor']: randomColor,
                        letter: firstLetters,
                    }), index);
                }
            }
        } else {
            // Update only initials if color already exists
            if (onChange) {
                if (type === 'players') {
                    onChange({
                        letter: firstLetters,
                        playerColor: color
                    }, index);
                } else {
                    onChange((prev) => ({
                        ...prev,
                        letter: firstLetters,
                    }), index);
                }
            }
        }
    }, [name]);

    return (
        <Box className='avtar' bgcolor={color}>
            {initials}
        </Box>
    );
};

export default React.memo(Avatar);

