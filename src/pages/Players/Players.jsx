'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { generateNumberId } from "@/components/common/commomFunction";
import { CommonText } from "@/components/common/commonText";
import Avtar from "@/components/common/commonUi/Avtar/Avtar";
import CustomeBack from "@/components/common/commonUi/CustomeBack";
import CustomeButton from "@/components/common/commonUi/CustomeButton";
import { BlueInput, SwipeUpDrawer, TitleBox } from "@/components/common/commonUi/CustomeCommon";
import CustomeMessageBox from "@/components/common/commonUi/CustomeMessageBox";
import Loader from "@/components/common/commonUi/Loader";
import MessageModal from "@/components/common/commonUi/Modal/MessageModal";
import SectionBox from "@/components/common/commonUi/SectionBox/SectionBox";
import { uploadPlayerFile } from "@/components/common/uploadFileApis";
import { createPlayerData, deletePlayerData, playersState, updatePlayerData } from "@/redux/slices/playersSlice";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from "@mui/material";
import { useQRCode } from "next-qrcode";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerSelection from "../PlayerSelection/StrikePlayerSection";
import './Players.css';

const Playerform = [
    { key_name: 'playerImage', label: 'player Image' },
    { key_name: 'playerColor', label: 'player Color' },
    { key_name: 'playerName', label: 'Player Name' },
    { key_name: 'playerContact', label: 'Phone Number' },
    // { key_name: 'countryCode', label: 'Country Code' },
]


