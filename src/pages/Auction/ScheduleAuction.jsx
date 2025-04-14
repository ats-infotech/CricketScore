"use client"
import { generateUniqueId } from "@/components/common/commomFunction";
import CustomeBack from "@/components/common/commonUi/CustomeBack";
import CustomeInput from "@/components/common/commonUi/CustomeInput";
import { AuctionForm } from "@/components/common/json/AuctionFormJson";
import { scheduleAuction, updateAuction } from "@/redux/slices/auctionSlice";
import { Box, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './ScheduleAuction.css';

const ScheduleAuction = ({ type }) => {
    const { tournamentId } = useParams()
    const [auctionState, setAuctionState] = useState({
        auction_date: new Date(),
        auction_time: new Date(new Date().getTime() + 5 * 60 * 1000).toISOString(),
        auction_team_balance_point: '',
        minimum_bid: '',
        bid_increase_by: '',
        player_per_team: '',
        venue: ''
    })
    const [errors, setErrors] = useState({});
    const [isUpdate, setIsUpdate] = useState(false)

    const router = useRouter()
    const dispatch = useDispatch()
    const auctionstate = useSelector(state => state?.auction)
    const auctionData = auctionstate.data.length > 0 && auctionstate?.data?.find((item) => item?.tournamentId === tournamentId) || null;

    useEffect(() => {
        setIsUpdate(false)
        if (type === 'update' && auctionData) {
            setAuctionState({
                ...auctionData,
                auction_time: auctionData?.auction_time
            })
            setIsUpdate(true)
        }
    }, [type, auctionData?.data])

    const handleEmpty = () => {
        setAuctionState({
            auction_date: null,
            auction_time: null,
            auction_team_balance_point: '',
            minimum_bid: '',
            bid_increase_by: '',
            player_per_team: '',
            venue: ''
        })
    }

    const handleOnChange = (value, key) => {
        setAuctionState(prev => ({
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
        let isValid = true;

        const formFields = AuctionForm;
        formFields.forEach(field => {
            const value = auctionState[field.key_name];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field.key_name] = `${field.label} is required`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }

    const handleCreateAuction = async () => {
        if (!validateForm()) {
            return;
        }

        if (isUpdate) {
            const payload = {
                ...auctionState,
            }
            let response = await dispatch(updateAuction(payload))
            if (response) {
                router.push(`/mytournament/${tournamentId}/auction`)
                handleEmpty()
            }
        } else {
            const payload = {
                id: generateUniqueId(),
                ...auctionState,
                tournamentId
            }
            let response = await dispatch(scheduleAuction(payload))
            if (response) {
                router.push(`/mytournament/${tournamentId}/auction`)
                handleEmpty()
            }
        }

    }

    return (
        <Box className='schedule_auction_form'>
            <Box sx={{ marginBottom: '10px' }}>
                <CustomeBack onclick={() => router.back()} type={'commonback'} />
            </Box>
            {
                AuctionForm.length > 0 && AuctionForm.map((field, index) => {
                    let value = auctionState[field?.key_name];
                    const error = errors[field.key_name];
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
                })
            }
            <Button
                type="submit"
                className="blue_btn"
                variant="contained"
                sx={{
                    marginBlock: '30px',
                }}
                onClick={handleCreateAuction}
            >
                {isUpdate ? 'Update Auction' : 'Schedule Auction'}
            </Button>
        </Box >
    )

}

export default ScheduleAuction