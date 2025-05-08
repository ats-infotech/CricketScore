import SvgIcon from '@/assets/icons/SvgIcon'
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MenuBarJson } from '../../json/MenuBarJson'
import './Menubar.css'

const Menubar = ({ open, direction = 'left', handleClose }) => {
    const [activeIndex, setActiveIndex] = useState(null)
    const [subActiveIndex, setSubActiveIndex] = useState(null)
    const router = useRouter()
    const sm = useMediaQuery('(max-width: 350px)')
    const md = useMediaQuery('(max-width: 380px)')
    const lg = useMediaQuery('(max-width: 410px)')

    const handleMenu = (index, val, path) => {
        if (val === 'submenu') {
            setSubActiveIndex(subActiveIndex === index ? null : index)
            redirect(path)
        } else {
            setActiveIndex(activeIndex === index ? null : index)
            redirect(path)
        }
    }

    const redirect = (path) => {
        if (path) {
            router.push('/' + path)
            handleClose()
        }
    }
    return (
        <Drawer
            open={open}
            anchor={direction}
            onClose={handleClose}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: 'var(--theme-primary)',
                    borderRadius: '0 50px 50px 0',
                    padding: sm ? '50px 20px' : md ? '50px 30px' : lg ? '50px 40px' : '50px 50px',
                    minWidth: sm ? '250px' : '320px'
                }
            }}
        >

            <Box className='profile-details'>
                <Box sx={{ width: '54px', height: '54px' }}>
                    <Image src={require('../../../../assets/img/profiledummy.png')} alt='profile' width={60} height={60} unoptimized />
                </Box>
                <Box className='profile-text'>
                    <Typography variant='body2'>Rudra Zohn</Typography>
                    <Typography variant='body2'>95322 45633</Typography>
                    <Typography variant='body2'>Rudrazohn758@gmail.com</Typography>
                </Box>
            </Box>
            <Box className='vertical-line'></Box>
            <Box sx={{ overflow: 'auto', scrollbarColor:'transparent transparent' }}>
                {
                    MenuBarJson.length > 0 && MenuBarJson.map((item, index) => {
                        let submenus = item.submenu || []
                        let redirect = item.submenu.length === 0 && item.redirect
                        return (
                            <Box key={index} sx={{cursor: 'pointer'}} >
                                <Box className={`listItem ${activeIndex === index ? 'active' : ''}`} onClick={() => handleMenu(index, 'mainmenu', redirect)}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <SvgIcon id={item?.icon} />
                                        <Typography variant='body2'>{item?.title}</Typography>
                                    </Box>
                                    {submenus.length > 0 && <SvgIcon id={'down-arrow'} className={`down-up-arrow ${activeIndex === index ? 'open' : ''}`} />}
                                </Box>
                                {
                                    activeIndex === index && submenus.length > 0 && submenus.map((item, index1) => {
                                        return (
                                            <Box className={`submenuListItem ${activeIndex === index ? 'designOpen' : ''}`} key={index1} onClick={() => handleMenu(index1, 'submenu', item?.redirect)}>
                                                <Box className={`submenu_list_btn ${subActiveIndex === index1 ? 'active' : ''}`}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                        <SvgIcon id={item?.icon} />
                                                        <Typography variant='body2'>{item?.title}</Typography>
                                                    </Box>
                                                    {subActiveIndex === index1 && <SvgIcon id={'down-arrow'} className={`right-side-arrow`} />}
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        )
                    })
                }
            </Box>
        </Drawer>
    )
}

export default React.memo(Menubar)