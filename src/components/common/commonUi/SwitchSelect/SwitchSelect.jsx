"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

const SwitchSelect = ({ options, defaultSelected, onChange }) => {
    const [selected, setSelected] = useState(0);

    const handleChange = (event, newSelection) => {
        if (newSelection !== null) {
            setSelected(newSelection);
            if (onChange) onChange(newSelection);
        }
    };

    return (
        <ToggleButtonGroup
            value={defaultSelected}
            exclusive
            onChange={handleChange}
            sx={{
                backgroundColor: 'var(--text-white)',
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
                            color: defaultSelected === index ? "var(--text-white) !important" : "var(--primary-color)",
                            backgroundColor: defaultSelected === index ? "var(--primary-color) !important" : 'transparent',
                            transition: "0.3s",
                            "&.Mui-selected": {
                                borderRadius: "30px",
                            },
                            "&:hover": {
                                backgroundColor: defaultSelected === index ? "var(--primary-color)" : "transparent",
                            },
                        }}
                        disableRipple
                    >
                        {/* {defaultSelected === index ? option : (index + 1)} */}
                        {option}
                    </ToggleButton>
                )
            }
            )}
        </ToggleButtonGroup>
    );
};

export default SwitchSelect;