const PlayersPage = ({ teamdata, playersData }) => {
    let teamName = teamdata?.team_name;
    const [open, setOpen] = useState(false);
    const [AddPlayerManual, setAddPlayerManual] = useState(false);
    const [blobpath, setBlobPath] = useState(['']);
    const [addPlayer, setAddPlayer] = useState([{
        playerImage: '',
        playerColor: '',
        playerName: '',
        letter: '',
        playerContact: ''
    }]);
    const [avtar, setAvatar] = useState([{ playerName: '', playerColor: '', letter: '' }]);
    const [errors, setErrors] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [updatePlayer, setUpdatePlayer] = useState(false);
    const [isUpdatePlayerData, setIsUpdatePlayerData] = useState(null);
    const [alertModal, setAlertModal] = useState({
        success: false,
        open: false,
        message: ''
    });
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef([]);
    const dispatch = useDispatch();
    const player_data = useSelector(playersState)
    const { Canvas } = useQRCode();

    const handleModalClose = () => {
        setAlertModal({
            open: false,
            message: '',
            success: null,
        });
    };

    const handleOpen = () => {
        setUpdatePlayer(false);
        setIsUpdatePlayerData(null);
        setAddPlayer([{
            playerImage: '',
            playerColor: '',
            letter: '',
            playerName: '',
            playerContact: '',
        }]);
        setBlobPath(['']);
        setErrors([{}])
        setAddPlayerManual(false);
        setOpen(true);
    };

    useEffect(() => {
        let firstErrorIndex = -1;
    
        errors.forEach((error, index) => {
            const keys = Object.keys(error);
            const hasNonEmptyError = keys.some(key => error[key]?.trim() !== "");
            if (hasNonEmptyError && firstErrorIndex === -1) {
                firstErrorIndex = index;
            }
        });
    
        if (firstErrorIndex !== -1) {
            document.querySelectorAll(".form_box")[firstErrorIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [errors]);
    

    const handleAddMoreForm = () => {
        setAddPlayer([
            ...addPlayer,
            {
                playerImage: '',
                playerColor: '',
                letter: '',
                playerName: '',
                playerContact: '',
                done: false
            }
        ]);
        setBlobPath([...blobpath, ''])
        setErrors([...errors, {}]);
        setTimeout(() => {
            const scrollToBottom = document.querySelector('.MuiPaper-root');
            if (scrollToBottom) {
                scrollToBottom.scrollTo({
                    top: scrollToBottom.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 100);
    };

    const handleUpdatePlayer = (item) => {
        setUpdatePlayer(true);
        setIsUpdatePlayerData(item);
        setAddPlayer([{
            id: item?.id,
            playerImage: item?.playerImage,
            letter: item?.letter ? item?.letter : '',
            playerColor: item?.playerColor ? item?.playerColor : '',
            playerName: item?.playerName,
            playerContact: item?.playerContact,
        }]);
        setBlobPath([item?.playerImage ? `/${item?.playerImage}` : '']);
        setErrors([{}])
        setAddPlayerManual(true);
        setOpen(true);
    };

    const handleBoxClick = (i) => {
        if (fileInputRef.current[i]) {
            fileInputRef.current[i].click();
        }
    };

    const validateForm = (getIndex) => {
        const newErrorsArr = []
        let isValid = true;

        addPlayer.forEach((player, index) => {
            const newErrors = {};
            Playerform.forEach((field) => {
                const value = player[field.key_name];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    if (field.key_name === 'playerName') {
                        newErrors[`${field.key_name}`] = `${field.label} is required`;
                        isValid = false;
                    }
                }

                if (field.key_name === 'playerContact') {
                    const number = player[field.key_name];
                    const isNumber = number.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !number.match(/0{5,}/);

                    if (!isNumber) {
                        newErrors[`${field.key_name}`] = `Add Valid ${field.label}`;
                        isValid = false;
                    }
                }
            });
            newErrorsArr.push(newErrors)
        });
        return newErrorsArr;
    };

    const handleFileChange = (e, index) => {
        let file = e.target.files[0];
        if (file) {
            let updatedBlobPaths = blobpath.map((blob, i) =>
                i === index ? URL.createObjectURL(file) : blob
            );
            setBlobPath(updatedBlobPaths)

            let updatedPlayers = addPlayer.map((player, i) =>
                i === index ? { ...player, playerImage: file } : player
            );
            setAddPlayer(updatedPlayers);
        }

        const updatedErrors = errors.map((error, i) =>
            i === index ? { ...error, playerImage: '' } : error
        );
        setErrors(updatedErrors)
    };

    const handleChange = (e, key, index) => {
        const { value } = e.target;
        if (!updatePlayer) {
            handleAvatarColor()
        }

        let isEmtyValue = key === 'playerName' && !value
        

        const updatedPlayers = addPlayer.map((player, i) =>
            i === index ? { 
                ...player, 
                [key]: value,
                ['playerColor']: isEmtyValue ? '' : player?.playerColor,
                ['letter']: isEmtyValue ? '' : player?.letter
            } : player
        );
        setAddPlayer(updatedPlayers);

        const updatedErrors = errors.map((error, i) =>
            i === index ? { ...error, [key]: '' } : error
        );
        setErrors(updatedErrors);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setAddPlayer([{
            playerImage: '',
            playerColor: '',
            playerName: '',
            letter: '',
            playerContact: '',
        }]);
        setUpdatePlayer(false);
        setIsUpdatePlayerData(null);
    };

    const handleAddOrUpdatePlayer = async (index) => {
        try {
            const newErrorsArr = validateForm();
            setErrors(newErrorsArr);
            if (newErrorsArr.some(error => Object.keys(error).length > 0)) {
                return;
            }
            setLoading(true);

            for (let i = 0; i < addPlayer.length; i++) {
                const shouldUpload = (!updatePlayer && addPlayer[i]?.playerImage) || (updatePlayer && addPlayer[i]?.playerImage && addPlayer[i]?.playerImage !== isUpdatePlayerData?.playerImage);
                if (shouldUpload) {
                    await handleImageUpload(i);
                }
            }

            const payload = createPlayerPayload();

            let response;
            if (updatePlayer) {
                response = await dispatch(updatePlayerData(payload));
            } else {
                response = await dispatch(createPlayerData(payload));
            }

            if (response) {
                handleSuccessResponse();
            }
            let timer = setTimeout(() => {
                setLoading(false);
                return () => clearTimeout(timer)
            }, 2000);

        } catch (error) {
            setLoading(false);
            console.error(`Error in handleAddOrUpdatePlayer: ${error.message || CommonText.ErrorUploadImage}`);
        }
    };

    const handleImageUpload = async (index) => {
        try {
            let oldFileName = (typeof isUpdatePlayerData?.playerImage === 'string') ? (isUpdatePlayerData?.playerImage).split('/').pop() : '';
            let method = updatePlayer && isUpdatePlayerData?.playerImage ? 'PUT' : 'POST';
            const res = await uploadPlayerFile({
                thumbnail: addPlayer[index].playerImage,
                folderId: teamdata.tournamentId,
                subFolder: teamdata.team_name,
                oldFileName: oldFileName,
            }, method);

            if (res?.url) {
                addPlayer[index].playerImage = res.url;
            } else {
                addPlayer[index].playerImage = '';
            }
        } catch (error) {
            console.error('Error uploading player image:', error);
            throw new Error('Image upload failed');
        }
    };

    const createPlayerPayload = () => {
        return addPlayer.map(player => {
            const { playerName, playerContact, playerColor, playerImage, letter } = player;
            const getStat = (statName) => updatePlayer ? (player?.[statName] || 0) : 0;
            return {
                tournamentId: teamdata.tournamentId,
                teamId: teamdata.id,
                id: updatePlayer ? isUpdatePlayerData?.id : generateNumberId(player_data?.data),
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
                highestScore: getStat('highestScore'),
                highestWicket: getStat('highestWicket'),
                battingnotout: getStat('battingnotout'),
                bowlingmaiden: getStat('bowlingmaiden'),
                battinghundred: getStat('battinghundred')
            };
        });
    };

    const handleSuccessResponse = () => {
        setOpen(false);
        setAddPlayer([{
            playerImage: '',
            playerColor: '',
            letter: '',
            playerName: '',
            playerContact: ''
        }]);
        setBlobPath(['']);
        setErrors([{}])
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleDeleteModalInfo = () => {
        setAlertModal({
            success: false,
            open: true,
            message: `Are you sure want to Delete this Player ${isUpdatePlayerData?.playerName || ''} ?`
        });
    };

    const handleDeletePlayer = async () => {
        let playerId = isUpdatePlayerData?.id;
        setProcessing(true);
        if (playerId) {
            let fileName = (typeof isUpdatePlayerData?.playerImage === 'string') ? (isUpdatePlayerData?.playerImage).split('/').pop() : '';
            let method = 'DELETE';
            if (fileName) {
                const res = await uploadPlayerFile({
                    folderId: teamdata.tournamentId,
                    subFolder: teamdata.team_name,
                    fileName: fileName,
                }, method);
            }
            let resp = await dispatch(deletePlayerData({ playerId }));
            if (resp) {
                setTimeout(() => {
                    setProcessing(false);
                    setAlertModal({
                        success: true,
                        open: true,
                        message: 'Player Deleted Successfully'
                    });
                    handleDrawerClose();
                }, 2000);
            }
        }
    };

    const removePalyerFromTheArr = (item, index) => {
        setAddPlayer([...addPlayer.slice(0, index), ...addPlayer.slice(index + 1)]);
        setBlobPath([...blobpath.slice(0, index), ...blobpath.slice(index + 1)]);
        setErrors([...errors.slice(0, index), ...errors.slice(index + 1)]);
    }


    const handleAvatarColor = (update, index) => {
        const updatedPlayers = addPlayer.map((player, i) =>
            i === index ? { ...player, ...update } : player
        );
        setAddPlayer(updatedPlayers);
    }
    return (
        <>
            {loading && <Loader />}
            <Box className='players_page_main'>
                <CustomeBack title={teamName + ` 's Players`} />
                <Box className='player_box_main'>
                    {
                        playersData && playersData.length > 0 ?
                            <PlayerSelection playerdata={playersData} type='readonly' handleUpdatePlayer={handleUpdatePlayer} />
                            :
                            <>
                                <CustomeMessageBox title='No Players Available' describe='Click on Add Player And add Player here' />
                                <Box className='player_add_when_No_data'>
                                    <CustomeButton title={'Add Player'} width={'80%'} bgColor={'var(--primary-color)'} height={'45px'} onClick={handleOpen} />
                                </Box>
                            </>
                    }
                </Box>
                {
                    playersData && playersData.length > 0 &&
                    <Box className='button_box'>
                        <CustomeButton title={'Add Player'} width={'80%'} bgColor={'var(--primary-color)'} height={'45px'} onClick={handleOpen} />
                    </Box>
                }
                <Box>
                    <SwipeUpDrawer open={open} onClose={handleDrawerClose} onOpen={() => setOpen(false)} id='scrollBottomPlayer'>
                        <Box className='top-arrows'>
                            {AddPlayerManual && !updatePlayer ? <SvgIcon id='down-arrow' className='back' onClick={() => setAddPlayerManual(false)} /> : <Box></Box>}
                        </Box>

                        {!AddPlayerManual ?
                            <Box>
                                <TitleBox title={CommonText.InvitePlayervia} />
                                <Box sx={{ padding: '30px 0' }}>
                                    <Typography variant="body2" className="smallText">{CommonText.TeamQRCode}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                        <Canvas
                                            text={`${window.location.origin}/players/${teamdata?.id}`}
                                            options={{
                                                errorCorrectionLevel: 'H',
                                                margin: 3,
                                                scale: 4,
                                                width: 200,
                                                color: {
                                                    dark: '#fff',
                                                    light: '#f0f8ff00',
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" className="ex-smallText">{CommonText.AskScanQr}</Typography>
                                    <Box className='share_button_box'>
                                        <CustomeButton
                                            title={CommonText.Share}
                                            icon={'share-line'}
                                            width={'130px'}
                                            borderRadius={'15px'}
                                            bgColor={'var(--text-white)'}
                                            color={'var(--primary-color)'}
                                            iconWidth={24}
                                            iconHeight={24}
                                        // onClick={() => setAddPlayerManual(true)}
                                        />
                                    </Box>
                                </Box>
                                <TitleBox title={CommonText.ManuallyaddPlayer} />
                                <Box sx={{ margin: '30px 0' }}
                                    onClick={() => setAddPlayerManual(true)}
                                >
                                    <SectionBox icon={"via-phone"} title={CommonText.AddPhoneNumberorEmail} sx={{ boxShadow: 'var(--shadow-light)', backgroundColor: 'var(--primary-color)' }}

                                    >
                                        <Box className='buttonBoxNormal'>
                                            <CustomeButton title={CommonText.AddPlayer} icon={'plus'} />
                                        </Box>
                                    </SectionBox>
                                </Box>
                            </Box>
                            :
                            <Box className='manual_add_player_main'>
                                {
                                    addPlayer.map((item, i) => {
                                        let lastIndex = !item?.done
                                        let itsNotAccess = (!updatePlayer && lastIndex) || updatePlayer

                                        return (
                                            <SectionBox key={i} className={`${addPlayer.length > 1 && (addPlayer.length - 1) === i && 'activeLastSpaceBottom'}`} icon={"via-phone"} title={!updatePlayer ? CommonText.AddPlayerDetails : CommonText.UpdatePlayerDetails} sx={{ boxShadow: 'var(--shadow-light)', backgroundColor: 'var(--primary-color)', position: 'relative' }} >
                                                {!updatePlayer && addPlayer.length > 1 && <CloseIcon className="close_player" onClick={() => removePalyerFromTheArr(item, i)} />}
                                                <Box className='form_box'>
                                                    <Box className='upload_player_image' sx={{ backgroundImage: `url('${blobpath[i]}')` }} onClick={() => handleBoxClick(i)}>
                                                        <input ref={(el) => { if (el) { fileInputRef.current[i] = el } }} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, i)} />
                                                        {item.playerName ?
                                                            <>
                                                                {!blobpath[i] && <Avtar name={item.playerName} prevState={item} type={'players'} bgColor={item.playerColor} onChange={handleAvatarColor} index={i} />}
                                                                <Box sx={{
                                                                    backgroundColor: 'var(--text-white)',
                                                                    borderRadius: '300px',
                                                                    height: '30px',
                                                                    width: '30px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    position: 'absolute',
                                                                    bottom: '0',
                                                                    right: '0'
                                                                }}>
                                                                    <SvgIcon id='addImage2' height={14} width={14} color='var(--primary-color)' />
                                                                </Box>
                                                            </>
                                                            :
                                                            !blobpath[i] && <SvgIcon id='addImage3' height={30} width={30} />
                                                        }
                                                    </Box>
                                                    {errors[i]['playerImage'] && <Typography variant='body2' color='error' className="errorText">{errors[i]['playerImage']}</Typography>}
                                                    <BlueInput placeholder={'Player Name'} type='text' value={item['playerName']} error={errors[i]['playerName']} onChange={(e) => handleChange(e, 'playerName', i)} disabled={!updatePlayer && !lastIndex} />
                                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {/* <select className="blue_select_input" sx={{ width: 'auto' }} value={addPlayer['countryCode']} onChange={(e) => handleChange(e, 'countryCode')}>
                                                            {countryCodes.map((country, index) => (
                                                                <option key={index} value={country.code}>{country.code}</option>
                                                            ))}
                                                        </select> */}
                                                        <BlueInput placeholder={'Phone Number'} type='number' value={item['playerContact']} error={errors[i]['playerContact']} onChange={(e) => handleChange(e, 'playerContact', i)} disabled={!updatePlayer && !lastIndex} />
                                                    </Box>
                                                    {!updatePlayer && addPlayer.length === 1 && <CustomeButton title={CommonText.AddPlayer} bgColor={'var(--text-white)'} color={'var(--primary-color)'} onClick={(i) => handleAddOrUpdatePlayer(i)} />}
                                                </Box>
                                            </SectionBox>
                                        )
                                    })
                                }
                                <Box className={`deleteUpdateBtn ${addPlayer.length > 1 ? 'actionBottomfixed' : ''}`}>
                                    {!updatePlayer && (
                                        <CustomeButton
                                            title='Add More Player'
                                            bgColor={'var(--text-white)'}
                                            color={'var(--primary-color)'}
                                            onClick={handleAddMoreForm}
                                        />
                                    )}

                                    {!updatePlayer && addPlayer.length > 1 && (
                                        <CustomeButton
                                            title={`Add All (${addPlayer.length || 0})`}
                                            bgColor={'var(--text-white)'}
                                            color={'var(--primary-color)'}
                                            onClick={handleAddOrUpdatePlayer}
                                        />
                                    )}

                                    {updatePlayer && (
                                        <>
                                            <CustomeButton
                                                title={CommonText.UpdatePlayer}
                                                bgColor={'var(--text-white)'}
                                                color={'var(--primary-color)'}
                                                onClick={handleAddOrUpdatePlayer}
                                            />
                                            <CustomeButton
                                                width={'auto'}
                                                bgColor={'var(--text-red)'}
                                                color={'var(--text-white)'}
                                                title='Delete'
                                                onClick={handleDeleteModalInfo}
                                            />
                                        </>
                                    )}
                                </Box>
                            </Box>

                        }
                    </SwipeUpDrawer>
                </Box>
            </Box>
            <MessageModal
                open={alertModal?.open}
                handleClose={handleModalClose}
                success={alertModal?.success}
                message={alertModal?.message}
                handleSubmit={handleDeletePlayer}
                processing={processing}
            />
        </>
    )
}

export default PlayersPage