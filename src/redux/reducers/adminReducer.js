import { LOADING_ADMIN_DATA, SET_ADMIN, SET_ADMIN_AUTHENTICATED, SET_ADMIN_UNAUTHENTICATED, SET_ERROR_ADMIN } from '../actionTypes';

const initialState = {
    authenticated: false,
    loading: false,
    // sidebarData: [],
    admin: {},
};

const AdminReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ADMIN:
            return {
                ...state,
                authenticated: true,
                loading: false,
                admin: action.payload.user,
                // sidebarData: action.payload.boards
            }
        case SET_ADMIN_AUTHENTICATED:
            return {
                ...state,
                loading: false,
                authenticated: true
            }
        case SET_ERROR_ADMIN:
            return {
                ...state,
                loading: false
            }
        case SET_ADMIN_UNAUTHENTICATED:
            return initialState
        case LOADING_ADMIN_DATA:
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}

export default AdminReducer