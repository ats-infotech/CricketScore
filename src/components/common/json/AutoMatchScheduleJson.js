export const AutoMatchScheduleJson = [
    {
        label: 'Number Of Overs',
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
    // {
    //     label: 'Total Teams',
    //     placeholder: '0',
    //     type: 'number',
    //     key_name: 'totalTeams',
    //     show_type: 'input'
    // },
    {
        label: 'How Many Times Teams will Play Against each Other ',
        placeholder: '0',
        type: 'number',
        key_name: 'teamPlayAgainstEachOther',
        show_type: 'input'
    },
    {
        label: 'Per Match Minutes',
        placeholder: '0',
        type: 'time',
        key_name: 'perMatchMinutes',
        show_type: 'input'
    },
    {
        label: 'No Of Matches In One Day',
        placeholder: '0',
        type: 'number',
        key_name: 'oneDayMatchesTotal',
        show_type: 'input'
    },
    {
        label: 'Break Minutes',
        placeholder: '0',
        type: 'time',
        key_name: 'breakMinutes',
        show_type: 'input'
    },
    {
        label: 'Number Of Player Per Team',
        placeholder: '0',
        type: 'number',
        key_name: 'perteamplayers',
        show_type: 'input'
    },
    {
        label: 'Start (Date And Time)',
        placeholder: '0',
        type: 'datetime-local',
        key_name: 'match_start_date',
        show_type: 'input'
    },
    {
        label: 'End (Date And Time)',
        placeholder: '0',
        type: 'datetime-local',
        key_name: 'match_end_date',
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