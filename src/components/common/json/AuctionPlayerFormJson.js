const playerCategoryOptions = ['Diamond Elite', 'Platinum Premier', 'Gold Class', 'Silver Standard', 'Bronze Category', 'Titanium Tier',
    'Emerald League', 'Sapphire Division', 'Ruby Class', 'Crystal Category']

const playerSpecificationOne = ['All Rounder', 'Batting All Rounder', 'Bowling All Rounder', 'All Rounder WicketKeeper', 'Batsman', 'Bowler', 'Wicket Keeper', 'Other']

const playerSpecificationTwo = ['Right Hand', 'Left Hand', 'Right Hand Batsman', 'Left Hand Batsman', 'Right Hand Opener', 'Left Hand Opener', 'Right Hand Middle Order',
    'Left Hand Middle Order', 'Other']

const playerSpecificationThree = ['Rigth Arm Fast', 'Right Arm Medium', 'Left Arm Fast', 'Left Arm Medium', 'off-Break', 'Leg-Break', 'Left Arm Orthodox', 'Right Arm Orthodox', 'Other']

export const AuctionPlayerForm = [
    {
        label: 'Name',
        placeholder: 'Enter player name',
        type: 'text',
        key_name: 'playerName',
        show_type: 'input'
    },
    {
        label: 'Category',
        placeholder: '',
        type: 'text',
        key_name: 'player_category',
        show_type: 'select',
        data: playerCategoryOptions
    },
    {
        label: 'Age',
        placeholder: 'Enter player age',
        type: 'text',
        key_name: 'player_age',
        show_type: 'input'
    },
    {
        label: 'Number',
        placeholder: 'Enter player number',
        type: 'number',
        key_name: 'playerContact',
        show_type: 'input'
    },
    // {
    //     label: 'skills',
    //     placeholder: 'Enter player skills',
    //     type: 'text',
    //     key_name: 'player_skills',
    //     show_type: 'tags'
    // },
    {
        label: 'Select Skills',
        placeholder: 'Select Skills',
        type: 'text',
        key_name: 'skills',
        show_type: 'tags',
        data: [
            { title: 'batsmen', image: require('../../../assets/img/balls/tennis.png'), key_name: "batsment" },
            { title: 'bowler', image: require('../../../assets/img/balls/leather.png'), key_name: "bowler" },
            { title: 'wicketkeeper', image: require('../../../assets/img/balls/other.png'), key_name: "wicketkeeper" },
            { title: 'allrounder', image: require('../../../assets/img/balls/other.png'), key_name: "allrounder" }
        ]
    },
    {
        label: 'Specification 1',
        // placeholder: 'Enter Specification 1',
        type: 'text',
        key_name: 'specification1',
        show_type: 'select',
        data: playerSpecificationOne
    },
    {
        label: 'Specification 2',
        // placeholder: 'Enter Specification 2',
        type: 'text',
        key_name: 'specification2',
        show_type: 'select',
        data: playerSpecificationTwo
    },
    {
        label: 'Specification 3',
        // placeholder: 'Enter Specification 3',
        type: 'text',
        key_name: 'specification3',
        show_type: 'select',
        data: playerSpecificationThree
    },
    {
        label: 'Jersey Size',
        placeholder: 'Enter jersey size',
        type: 'text',
        key_name: 'jerseysize',
        show_type: 'input'
    },
    {
        label: 'Trouser Size',
        placeholder: 'Enter Trouser size',
        type: 'text',
        key_name: 'trousersize',
        show_type: 'input'
    },
    {
        label: 'Jersey Name',
        placeholder: 'Enter jersey Name',
        type: 'text',
        key_name: 'jerseyname',
        show_type: 'input'
    },
    {
        label: 'Jersey Number',
        placeholder: 'Enter Jersey Number',
        type: 'text',
        key_name: 'jerseynumber',
        show_type: 'input'
    },
    {
        label: 'Matches',
        placeholder: 'Enter player matches',
        type: 'number',
        key_name: 'matchplayed',
        show_type: 'input'
    },
    {
        label: 'Runs',
        placeholder: 'Enter player runs',
        type: 'number',
        key_name: 'runsscored',
        show_type: 'input'
    },
    {
        label: 'Wicket',
        placeholder: 'Enter player wickets',
        type: 'number',
        key_name: 'wicketstaken',
        show_type: 'input'
    },
    {
        label: 'Extra Details',
        placeholder: 'Enter extra details',
        type: 'text',
        key_name: 'extradetails',
        show_type: 'input'
    },
]