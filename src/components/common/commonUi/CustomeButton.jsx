import SvgIcon from "@/assets/icons/SvgIcon"
import { Button } from "@mui/material"
import React from "react"

const CustomeButton = ({ icon, title, width, height, bgColor, borderRadius, boxShadow, color, onClick, iconWidth, iconHeight, border, hoverbg, hovertext, hover, disabled, margin, fontSize }) => {

    const handleSubmitClick = () => {
        if (!disabled) {
            if (typeof onClick === "function") {
                onClick();
            }
        }
    }

    return (
        <Button
            variant='contained'
            className="custome_button"
            sx={{
                backgroundColor: !disabled ? bgColor ? bgColor : 'var(--blue-background)' : 'var(--light-grey) !important',
                borderRadius: borderRadius ? borderRadius : '10px',
                color: !disabled ? color ? color : 'var(--text-white)' : 'var(--gray) !important',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
                textTransform: 'capitalize',
                minWidth: '0px',
                width: width ? width : '148px',
                height: height ? height : 'auto',
                padding: '8px',
                boxShadow: boxShadow ? boxShadow : 'none',
                transition: 'all 0.5s ease',
                fontWeight: '600',
                fontSize: fontSize ? fontSize : '14px',
                margin: margin ? margin : '0 auto',
                '&:hover': {
                    // backgroundColor: hover === 'none' ? bgColor : hoverbg ? hoverbg : !disabled ? 'var(--secondary-color)' : '',
                    // color: hover === 'none' ? color : hovertext ? hovertext : !disabled ? 'var(--text-white)' : '',
                    boxShadow: 'none',
                },
                '&:disabled': {
                    backgroundColor: 'var(--light-grey) !important',
                    color: 'var(--gray) !important'
                },
                border: border ? border : 'none',
            }}
            onClick={handleSubmitClick}
            disabled={disabled}
        >
            {icon && <SvgIcon id={icon} width={iconWidth ? iconWidth : 14} height={iconHeight ? iconHeight : 14} />}
            <span>{title}</span>
        </Button>
    )
}

export default React.memo(CustomeButton)