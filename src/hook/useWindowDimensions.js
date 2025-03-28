import { useEffect, useState } from 'react';

const getWindowDimensions = () => {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    }
    return { width: 0, height: 0 };
};

const useWindowDimensions = (offset = 0) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const { height } = windowDimensions;

    const maxHeight = height - offset;

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return maxHeight;
};

export default useWindowDimensions;

// use in Component following example :
// const maxHeight = useWindowDimensions(330);