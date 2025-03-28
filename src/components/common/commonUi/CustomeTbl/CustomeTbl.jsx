import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Image from "next/image"
import './CustomeTbl.css'
import ImageAvatar from "../ImageAvatar/ImageAvatar"

const CustomeTbl = ({ headRow, data }) => {
    return (
        <TableContainer component={Paper} className="tableContainer">
            <Table className="table_main" size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {
                            headRow && headRow.length > 0 && headRow.map((item, i) => {
                                return (
                                    <TableCell align="left" key={item?.keyname || i} className={`table_main_head_tr_th ${i === 0 ? 'table_main_head_tr_th_index_0' : ''}`}>
                                        {item?.title}
                                    </TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data && data.length > 0 && data.map((item, i) => {
                            return (
                                <TableRow key={`$_${i}`} sx={{ border: 0 }}>
                                    {
                                        headRow && headRow.length > 0 && headRow.map((row, i) => {
                                            return (
                                                <TableCell align="left" key={row?.keyname || i} className={`table_main_body_tr_td ${i === 0 ? 'table_main_body_tr_td_index_0' : ''}`}>
                                                    {
                                                        row?.keyname === 'team_name' ? (
                                                            <Box className='image_col'>
                                                                <Box className='image_box'>
                                                                    {item['team_logo'] && <Image src={`/${item['team_logo']}`} alt={row?.keyname} width={100} height={100} />}
                                                                    {!item['team_logo'] && <ImageAvatar fontSize={'var(--small)'} height={'40px'} width={'40px'} 
                                                                    text={item['letter']} bgColor={item['team_color']} smallHeight={'40px'} smallWidth={'40px'} meduimHeight={'40px'} meduimWidth={'40px'} />}
                                                                </Box>
                                                                <Typography variant='body2' className="para">{item[row?.keyname]?.toLowerCase()}</Typography>
                                                            </Box>
                                                        ) : row?.keyname === 'nrr' ? (
                                                            item[row?.keyname]?.toFixed(3)
                                                        ) : (
                                                            item[row?.keyname]
                                                        )
                                                    }
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomeTbl