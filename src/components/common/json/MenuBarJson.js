export const MenuBarJson = [
    {
        icon: 'throphy',
        title: 'Add A Tournament/Series',
        redirect: 'registeredTornaments',
        submenu: []
    },
    {
        icon: 'game-flag',
        title: 'Start A Match',
        redirect: 'mytournaments',
        submenu: []
    },
    {
        icon: 'bat-ball',
        title: 'My Cricket',
        redirect: '',
        submenu: [
            {
                icon: 'matches',
                title: 'My Matches',
                redirect: '',
            },
            {
                icon: 'tournaments',
                title: 'My Tournaments',
                redirect: '',
            },
            {
                icon: 'teams',
                title: 'My Teams',
                redirect: '',
            },
            {
                icon: 'stats',
                title: 'My Stats',
                redirect: '',
            },
        ]
    },
    {
        icon: 'performance',
        title: 'My Performance',
        redirect: '',
        submenu: []
    },
    {
        icon: 'shareapp',
        title: 'Share The App',
        redirect: '',
        submenu: []
    },
    {
        icon: 'followus',
        title: 'Follow Us',
        redirect: '',
        submenu: [
            {
                icon: 'instagram',
                title: 'Instagram',
                redirect: '',
            },
            {
                icon: 'youtube',
                title: 'Youtube',
                redirect: '',
            },
            {
                icon: 'facebook',
                title: 'Facebook',
                redirect: '',
            },
            {
                icon: 'twitter',
                title: 'X',
                redirect: '',
            },
        ]
    }
]