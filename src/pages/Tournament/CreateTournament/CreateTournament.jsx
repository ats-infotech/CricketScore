'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { generateNumberId } from "@/components/common/commomFunction";
import Avatar from "@/components/common/commonUi/Avtar/Avtar";
import CustomeInput from "@/components/common/commonUi/CustomeInput";
import CustomeTags from "@/components/common/commonUi/CustomeTags";
import { TornamentExtraForm, TornamentForm } from "@/components/common/json/TornamentForm";
import { createTornament, editTournament, tournamentState } from "@/redux/slices/tournamentSlice";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Box, Button, Checkbox, FormControlLabel, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadTournamentFile } from "../../../components/common/uploadFileApis";
import './CreateTournament.css';

const CheckBoxRequired = ({ label, onChecked, value = false }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    sx={{
                        color: 'var(--primary-color)',
                        padding: '5px',
                        '&.Mui-checked': {
                            color: 'var(--primary-color)',
                        },
                    }}
                    onChange={onChecked}
                    checked={value}
                />
            }
            label={label}
            sx={{
                '.MuiTypography-root': {
                    fontSize: 'var(--ex-small)',
                    fontWeight: '500'
                }
            }}
        />
    )
}

const CreateTournament = ({ tournamentData }) => {
    const [openTab, setOpenTab] = useState(1);
    const [formData, setFormData] = useState([]);
    const [createTornaments, setCreateTornaments] = useState({
        tournament_name: '',
        city: '',
        ground: '',
        organizer_name: '',
        organizer_number: '',
        tournament_start_date: new Date().toISOString() || '',
        tournament_end_date: new Date().toISOString() || '',
        tournament_logo_color: '',
        letter: '',
        tournaments_category: '',
        ball_type: '',
        pitch_type: '',
        match_type: '',
        tournament_location: '',
        entry_fee: '',
        total_number_of_teams: '',
        your_required_teams: '',
        winning_price: '',
        match_on: '',
        match_timing: "",
        additional_details: '',
        tournament_format: '',
        need_more_teams: false,
        previous_inform: false,
        need_official: false,
        tournament_banner: null,
        tournament_image: null,
        auction: false,
        matches: 0,
        innings: 0,
        runs: 0,
        wickets: 0,
        balls: 0,
        extras: 0,
        fours: 0,
        sixes: 0,
        fiftys: 0,
        hundreds: 0,
        fiftypartnerships: 0,
        hundredspartnerships: 0,
        maidens: 0,
        dotballs: 0,
        catches: 0,
        stumpings: 0,
    });
    const [tournamentRegistered, setTornamentRegistered] = useState(false)
    const [blobpath, setBlobpath] = useState({
        tournament_banner: null,
        tournament_image: null
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [edit, setEdit] = useState(false)
    const fileInputRef = useRef(null);
    const fileInputRef2 = useRef(null);
    const dispatch = useDispatch();
    const router = useRouter()
    const sm = useMediaQuery('(max-width: 380px)')
    const tournament_data = useSelector(tournamentState)

    console.log(createTornaments, 'createTornaments');

    useEffect(() => {
        if (tournamentData !== undefined) {
            setCreateTornaments({
                tournament_name: tournamentData?.tournament_name,
                city: tournamentData?.city,
                ground: tournamentData?.ground,
                organizer_name: tournamentData?.organizer_name,
                organizer_number: tournamentData?.organizer_number,
                tournament_start_date: tournamentData?.tournament_start_date,
                tournament_end_date: tournamentData?.tournament_end_date,
                tournament_logo_color: tournamentData?.tournament_logo_color,
                letter: tournamentData?.letter,
                tournaments_category: tournamentData?.tournaments_category,
                ball_type: tournamentData?.ball_type,
                pitch_type: tournamentData?.pitch_type,
                match_type: tournamentData?.match_type,
                tournament_location: tournamentData?.tournament_location,
                entry_fee: tournamentData?.entry_fee,
                total_number_of_teams: tournamentData?.total_number_of_teams,
                your_required_teams: tournamentData?.your_required_teams,
                winning_price: tournamentData?.winning_price,
                match_on: tournamentData?.match_on,
                match_timing: tournamentData?.match_timing,
                additional_details: tournamentData?.additional_details,
                tournament_format: tournamentData?.tournament_format,
                need_more_teams: tournamentData?.need_more_teams,
                previous_inform: tournamentData?.previous_inform,
                need_official: tournamentData?.need_official,
                tournament_banner: tournamentData?.tournament_banner,
                tournament_image: tournamentData?.tournament_image,
                matches: tournamentData?.matches,
                innings: tournamentData?.innings,
                runs: tournamentData?.runs,
                wickets: tournamentData?.wickets,
                balls: tournamentData?.balls,
                extras: tournamentData?.extras,
                fours: tournamentData?.fours,
                sixes: tournamentData?.sixes,
                fiftys: tournamentData?.fiftys,
                hundreds: tournamentData?.hundreds,
                fiftypartnerships: tournamentData?.fiftypartnerships,
                hundredspartnerships: tournamentData?.hundredspartnerships,
                maidens: tournamentData?.maidens,
                dotballs: tournamentData?.dotballs,
                catches: tournamentData?.catches,
                stumpings: tournamentData?.stumpings,
            })
            setBlobpath({
                tournament_banner: tournamentData?.tournament_banner,
                tournament_image: tournamentData?.tournament_image
            });
            setEdit(true)
        }
    }, [tournamentData])

    const handleBoxClick = (val) => {
        if (val === 'back') {
            router.back(-1)
        } else {
            if (val === 'tournament_banner') {
                fileInputRef.current.click();
            } else {
                fileInputRef2.current.click();
            }
        }

    };

    useEffect(() => {
        let TornamentExtraForms;
        if (createTornaments['tournaments_category'] === 'Open') {
            TornamentExtraForms = TornamentExtraForm
        } else {
            TornamentExtraForms = TornamentExtraForm.filter(item => item.key_name !== 'entry_fee')
        }
        setFormData(openTab === 1 ? TornamentForm : TornamentExtraForms);
    }, [openTab]);

    const handleEmpty = () => {
        setCreateTornaments({
            tournament_name: '',
            city: '',
            ground: '',
            organizer_name: '',
            organizer_number: '',
            tournament_start_date: '',
            tournament_end_date: '',
            tournaments_category: '',
            ball_type: '',
            pitch_type: '',
            match_type: '',
            tournament_location: '',
            entry_fee: '',
            total_number_of_teams: '',
            your_required_teams: '',
            winning_price: '',
            match_on: '',
            match_timing: "",
            additional_details: '',
            tournament_format: '',
            need_more_teams: false,
            previous_inform: false,
            need_official: false,
            tournament_banner: null,
            tournament_image: null,
            tournament_logo_color: '',
            letter: '',
            matches: 0,
            innings: 0,
            runs: 0,
            wickets: 0,
            balls: 0,
            extras: 0,
            fours: 0,
            sixes: 0,
            fiftys: 0,
            hundreds: 0,
            fiftypartnerships: 0,
            hundredspartnerships: 0,
            maidens: 0,
            dotballs: 0,
            catches: 0,
            stumpings: 0,
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [openTab])

    const handleOnChange = (value, key) => {
        if (key === 'tournament_start_date') {
            let isTrue = value > createTornaments.tournament_end_date
            if (isTrue) {
                setCreateTornaments(prev => ({
                    ...prev,
                    ['tournament_end_date']: ''
                }));
            }

            // const now = new Date();
            // const formattedDate = now.toISOString().split('T')[0];
            // if (value >= formattedDate) {
            //     setCreateTornaments(prev => ({
            //         ...prev,
            //         [key]: value
            //     }));
            // }
        }

        if (key === 'tournament_name' && !value) {
            setCreateTornaments(prev => ({
                ...prev,
                ['tournament_logo_color']: '',
                ['letter']: ''
            }));
        }

        if (key === 'auction') {
            setCreateTornaments(prev => ({
                ...prev,
                [key]: value === 'Yes'
            }));
            return
        }

        setCreateTornaments(prev => ({
            ...prev,
            [key]: value
        }));
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };

    const handleImageUpload = (e, key) => {
        let file = e.target.files[0];
        if (file) {
            let blobPath = URL.createObjectURL(file);
            setBlobpath((prev) => ({
                ...prev,
                [key]: blobPath
            }));
            setCreateTornaments(prev => ({
                ...prev,
                [key]: file
            }));
            setErrors(prev => ({
                ...prev,
                [key]: null
            }));
        }
    }

    const onChecked = (e, key) => {
        setCreateTornaments(prev => ({
            ...prev,
            [key]: e.target.checked
        }));
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    }

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        let TornamentExtraForms;
        if (createTornament['tournaments_category'] === 'Open') {
            TornamentExtraForms = TornamentExtraForm
        } else {
            TornamentExtraForms = TornamentExtraForm.filter(item => item.key_name !== 'entry_fee')
        }

        const formFields = openTab === 1 ? TornamentForm : TornamentExtraForms;
        formFields.forEach(field => {
            const value = createTornaments[field.key_name];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field.key_name] = `${field.label} is required`;
                isValid = false;
            }
            if (field.key_name === 'organizer_number') {
                const number = createTornaments[field.key_name];
                const isNumber = number.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !number.match(/0{5,}/);

                if (!isNumber) {
                    newErrors[field.key_name] = `Add Valid ${field.label}`;
                    isValid = false;
                }
            }

        });
        // if (!createTornaments['tournament_banner']) {
        //     newErrors['tournament_banner'] = 'Tournament Banner is required';
        //     isValid = false;
        // }

        // if (!createTornaments['tournament_image']) {
        //     newErrors['tournament_image'] = 'Tournament Profile Image is required';
        //     isValid = false;
        // }
        setErrors(newErrors);
        return isValid;
    }

    const handleCreateTournament = async () => {
        try {
            if (!validateForm()) {
                setErrorMessage("Please fill out all required fields.");
                return;
            }

            if (openTab === 1) {
                setOpenTab(2);
            } else if (edit) {
                let bannerUrl;
                let imageUrl;

                if ((tournamentData?.tournament_banner === null || tournamentData?.tournament_image === null) ||
                    (createTornaments?.tournament_banner !== tournamentData?.tournament_banner || createTornaments?.tournament_image !== tournamentData?.tournament_image)) {

                    let oldBannerFileName = (typeof tournamentData?.tournament_banner === 'string') && tournamentData?.tournament_banner ? tournamentData?.tournament_banner.split('/').pop() : '';
                    let oldImageFileName = (typeof tournamentData?.tournament_image === 'string') && tournamentData?.tournament_image ? tournamentData?.tournament_image.split('/').pop() : '';

                    let method = !tournamentData?.tournament_banner || !tournamentData?.tournament_image ? 'POST' : 'PUT';

                    const res = await uploadTournamentFile({
                        tournament_banner: createTornaments?.tournament_banner && createTornaments?.tournament_banner !== tournamentData?.tournament_banner ? createTornaments?.tournament_banner : null,
                        tournament_image: createTornaments?.tournament_image && createTornaments?.tournament_image !== tournamentData?.tournament_image ? createTornaments?.tournament_image : null,
                        folderId: tournamentData?.id,
                        oldBannerFileName: oldBannerFileName || '',
                        oldImageFileName: oldImageFileName || '',
                    }, method);
                    bannerUrl = res?.bannerUrl || null;
                    imageUrl = res?.imageUrl || null;
                }

                const payload = {
                    ...createTornaments,
                    tournament_banner: bannerUrl || tournamentData?.tournament_banner || null,
                    tournament_image: imageUrl || tournamentData?.tournament_image || null
                };

                let response = await dispatch(editTournament({ id: tournamentData?.id, updatedFields: payload }));
                if (response) {
                    setTornamentRegistered(true);
                    handleEmpty();
                } else {
                    setErrorMessage("Failed to register the tournament. Please try again.");
                }
            } else {
                let Id = generateNumberId(tournament_data?.data);
                const res = await uploadTournamentFile({
                    tournament_banner: createTornaments?.tournament_banner || null,
                    tournament_image: createTornaments?.tournament_image || null,
                    folderId: Id,
                });

                if (res) {
                    const payload = {
                        id: Id,
                        ...createTornaments,
                        tournament_banner: res?.bannerUrl || null,
                        tournament_image: res?.imageUrl || null
                    };
                    let response = await dispatch(createTornament(payload));
                    if (response) {
                        setTornamentRegistered(true);
                        handleEmpty();
                    } else {
                        setErrorMessage("Failed to register the tournament. Please try again.");
                    }
                } else {
                    setErrorMessage("Failed to upload images. Please try again.");
                }
            }

        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <Box className="createTournamentForm">
            {
                !tournamentRegistered ?
                    <Box>
                        {
                            openTab === 1 && <Box
                                sx={{
                                    width: '100%',
                                    height: '230px',
                                    borderRadius: '0 0 30px 30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    backgroundImage: `url(${blobpath?.tournament_banner})`,
                                    backgroundColor: `${createTornaments?.tournament_name && !blobpath?.tournament_image && createTornaments?.tournament_logo_color ? createTornaments?.tournament_logo_color : 'var(--primary-color)'} `,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'top center',
                                    zIndex: '1'
                                }}
                            >
                                <Box sx={{
                                    height: '45px',
                                    width: '45px',
                                    backgroundColor: 'var(--primary-color)',
                                    boxShadow: 'var(--shadow-light)',
                                    border: '1px solid var(--text-white)',
                                    borderRadius: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    top: '30px',
                                    left: '20px',
                                    cursor: 'pointer',
                                    zIndex: '10',
                                }} onClick={() => handleBoxClick('back')}>
                                    <KeyboardArrowLeftIcon sx={{ fontSize: 'var(--ex-large)', color: 'var(--text-white)', }} />
                                </Box>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, 'tournament_banner')}
                                />
                                {!createTornaments?.tournament_banner && <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleBoxClick('tournament_banner')}>
                                    <SvgIcon id='addImage' width='30px' height='30px' color='var(--text-white)' />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: 'var(--small)',
                                            fontWeight: '500',
                                            color: 'var(--text-white)',
                                            marginTop: '15px'
                                        }}
                                    >
                                        Add Your Tournaments Banner
                                    </Typography>
                                    {errors['tournament_banner'] && <Typography color="error" variant="body2">{errors['tournament_banner']}</Typography>}
                                </Box>}
                                <Box sx={{
                                    backgroundColor: 'var(--text-white)',
                                    borderRadius: '300px',
                                    height: '36px',
                                    width: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    bottom: '12px',
                                    right: '12px',
                                    cursor: 'pointer',
                                }} onClick={() => handleBoxClick('tournament_banner')}>
                                    <SvgIcon id='addImage2' width='14px' height='14px' color='var(--primary-color)' />
                                </Box>
                            </Box>
                        }
                        <Box className={openTab === 1 ? 'tornament_form' : 'second_tournament_form'}>
                            {
                                openTab === 2 ?
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', left: '-10px' }} onClick={() => setOpenTab(1)}>
                                            <KeyboardArrowLeftIcon sx={{ fontSize: 'var(--ex-large)' }} />
                                            <Typography variant="p" sx={{ fontSize: 'var(--small)', fontWeight: '600' }}>Back</Typography>
                                        </Box>
                                        <Box sx={{ padding: '25px 0' }}>
                                            <Typography variant="h6" sx={{ fontSize: 'var(--semi-normal)', fontWeight: '600' }}>Tournament Details</Typography>
                                            <Typography variant="body2" sx={{ fontSize: 'var(--ex-small)', fontWeight: '500', color: 'var(--text-grey)' }}>Because you Need Teams For Your Tournament</Typography>
                                        </Box>
                                    </>
                                    :
                                    <>
                                        <Box
                                            sx={{
                                                backgroundColor: 'var(--primary-color)',
                                                borderRadius: '300px',
                                                height: '110px',
                                                width: '110px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                position: 'absolute',
                                                top: '-60px',
                                                left: '0',
                                                right: '0',
                                                boxShadow: 'var(--shadow-light)',
                                                backgroundImage: `url(${blobpath?.tournament_image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'top center',
                                                zIndex: '2',
                                                cursor: 'pointer',
                                            }}

                                            onClick={() => handleBoxClick('tournament_image')}
                                        >
                                            {createTornaments?.tournament_name && !blobpath?.tournament_image && <Avatar onChange={setCreateTornaments} name={createTornaments?.tournament_name} bgColor={createTornaments?.tournament_logo_color} type={'tournament'} />}
                                            <input
                                                ref={fileInputRef2}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageUpload(e, 'tournament_image')}
                                            />
                                            {!createTornaments?.tournament_name && !createTornaments?.tournament_image && <SvgIcon
                                                id='profile'
                                                width='30px'
                                                height='30px'
                                                color='var(--text-white)'
                                            />}
                                            {!blobpath?.tournament_image && <Box sx={{
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
                                                <SvgIcon id='addImage2' width='14px' height='14px' color='var(--primary-color)' />
                                            </Box>}
                                        </Box>
                                        {errors['tournament_image'] && <Typography color="error" variant="body2" sx={{ textAlign: 'center', margin: '-5px 0 20px' }}>{errors['tournament_image']}</Typography>}
                                    </>
                            }
                            {
                                formData?.length > 0 && formData.map((field, index) => {
                                    let value = field?.key_name === 'auction' ? createTornaments[field?.key_name] === true ? 'Yes' : 'No' : createTornaments[field?.key_name];
                                    const error = errors[field.key_name];
                                    let startDate = createTornaments['tournament_start_date']
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
                                                    startDate={startDate}
                                                    onChange={handleOnChange}
                                                />
                                            </React.Fragment>
                                        );
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
                                                    disabled={edit && isDisabled}
                                                />
                                            </React.Fragment>
                                        );
                                    }
                                })
                            }
                            {
                                openTab === 2 &&
                                <Box sx={{ marginBottom: '30px' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            color: 'var(--text-grey)',
                                            marginBottom: '15px',
                                            fontWeight: '500',
                                            fontSize: 'var(--small)'
                                        }}
                                    >{'Any Additional Details?'}</label>
                                    <textarea
                                        placeholder={'Add More Details Like Prizes, Awards Entry Fees, Rules, Etc.'}
                                        type={'text'}
                                        value={createTornaments['additional_details']}
                                        onChange={(e) => handleOnChange(e.target.value, 'additional_details')}
                                        style={{
                                            fontFamily: 'var(--primary-font)',
                                            color: 'var(--text-lightgrey)',
                                            backgroundColor: 'var(--primary-color)',
                                            outline: 'none',
                                            height: '160px',
                                            borderRadius: '12px',
                                            padding: '17px 30px',
                                            fontWeight: '500',
                                            fontSize: 'var(--small)',
                                            border: '0px',
                                            width: '100%',
                                            lineHeight: '22px'
                                        }}
                                    />
                                </Box>
                            }
                            <Box>
                                {
                                    //  ?
                                    //     <CheckBoxRequired label="Do You Need More Teams For Your Tournaments?" onChecked={(e) => onChecked(e, 'need_more_teams')} value={createTornaments['need_more_teams']} />
                                    //     :
                                    //     <CheckBoxRequired label="Inform All The Players Of My Previous Tournaments." onChecked={(e) => onChecked(e, 'previous_inform')} value={createTornaments['previous_inform']} />
                                    openTab === 1 ? ' ' :
                                        <CheckBoxRequired label="Do You Need Officials? (e.g. Umpire, Scorer)" onChecked={(e) => onChecked(e, 'need_official')} value={createTornaments['need_official']} />

                                }
                            </Box>

                            <Button
                                type="submit"
                                className="blue_btn"
                                variant="contained"
                                sx={{
                                    marginBlock: '30px',
                                }}
                                onClick={handleCreateTournament}
                            >
                                {edit && openTab === 2 ? 'Update Tournament' : openTab === 2 && !edit ? 'Create Tournament' : 'Continue'}
                            </Button>
                        </Box>
                    </Box>
                    :
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                        <Box sx={{ width: '120px', height: '260px', marginBottom: '20px' }}>
                            <Image src={require('../../../assets/img/batmanboy.png')} alt="batsman" width={264} height={264} unoptimized />
                        </Box>
                        <Box sx={{ width: '80px', height: '80px', marginBottom: '20px' }}>
                            <Image src={require('../../../assets/img/done.gif')} alt="batsman" width={80} height={80} unoptimized />
                        </Box>
                        <Typography variant="h6" sx={{ fontSize: "var(--semi-normal)", fontWeight: "600", color: 'var(--primary-color)' }}>{edit ? 'Tournament Updated' : 'Tournament Registered'}</Typography>
                        <Typography variant="p" sx={{ fontSize: "var(--ex-small)", fontWeight: "500", color: 'var(--text-grey)', marginBottom: '20px' }}>Continue to Complete The Setup</Typography>
                        <Button variant="contained" className="blue_btn" sx={{ maxWidth: '80%' }} onClick={() => router.push('/')}>Continue</Button>
                    </Box>
            }
        </Box>
    );
};

export default React.memo(CreateTournament);
