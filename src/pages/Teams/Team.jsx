'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { generateNumberId } from "@/components/common/commomFunction";
import { CommonText } from "@/components/common/commonText";
import Avatar from "@/components/common/commonUi/Avtar/Avtar";
import CommonBack from "@/components/common/commonUi/commonBack";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import CustomeInput from "@/components/common/commonUi/CustomeInput";
import Loader from "@/components/common/commonUi/Loader";
import { TeamForm } from "@/components/common/json/TeamForm";
import { uploadFile } from "@/components/common/uploadFileApis";
import { createTeams, teamsState, updateTeam } from "@/redux/slices/teamSlice";
import { tournamentState } from "@/redux/slices/tournamentSlice";
import { Box, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Team.css';

const TeamBanner = React.memo(({ banner, describe, onChange, previewPath, tournamentColor, errors, teamState, teamData }) => {
    const fileInputRef = useRef(null);
    const router = useRouter()

    const handleBoxClick = (val) => {
        fileInputRef.current.click()
    }
    const handleBack = () => {
        router.back(-1)
    }

    return (
        <Box sx={{ backgroundImage: `url('${banner}')`, backgroundColor: `${!banner ? tournamentColor : ""}` }} className='create_team_banner'>
            <CommonBack onClick={handleBack} />
            <Box className='upload_Team_logo' onClick={() => handleBoxClick('team_logo')} sx={{ backgroundImage: `url('${previewPath}')` }} >
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onChange(e, 'team_logo')} />
                {
                    teamData?.team_name ?
                        <>
                            {(!previewPath) &&
                                <>
                                    <Avatar onChange={teamState} name={teamData?.team_name} bgColor={teamData?.team_color} type={'team'} />
                                    <Box className='iconBox'>
                                        <SvgIcon id='addImage2' />
                                    </Box>
                                </>
                            }
                        </>
                        :
                        <>
                            {(!previewPath) && <SvgIcon id='profile' width='30px' height='30px' color='var(--text-white)' />}
                        </>
                }
            </Box>
            {describe && <Typography variant="body2" className="describe">{describe}</Typography>}
            {errors['team_logo'] && <Typography color="error" variant="body2" sx={{ textAlign: 'center', margin: '-18px 0 20px', zIndex: 1 }}>{errors['team_logo']}</Typography>}
        </Box>
    )
})

