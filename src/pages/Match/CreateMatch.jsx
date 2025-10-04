import SvgIcon from "@/assets/icons/SvgIcon";
import { generateUniqueId } from "@/components/common/commomFunction";
import { CommonText } from "@/components/common/commonText";
import CommonBack from "@/components/common/commonUi/commonBack";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { SwipeUpDrawer } from "@/components/common/commonUi/CustomeCommon";
import CustomeInput from "@/components/common/commonUi/CustomeInput";
import ImageAvatar from "@/components/common/commonUi/ImageAvatar/ImageAvatar";
import Loader from "@/components/common/commonUi/Loader";
import { ScheduleMatchJson } from "@/components/common/json/ScheduleMatchJson";
import { createMatchSchedule, editMatchSchedule } from "@/redux/slices/matchSlice";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import vsPic from '../../assets/img/vs.png';
import './CreateMatch.css';
import CustomeTags from "@/components/common/commonUi/CustomeTags";

const TeamSelectionBox = ({ title, previewPath, onClick, keyName, error, SelectedTeamData }) => {
    return (
        <Box className='team_selection_Box'>
            <Box
                className='selecte_team_logo'
                onClick={(e) => onClick(keyName)}
                sx={{ backgroundImage: `url('/${previewPath}')` }}>
                {!previewPath && !SelectedTeamData && <SvgIcon id='plus' />}
                {!previewPath && SelectedTeamData && <ImageAvatar text={SelectedTeamData?.letter} bgColor={SelectedTeamData?.team_color} />}
            </Box>
            {title && <Typography variant="body2" className="describe">{title}</Typography>}
            {error && <Typography color="error" variant="body2" sx={{ textAlign: 'center', margin: '1px 0 20px', zIndex: 1 }}>{error}</Typography>}
        </Box>
    )
}

const TeamBanner = ({ banner, selectdTeam, onClick, errors, tournamentColor, handleBack }) => {
    return (
        <Box sx={{ backgroundImage: `url('${banner}')`, backgroundColor: `${!banner ? tournamentColor : ""}` }} className='create_team_banner'>
            <CommonBack onClick={handleBack} />
            <Box className='box_child'>
                <TeamSelectionBox
                    title={selectdTeam?.team1?.team_name || `${CommonText.SelectTeam1}`}
                    keyName='team1'
                    onClick={onClick}
                    previewPath={selectdTeam?.team1?.team_logo}
                    SelectedTeamData={selectdTeam?.team1}
                    error={errors['team1']}
                />
                <Box sx={{ width: '40px', height: '100px', zIndex: '1' }}>
                    <Image src={vsPic} alt="logo" width={100} height={100} unoptimized />
                </Box>
                <TeamSelectionBox
                    title={selectdTeam?.team2?.team_name || `${CommonText.SelectTeam2}`}
                    keyName='team2'
                    onClick={onClick}
                    previewPath={selectdTeam?.team2?.team_logo}
                    SelectedTeamData={selectdTeam?.team2}
                    error={errors['team2']}
                />
            </Box>
        </Box>
    )
}

