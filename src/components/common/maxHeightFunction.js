export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
export const getMainContainerDimensions = () => {
    let mainContainer = document.getElementById('mainContainer')
    if (!mainContainer) return
    
    const { offsetWidth: width, offsetHeight: height } = mainContainer;

    return {
        width,
        height
    };
}