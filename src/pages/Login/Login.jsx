'use client'
import SvgIcon from "@/assets/icons/SvgIcon"
import { CommonText } from "@/components/common/commonText"
import CustomeButton from "@/components/common/commonUi/CustomeButton"
import MessageModal from "@/components/common/commonUi/Modal/MessageModal"
import { genderJson, loginJson } from "@/components/common/login"
import { Box, Button, LinearProgress, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import './Login.css'

const LoginPage = () => {
    const [sliderImage, setSliderImage] = useState(1)
    const [loginFormData, setLoginFormData] = useState({
        mobile: "",
        gender: ""
    })
    const imageCount = loginJson.length;
    const initialState = Object.fromEntries(
        Array.from({ length: imageCount }, (_, i) => [`img${i + 1}`, 0])
    )
    const [sliderImagePercentage, setSliderImagePercentage] = useState(initialState)
    const [otp, setOtp] = useState(Array(4).fill(""))
    const [errorState, setErrorState] = useState("")
    const [loginStep, setLoginStep] = useState(1)
    const [alertModal, setAlertModal] = useState({
        success: false,
        open: false,
        message: ''
    })
    const router = useRouter()
    const otpRefs = useRef([])

    useEffect(() => {
        const interval = setInterval(() => {
            setSliderImagePercentage((prev) => {
                const updated = { ...prev };
                const imageKeys = Object.keys(updated);
                const currentIndex = imageKeys.indexOf(`img${sliderImage}`);

                if (updated[`img${sliderImage}`] < 100) {
                    updated[`img${sliderImage}`] += 10;
                } else {
                    const nextIndex = (currentIndex + 1) % imageKeys.length;
                    setSliderImage(parseInt(imageKeys[nextIndex].replace('img', ''), 10));

                    if (nextIndex === 0) {
                        return Object.fromEntries(imageKeys.map((key) => [key, 0]));
                    }
                }
                return updated;
            });
        }, 500);
        return () => clearInterval(interval);
    }, [sliderImage]);

    const handleChange = (field, value) => {
        setLoginFormData((prev) => ({
            ...prev,
            [field]: value
        }));
        setErrorState("");
    };

    const handleOtpChange = (index, value, event = null) => {
        if (!/^[0-9]?$/.test(value)) return;
        let newOtp = [...otp];

        if (event?.key === "Backspace") {
            if (newOtp[index] !== "") {
                newOtp[index] = "";
            } else if (index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        } else {
            newOtp[index] = value;
            if (value && index < otp.length - 1) {
                otpRefs.current[index + 1]?.focus();
            }
        }

        setOtp(newOtp);
        setErrorState("");
    };


    const handleSubmit = () => {
        if (loginStep === 1) {
            if (!/^\d{10}$/.test(loginFormData.mobile)) {
                setErrorState("Please enter a valid 10-digit mobile number");
                return;
            }
            setLoginStep(2)
        } else if (loginStep === 2) {
            if (otp.join("") !== "1234") {
                setErrorState("Invalid OTP");
                return;
            }
            setLoginStep(3)
        } else if (loginStep === 3) {
            if (!loginFormData.gender) {
                setErrorState("Please select a gender");
                return;
            }
            setLoginStep(4)
            setAlertModal({
                success: true,
                open: true,
                message: 'Login Successful'
            })
        }
    }

    const handleClose = () => {
        setAlertModal({
            success: false,
            open: false,
            message: ''
        })
        router.push('/')
    }

    return (
        <Box className="login_section">
            {
                loginStep !== 4 && <Box>

                    {/* Slider Section */}
                    <Box className="slider_section">
                        {
                            loginJson.length > 0 && loginJson.map((items, i) => {
                                return (
                                    <Box key={i}>
                                        <Box className={`login_slider_images ${items.id === sliderImage ? 'active' : ''}`}>
                                            <Image unoptimized src={items.image} alt="Image" height={500} width={500} />
                                        </Box>
                                        <Box className="slider_shadow_effect" />
                                    </Box>
                                )
                            })
                        }
                        {
                            loginStep !== 1 && (
                                <Box className="login_back_step_section" onClick={() => {
                                    setLoginStep(loginStep - 1);
                                    setErrorState("");
                                }}>
                                    <SvgIcon id={"down-arrow"} />
                                </Box>
                            )
                        }
                    </Box>

                    {/* Form Section */}

                    <Box className="login_form_section">
                        <Box className="login_welcome_section">
                            <Typography variant="body2">{CommonText.welcome}</Typography>
                            <Typography variant="p">{CommonText.welcomedescription}</Typography>
                        </Box>
                        <Box className="slider_progress_section">
                            {
                                loginJson.map((_, index) => (
                                    <LinearProgress key={index} variant="determinate" value={sliderImagePercentage[`img${index + 1}`]} className={`slider_linear_progress ${sliderImage === index + 1 && 'active'}`} />
                                ))
                            }
                        </Box>
                        <Box className="login_input_section">
                            {/* Mobile Number Input */}
                            {
                                loginStep === 1 && <Box className="login_input">
                                    <input aria-label="Mobile Number" type="number" placeholder="Mobile Number" value={loginFormData.mobile} onChange={(e) => handleChange("mobile", e.target.value)} />
                                    {errorState && <span style={{ fontWeight: '500', marginTop: '5px' }} className="errorText">{errorState}</span>}
                                </Box>
                            }
                            {/* Otp and Gender Selection */}
                            {
                                loginStep !== 1 && <Box className="login_otp_verfication">
                                    <Typography variant="body2">{loginStep === 2 ? CommonText.verfication : CommonText.genderPreferencetitle}</Typography>
                                    <Typography variant="p">{loginStep === 2 ? CommonText.msgsent : CommonText.genderPreferencedescription}</Typography>
                                    {/* Otp Input */}
                                    {
                                        loginStep === 2 && <Box className="otp_input_container" sx={{ marginBottom: !errorState ? '30px' : '0px' }}>
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    type="text"
                                                    maxLength="1"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Backspace") handleOtpChange(index, "", e);
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    }

                                    {/* Gender Selection */}
                                    {
                                        loginStep === 3 && <Box className="login_gender_section" sx={{ marginBottom: !errorState ? '30px' : '0px' }}>
                                            {
                                                genderJson.length > 0 && genderJson.map((items, i) => {
                                                    return (
                                                        <Box key={i} className={`login_gender_button ${loginFormData.gender === items && 'active'}`}>
                                                            <Button onClick={() => handleChange("gender", items)}>{items}</Button>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                    }
                                    {errorState && <span style={{ fontWeight: '500', marginTop: '5px', marginBottom: '25px' }} className="errorText">{errorState}</span>}
                                </Box>
                            }
                            <CustomeButton onClick={handleSubmit} margin={"15px 0px 0px"} title={loginStep === 1 ? "Login" : "Confirm"} height={"50px"} width={"100%"} bgColor={"var(--theme-primary)"} />
                        </Box>
                        {/* Skip Button for step 1 */}
                        {
                            loginStep === 1 && <Box className="login_skip">
                                <Typography variant="body2" onClick={() => router.push('/')} >Skip <SvgIcon id={"down-arrow"} /></Typography>
                            </Box>
                        }
                    </Box>
                </Box>
            }
            <MessageModal
                open={alertModal?.open}
                handleClose={handleClose}
                success={alertModal?.success}
                message={alertModal?.message}
                handleSubmit={handleClose}
                processing={false}
                type={"login"}
            />
        </Box>
    )
}

export default LoginPage