import { CommonText } from "@/components/common/commonText"
import CustomeErrorBox from "@/components/common/commonUi/CustomeErrorBox"
import CustomeTbl from "@/components/common/commonUi/CustomeTbl/CustomeTbl"
import { Box, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import './PointTable.css'

const headerData = [
    {
        title: 'Team',
        keyname: 'team_name'
    },
    {
        title: 'M',
        keyname: 'match'
    },
    {
        title: 'W',
        keyname: 'win'
    },
    {
        title: 'L',
        keyname: 'lose'
    },
    {
        title: 'T',
        keyname: 'tie'
    },
    {
        title: 'NR',
        keyname: 'noresult'
    },
    {
        title: 'For',
        keyname: 'for'
    },
    {
        title: 'Against',
        keyname: 'againts'
    },
    {
        title: 'Pt.',
        keyname: 'point'
    },
    {
        title: 'NRR',
        keyname: 'nrr'
    },
]
const PointTable = ({ teamData, tournamentData }) => {

    const [Teams, setTeams] = useState([])
    useEffect(() => {
        const sortedTeams = Array.isArray(teamData) ? teamData.sort((a, b) => {
            if (b.point !== a.point) {
                return b.point - a.point;
            }
            return b.nrr - a.nrr;
        }) : [];
        setTeams(sortedTeams)
    }, [teamData])

    return (
        <>
            {
                tournamentData?.Group?.length > 0 ?
                    <Box className='point_table_section activeAnimation'>
                        {
                            tournamentData?.Group?.map((items, i) => {
                                const teams = items?.teams?.map((teamId) => {
                                    return teamData?.find(item => item.id === teamId);
                                }).filter(team => team);
                                const sortedTeams = teams?.sort((a, b) => {
                                    if (b.point !== a.point) {
                                        return b.point - a.point;
                                    }
                                    return b.nrr - a.nrr;
                                });
                                return (
                                    <Box key={i} className='point_table'>
                                        <Typography variant="body2">{items?.group_name ?? `Group ${i + 1}`}</Typography>
                                        <Box className='pt-gradient-line'></Box>
                                        <CustomeTbl
                                            headRow={headerData}
                                            data={sortedTeams || []}
                                        />
                                    </Box>
                                );
                            })
                        }
                    </Box>
                    :
                    Teams?.length > 0 ?
                        <Box className='point_table_section'>
                            <CustomeTbl
                                headRow={headerData}
                                data={Teams || []}
                            />
                        </Box>
                        :
                        <Box className='no-file-box'>
                            <CustomeErrorBox icon='noFile' title={CommonText.pointTableDataNotAvailable} />
                        </Box>
            }
        </>
    )
}

export default React.memo(PointTable)