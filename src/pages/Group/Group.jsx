'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { generateUniqueId } from "@/components/common/commomFunction"
import CustomeBack from "@/components/common/commonUi/CustomeBack"
import CustomeButton from "@/components/common/commonUi/CustomeButton"
import CustomeInput from "@/components/common/commonUi/CustomeInput"
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox"
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar"
import Loader from "@/components/common/commonUi/Loader"
import MessageModal from "@/components/common/commonUi/Modal/MessageModal"
import { teamsState } from "@/redux/slices/teamSlice"
import { ReplaceTournamentGroups, tournamentState, UpdateTournamentGroups } from "@/redux/slices/tournamentSlice"
import { Delete, Edit } from "@mui/icons-material"
import { Box, Typography, useMediaQuery } from "@mui/material"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import './Group.css'

const GroupForm = [
    {
        label: 'Group Name',
        placeholder: 'Group name',
        type: 'text',
        key_name: 'group_name',
        show_type: 'input'
    },
]

const GroupPage = () => {
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()

    const sm = useMediaQuery('(max-width:360px)')

    const [groupData, setGroupData] = useState({
        group_name: '',
        Teams: []
    })
    const [activeTab, setActiveTab] = useState(0)
    const [errors, setErrors] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        group: '',
        input: ''
    })
    const [teams, setTeams] = useState([])
    const [tournamentData, setTournamentData] = useState([])
    const [tournamentGroupData, setTournamentGroupData] = useState([])
    const [edit, setEdit] = useState(false)
    const pathName = params
    const leaguetype = sessionStorage.getItem('selectedRound')
    const matchmaking = sessionStorage.getItem('matchMaking')
    const [alertModal, setAlertModal] = useState({
        success: false,
        open: false,
        message: ''
    })
    const [deletedData, setDeletedData] = useState(null)
    const [editId, setEditId] = useState('')
    const [processing, setProcessing] = useState(false)

    const [loading, setLoading] = useState(false)
    // redux data
    const team_data = useSelector(teamsState)
    const tournament_data = useSelector(tournamentState)
    const addTeamFromGroup = JSON.parse(localStorage.getItem('addTeamFromGroup') || 'null')
    const dataFromGroup = JSON.parse(localStorage.getItem('dataFromGroup') || 'null')
    const actionInTeamFromGroup = localStorage.getItem('actionInTeamFromGroup')

    const handleClose = () => {
        setAlertModal({
            success: false,
            open: false,
            message: ''
        })
    }

    useEffect(() => {
        if (!leaguetype || !matchmaking) {
            router.push(`/mytournament/${pathName?.tournamentId}/match`)
        }
    }, [leaguetype, matchmaking])

    useEffect(() => {
        if (addTeamFromGroup) {
            setActiveTab(1)
            if (actionInTeamFromGroup === 1) {
                if (dataFromGroup) {
                    setEdit(true)
                    setActiveTab(1)
                    setEditId(dataFromGroup?.id)
                    setGroupData({
                        group_name: dataFromGroup.group_name,
                        Teams: dataFromGroup.Teams
                    })
                }
            }
        }
        localStorage.setItem('addTeamFromGroup', JSON.stringify(false))
        localStorage.setItem('actionInTeamFromGroup', JSON.stringify(null))
        localStorage.setItem('dataFromGroup', JSON.stringify(false))
        let tournament = tournament_data?.data?.find((items) => items.id === pathName?.tournamentId)
        setTimeout(() => {
            setLoading(true)
            if (tournament?.Group) {
                setTournamentGroupData(tournament?.Group?.filter(item => leaguetype === item?.league))
            }
            setTournamentData(tournament)
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }, 100);

    }, [addTeamFromGroup, tournament_data])

    useEffect(() => {
        if (activeTab === 1 && edit) {
            const assignedTeams = tournamentData?.Group?.flatMap(group => group.teams) || [];
            const availableTeams = team_data?.data?.filter((item) => {
                const filterCurrentGroup = assignedTeams.filter((items) => !groupData.Teams.includes(items))
                return !filterCurrentGroup.some(assignedTeam => assignedTeam === item.id);
            });
            const filterAssignedTeams = availableTeams.filter(item => item?.tournamentId === params?.tournamentId)
            setTeams(filterAssignedTeams);
        } else if (activeTab === 1 && !edit) {
            const assignedTeams = tournamentData?.Group?.flatMap(group => group.teams) || [];
            const availableTeams = team_data?.data?.filter((item) => {
                return !assignedTeams.some(assignedTeam => assignedTeam === item.id);
            });
            const filterAssignedTeams = availableTeams.filter(item => item?.tournamentId === params?.tournamentId)
            setTeams(filterAssignedTeams);
        } else {
            let teams = team_data?.data?.filter((items) => items.tournamentId === pathName?.tournamentId)
            setTeams(teams)
        }
    }, [params, team_data, tournamentData, activeTab]);

    const IsinCludes = (item) => {
        return groupData?.Teams?.includes(item?.id)
    }

    const handleCheckboxChange = (event, item) => {
        const teamId = item?.id;
        setGroupData((prev) => {
            const newTeams = prev.Teams.includes(teamId)
                ? prev.Teams.filter(id => id !== teamId)
                : [...prev.Teams, teamId];

            return { ...prev, Teams: newTeams };
        });

        setGroupData((prev) => {
            const hasError = prev.Teams.length >= 2;
            setErrors(!hasError);
            setErrorMessage(prevError => ({
                ...prevError,
                group: hasError ? '' : ''
            }));

            return prev;
        });
    }

    const handleAddClick = () => {
        setErrors(false)
        setErrorMessage({ group: '', input: '' })
        setActiveTab(1)
    }

    const handleOnChange = (value, key) => {
        setGroupData(prev => ({
            ...prev,
            [key]: value
        }));
        setErrors(!value)
        setErrorMessage(prev => ({
            ...prev,
            input: !value ? 'Please enter group name' : ''
        }))
    };

    const handleSubmit = () => {
        const GroupObj = {
            id: generateUniqueId(),
            group_name: groupData.group_name,
            teams: groupData.Teams,
            league: leaguetype
        };
        const isEditing = !!editId;
        let OtherGroup = isEditing ? tournamentData?.Group.filter(item => item.id !== editId) : tournamentData?.Group
        const isDuplicate = OtherGroup?.some(group => {
            return group.group_name.trim().toLowerCase() === groupData['group_name'].trim().toLowerCase()
        });

        if (!groupData.group_name || groupData.Teams.length <= 1 || isDuplicate) {
            setErrorMessage({
                group: groupData.Teams.length <= 1 ? 'Please select minimun two teams' : '',
                input: !groupData.group_name ? 'Please enter group name' : isDuplicate ? 'This name of group is already taken' : ''
            })
            setErrors(true)
            return
        }

        if (edit) {
            dispatch(UpdateTournamentGroups({
                id: tournamentData.id,
                group_id: editId,
                group_name: groupData.group_name,
                updatedGroup: GroupObj
            }));
        } else {
            const newObj = {
                ...tournamentData,
                Group: [...(tournamentData?.Group || []), GroupObj]
            };
            dispatch(ReplaceTournamentGroups(newObj));
        }
        setEdit(false)
        setErrors(false)
        setErrorMessage({
            input: '',
            group: ''
        })
        setActiveTab(0)
        setGroupData({
            group_name: '',
            Teams: []
        })
    };

    const handleComplete = () => {
        if (matchmaking === 'manual_schedule_match') {
            router.push(`/creatematch/${pathName?.tournamentId}`)
        } else if (matchmaking === 'auto_match') {
            router.push(`/automatchschedule/${pathName?.tournamentId}`)
        }
    }

    const handleBack = () => {
        setActiveTab(0)
        setGroupData({
            group_name: '',
            Teams: []
        })
        setEdit(false)
        setErrors(false)
        setErrorMessage({
            group: '',
            input: ''
        })
        setEditId('')
    }
    const handleDeleteInfo = (data) => {
        setDeletedData(data)
        setAlertModal({
            success: false,
            open: true,
            message: 'Are you sure want to Delete This Group ?'
        })
    }

    const handleDelete = async () => {
        if (deletedData) {
            setProcessing(true)
            let data = deletedData
            const updatedGroups = tournamentData?.Group?.filter(item => item.id !== data.id);
            const updatedTournamentData = {
                ...tournamentData,
                Group: updatedGroups,
            };
            let res = await dispatch(ReplaceTournamentGroups(updatedTournamentData));
            if (res) {
                let timer = setTimeout(() => {
                    setProcessing(false)
                    setAlertModal({
                        success: true,
                        open: true,
                        message: 'Group Deleted SuccessFully'
                    })
                    return () => clearTimeout(timer)
                }, 1000);
            }
        }
    };

    const handleEdit = (data) => {
        setEdit(true)
        setErrors(false)
        setErrorMessage({
            group: '',
            input: ''
        })
        setActiveTab(1)
        setEditId(data?.id)
        setGroupData({
            group_name: data.group_name,
            Teams: data.teams
        })
    };

    const handleAddTeamFromGroup = () => {
        localStorage.setItem('addTeamFromGroup', JSON.stringify(true))
        localStorage.setItem('actionInTeamFromGroup', JSON.stringify(edit ? 1 : 0))
        localStorage.setItem('dataFromGroup', JSON.stringify(edit ? {
            editId,
            ...groupData,
        } : null))
        router.push(`/teams/${pathName?.tournamentId}`)
    }

    return (
        <Box className='group_main_section'>
            <CustomeBack title={activeTab === 0 ? 'Groups' : edit ? 'Update Group' : 'Add Group'} align='center' onclick={activeTab === 1 ? handleBack : () => {
                sessionStorage.removeItem('matchmaking')
                sessionStorage.removeItem('selectedRound')
                router.push(`/mytournament/${pathName?.tournamentId}/match`)
            }} />
            {activeTab === 0 &&
                <Box className={`all_groups`}>
                    {loading && <Loader />}
                    {
                        tournamentGroupData?.length > 0 ? tournamentGroupData?.map((items, i) => {
                            return (
                                <Box key={i} className='Selected_teams_main_section'>
                                    <Box className='group_action_section'>
                                        <Box className='group_actions' onClick={() => handleEdit(items)}>
                                            <Edit />
                                        </Box>
                                        <Box className='group_actions' onClick={() => handleDeleteInfo(items)}>
                                            <Delete sx={{ color: 'var(--color-red)!important' }} />
                                        </Box>
                                    </Box>
                                    <Box className='Group_name_field'>
                                        <Typography variant="body2">{items?.group_name}</Typography>
                                        <Box className='gp-gradient-line'></Box>
                                    </Box>
                                    <Box className={`Selected_team_section ${items?.teams.length <= 2 && 'activeSize'} ${items?.teams.length === 3 && !sm && 'active3three'}`}>
                                        {
                                            items?.teams?.map((teamId, i) => {
                                                const team = teams?.find(item => item.id === teamId);

                                                return (
                                                    <Box className='team_box' key={i}>
                                                        <Box className={`Selected_teams ${items?.teams.length <= 2 && 'activeSize'}`}>
                                                            {team?.team_logo && <Image src={`/${team?.team_logo}`} alt="team" height={500} width={500} unoptimized />}
                                                            {!team?.team_logo && <ImageAvatar text={team?.letter} bgColor={team?.team_color} borderRadius={'10px'} />}
                                                        </Box>
                                                        <Typography variant="body2">{team?.team_name}</Typography>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Box>
                            );
                        })
                            :
                            <>
                                <CustomeMessageBox title='No Groups Available' describe='Click on Add Group And add Group here' />
                                <CustomeButton width={'50%'} title={"Add Group"} onClick={handleAddClick} />
                            </>
                    }

                </Box>
            }
            {
                activeTab === 1 &&
                <>
                    {
                        GroupForm.length > 0 && GroupForm.map((items, i) => {
                            return (
                                <Box key={i}>
                                    <CustomeInput
                                        key={i}
                                        label={items.label}
                                        placeholder={items.placeholder}
                                        type={items.type}
                                        keyName={items.key_name}
                                        value={groupData['group_name']}
                                        onChange={handleOnChange}
                                        error={errorMessage.input}
                                    />
                                </Box>
                            )
                        })
                    }
                    {errorMessage.group && <Typography sx={{ margin: '0 0 10px 0' }} color="error" variant="body2">{errorMessage.group}</Typography>}
                    <Box className={`group_post_main_section ${errorMessage.group || errorMessage.input ? 'activeHeight' : ''}`}>
                        <Box className='group_row_section'>
                            <Box className={`add_team_in_group`} onClick={handleAddTeamFromGroup}>
                                <Box className='team_group_box'>
                                    <Box className='svgBox'>
                                        <SvgIcon id={'plus'} />
                                    </Box>
                                </Box>
                                <Typography variant="body2">Add Teams</Typography>
                            </Box>
                            {
                                teams.length > 0 && teams.map((item) => {
                                    let isSelect = IsinCludes(item)
                                    let teamName = item?.team_name.length > 10 ? item?.team_name.slice(0, 10) + '...' : item?.team_name
                                    return (
                                        <Box className={`group_common_main_section ${isSelect ? 'active' : ''}`} key={item?.id} onClick={(e) => handleCheckboxChange(e, item)}>
                                            <Box className='group_common_section'>
                                                {item?.team_logo && <Image unoptimized src={`/${item?.team_logo}`} alt='profile pic' width={150} height={150} />}
                                                {!item?.team_logo && <ImageAvatar text={item?.letter} bgColor={item?.team_color} borderRadius={'10px'} smallHeight={'100px'} smallWidth={'100px'} />}
                                            </Box>
                                            <Typography variant="body2">{teamName}</Typography>
                                            <Box className='group_common_sub_section'>
                                                <Box className={`group_checkbox_section ${isSelect ? 'active' : ''}`}>
                                                    {isSelect && <SvgIcon id={'trueIcon'} height={20} width={20} style={{ color: 'var(--color-white)' }} />}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </Box>
                </>
            }
            {<Box className='group_final_button'>
                {
                    activeTab === 0 && tournamentGroupData?.length > 0 ?
                        <>
                            <CustomeButton
                                width={'50%'}
                                title={"Add Group"}
                                bgColor={'var(--color-white)'}
                                color={'var(--theme-primary)'}
                                border={'1px solid var(--theme-primary)'}
                                onClick={handleAddClick}
                            />
                            <CustomeButton
                                width={tournamentGroupData?.length > 0 ? '50%' : '80%'}
                                title={"Next"}
                                onClick={handleComplete}
                            />
                        </>
                        :
                        activeTab === 1 && <CustomeButton
                            width={'80%'}
                            title={edit ? 'Update Group' : 'Add Group'}
                            onClick={handleSubmit}
                            disabled={!(groupData?.group_name && groupData?.Teams?.length >= 2)}
                        />
                }
            </Box>}
            <MessageModal
                open={alertModal?.open}
                handleClose={handleClose}
                success={alertModal?.success}
                message={alertModal?.message}
                handleSubmit={handleDelete}
                processing={processing}
            />
        </Box>
    )
}

export default GroupPage