'use client'
import { Box, Typography, IconButton } from '@mui/material'
import './CreateAuctionPlayer.css'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import PhotoUploader from '@/components/common/commonUi/PhotoUploader/PhotoUploader'
import { AuctionPlayerForm, BulkPlayerForm } from '@/components/common/json/AuctionPlayerFormJson'
import CustomeInput from '@/components/common/commonUi/CustomeInput'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomSelectInput from '@/components/common/commonUi/CustomSelectInput'
import CustomeTags from '@/components/common/commonUi/CustomeTags'
import { generateNumberId } from '@/components/common/commomFunction'
import { useDispatch, useSelector } from 'react-redux'
import { createPlayerData, playersState } from '@/redux/slices/playersSlice'
import { Add, Delete } from '@mui/icons-material'
import { uploadPlayerFile } from '@/components/common/uploadFileApis'

const defaultPlayer = {
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
};

const CreateAuctionPlayer = () => {
    const [playersData, setPlayersData] = useState([{ ...defaultPlayer }])
    const [blobPaths, setBlobPaths] = useState([{ playerImage: null }])
    const [errors, setErrors] = useState([{}])
    const player_data = useSelector(playersState)
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const [FormData, setFormData] = useState([...AuctionPlayerForm]);

    useEffect(() => {
        if (playersData.length === 1) {
            setFormData([...AuctionPlayerForm])
        } else {
            setFormData([...BulkPlayerForm])
        }
    }, [playersData])


    const handleAddPlayer = () => {
        setPlayersData(prev => [...prev, { ...defaultPlayer }])
        setBlobPaths(prev => [...prev, { playerImage: null }])
        setErrors(prev => [...prev, {}])
    }

    const handleRemovePlayer = (index) => {
        if (playersData.length > 1) {
            const updatedData = [...playersData]
            const updatedBlobs = [...blobPaths]
            const updatedErrors = [...errors]
            updatedData.splice(index, 1)
            updatedBlobs.splice(index, 1)
            updatedErrors.splice(index, 1)
            setPlayersData(updatedData)
            setBlobPaths(updatedBlobs)
            setErrors(updatedErrors)
        }
    }

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const blobPath = URL.createObjectURL(file);
            const updatedBlobs = [...blobPaths];
            const updatedData = [...playersData];
            updatedBlobs[index].playerImage = blobPath;
            updatedData[index].playerImage = file;
            setBlobPaths(updatedBlobs);
            setPlayersData(updatedData);
            setErrors((prev) => {
                const updated = [...prev];
                updated[index].playerImage = null;
                return updated;
            });
        }
    };

    const handleChange = (index, field) => (event) => {
        const updatedData = [...playersData];
        updatedData[index][field] = event.target.value;
        setPlayersData(updatedData);
    };

    const handleOnChange = (index, value, key) => {
        const updatedData = [...playersData];
        updatedData[index][key] = value;
        setPlayersData(updatedData);

        const updatedErrors = [...errors];
        updatedErrors[index][key] = '';
        setErrors(updatedErrors);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = playersData.map((player) => {
            const err = {};
            FormData.forEach((field) => {
                const value = player[field.key_name];
                if (field.show_type === 'input' && (!value || value === '')) {
                    err[field.key_name] = `${field.label} is required`;
                    valid = false;
                }
                if (field.show_type === 'select' && value === '') {
                    err[field.key_name] = `Please select a valid ${field.label}`;
                    valid = false;
                }
                if (field.show_type === 'tags' && (!value || value.length === 0)) {
                    err[field.key_name] = `${field.label} is required`;
                    valid = false;
                }
            });
            return err;
        });
        setErrors(newErrors);
        return valid;
    };

    const handleImageUpload = async (index) => {
        try {
            // let oldFileName = (typeof isUpdatePlayerData?.playerImage === 'string') ? (isUpdatePlayerData?.playerImage).split('/').pop() : '';
            let method = 'POST';
            const res = await uploadPlayerFile({
                thumbnail: playersData[index].playerImage,
                folderId: params?.tournamentId,
                subFolder: 'auction',
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

    const createPlayerPayload = () => {
        return playersData.map(player => {
            const { playerName, playerContact, playerColor, playerImage, letter, player_category, player_age, player_skills,
                specification1, specification2, specification3, jerseysize, trousersize, jerseyname, jerseynumber, matchplayed,
                runsscored, wicketstaken, extradetails } = player;
            return {
                tournamentId: params?.tournamentId,
                teamId: '',
                id: generateNumberId(player_data?.data),
                playerName,
                playerContact,
                playerColor,
                letter: letter,
                playerImage: playerImage || '',
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
            for (let i = 0; i < playersData.length; i++) {
                const shouldUpload = playersData[i]?.playerImage;
                if (shouldUpload) {
                    await handleImageUpload(i);
                }
            }

            const payload = createPlayerPayload();
            let response = await dispatch(createPlayerData(payload));
            if (response) {
                router.push(`/mytournament/${params?.tournamentId}/players`)
            }
        } else {
            console.log("❌ Validation failed");
        }
    };

    return (
        <Box className="create_auction_players">
            <CustomeBack onclick={() => router.back()} type={'commonback'} />
            {playersData.map((player, index) => (
                <Box key={index} sx={{ marginBlock: 3, borderRadius: '10px', position: 'relative', border: '1px solid var(--primary-color)', padding: '0 10px' }}>
                    {playersData.length > 1 && (
                        <IconButton
                            onClick={() => handleRemovePlayer(index)}
                            sx={{ position: 'absolute', top: 5, right: 5 }}
                        >
                            <Delete sx={{ color: 'var(--primary-color) !important' }} />
                        </IconButton>
                    )}
                    <PhotoUploader
                        name={player?.playerName}
                        onNameChange={(value) => {
                            const updated = [...playersData];
                            updated[index] = { ...updated[index], ...value };
                            setPlayersData(updated);
                        }}
                        bgColor={player?.playerColor}
                        file={blobPaths?.[index]?.playerImage || player?.playerImage}
                        type={"players"}
                        onChange={(e) => handleFileUpload(e, index)}
                    />
                    {FormData.map((field, fIndex) => {
                        const value = player[field.key_name];
                        const error = errors[index]?.[field.key_name];
                        if (field.show_type === 'input') {
                            return (
                                <CustomeInput
                                    key={fIndex}
                                    placeholder={field?.placeholder}
                                    type={field?.type}
                                    error={error}
                                    keyName={field?.key_name}
                                    label={field?.label}
                                    value={value}
                                    ampm={true}
                                    onChange={(val, key) => handleOnChange(index, val, key)}
                                />
                            );
                        } else if (field.show_type === 'select') {
                            return (
                                <Box key={fIndex} sx={{ marginBottom: '15px' }}>
                                    <Box className="select_title_section">
                                        <Typography variant="body2">{field?.label}</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', maxWidth: '430px' }}>
                                        <CustomSelectInput
                                            fontWeight={500}
                                            color={'var(--text-lightgrey)'}
                                            labelfont={'var(--ex-small)'}
                                            bgColor={'var(--primary-color)'}
                                            value={value}
                                            minWidth={'377px'}
                                            borderRadius={'10px!important'}
                                            label={`Select ${field?.label}`}
                                            options={field?.data?.map(player => ({ key: player, name: player }))}
                                            onChange={handleChange(index, field.key_name)}
                                        />
                                    </Box>
                                    {error && <Typography color="error" variant="body2" sx={{ fontSize: "var(--ex-small)", padding: '6px 10px 0' }}>{error}</Typography>}
                                </Box>
                            )
                        } else if (field.show_type === 'tags') {
                            return (
                                <CustomeTags
                                    key={fIndex}
                                    label={field?.label}
                                    data={field?.data}
                                    value={value}
                                    error={error}
                                    keyName={field?.key_name}
                                    onClick={(val, key) => handleOnChange(index, val, key)}
                                />
                            )
                        }
                    })}
                </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <CustomeButton
                    onClick={handleAddPlayer}
                    title="Add Another Player"
                    startIcon={<Add />}
                />
            </Box>
            <CustomeButton onClick={handleSubmit} title={"Add Players"} width={'100%'} />
        </Box>
    );
}

export default CreateAuctionPlayer