const Team = ({ tournamentData = null, type, teamData = null }) => {
    const [blobPath, setBlobPath] = useState('')
    const [errors, setErrors] = useState({});
    const [addTeam, setAddTeam] = useState({
        team_logo: '',
        team_name: '',
        location: '',
        team_contact: '',
        team_color: '',
        letter: ''
    })
    const [loading, setLoading] = useState(false)
    const tournament_data = useSelector(tournamentState)
    const team_data = useSelector(teamsState)
    const [data, setData] = useState(null)
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()


    useEffect(() => {
        if (type === 'edit' && teamData) {
            let tournament = tournament_data.data.find(item => item?.id === teamData?.tournamentId);
            setData(tournament)
            setBlobPath(teamData?.team_logo ? `/${teamData?.team_logo}` : null)
            setAddTeam({
                team_logo: teamData?.team_logo,
                team_name: teamData?.team_name,
                location: teamData?.location,
                team_contact: teamData?.team_contact,
                team_color: teamData?.team_color,
                letter: teamData?.letter
            })
        } else {
            setData(tournamentData)
        }
    }, [type, teamData]);


    const handleEmpty = () => {
        setAddTeam({
            team_logo: '',
            team_name: '',
            location: '',
            team_contact: '',
            team_color: '',
            letter: ''
        })
        setBlobPath('')
    }

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const formFields = TeamForm;
        formFields.forEach(field => {
            const value = addTeam[field.key_name];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field.key_name] = `${field.label} is required`;
                isValid = false;
            }
            if (field.key_name === 'team_contact') {
                const number = addTeam[field.key_name];
                const isNumber = number.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !number.match(/0{5,}/);

                if (!isNumber) {
                    newErrors[field.key_name] = `Add Valid ${field.label}`;
                    isValid = false;
                }
            }
        });

        if (addTeam['team_name']) {
            let EditTeam = team_data?.data?.find((items) => items?.id === params?.teamId);
            let teams = params?.slug
                ? team_data?.data?.filter((items) => items?.tournamentId === params?.slug)
                : team_data?.data?.filter((items) => items?.tournamentId === EditTeam?.tournamentId);
            const isTeamNameTaken = teams.some((team) => {
                return team.team_name.trim().toLowerCase() === addTeam['team_name'].trim().toLowerCase() && team.id !== EditTeam?.id;
            });
            if (isTeamNameTaken) {
                newErrors['team_name'] = 'This team name is already taken.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleTeamLogoUpload = (e, key) => {
        let file = e.target.files[0]
        setAddTeam((prev) => ({
            ...prev,
            [key]: file
        }))
        setBlobPath(URL.createObjectURL(file))
        // setErrors(prev => ({
        //     ...prev,
        //     [key]: ''
        // }));
    }

    const handleChange = (val, key) => {
        if (key === 'team_name' && !val) {
            setAddTeam((prev) => ({
                ...prev,
                team_color: '',
                letter: ''
            }));
        }

        setAddTeam((prev) => ({
            ...prev,
            [key]: val
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: ''
        }));
    };


    const handleAddTeam = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            setLoading(true)
            let Id = generateNumberId(team_data?.data);
            let tournamentId = tournamentData?.id
            const res = await uploadFile({
                thumbnail: addTeam.team_logo,
                folderId: tournamentId,
                subFolder: addTeam.team_name
            })

            if (res) {
                const payload = {
                    id: Id,
                    tournamentId: tournamentId,
                    ...addTeam,
                    team_logo: res?.url ? res?.url : null,
                    runs: 0,
                    wicket: 0,
                    overs: 0,
                    balls: 0,
                    match: 0,
                    point: 0,
                    noresult: 0,
                    tie: 0,
                    win: 0,
                    lose: 0,
                    nrr: 0,
                    againtsruns: 0,
                    againtsballs: 0,
                    againtsovers: 0
                };
                let response = await dispatch(createTeams(payload));
                if (response) {
                    handleEmpty();
                    setTimeout(() => {
                        setLoading(false)
                        // router.push(`/mytournament/${tournamentId}/about`)
                        router.back(-1)
                    }, 1000);
                }
            } else {
                setLoading(false)
                console.error(`${CommonText.ErrorUploadImage}`);
            }

        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }

    const handleUpdateTeam = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            setLoading(true);
            let tournamentId = data?.id;

            const payload = {
                id: teamData.id,
                tournamentId: tournamentId,
                team_name: addTeam.team_name,
                letter: addTeam.letter,
                team_color: addTeam.team_color,
                team_logo: addTeam.team_logo,
                location: addTeam.location,
                team_contact: addTeam.team_contact,
                runs: teamData.runs,
                wicket: teamData.wicket,
                overs: teamData.overs,
                balls: teamData.balls,
                match: teamData.match,
                point: teamData.point,
                noresult: teamData.noresult,
                tie: teamData.tie,
                win: teamData.win,
                lose: teamData.lose,
                nrr: teamData.nrr,
                againtsruns: teamData.againtsruns,
                againtsballs: teamData.againtsballs,
                againtsovers: teamData.againtsovers
            };

            if (addTeam.team_logo && addTeam.team_logo !== teamData?.team_logo) {
                let oldFileName = (typeof teamData?.team_logo === 'string') ? (teamData?.team_logo).split('/').pop() : ''
                const res = await uploadFile({
                    thumbnail: addTeam.team_logo,
                    folderId: tournamentId,
                    subFolder: addTeam.team_name,
                    oldFileName: oldFileName,
                }, (typeof teamData?.team_logo === 'string') ? 'PUT' : 'POST');

                if (res) {
                    payload.team_logo = res?.url;
                } else {
                    setLoading(false);
                    console.error(`${CommonText.ErrorUploadImage}`);
                    return;
                }
            }

            let response = await dispatch(updateTeam(payload));
            if (response) {
                setTimeout(() => {
                    router.back(-1)
                    //     router.push(`/mytournament/${tournamentId}/teams`);
                    setLoading(false);
                }, 1000);
            }

        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <>
            {loading && <Loader />}
            <Box>
                <TeamBanner banner={data?.tournament_banner} tournamentColor={data?.tournament_logo_color} describe={CommonText.AddTeamLogo} teamState={setAddTeam} teamData={addTeam} onChange={handleTeamLogoUpload} previewPath={blobPath} errors={errors} />
                <Box className={`team_form ${errors ? 'overflow_inputs' : ''}`}>
                    {
                        TeamForm.length > 0 && TeamForm.map((field, index) => {
                            let value = addTeam[field?.key_name]
                            const error = errors[field.key_name];
                            return (
                                <CustomeInput
                                    key={index}
                                    placeholder={field?.placeholder}
                                    type={field?.type}
                                    keyName={field?.key_name}
                                    label={field?.label}
                                    error={error}
                                    value={value}
                                    onChange={handleChange}
                                />
                            )
                        })
                    }
                    <Box className='button_box'>
                        {
                            type === 'edit' ?
                                <CustomeButton title={CommonText.EditTeam} width='80%' height='45px' bgColor={'var(--blue-background)'} onClick={handleUpdateTeam} />
                                :
                                <CustomeButton title={CommonText.AddTeam} width='80%' height='45px' bgColor={'var(--blue-background)'} onClick={handleAddTeam} />
                        }
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Team