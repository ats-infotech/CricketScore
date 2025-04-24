export const ScheduleMatchJson = [
    {
        label: 'Date and Time',
        placeholder: '',
        type: 'datetime-local',
        key_name: 'match_start_time',
        show_type: 'input'
    },
    {
        label: 'Number of Overs',
        placeholder: '0',
        type: 'number',
        key_name: 'numberOfOvers',
        show_type: 'input'
    },
    {
        label: 'Over Per Bowler',
        placeholder: '0',
        type: 'number',
        key_name: 'overPerBowler',
        show_type: 'input'
    },
    {
        label: 'Number of Player Per Team',
        placeholder: '0',
        type: 'number',
        key_name: 'perteamplayers',
        show_type: 'input'
    },
    {
        label: 'Wagon Wheel',
        placeholder: '',
        type: 'text',
        key_name: 'wagonWheel',
        show_type: 'tags',
        data: [
            { title: 'Yes', key_name: "yes" },
            { title: 'No', key_name: "no" },
        ]
    },
]