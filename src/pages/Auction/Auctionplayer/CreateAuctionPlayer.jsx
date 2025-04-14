'use client'
import { Box, Typography } from '@mui/material'
import './CreateAuctionPlayer.css'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomeBack from '@/components/common/commonUi/CustomeBack'
import PhotoUploader from '@/components/common/commonUi/PhotoUploader/PhotoUploader'
import { AuctionPlayerForm } from '@/components/common/json/AuctionPlayerFormJson'
import CustomeInput from '@/components/common/commonUi/CustomeInput'
import CustomeButton from '@/components/common/commonUi/CustomeButton'
import CustomSelectInput from '@/components/common/commonUi/CustomSelectInput'
import CustomeTags from '@/components/common/commonUi/CustomeTags'


const CreateAuctionPlayer = () => {
    const [playersData, setPlayersData] = useState({
        player_img: null,
        player_name: '',
        player_category: '',
        player_age: '',
        phone_number: '',
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
        extradetails: ''
    })
    const [blobpath, setBlobpath] = useState({
        player_img: null,
    });
    const [errors, setErrors] = useState({});
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

    const handleChange = (field) => event => {
        setPlayersData(prev => ({ ...prev, [field]: event.target.value }));
        console.log(field, event);
        
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

    return (
        <Box className="create_auction_players">
            <Box>
                <CustomeBack onclick={() => router.back()} type={'commonback'} />
            </Box>
            <Box className='file_uploader_main'>
                <PhotoUploader
                    file={blobpath?.player_img ? blobpath?.player_img : playersData?.player_img}
                    onChange={(e) => handleFileUpload(e, 'player_img')}
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
                        return (
                            <Box key={index} sx={{marginBottom: '15px'}}>
                                <Box>
                                    <Typography variant="body2">{field?.label}</Typography>
                                </Box>
                                <Box sx={{ width: '100%', maxWidth: '440px' }}>
                                    <CustomSelectInput value={value} minWidth={'380px'} borderRadius={'10px!important'} label={"Select"} options={field?.data?.map(player => ({ key: field?.key_name, name: player }))} onChange={handleChange} />
                                </Box>
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
                <CustomeButton title={"Add Player"} width={'100%'} />
            </Box>
        </Box>
    )
}

export default CreateAuctionPlayer