'use client'
import { generatePair, generateUniqueId } from '@/components/common/commomFunction'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomeInput from '@/components/common/commonUi/CustomeInput'
import Loader from '@/components/common/commonUi/Loader'
import { AutoMatchScheduleJson } from '@/components/common/json/AutoMatchScheduleJson'
import { autoMatchSchedule } from '@/redux/slices/matchSlice'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './AutoMatchSchedule.css'
import CustomeTags from '@/components/common/commonUi/CustomeTags'

const AutoMatchSchedulePage = ({ teamData, tournamentId, tournament }) => {
    const [errors, setErrors] = useState({})
    const [autoSchedule, setAutoSchedule] = useState({
        numberOfOvers: '',
        overPerBowler: '',
        // totalTeams: '',
        teamPlayAgainstEachOther: 1,
        perMatchMinutes: '',
        oneDayMatchesTotal: '',
        breakMinutes: '',
        perteamplayers: '',
        match_start_date: new Date().toISOString(),
        match_end_date: new Date().toISOString(),
        wagonWheel: false
    })
    const [teamsPair, setTeamsPair] = useState([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!tournament || !tournament.Group || !autoSchedule.match_start_date || !autoSchedule.perMatchMinutes || !autoSchedule.breakMinutes) return;

        if (autoSchedule.oneDayMatchesTotal !== '' && autoSchedule.breakMinutes !== '' && autoSchedule.perMatchMinutes !== '' && autoSchedule.match_start_date !== '' && autoSchedule.match_end_date !== '') {
            let teamsPair = [];
            let baseMatchStartTime = new Date(autoSchedule.match_start_date).getTime();
            let scheduledMatchesCount = 0;

            if (isNaN(baseMatchStartTime)) {
                console.error("Invalid match start date:", autoSchedule.match_start_date);
                return;
            }

            const matchDurationInSeconds = timeToSeconds(autoSchedule?.perMatchMinutes);
            const breakDurationInSeconds = timeToSeconds(autoSchedule?.breakMinutes);
            const totalMatchDurationInSeconds = matchDurationInSeconds + breakDurationInSeconds;
            const oneDayMatchesTotal = parseInt(autoSchedule?.oneDayMatchesTotal) || 0;

            tournament.Group.forEach((item) => {
                const teamIds = item?.teams;
                if (teamIds && Array.isArray(teamIds)) {
                    const groupPairs = generatePair(teamData, teamIds, 'team1', 'team2', item?.group_name);
                    teamsPair.push({ groupName: item?.group_name, pairs: groupPairs });
                }
            });

            let groupIndexes = {};
            let totalMatches = 0;

            teamsPair.forEach(group => {
                const groupName = group.groupName;
                const pairs = group.pairs;
                const totalPairsForGroup = pairs.length * (autoSchedule?.teamPlayAgainstEachOther || 0);

                groupIndexes[groupName] = {
                    index: 0,
                    totalPairs: totalPairsForGroup,
                    pairs: pairs
                };

                totalMatches += totalPairsForGroup;
            });

            let groupNames = Object.keys(groupIndexes);

            let allPairs = [];

            groupNames.forEach(groupName => {
                const groupData = groupIndexes[groupName];
                const pairs = groupData.pairs;

                for (let i = 0; i < autoSchedule?.teamPlayAgainstEachOther; i++) {
                    allPairs = allPairs.concat(pairs);
                }
            });

            let allScheduledPairs = [];
            let groupIndex = 0;

            let maxTotalPairs = allPairs.length;

            while (allScheduledPairs.length < maxTotalPairs) {
                const groupName = groupNames[groupIndex];
                const groupData = groupIndexes[groupName];
                const pairs = groupData.pairs;
                allScheduledPairs.push(pairs[groupData.index]);
                groupData.index = (groupData.index + 1) % pairs.length;
                groupIndex = (groupIndex + 1) % groupNames.length;
            }

            let scheduledMatches = allScheduledPairs.map((pair, index) => {
                let matchStartTime = new Date(baseMatchStartTime + (scheduledMatchesCount * totalMatchDurationInSeconds * 1000)).toISOString();
                let matchEndTime = new Date(baseMatchStartTime + (scheduledMatchesCount * totalMatchDurationInSeconds * 1000) + matchDurationInSeconds * 1000).toISOString();

                scheduledMatchesCount++;

                if (scheduledMatchesCount >= oneDayMatchesTotal) {
                    scheduledMatchesCount = 0;
                    baseMatchStartTime += 24 * 60 * 60 * 1000;
                }

                return {
                    ...pair,
                    match_start_time: matchStartTime,
                    match_end_time: matchEndTime,
                };
            });

            scheduledMatches = scheduledMatches.filter(match => match !== null);
            setTeamsPair(scheduledMatches);
        }
    }, [teamData, tournament, autoSchedule]);

    const handleMatchAsEmty = () => {
        setAutoSchedule({
            numberOfOvers: '',
            overPerBowler: '',
            // totalTeams: '',
            teamPlayAgainstEachOther: 1,
            perMatchMinutes: '',
            oneDayMatchesTotal: '',
            breakMinutes: '',
            perteamplayers: '',
            match_start_date: '',
            match_end_date: '',
            wagonWheel: false
        })
        setErrors({})
        setTeamsPair([])
    }

    const handleChangeInput = (val, key) => {
        if (key === 'wagonWheel') {
            setAutoSchedule(prev => ({
                ...prev,
                [key]: val === 'Yes'
            }));
            return
        }

        if (key === 'match_start_date') {
            let isTrue = val > autoSchedule.match_end_date
            if (isTrue) {
                setAutoSchedule(prev => ({ ...prev, ['match_end_date']: '' }))
            }
        }
        setAutoSchedule(prev => ({ ...prev, [key]: val }))
        setErrors(prev => ({ ...prev, [key]: '' }))
    }

    const validationForm = () => {
        const newErrors = {}
        let isValid = true
        const formFields = tournament?.match_type === "Test Match" ? AutoMatchScheduleJson.filter((item) => !["overPerBowler", "numberOfOvers", "wagonWheel"].includes(item?.key_name)) : AutoMatchScheduleJson.filter((item) => !["wagonWheel"].includes(item?.key_name));

        formFields.forEach((field) => {
            const value = autoSchedule[field?.key_name]
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field?.key_name] = `${field?.label} is required`
                isValid = false
            }

            if (field?.key_name === 'teamPlayAgainstEachOther' && value == '0') {
                newErrors[field?.key_name] = `${field?.label} is minimum 1 required`
                isValid = false
            }
        })
        // Match start time validation
        const selectedDateTime = new Date(autoSchedule.match_start_date);
        const now = new Date();

        // Ensure the selected date/time is valid
        if (isNaN(selectedDateTime.getTime())) {
            newErrors['match_start_date'] = 'Invalid date selected';
            isValid = false;
        } else {
            const selectedDate = selectedDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
            const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

            if (selectedDate < currentDate) {
                // Selected date is in the past
                newErrors['match_start_date'] = 'The selected date has already passed. Please choose a future date.';
                isValid = false;
            } else if (selectedDate === currentDate) {
                // Selected date is today, validate time
                if (selectedDateTime.getTime() < now.getTime()) {
                    newErrors['match_start_date'] = 'The selected time has already passed. Please choose a future time.';
                    isValid = false;
                }
            }
        }

        const { perteamplayers, numberOfOvers, overPerBowler } = autoSchedule;
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
        return isValid
    }

    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const handleCreateAutoMatches = async () => {
        let selectedRound = sessionStorage?.getItem('selectedRound') || '';
        try {
            if (!validationForm()) {
                return;
            }

            setLoading(true);
            const generatedSchedules = teamsPair.map((pair, index) => {
                return {
                    id: generateUniqueId(),
                    overPerBowler: autoSchedule?.overPerBowler,
                    perteamplayers: autoSchedule?.perteamplayers,
                    totalovers: autoSchedule?.numberOfOvers,
                    team1: pair.team1,
                    team2: pair.team2,
                    tournamentId: tournamentId,
                    round: selectedRound,
                    match_start_time: pair.match_start_time,
                    match_end_time: pair.match_end_time,
                    status: 1,
                };
            });
            if (teamsPair.length === generatedSchedules.length) {
                let res = await dispatch(autoMatchSchedule(generatedSchedules));

                if (res) {
                    handleMatchAsEmty();
                    setTimeout(() => {
                        sessionStorage.removeItem('selectedRound');
                        router.push(`/mytournament/${tournamentId}/match`);
                        setLoading(false);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };


    return (
        <>
            {loading && <Loader />}
            <Box className='auto_match_schedule'>
                <CustomeBack title={'Auto Schedule Match'} />
                <Box className='auto_match_form'>
                    {
                        AutoMatchScheduleJson.length > 0 && AutoMatchScheduleJson.map((field) => {
                            let value = field?.key_name === 'wagonWheel' ? autoSchedule[field?.key_name] === true ? 'Yes' : 'No' : autoSchedule[field?.key_name]
                            const error = errors[field.key_name];
                            let startDate = autoSchedule['match_start_date']
                            let isNotShow = tournament?.match_type === "Test Match" && ["overPerBowler", "numberOfOvers"]?.includes(field?.key_name)
                            if (!isNotShow && field?.show_type === "input") {
                                return (
                                    <CustomeInput
                                        tournament={tournament}
                                        key={field?.key_name}
                                        placeholder={field?.placeholder}
                                        label={field?.label}
                                        type={field?.type}
                                        value={value}
                                        keyName={field?.key_name}
                                        error={error}
                                        startDate={startDate}
                                        onChange={handleChangeInput}
                                    />
                                )
                            } else if (field?.show_type === 'tags') {
                                return (
                                    <React.Fragment key={field?.key_name}>
                                        <CustomeTags
                                            label={field?.label}
                                            data={field?.data}
                                            value={value}
                                            error={error}
                                            keyName={field?.key_name}
                                            onClick={handleChangeInput}
                                        />
                                    </React.Fragment>
                                );
                            }
                        })
                    }
                    <Box className='button_box'>
                        <CustomeButton title='Schedule Match' width='80%' height='45px' bgColor={'var(--secondary-color)'} onClick={handleCreateAutoMatches} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default AutoMatchSchedulePage