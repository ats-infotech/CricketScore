export const handleApiError = (error) => {
    return {
        success: false,
        message: error?.message || 'An unexpected error occurred',
        status: 'Error',
    };
};
