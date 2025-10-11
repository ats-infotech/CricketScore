"use client";

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Image from "next/image";

const SwitchSelect = ({ options, defaultSelected, onChange, type }) => {
    const handleChange = (event, newSelection) => {
        if (newSelection !== null) {
            if (onChange) onChange(newSelection);
        }
    };

    return (
        <ToggleButtonGroup
            value={defaultSelected}
            exclusive
            onChange={handleChange}
            sx={{
                backgroundColor: 'var(--color-white)',
                borderRadius: "30px",
                padding: "5px",
                boxShadow: 'var(--shadow-grey)',
            }}
        >
            {options.map((option, index) => {
                return (
                    <ToggleButton
                        key={index}
                        value={index}
                        sx={{
                            textTransform: 'capitalize',
                            borderRadius: "30px !important",
                            padding: "5px 20px",
                            border: "none",
                            color: defaultSelected === index ? "var(--color-white) !important" : "var(--theme-primary)",
                            backgroundColor: defaultSelected === index ? "var(--theme-primary) !important" : 'transparent',
                            transition: "0.3s",
                            "&.Mui-selected": {
                                borderRadius: "30px",
                            },
                            "&:hover": {
                                backgroundColor: defaultSelected === index ? "var(--theme-primary)" : "transparent",
                            },
                        }}
                        disableRipple
                    >
                        {/* {defaultSelected === index ? option : (index + 1)} */}
                        {type === 'football' ? <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            {option?.img && <Image style={{width: '16px', height: '16px'}} src={option?.img} alt="logo" height={100} width={100} unoptimized />}
                            {option?.name}
                        </Box> : option}
                    </ToggleButton>
                )
            }
            )}
        </ToggleButtonGroup>
    );
};

export default SwitchSelect;
