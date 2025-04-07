'use client'
import { Box, Typography } from '@mui/material'
import './Stats.css'

const CommonBox = ({data, title}) => {
    return(
        <Box className="stats_card">
            <Typography variant='h6'>{data}</Typography>
            <Typography variant='body2'>{title}</Typography>
        </Box>
    )
}

const Stats = ({ tournamentData }) => {
    const getStat = (statName) => tournamentData?.[statName] || 0;

    return (
            <Box className='stats_card_section activeAnimation'>
                <CommonBox data={getStat('matches')} title={'Matches'}/>
                <CommonBox data={getStat('innings')} title={'Innings'}/>
                <CommonBox data={getStat('runs')} title={'Runs'}/>
                <CommonBox data={getStat('wickets')} title={'Wickets'}/>
                <CommonBox data={getStat('balls')} title={'Balls'}/>
                <CommonBox data={getStat('extras')} title={'Extras'}/>
                <CommonBox data={getStat('fours')} title={'Fours'}/>
                <CommonBox data={getStat('sixes')} title={'Sixes'}/>
                <CommonBox data={getStat('fiftys')} title={'50`s'}/>
                <CommonBox data={getStat('hundreds')} title={'100`s'}/>
                <CommonBox data={getStat('fiftypartnerships')} title={'50+ Partnership'}/>
                <CommonBox data={getStat('hundredspartnerships')} title={'100+ Partnership'}/>
                <CommonBox data={getStat('maidens')} title={'Maidens'}/>
                <CommonBox data={getStat('dotballs')} title={'Dot Balls'}/>
                <CommonBox data={getStat('catches')} title={'Catches'}/>
                <CommonBox data={getStat('stumpings')} title={'Stumpings'}/>
                <CommonBox data={((getStat('dotballs')*100)/getStat('balls')).toFixed(2)} title={'DB%'}/>
                <CommonBox data={((((getStat('fours') * 4)+(getStat('sixes') * 6)) * 100)/getStat('runs')).toFixed(2)} title={'BDRY%'}/>
        </Box>
    )
}

export default Stats