const CreateMatchPage = ({ tournament, teams, type, matchData }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [selectedKey, setSelectedKey] = useState('')
    const [selectdTeam, setSelectedTeam] = useState({
        team1: null,
        team2: null,
        team1Error: null,
        team2Error: null,
    })
    const [scheduleMatch, setScheduleMatch] = useState({
        team1: null,
        team2: null,
        match_start_time: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
        numberOfOvers: '',
        overPerBowler: '',
        perteamplayers: '',
        wagonWheel: false
    })
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [selectableTeams, setSelectableTeams] = useState([])
    let showError = selectdTeam?.team1Error || selectdTeam?.team2Error
    const Groups = tournament?.Group || []
    const scheduleType = sessionStorage.getItem('scheduleType') || ''
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    useEffect(() => {
        if (!Groups || Groups.length === 0) return;

        let filterdata = teams.filter(team =>
            Groups.some(group => group.teams?.includes(team.id))
        );
        setSelectableTeams(filterdata);
    }, [teams, Groups]);

    useEffect(() => {
        setSelectedTeam((prev) => ({
            ...prev,
            team1: matchData?.team1,
            team2: matchData?.team2
        }))
        setScheduleMatch((prev) => ({
            ...prev,
            team1: matchData?.team1,
            team2: matchData?.team2,
            match_start_time: matchData?.match_start_time ? matchData?.match_start_time : new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
            numberOfOvers: matchData?.totalovers,
            overPerBowler: matchData?.overPerBowler,
            perteamplayers: matchData?.perteamplayers
        }))
    }, [matchData])

    useEffect(() => {
        if (scheduleType === 'group_match') {
            const selectedKeyTeam = (selectedKey === 'team1' ? 'team2' : selectedKey)
            if ((selectdTeam?.[selectedKey] && !selectdTeam?.[selectedKeyTeam])) {
                if (!Groups || Groups.length === 0) return;

                let filterdata = teams.filter(team =>
                    Groups.some(group => group.teams?.includes(team.id))
                );
                setSelectableTeams(filterdata);
            } else if (selectdTeam?.team1 || selectdTeam?.team2) {
                const selectedTeamGroup = Groups?.find(group =>
                    group?.teams?.some(teamId =>
                        teamId === selectdTeam?.team1?.id || teamId === selectdTeam?.team2?.id
                    )
                );

                if (selectedTeamGroup) {
                    const filteredTeams = teams.filter(team => selectedTeamGroup.teams.includes(team.id));
                    setSelectableTeams(filteredTeams);
                } else {
                    setSelectableTeams([]);
                }
            }
        } else {
            setSelectableTeams(teams)
        }
    }, [selectdTeam, Groups, teams]);

    const handleCreateMatchAsEmty = () => {
        setSelectedKey('')
        setSelectedTeam({
            team1: null,
            team2: null,
            team1Error: null,
            team2Error: null,
        })
        setScheduleMatch({
            team1: null,
            team2: null,
            match_start_time: '',
            numberOfOvers: '',
            overPerBowler: '',
            perteamplayers: ''
        })
        setSelectableTeams(teams)
    }

    const handleSelectTeam = (val) => {
        if (val === 'team2' && selectdTeam?.team1 === undefined) {
            setErrors(prev => ({
                ...prev,
                'team1': 'Select Team 1 First'
            }))
        } else {
            handleOpen(true)
            setSelectedKey(val);
            setSelectedTeam(prev => ({
                ...prev,
                team1Error: null,
                team2Error: null,
            }))
        }
    }

    const handleSelecteTeamData = (isAlredySelected, val) => {
        if (selectedKey === 'team1' && selectdTeam?.team2?.id === val.id) {
            setSelectedTeam({
                ...selectdTeam,
                team1Error: `${CommonText.ErrorTeam1Team2NotSame}`
            });
            return;
        }

        if (selectedKey === 'team2' && selectdTeam?.team1?.id === val.id) {
            setSelectedTeam({
                ...selectdTeam,
                team2Error: `${CommonText.ErrorTeam1Team2NotSame}`
            });
            return;
        }
        setSelectedTeam({
            ...selectdTeam,
            [selectedKey]: val,
            [`${selectedKey}Error`]: null
        });
        setScheduleMatch(prev => ({
            ...prev,
            [selectedKey]: val,
        }))

        // group wise team selection logic
        const selectedTeamGroup = Groups.find(group => group.teams.includes(val.id));
        if (selectedTeamGroup) {
            const selectableTeams = teams.filter(team => selectedTeamGroup.teams.includes(team.id));
            setSelectableTeams(selectableTeams);
        }
        setErrors(prev => ({
            ...prev,
            [selectedKey]: ''
        }));
        handleClose()
    }

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        const formFields = tournament?.match_type === "Test Match" ? ScheduleMatchJson.filter((item) => !["overPerBowler", "numberOfOvers", "wagonWheel"].includes(item?.key_name)) : ScheduleMatchJson.filter((item) => !["wagonWheel"].includes(item?.key_name));
        formFields.forEach(field => {
            const value = scheduleMatch[field.key_name];
            if (!value || (typeof value === 'string' && value.trim() === '') && field.key_name !== "wagonWheel") {
                newErrors[field.key_name] = `${field.label} is required`;
                isValid = false;
            }
        });

        if (!scheduleMatch['team1']) {
            newErrors['team1'] = CommonText.Team1Required;
            isValid = false;
        }
        if (!scheduleMatch['team2']) {
            newErrors['team2'] = CommonText.Team2Required;
            isValid = false;
        }

        const selectedDateTime = new Date(scheduleMatch.match_start_time);
        const now = new Date();

        if (isNaN(selectedDateTime.getTime())) {
            newErrors['match_start_time'] = 'Invalid date selected';
            isValid = false;
        } else {
            const selectedDate = selectedDateTime.toISOString().split('T')[0];
            const currentDate = now.toISOString().split('T')[0];

            if (selectedDate < currentDate) {
                newErrors['match_start_time'] = 'The selected date has already passed. Please choose a future date.';
                isValid = false;
            } else if (selectedDate === currentDate) {
                if (selectedDateTime.getTime() < now.getTime()) {
                    newErrors['match_start_time'] = 'The selected time has already passed. Please choose a future time.';
                    isValid = false;
                }
            }
        }

        const { perteamplayers, numberOfOvers, overPerBowler } = scheduleMatch;
        if (perteamplayers && numberOfOvers && overPerBowler) {
            const perTeamPlayersNum = parseInt(perteamplayers, 10);
            const numberOfOversNum = parseInt(numberOfOvers, 10);
            const overPerBowlerNum = parseInt(overPerBowler, 10);

            if (Math.floor(numberOfOversNum / overPerBowlerNum) > perTeamPlayersNum) {
                newErrors['overPerBowler'] = 'The overs per bowler cannot be less than the per team players for the given number of overs.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleOnChange = (value, key) => {
        if (key === 'wagonWheel') {
            setScheduleMatch(prev => ({
                ...prev,
                [key]: value === 'Yes'
            }));
            return
        }

        setScheduleMatch(prev => ({
            ...prev,
            [key]: value
        }));
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };

    const handleCreateTournament = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            setLoading(true)
            let res
            if (type !== 'edit') {
                const matchData = {
                    id: generateUniqueId(),
                    team1: selectdTeam?.team1,
                    team2: selectdTeam?.team2,
                    match_start_time: scheduleMatch?.match_start_time,
                    totalovers: scheduleMatch?.numberOfOvers,
                    overPerBowler: scheduleMatch?.overPerBowler,
                    perteamplayers: scheduleMatch?.perteamplayers,
                    wagonWheel: scheduleMatch?.wagonWheel,
                    tournamentId: tournament?.id,
                    status: 1
                };
                res = await dispatch(createMatchSchedule(matchData))
            } else if (type === 'edit') {
                const editmatchData = {
                    id: matchData?.id,
                    team1: selectdTeam?.team1,
                    team2: selectdTeam?.team2,
                    match_start_time: scheduleMatch?.match_start_time,
                    totalovers: scheduleMatch?.numberOfOvers,
                    overPerBowler: scheduleMatch?.overPerBowler,
                    perteamplayers: scheduleMatch?.perteamplayers,
                    wagonWheel: scheduleMatch?.wagonWheel,
                    tournamentId: tournament?.id,
                    status: matchData?.status
                };
                res = await dispatch(editMatchSchedule(editmatchData))
            }

            if (res) {
                handleCreateMatchAsEmty()
                setTimeout(() => {
                    router.push(`/mytournament/${tournament?.id}/match`)
                    setLoading(false)
                }, 1000);
            }

        } catch (error) {
            console.error(error.message)
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loader />}
            <TeamBanner
                tournamentColor={tournament?.tournament_logo_color}
                banner={tournament?.tournament_banner}
                describe={CommonText.SelectTeam}
                onClick={handleSelectTeam}
                selectdTeam={selectdTeam}
                errors={errors}
                handleBack={() => {
                    router.back()
                }}
            />
            <Box className='matchFrom'>
                {
                    ScheduleMatchJson.length > 0 && ScheduleMatchJson.map((field, index) => {
                        let value = field?.key_name === 'wagonWheel' ? scheduleMatch[field?.key_name] === true ? 'Yes' : 'No' : scheduleMatch[field?.key_name];
                        const error = errors[field.key_name];
                        let isNotShow = tournament?.match_type === "Test Match" && ["overPerBowler", "numberOfOvers"]?.includes(field?.key_name)
                        if (!isNotShow && field?.show_type === "input") {
                            return (
                                <CustomeInput
                                    tournament={tournament}
                                    key={index}
                                    placeholder={field?.placeholder}
                                    type={field?.type}
                                    error={error}
                                    keyName={field?.key_name}
                                    label={field?.label}
                                    value={value}
                                    onChange={handleOnChange}
                                />
                            )
                        } else if (field?.show_type === 'tags') {
                            return (
                                <React.Fragment key={index}>
                                    <CustomeTags
                                        key={index}
                                        label={field?.label}
                                        data={field?.data}
                                        value={value}
                                        error={error}
                                        keyName={field?.key_name}
                                        onClick={handleOnChange}
                                    />
                                </React.Fragment>
                            );
                        }
                    })
                }
                <Box className='scheduleButton'>
                    <CustomeButton title={type === 'edit' ? CommonText.EditMatch : CommonText.ScheduleMatch} width={'80%'} height={'50px'} onClick={handleCreateTournament} />
                </Box>
            </Box>
            <SwipeUpDrawer open={open} onClose={handleClose} maxHeight={'70%'}>
                {showError && <Typography color="error" variant="body2" sx={{ textAlign: 'center', margin: '-18px 0 20px', zIndex: 1 }}>{showError}</Typography>}
                <Box className='team_show_row'>
                    <Box className={`show_all_Team ${selectableTeams.length > 9 ? 'scroll' : selectableTeams.length > 3 ? 'wrap' : ''}`}>
                        {
                            selectableTeams.length > 1 ? selectableTeams.map((item, i) => {
                                const isSelected =
                                    (selectedKey === 'team1' && selectdTeam?.team1?.id === item.id) ||
                                    (selectedKey === 'team2' && selectdTeam?.team2?.id === item.id);
                                const isAlredySelected =
                                    (selectedKey === 'team1' && selectdTeam?.team2?.id === item.id) ||
                                    (selectedKey === 'team2' && selectdTeam?.team1?.id === item.id);
                                let teamName = item?.team_name.length > 10 ? item?.team_name.slice(0, 10) + '...' : item?.team_name

                                return (
                                    <Box className={`Team_box ${selectableTeams.length > 3 ? 'showBox' : ''}`} key={i} onClick={() => handleSelecteTeamData(isAlredySelected, item)}>
                                        <Box className='team_logo_box'>
                                            {item?.team_logo && <Image src={`/${item?.team_logo}`} alt="logo image" width={100} height={100} unoptimized />}
                                            {!item?.team_logo && <ImageAvatar text={item?.letter} width={'80px'} height={'80px'} bgColor={item?.team_color} />}
                                            {(isSelected || isAlredySelected) && (
                                                <Box className='checkIcon'>
                                                    <SvgIcon id='trueIcon' />
                                                </Box>
                                            )}
                                        </Box>
                                        <Typography variant="body2">{teamName}</Typography>
                                    </Box>
                                )
                            })
                                :
                                <Box className='show_all_add_button'>
                                    <Typography variant="body2">Minimum 2 teams required to schedule match</Typography>
                                    <CustomeButton title={CommonText.AddTeam} width={'90%'} height={'45px'} onClick={() => router.push(`/teams/${tournament?.id}`)} />
                                </Box>
                        }
                    </Box>
                </Box>
            </SwipeUpDrawer>
        </>
    )
}

export default CreateMatchPage;