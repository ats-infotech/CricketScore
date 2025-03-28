export const TornamentForm = [
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
    {
        label: 'Tournaments Category',
        placeholder: 'Tournaments category',
        type: 'text',
        key_name: 'tournaments_category',
        show_type: 'tags',
        data: [
            { title: 'Open', key_name: "open" },
            { title: 'Corporate', key_name: "corporate" },
            { title: 'School', key_name: "school" },
            { title: 'Community', key_name: "community" },
            { title: 'University', key_name: "university" },
            { title: 'Series', key_name: "series" },
            { title: 'College', key_name: "college" },
            { title: 'Other', key_name: "other" },
        ]
    },
    {
        label: 'Select Ball Type',
        placeholder: 'Select Ball Type',
        type: 'text',
        key_name: 'ball_type',
        show_type: 'tags',
        data: [
            { title: 'Tennis', image: require('../../../assets/img/balls/tennis.png'), key_name: "tennis" },
            { title: 'Leather', image: require('../../../assets/img/balls/leather.png'), key_name: "leather" },
            { title: 'Other', image: require('../../../assets/img/balls/other.png'), key_name: "other" }
        ]
    },
    {
        label: 'Pitch Type',
        placeholder: 'Pitch Type',
        type: 'text',
        key_name: 'pitch_type',
        show_type: 'tags',
        data: [
            { title: 'Rough', key_name: "rough" },
            { title: 'Turf', key_name: "turf" },
            { title: 'Matting', key_name: "matting" },
            { title: 'Cement', key_name: "cement" },
            { title: 'Astroturf', key_name: "astroturf" },
        ]
    },
    {
        label: 'Match Type',
        placeholder: 'Match Type',
        type: 'text',
        key_name: 'match_type',
        show_type: 'tags',
        data: [
            { title: 'Test Match', key_name: "test-match" },
            { title: 'Pair Cricket', key_name: "pair" },
            { title: 'Limited Overs', key_name: "limitedOvers" },
            { title: 'The Hundred', key_name: "the-hundred" },
            { title: 'Box/Turf Cricket', key_name: "box-turf" },
        ]
    },
]

export const TornamentExtraForm = [
    {
        label: 'Match Locations',
        placeholder: 'Tournament locations',
        type: 'text',
        key_name: 'tournament_location',
        show_type: 'input'
    },
    {
        label: 'Entry Fee',
        placeholder: 'Entry fee',
        type: 'number',
        key_name: 'entry_fee',
        show_type: 'input'
    },
    {
        label: 'Tota Teams',
        placeholder: 'Total Teams',
        type: 'number',
        key_name: 'total_number_of_teams',
        show_type: 'input'
    },
    // {
    //     label: 'How Many Teams Do you Require?',
    //     placeholder: 'Your How Many Teams Do You Require?',
    //     type: 'text',
    //     key_name: 'your_required_teams',
    //     show_type: 'input'
    // },
    {
        label: 'Winning Prize',
        placeholder: 'Winning Prize',
        type: 'text',
        key_name: 'winning_price',
        show_type: 'tags',
        data: [
            { title: 'Cash', key_name: "cash" },
            { title: 'Trophies', key_name: "trophies" },
            { title: 'Both', key_name: "both" },
        ]
    },
    {
        label: 'Match On',
        placeholder: 'Match On',
        type: 'text',
        key_name: 'match_on',
        show_type: 'tags',
        data: [
            { title: 'Weekends', key_name: "weekends" },
            { title: 'Weekdays', key_name: "weekdays" },
            { title: 'All Days', key_name: "alldays" },
        ]
    },
    {
        label: 'Match Timing',
        placeholder: 'Match Timing',
        type: 'text',
        key_name: 'match_timing',
        show_type: 'tags',
        data: [
            { title: 'Day', key_name: "day" },
            { title: 'Night', key_name: "night" },
            { title: 'Day & Night', key_name: "day-night" },
        ]
    },
    {
        label: 'Tournament Format',
        placeholder: 'Tournament Format',
        type: 'text',
        key_name: 'tournament_format',
        show_type: 'tags',
        data: [
            { title: 'League', key_name: "league" },
            { title: 'Knockout', key_name: "knockout" },
        ]
    },
]