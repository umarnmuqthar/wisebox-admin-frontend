import axios from '../api';

export const setAuthHeaders = (token, role) => {
    // const AdminToken = `Bearer ${token}`;
    const {accessToken, refreshToken } = token

    if(accessToken) {
        role === "admin" ? localStorage.setItem('AdminToken', accessToken)
                         : localStorage.setItem('TeacherToken', accessToken)
    }
    if(refreshToken) {
        role === "admin" ? localStorage.setItem('AdminRefreshToken', refreshToken)
                         : localStorage.setItem('TeacherRefreshToken', refreshToken)
    }

    // localStorage.setItem('AdminToken', accessToken);
    // axios.defaults.headers.common['Authorization'] = AdminToken;

    // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}