import React from "react"

export const CommonInput = React.memo(({ value, onchange, loop, title, disabled, type, minWidth }) => {
    return (
        <FormControl className="scoreboard_form">
            <InputSelect
                value={value}
                onChange={onchange}
                disabled={disabled}
                minWidth={minWidth}
                sx={{
                    backgroundColor: 'var(--theme-blue-bg)',
                    color: 'var(--color-white)',
                    '& .MuiSvgIcon-root': {
                        color: 'var(--color-white)',
                    },
                    '&.Mui-focused': {
                        border: 'none',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&:hover': {
                        border: 'none',
                    },
                }}
            >
                <MenuItem value={0}>{title}</MenuItem>
                {
                    loop.map((items, i) => {
                        return (
                            <MenuItem key={i} value={i + 1} >{type === "reason" ? items : items.playerName}</MenuItem>
                        )
                    })
                }
            </InputSelect>
        </FormControl>
    )
})

export const SelectionOptionSection = React.memo(({ title, value, option, firstoption, onchange, width, className }) => {
    return (
        <Box className={`scoreboard_common_section ${width && 'active'} ${className}`}>
            <Box>
                <Typography variant="body2">{title}</Typography>
            </Box>
            <Box sx={{ width: width ? width : '60%' }}>
                <CustomSelectInput label={firstoption} options={option.map(player => ({ key: player.id, name: player.playerName }))} onChange={onchange} value={value} />
            </Box>
        </Box>
    )
})

export const RenderButton = React.memo(({ onClick, title, disabled }) => {
    return (
        <CustomeButton
            onClick={onClick}
            bgColor={'var(--color-white)'}
            color={'var(--theme-primary)'}
            hover={'none'}
            title={title}
            width={'100%'}
            height={'44px'}
            disabled={disabled}
        />
    )
});