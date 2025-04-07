import { Box, Typography, useMediaQuery } from "@mui/material"
import Image from "next/image"
import './StrikePlayerSection.css'
import CustomeCheckBox from "@/components/common/commonUi/CustomeCheckBox/CustomeCheckBox"

const PlayerSelection = ({ playerdata = [], onCheck, handleUpdatePlayer, isPlayer, type, isPlayerShow = false, side }) => {
    let isShow = (type && type === 'readonly')
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')

    const handleCheckPlayer = (e, item) => {
        if (!isPlayerShow) {
            if (!isShow) {
                onCheck(e, item)
            } else {
                handleUpdatePlayer(item)
            }
        }
    }
    return (
        <Box className={`strike_player_selection_box ${side === 'user' && 'user'}`}>
            <Box className='strike_player_row_box'>
                {
                    playerdata.length > 0 && playerdata.map((item) => {
                        let isSelect = isPlayer && isPlayer === item?.id
                        return (
                            <Box onClick={(e) => handleCheckPlayer(e, item)} key={item?.id} className='strike_player_box'>
                                <Box className='box_column'>
                                    <Box sx={{maxWidth: sm ? '120px' : md ? '130px' : '140px'}} className={`strike_player_image ${type === 'readonly' ? 'active' : isSelect ? 'active' : 'notActive'}`}>
                                        <Box className='strike_player_photo'>
                                            {
                                                item?.playerImage ?
                                                    <Image unoptimized className={type === 'readonly' ? 'active' : isSelect ? 'active' : 'notActive'} src={`/${item?.playerImage}`} alt='profile pic' width={150} height={150} />
                                                    :
                                                    <Box className={type === 'readonly' ? 'active' : isSelect ? 'active' : 'notActive'}
                                                        sx={{
                                                            width: sm ? '80px' : md ? '90px' : '95px',
                                                            height: sm ? '80px' : md ? '90px' : '95px',
                                                            borderRadius: '100px',
                                                            border: 'none',
                                                            color: 'var(--text-white)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '24px',
                                                            fontWeight: 'bold',
                                                            backgroundColor: item?.playerColor,
                                                            marginTop: sm ? '1px' : md ? '7px' : '3px'
                                                        }}
                                                    >
                                                        {item?.letter}
                                                    </Box>
                                            }
                                            {isSelect && <Box className='box_design'></Box>}
                                        </Box>
                                    </Box>
                                    <Typography className="player_name" variant="body2">{item?.playerName}</Typography>
                                </Box>
                                {!isShow && <CustomeCheckBox checked={isSelect} onChange={(e) => handleCheckPlayer(e, item)} />}
                            </Box>
                        )
                    })
                }
            </Box>
        </Box >
    )
}

export default PlayerSelection