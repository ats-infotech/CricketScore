import SvgIcon from '@/assets/icons/SvgIcon'
import { CheckTournamentIsRunning } from '@/components/common/commomFunction'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomeErrorBox from '@/components/common/commonUi/CustomeErrorBox'
import CustomeMessageBox from '@/components/common/commonUi/CustomeMessageBox'
import ImageAvatar from '@/components/common/commonUi/ImageAvatar/ImageAvatar'
import MessageModal from '@/components/common/commonUi/Modal/MessageModal'
import SectionBox from '@/components/common/commonUi/SectionBox/SectionBox'
import { deleteMultiplePlayerData, playersState } from '@/redux/slices/playersSlice'
import { deleteTeam } from '@/redux/slices/teamSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadFile, uploadPlayerFile } from '../../../components/common/uploadFileApis'
import './TeamPage.css'


const CommonTeamSection = React.memo(({ teamData, onClick, title, boolean = false, isAuction = false }) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null)
    };

    const handleMenuItemClick = (action) => {
        if (selectedItem) {
            onClick(selectedItem, action)
        }
        handleClose();
    };

    return (
        <Box sx={{ padding: '0 0 0' }}>
            {
                teamData.length > 0 && teamData.map((item, i) => {
                    let lastData = teamData.length === (i + 1)
                    return (
                        <Box key={i} className={`${lastData ? 'm-0' : ''} ${title === 'View Players' ? 'userteamBox' : 'teamBox'}`}>
                            <Box className='teamChildBox'>
                                <Box className='team_logo_section'>
                                    {item?.team_logo &&
                                        <Image src={`/${item?.team_logo}`} width={60} height={60} alt='team logo' unoptimized />
                                    }
                                    {!item?.team_logo &&
                                        <ImageAvatar bgColor={item?.team_color} text={item?.letter} borderRadius={'10px'}
                                            fontSize={'var(--small)'} />
                                    }
                                </Box>
                                <Box className='teamDetails'>
                                    <Typography variant='h6'>{item?.team_name}</Typography>
                                    <Typography variant='body2'>
                                        <SvgIcon id={'location'} />
                                        <span>{item?.location}</span>
                                    </Typography>
                                    {
                                        title === 'View Players' &&
                                        <Box className='team_background_effect' ></Box>
                                    }
                                </Box>
                            </Box>
                            <Box>
                                <IconButton onClick={(e) => handleClick(e, item)} aria-controls="simple-menu" aria-haspopup="true" className='menu-icon-box'>
                                    <MoreVertIcon />
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    className='list-menu'
                                >
                                    {
                                        title !== 'View Players' ?
                                            <div>
                                                <MenuItem onClick={() => handleMenuItemClick('add_player')}>
                                                    <Box className='AddPlayerTag' >
                                                        <SvgIcon id={'add-player'} />
                                                        <Typography variant='body2'>{title}</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuItemClick('edit')}>
                                                    <Box className='AddPlayerTag' >
                                                        <EditIcon />
                                                        <Typography variant='body2'>Edit</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuItemClick('delete')}>
                                                    <Box className='AddPlayerTag delete' >
                                                        <DeleteIcon color='error' />
                                                        <Typography variant='body2'>Delete</Typography>
                                                    </Box>
                                                </MenuItem>
                                            </div>
                                            :
                                            <div>
                                                <MenuItem onClick={() => handleMenuItemClick('view_player')}>
                                                    <Box className='AddPlayerTag' >
                                                        <SvgIcon id={'add-player'} />
                                                        <Typography variant='body2'>{title}</Typography>
                                                    </Box>
                                                </MenuItem>
                                                {
                                                    boolean &&
                                                    <MenuItem onClick={() => handleMenuItemClick('delete')}>
                                                        <Box className='AddPlayerTag delete' >
                                                            <DeleteIcon style={{ marginRight: 8 }} color='error' />
                                                            <Typography variant='body2'>Delete</Typography>
                                                        </Box>
                                                    </MenuItem>
                                                }
                                            </div>

                                    }
                                </Menu>
                            </Box>
                        </Box>
                    )
                })
            }
        </Box>
    )
})

