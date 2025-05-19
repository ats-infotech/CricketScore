'use client'
import CustomeButton from "@/components/common/commonUi/CustomeButton"
import CustomeInput from "@/components/common/commonUi/CustomeInput"
import { Box } from "@mui/material"
import Image from "next/image"
import React, { useState } from "react"
import './Profile.css'

const ProfileInputs = [
    {
        label: 'Name',
        placeholder: 'Name',
        type: 'text',
        key_name: 'name',
        show_type: 'input'
    },
    {
        label: 'Mobile Number',
        placeholder: 'Mobile Number',
        type: 'number',
        key_name: 'number',
        show_type: 'input'
    },
    {
        label: 'Email Id',
        placeholder: 'Email Id',
        type: 'email',
        key_name: 'email',
        show_type: 'input'
    },
]

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
        name: "Rudra Zohn",
        number: "9532245633",
        email: "Rudrazohn758@gmail.com"
    })
    const [errors, setErrors] = useState({});

    const handleOnChange = (value, key) => {
        setProfileData(prev => ({
            ...prev,
            [key]: value
        }));
        setErrors(prev => ({
            ...prev,
            [key]: ''
        }));
    };

    // const validateInputs = () => {
    //     let newErrors = {};
    //     if (!profileData.name.trim()) {
    //         newErrors.name = "Name is required";
    //     }
    //     if (!profileData.number.trim()) {
    //         newErrors.number = "Mobile Number is required";
    //     } else if (!/^[0-9]{10}$/.test(profileData.number)) {
    //         newErrors.number = "Enter a valid 10-digit mobile number";
    //     }
    //     if (!profileData.email.trim()) {
    //         newErrors.email = "Email is required";
    //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    //         newErrors.email = "Enter a valid email address";
    //     }
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };
    const validateInputs = () => {
        const validations = {
            name: {
                required: true,
                message: "Name is required"
            },
            number: {
                required: true,
                pattern: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number"
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address"
            }
        };

        const newErrors = Object.entries(validations).reduce((acc, [key, rule]) => {
            const value = profileData[key]?.trim();
            if (!value) {
                acc[key] = rule.message;
            } else if (rule.pattern && !rule.pattern.test(value)) {
                acc[key] = rule.message;
            }
            return acc;
        }, {});

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateInputs()) {
            console.log("Form submitted successfully", profileData);
        }
    };

    return (
        <Box className="profile_main_section">
            <Box className="profile_image_section">
                <Image unoptimized src={require('../../assets/img/profiledummy.png')} alt="profile" />
            </Box>
            <Box>
                {
                    ProfileInputs.map((field, index) => {
                        let value = profileData[field.key_name];
                        const error = errors[field.key_name];
                        return (
                            <React.Fragment key={index}>
                                <CustomeInput
                                    key={index}
                                    placeholder={field.placeholder}
                                    type={field.type}
                                    error={error}
                                    keyName={field.key_name}
                                    label={field.label}
                                    value={value}
                                    onChange={handleOnChange}
                                />
                            </React.Fragment>
                        )
                    })
                }
                <Box sx={{ maxWidth: '300px', margin: '15px auto 0px' }}>
                    <CustomeButton title={"Continue"} width={"100%"} onClick={handleSubmit} />
                </Box>
            </Box>
        </Box>
    )
}

export default ProfilePage;