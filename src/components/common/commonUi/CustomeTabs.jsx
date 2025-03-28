import { Box } from "@mui/material";
import { useCallback, useEffect } from "react";
import './CustomeFileCss/CustomeTabs.css';

const CustomeTabs = ({ data, onClick, activeTab, className }) => {

    const handleScroll = useCallback(() => {
        const tabElement = document.getElementById("tab-list");
        const subTabsElement = document.getElementById("sub-tab-list");

        if (!tabElement || !subTabsElement) return;

        const tabTop = tabElement.getBoundingClientRect().top;

        if (tabTop <= 0) {
            if (tabElement.classList.contains("sticky-tab-list")) {
                subTabsElement.classList.add("stickySubTabList");
                subTabsElement.style.top = tabElement.offsetHeight + 'px'
            }
        } else {
            subTabsElement.classList.remove("stickySubTabList");
            subTabsElement.style = ''
        }
    }, []);

    useEffect(() => {
        const mainContainer = document.getElementById("mainContainer");
        if (!mainContainer) return;

        mainContainer.addEventListener("scroll", handleScroll);

        return () => {
            mainContainer.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <Box className={`${className ? className : ''} tablist`} id='sub-tab-list'>
            <ul>
                {
                    data.length > 0 && data.map((item, index) => {
                        return (
                            <li className={activeTab === index ? 'active' : ''} key={index} onClick={() => onClick(index)}>{item?.label}</li>
                        )
                    })
                }
            </ul>
        </Box>
    )
}

export default CustomeTabs