const TeamPage = ({ tournamentData, teamData, type }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const playerData = useSelector(playersState);

    const [teamId, setTeamId] = useState(null);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" });
    const [processing, setProcessing] = useState(false);

    const isTeams = type === "teams";
    const isUserTeams = type === "userteams";
    const tournamentId = tournamentData?.id;
    const isPastTournament = useMemo(() => CheckTournamentIsRunning(
        tournamentData?.tournament_start_date,
        tournamentData?.tournament_end_date
    ) === "completed", [tournamentData]);
    const isAuction = tournamentData?.auction || false

    const handleModalClose = () => {
        setAlertModal({ open: false, success: false, message: "" });
        setTeamId(null);
    };

    const handleDeleteTeamInfo = (team) => {
        setTeamId(team);
        const teamPlayersList = playerData?.data?.filter(player => player.teamId === team.id) || [];
        setTeamPlayers(teamPlayersList);
        setAlertModal({ open: true, success: false, message: "Are you sure you want to delete this team?" });
    };

    const handleDeleteTeam = async () => {
        if (!teamId) return;

        setProcessing(true);
        const playersImages = teamPlayers.map(player => player?.playerImage).filter(Boolean);
        const playerIds = teamPlayers.map(player => player.id);

        try {
            if (playersImages.length > 0) {
                await Promise.all(playersImages.map(image => {
                    const fileName = image.split("/").pop();
                    return uploadPlayerFile({
                        thumbnail: null,
                        folderId: tournamentId,
                        subFolder: teamId.team_name,
                        fileName
                    }, "DELETE");
                }));
            }

            if (playerIds.length > 0) {
                await dispatch(deleteMultiplePlayerData({ playerId: playerIds }));
            }

            if (teamId?.team_logo) {
                const teamLogoFileName = teamId.team_logo.split("/").pop();
                await uploadFile({
                    thumbnail: null,
                    folderId: tournamentId,
                    subFolder: teamId.team_name,
                    fileName: teamLogoFileName
                }, "DELETE");
            }

            const response = await dispatch(deleteTeam({ teamId: teamId.id }));
            if (response) {
                let timer = setTimeout(() => {
                    setProcessing(false);
                    setAlertModal({ open: true, success: true, message: "Team deleted successfully" });
                    return () => clearTimeout(timer)
                }, 2000);
            }
        } catch (error) {
            console.error("Error deleting team:", error);
            setProcessing(false);
            setAlertModal({ open: true, success: false, message: "Error deleting team. Please try again." });
        }
    };

    const handleEvent = (team, action) => {
        const routes = {
            add_player: `/players/${team?.id}`,
            edit: `/edit-team/${team?.id}`,
            delete: () => handleDeleteTeamInfo(team),
            view_player: `/teamplayers/${team?.id}`,
        };
        typeof routes[action] === "function" ? routes[action]() : router.push(routes[action]);
    };

    return (
        <Box className={type === "about" ? "about_us_main maxheight" : "activeTeam"}>
            {!isAuction ? !isTeams && !isUserTeams && (
                <SectionBox icon="teams" title="TeamLink">
                    <Box className="teamlink_main">
                        {!isPastTournament && (
                            <>
                                <CustomeButton
                                    icon="addTeams"
                                    title="Add Team"
                                    onClick={() => router.push(`/teams/${tournamentId}`)}
                                />
                                <Typography variant="body2" className="OrName">Or</Typography>
                            </>
                        )}
                        <CustomeButton icon="share-line" title="Share" />
                    </Box>
                </SectionBox>
            )
                :
                teamData?.length === 0 ?
                    <Box className='auction_error'>
                        <CustomeMessageBox icon='teams2' title='Add Teams Guide'
                            describe='Quickly Add Teams with ease. Get personalized suggestions based on your preferences'
                        >
                        </CustomeMessageBox>
                        <Box sx={{ marginTop: '40px' }}>
                            <CustomeButton width={'80%'} height={'45px'} bgColor={'var(--primary-color) !important'} hover='none' title='Add Team' onClick={() => router.push(`/teams/${tournamentId}`)} />
                        </Box>
                    </Box>
                    :
                    <CustomeButton
                        icon="addTeams"
                        title="Add Team"
                        onClick={() => router.push(`/teams/${tournamentId}`)}
                    />
            }

            {teamData?.length > 0 ? (
                <Box>
                    {!isUserTeams && (
                        <Box className="teams_data_box">
                            {!isAuction ?
                                <SectionBox icon="teams2" title="My Teams">
                                    <CommonTeamSection
                                        teamData={teamData}
                                        onClick={handleEvent}
                                        isAuction={isAuction}
                                        title={!isPastTournament ? "Add Player" : "View Players"}
                                        boolean={isPastTournament}
                                    />
                                </SectionBox>
                                :
                                <CommonTeamSection
                                    teamData={teamData}
                                    onClick={handleEvent}
                                    isAuction={isAuction}
                                    title={!isPastTournament ? "Add Player" : "View Players"}
                                    boolean={isPastTournament}
                                />
                            }
                        </Box>
                    )}

                    {isUserTeams && (
                        <Box className="activeAnimation">
                            {teamData.length > 0 ? (
                                <CommonTeamSection
                                    teamData={teamData}
                                    isAuction={isAuction}
                                    onClick={handleEvent}
                                    title="View Players"
                                />
                            ) : (
                                <SectionBox
                                    icon="teams2"
                                    title="My Teams"
                                    description="Quickly add teams from your network."
                                />
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
               !isAuction && <Box sx={{ marginX: "15px" }}>
                    <CustomeErrorBox icon="noFile" title="Teams data not available" />
                </Box>
            )}

            <MessageModal
                open={alertModal.open}
                handleClose={handleModalClose}
                success={alertModal.success}
                message={alertModal.message}
                handleSubmit={handleDeleteTeam}
                processing={processing}
            />
        </Box>
    );
};

export default React.memo(TeamPage);
