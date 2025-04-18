'use client'
import { generateNumberId } from '@/components/common/commomFunction'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomeInput from '@/components/common/commonUi/CustomeInput'
import CustomeTags from '@/components/common/commonUi/CustomeTags'
import CustomSelectInput from '@/components/common/commonUi/CustomSelectInput'
import PhotoUploader from '@/components/common/commonUi/PhotoUploader/PhotoUploader'
import { AuctionPlayerForm, BulkPlayerForm } from '@/components/common/json/AuctionPlayerFormJson'
import { uploadPlayerFile } from '@/components/common/uploadFileApis'
import { createPlayerData, playersState, updatePlayerData } from '@/redux/slices/playersSlice'
import { Add, Delete } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './CreateAuctionPlayer.css'

const CreateAuctionPlayer = ({ edit }) => {
    const [player, setPlayer] = useState([])
    const defaultPlayer = {
        playerImage: null,
        playerName: edit && player ? player?.playerName : '',
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
    const [playersData, setPlayersData] = useState([{ ...defaultPlayer }])
    const [blobPaths, setBlobPaths] = useState([{ playerImage: null }])
    const [errors, setErrors] = useState([{}])
    const player_data = useSelector(playersState)
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const [FormData, setFormData] = useState([...AuctionPlayerForm]);

    useEffect(() => {
        if (edit) {
            const updatePlayer = player_data?.data?.find((items) => items?.id === params?.playerId)
            setPlayer(updatePlayer)
        }
    }, [player_data])

    useEffect(() => {
        if (edit && player) {
            setPlayersData([{ ...defaultPlayer, ...player }]);
        }
    }, [player])

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
        const keyArray = ["playerName", "playerContact"];
        const requiredFormData = FormData.filter((items) => keyArray.includes(items?.key_name));

        const newErrors = playersData.map((player) => {
            const err = {};

            requiredFormData.forEach((field) => {
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
                if (field.key_name === 'playerContact' && value) {
                    const phoneRegex = /^[2-9]\d{9}$/;
                    if (!phoneRegex.test(value)) {
                        err[field.key_name] = `Please enter a valid mobile number`;
                        valid = false;
                    }
                }
            });
            return err;
        });
        setErrors(newErrors);
        return valid;
    };

    const handleImageUpload = async (index) => {
        try {
            let oldFileName = (typeof player?.playerImage === 'string') ? (player?.playerImage).split('/').pop() : '';
            let method = edit && player?.playerImage ? 'PUT' : 'POST';

            const res = await uploadPlayerFile({
                thumbnail: playersData[index].playerImage,
                folderId: edit && player ? player?.tournamentId : params?.tournamentId,
                subFolder: 'auction',
                oldFileName: oldFileName,
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
            const getStat = (statName) => edit ? (player?.[statName] || 0) : 0;
            return {
                tournamentId: edit && player ? player?.tournamentId : params?.tournamentId,
                teamId: '',
                id: edit && player ? player?.id : generateNumberId(player_data?.data),
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
                extradetails,
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

            let response;
            if (edit) {
                response = await dispatch(updatePlayerData(payload));
            } else {
                response = await dispatch(createPlayerData(payload));
            }

            if (response) {
                router.push(`/mytournament/${edit && player ? player?.tournamentId : params?.tournamentId}/players`)
            }
        } else {
            console.log("❌ Validation failed");
        }
    };

    return (
        <Box className="create_auction_players">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <CustomeBack onclick={() => router.back()} type={'commonback'} />
               {playersData.length === 1 && <CustomeButton
                    margin={'0'}
                    onClick={handleAddPlayer}
                    title="Add Bulk Player"
                    startIcon={<Add />}
                />}
            </Box>
            {playersData.map((player, index) => (
                <Box key={index} sx={{ marginBlock: 3, borderRadius: '10px', position: 'relative', border: '1px solid var(--primary-color)', padding: '0 10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {playersData.length > 1 && (
                            <IconButton
                                onClick={() => handleRemovePlayer(index)}
                                sx={{ position: 'absolute', top: 5, right: 5 }}
                            >
                                <Delete sx={{ color: 'var(--primary-color) !important' }} />
                            </IconButton>
                        )}
                    </Box>
                    <PhotoUploader
                        name={player?.playerName}
                        onNameChange={(value) => {
                            const updated = [...playersData];
                            updated[index] = { ...updated[index], ...value };
                            setPlayersData(updated);
                        }}
                        previewOldImage={edit && !blobPaths?.[index]?.playerImage}
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
            {!edit && playersData.length > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <CustomeButton
                    onClick={handleAddPlayer}
                    title="Add Another Player"
                    startIcon={<Add />}
                />
            </Box>}
            <CustomeButton onClick={handleSubmit} title={edit ? "Update Player" : "Add Players"} width={'100%'} />
        </Box>
    );
}

export default CreateAuctionPlayer