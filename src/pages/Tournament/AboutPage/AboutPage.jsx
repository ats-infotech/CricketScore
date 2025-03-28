import { DateFormat } from '@/components/common/commomFunction';
import { CommonText } from "@/components/common/commonText";
import CustomeInput from '@/components/common/commonUi/CustomeInput';
import MessageModal from '@/components/common/commonUi/Modal/MessageModal';
import { deleteAllMatchesForTournament } from '@/redux/slices/matchSlice';
import { deleteMultiplePlayerData } from '@/redux/slices/playersSlice';
import { deleteMultipleTeams } from '@/redux/slices/teamSlice';
import { deleteTournament } from '@/redux/slices/tournamentSlice';
import { Delete, Edit } from '@mui/icons-material';
import { Box, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadTournamentFile } from '../../../components/common/uploadFileApis';
import './AboutPage.css';

const TournamentInputs = [
    {
        label: 'Tournament Name',
        placeholder: 'Tournament name',
        type: 'text',
        key_name: 'tournament_name',
        show_type: 'input'
    },
    {
        label: 'City Name',
        placeholder: 'City name',
        type: 'text',
        key_name: 'city',
        show_type: 'input'
    },
    {
        label: 'Ground Name',
        placeholder: 'Ground name',
        type: 'text',
        key_name: 'ground',
        show_type: 'input'
    },
    {
        label: 'Organizer Name',
        placeholder: 'Organizer name',
        type: 'text',
        key_name: 'organizer_name',
        show_type: 'input'
    },
    {
        label: 'Organizer Number',
        placeholder: 'Organizer number',
        type: 'number',
        key_name: 'organizer_number',
        show_type: 'input'
    },
    {
        label: 'Tournaments Start Date',
        placeholder: 'DD/MM/YYYY',
        type: 'date',
        key_name: 'tournament_start_date',
        show_type: 'input',
    },

    {
        label: 'Tournaments End Date',
        placeholder: 'DD/MM/YYYY',
        type: 'date',
        key_name: 'tournament_end_date',
        show_type: 'input'
    },
]

const AboutPage = ({ tournamentData, teamData, playerData }) => {

    const [tournamentDetails, setTournamentDetails] = useState({
        tournament_name: '',
        city: '',
        ground: '',
        organizer_name: '',
        organizer_number: '',
        tournament_start_date: '',
        tournament_end_date: ''
    })
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [alertModal, setAlertModal] = useState({ open: false, success: false, message: "" });
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (tournamentData?.tournament_start_date && tournamentData?.tournament_end_date) {
            const Startdate = new Date(tournamentData.tournament_start_date);
            const Enddate = new Date(tournamentData.tournament_end_date);
            if (isNaN(Startdate.getTime()) || isNaN(Enddate.getTime())) {
                console.error("Invalid date value");
                return;
            }

            const formattedStartDate = DateFormat(Startdate);
            const formattedEndDate = DateFormat(Enddate);

            setTournamentDetails({
                tournament_name: tournamentData?.tournament_name,
                city: tournamentData?.city,
                ground: tournamentData?.ground,
                organizer_name: tournamentData?.organizer_name,
                organizer_number: tournamentData?.organizer_number,
                tournament_start_date: formattedStartDate,
                tournament_end_date: formattedEndDate
            });
        }
    }, [tournamentData]);

    const handleModalClose = () => {
        setAlertModal({ open: false, success: false, message: "" });
        if (alertModal.success) {
            router.push('/')
        }
    };

    const handleDeleteTournamentInfo = () => {
        const allTeamPlayersList = [];

        teamData.forEach(team => {
            const teamPlayersList = playerData?.data?.filter(player => player.teamId === team.id) || [];
            allTeamPlayersList.push(...teamPlayersList);
        });

        setTeamPlayers(allTeamPlayersList);
        setAlertModal({ open: true, success: false, message: "Are you sure you want to delete this tournament?" });
    };

    const handleDeleteTournament = async () => {
        setProcessing(true);
        const allPlayerImages = [];
        const allPlayerIds = [];
        const allTeamLogoFiles = [];

        teamData.forEach(team => {
            const teamPlayer = teamPlayers.filter(player => player.teamId === team.id);
            const playersImages = teamPlayer.map(player => player?.playerImage).filter(Boolean);
            const playerIds = teamPlayer.map(player => player.id);
            const teamLogo = team?.team_logo ? team.team_logo.split("/").pop() : null;

            allPlayerImages.push(...playersImages);
            allPlayerIds.push(...playerIds);
            if (teamLogo) {
                allTeamLogoFiles.push(teamLogo);
            }
        });

        try {
            await dispatch(deleteAllMatchesForTournament({ tournamentId: tournamentData.id }));

            if (allPlayerIds.length > 0) {
                await dispatch(deleteMultiplePlayerData({ playerId: allPlayerIds }));
            }

            await Promise.all(teamData.map(async team => {
                const response = await dispatch(deleteMultipleTeams({ teamIds: [team.id] }));
                if (!response) {
                    throw new Error("Error deleting team with ID: " + team.id);
                }
            }));

            const res = await uploadTournamentFile({ folderId: tournamentData?.id, }, 'DELETE');
            if (res) {
                await dispatch(deleteTournament({ tournamentId: tournamentData.id }));

            }

            let timer = setTimeout(() => {
                setProcessing(false);
                setAlertModal({ open: true, success: true, message: "Tournament deleted successfully" });
                return () => clearTimeout(timer);
            }, 2000);

        } catch (error) {
            console.error("Error deleting tournament:", error);
            setProcessing(false);
            setAlertModal({ open: true, success: false, message: "Error deleting tournament. Please try again." });
        }
    };

    return (
        <Box className="tournament_about_main_section" >
            <Box className="tournament_action_main_section">
                <Typography variant="h6">{CommonText.TournamentDetails}</Typography>
                <Box className='tournament_action_section'>
                    <Box className='tournament_actions' onClick={() => router.push(`/edit-tournament/${tournamentData?.id}`)}>
                        <Edit />
                    </Box>
                    <Box className='tournament_actions' onClick={handleDeleteTournamentInfo}>
                        <Delete sx={{ color: 'var(--text-red)!important' }} />
                    </Box>
                </Box>
            </Box>
            <Box className="tournament_about_details">
                {
                    TournamentInputs.length > 0 && TournamentInputs.map((items, i) => {
                        return (
                            <CustomeInput
                                key={i}
                                label={items?.label}
                                keyName={items?.key_name}
                                value={tournamentDetails[items?.key_name]}
                                onClick={() => { }}
                                // disabled={true}
                                readOnly={true}
                                
                            />
                        )
                    })
                }
            </Box>
            <MessageModal
                open={alertModal.open}
                handleClose={handleModalClose}
                success={alertModal.success}
                message={alertModal.message}
                handleSubmit={handleDeleteTournament}
                processing={processing}
            />
        </Box>
    )
}

export default AboutPage