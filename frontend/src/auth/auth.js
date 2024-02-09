export const isAuthenticated = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false; // No token found, not authenticated
    }
    try {
        return true;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false; // Token is invalid, not authenticated
    }
};
