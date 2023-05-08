import { SET_TEACHER, SET_ADMIN_AUTHENTICATED, SET_ADMIN_UNAUTHENTICATED, LOADING_TEACHER_DATA, SET_ERROR_TEACHER } from '../actionTypes';

const initialState = {
    authenticated: false,
    loading: false,
    teacher: {},
};

const TeacherReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_TEACHER:
            return {
                ...state,
                authenticated: true,
                loading: false,
                teacher: action.payload.user,
            }
        case SET_ADMIN_AUTHENTICATED:
            return {
                ...state,
                loading: false,
                authenticated: true
            }
        case SET_ERROR_TEACHER:
            return {
                ...state,
                loading: false
            }
        case SET_ADMIN_UNAUTHENTICATED:
            return initialState
        case LOADING_TEACHER_DATA:
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}

export default TeacherReducer