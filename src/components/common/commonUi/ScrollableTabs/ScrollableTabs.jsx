import SvgIcon from '@/assets/icons/SvgIcon';
import { Addchart } from '@mui/icons-material';
import { Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import './ScrollableTabs.css';

function ScrollableTabs({ buttonGroups, tabActive, handleChange, data, type }) {
    const tabRefs = useRef([]);

    useEffect(() => {
        if (buttonGroups.length > 0 && !buttonGroups.some(item => item.value === tabActive) && data) {
            handleChange(buttonGroups[0]?.value || '');
        }
    }, [tabActive, buttonGroups, handleChange]);

    useEffect(() => {
        if (tabActive) {            
            const index = buttonGroups.findIndex(item => item.value === tabActive);
            if (index !== -1 && tabRefs.current[index]) {
                tabRefs.current[index].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                });
            }
        }
    }, [tabActive, buttonGroups]);

    return (
        <Tabs
            value={buttonGroups.some(item => item.value === tabActive) ? tabActive : buttonGroups[0]?.value || ''}
            onChange={(event, newValue) => {
                if (newValue !== tabActive) {
                    handleChange(newValue);
                }
            }}
            className={`tabs_main ${type}`}
            id='tab-list'
        >
            {
                buttonGroups.length > 0 && buttonGroups.map((item, i) => {
                    return (
                        <Tab
                            id={item?.value}
                            label={<Typography variant="body2">{item?.title}</Typography>}
                            value={item?.value}
                            key={item?.title}
                            icon={item?.icon === "analysis" ? <Addchart /> : <SvgIcon id={item?.icon} width={16} height={16} style={{ margin: '0' }} />}
                            className='childTab'
                            ref={(el) => (tabRefs.current[i] = el)}
                        />
                    )
                })
            }
        </Tabs>
    );
}

export default React.memo(ScrollableTabs);
