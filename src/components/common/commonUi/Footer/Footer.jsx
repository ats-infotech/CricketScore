'use client'
import SvgIcon from "@/assets/icons/SvgIcon";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import './Footer.css';

const FooterContent = [
    { id: 1, icon: 'home', name: 'Home', navigate: '/' },
    { id: 2, icon: 'group', name: 'My Cricket', navigate: '/mytournaments' },
    { id: 3, icon: 'news', name: 'News', navigate: '/news' },
    { id: 4, icon: 'profile', name: 'Profile', navigate: '/profile' },
];

export const Footer = () => {
    const [active, setActive] = useState(1);
    const router = useRouter();
    const pathname = usePathname()

    const determineActive = useCallback(() => {
        const currentPath = pathname;
        const currentPathForUserPage = ['tournament',]
        const currentPathForAdminPage = ['mytournament', 'mytournaments', 'matchgroup', '/mytounament/teams']
        let UserPagePATH = currentPathForUserPage.some((p) => currentPath.includes(p));
        let AdminPagePATH = currentPathForAdminPage.some((p) => currentPath.includes(p));
        if (AdminPagePATH) {
            return 2;
        }
        if (UserPagePATH) {
            return 1;
        }
        const activeItem = FooterContent.find(item => pathname === item.navigate);
        return activeItem ? activeItem.id : 1;
    }, [pathname]);

    useEffect(() => {
        setActive(determineActive());
    }, [pathname, determineActive]);

    function handleClick(item) {
        setActive(item.id);
        router.push(item.navigate);
    }

    return (
        <Box className='footer-container'>
            <Box className="footer">
                {FooterContent.map((field) => {
                    return (
                        <Box
                            key={field.id}
                            className={`footer-item ${active === field.id ? 'active' : ''}`}
                            onClick={() => handleClick(field)}
                        >
                            <Box className={`footer-icon ${active === field.id ? 'active' : ''}`}>
                                <SvgIcon id={field.icon} />
                            </Box>
                            <h2 className={`footer-text ${active === field.id ? 'active' : ''}`}>
                                {active === field.id ? field.name : ''}
                            </h2>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    );
};
