'use client'
import { Box, Typography } from '@mui/material'
import './CreateAuctionPlayer.css'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import PhotoUploader from '@/components/common/commonUi/PhotoUploader/PhotoUploader'
import { AuctionPlayerForm } from '@/components/common/json/AuctionPlayerFormJson'
import CustomeInput from '@/components/common/commonUi/CustomeInput'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomSelectInput from '@/components/common/commonUi/CustomSelectInput'
import CustomeTags from '@/components/common/commonUi/CustomeTags'
import { generateNumberId } from '@/components/common/commomFunction'
import { useSelector } from 'react-redux'
import { playersState } from '@/redux/slices/playersSlice'

const CreateAuctionPlayer = () => {
    const [playersData, setPlayersData] = useState({
        playerImage: null,
        playerName: '',
        player_category: '',
        player_age: '',
        playerContact: '',
        player_skills: '',
        specification1: '',
        specification2: '',
        specification3: '',
        jerseysize: '',
        trousersize: '',
        jerseyname: '',
        jerseynumber: '',
        matchplayed: '',
        runsscored: '',
        wicketstaken: '',
        extradetails: '',
        playerColor: '',
        letter: '',
    })
    const [blobpath, setBlobpath] = useState({
        playerImage: null,
    });
    const [errors, setErrors] = useState({});
    const player_data = useSelector(playersState)
    const params = useParams()
    const router = useRouter()

    const handleFileUpload = (e, key) => {
        let file = e.target.files[0];
        if (file) {
            let blobPath = URL.createObjectURL(file);
            setBlobpath((prev) => ({
                ...prev,
                [key]: blobPath
            }));
            setPlayersData(prev => ({
                ...prev,
                [key]: file
            }));
            setErrors(prev => ({
                ...prev,
                [key]: null
            }));
        }
    }

    const handleImageUpload = async (index) => {
        try {
            // let oldFileName = (typeof isUpdatePlayerData?.playerImage === 'string') ? (isUpdatePlayerData?.playerImage).split('/').pop() : '';
            let method = 'POST';
            const res = await uploadPlayerFile({
                thumbnail: playersData[index].playerImage,
                folderId: teamdata.tournamentId,
                subFolder: teamdata.team_name,
                // oldFileName: oldFileName,
            }, method);

            if (res?.url) {
                playersData[index].playerImage = res.url;
            } else {
                playersData[index].playerImage = '';
            }
        } catch (error) {
            console.error('Error uploading player image:', error);
            throw new Error('Image upload failed');
        }
    };

    const handleChange = (field) => event => {
        setPlayersData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleOnChange = (value, key) => {
        setPlayersData(prev => ({
            ...prev,
            [key]: value
        }));
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    }

    const validateForm = () => {
        const newErrors = {};

        AuctionPlayerForm.forEach((field) => {
            const value = playersData[field.key_name];

            // Required field
            if (field.show_type === 'input' && (!value || value === '')) {
                newErrors[field.key_name] = `${field.label} is required`;
            }

            // For select input, also ensure default "Select" is not picked
            if (field.show_type === 'select' && value === '') {
                newErrors[field.key_name] = `Please select a valid ${field.label}`;
            }

            if (field.show_type === 'tags' && (!value || value.length === 0)) {
                newErrors[field.key_name] = `${field.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createPlayerPayload = () => {
        return playersData.map(player => {
            const { playerName, playerContact, playerColor, playerImage, letter, player_category, player_age, player_skills, 
                specification1, specification2, specification3, jerseysize, trousersize, jerseyname, jerseynumber, matchplayed,
                runsscored, wicketstaken, extradetails } = player;
            const getStat = (statName) => updatePlayer ? (player?.[statName] || 0) : 0;
            return {
                tournamentId: params?.tournamentId,
                teamId: '',
                id: generateNumberId(player_data?.data),
                playerName,
                playerContact,
                playerColor,
                letter: letter,
                playerImage: playerImage || '',
                battingruns: getStat('battingruns'),
                battingballs: getStat('battingballs'),
                battingfour: getStat('battingfour'),
                battingsix: getStat('battingsix'),
                battingdot: getStat('battingdot'),
                battingout: getStat('battingout'),
                bowlingovers: getStat('bowlingovers'),
                bowlingwickets: getStat('bowlingwickets'),
                bowlingballs: getStat('bowlingballs'),
                bowlingdots: getStat('bowlingdots'),
                bowlingruns: getStat('bowlingruns'),
                runouts: getStat('runouts'),
                catches: getStat('catches'),
                mvppoints: getStat('mvppoints'),
                innings: getStat('innings'),
                player_category,
                player_age,
                player_skills,
                specification1,
                specification2,
                specification3,
                jerseysize,
                trousersize,
                jerseyname,
                jerseynumber,
                matchplayed,
                runsscored,
                wicketstaken,
                extradetails
            };
        });
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            for (let i = 0; i < addPlayer.length; i++) {
                const shouldUpload = handleImageUpload[i]?.playerImage;
                if (shouldUpload) {
                    await handleFileUpload(i);
                }
            }

            const payload = createPlayerPayload();
        } else {
            console.log("❌ Validation failed");
        }
    };

    return (
        <Box className="create_auction_players">
            <Box>
                <CustomeBack onclick={() => router.back()} type={'commonback'} />
            </Box>
            <Box className='file_uploader_main'>
                <PhotoUploader name={playersData?.playerName}
                    onNameChange={(value) => { setPlayersData((prev) => ({ ...prev, ...value, })) }} bgColor={playersData?.playerColor}
                    file={blobpath?.playerImage ? blobpath?.playerImage : playersData?.playerImage} type={"players"}
                    onChange={(e) => handleFileUpload(e, 'playerImage')}
                />
            </Box>
            {
                AuctionPlayerForm.length > 0 && AuctionPlayerForm.map((field, index) => {
                    let value = playersData[field?.key_name];
                    const error = errors[field.key_name];
                    if (field?.show_type === 'input') {
                        return (
                            <React.Fragment key={index}>
                                <CustomeInput
                                    key={index}
                                    placeholder={field?.placeholder}
                                    type={field?.type}
                                    error={error}
                                    keyName={field?.key_name}
                                    label={field?.label}
                                    value={value}
                                    ampm={true}
                                    onChange={handleOnChange}
                                />
                            </React.Fragment>
                        )
                    } else if (field?.show_type === 'select') {
                        const error = errors[field.key_name];
                        return (
                            <Box key={index} sx={{ marginBottom: '15px' }}>
                                <Box className="select_title_section">
                                    <Typography variant="body2">{field?.label}</Typography>
                                </Box>
                                <Box sx={{ width: '100%', maxWidth: '440px' }}>
                                    <CustomSelectInput fontWeight={500} color={'var(--text-lightgrey)'} labelfont={'var(--ex-small)'} bgColor={'var(--primary-color)'}
                                        value={value} minWidth={'380px'} borderRadius={'10px!important'} label={`Select ${field?.label}`}
                                        options={field?.data?.map(player => ({ key: player, name: player }))} onChange={handleChange(field?.key_name)} />
                                </Box>
                                {error && <Typography color="error" variant="body2" sx={{ fontSize: "var(--ex-small)", padding: '6px 10px 0' }}>{error}</Typography>}
                            </Box>
                        )
                    } else if (field?.show_type === 'tags') {
                        let isDisabled = field?.data.some(item => item?.key_name === "test-match")
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
                                // disabled={edit && isDisabled}
                                />
                            </React.Fragment>
                        );
                    }
                })
            }
            <Box sx={{ padding: '20px 0px 40px' }}>
                <CustomeButton onClick={handleSubmit} title={"Add Player"} width={'100%'} />
            </Box>
        </Box>
    )
}

export default CreateAuctionPlayer