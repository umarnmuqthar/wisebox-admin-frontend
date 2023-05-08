import { 
    SET_BOARDS, 
    POST_NEW_BOARD, 
    SET_SUBJECTS, 
    SET_SLABS, 
    LOADING_DATA, 
    SET_TEACHERS_LIST, 
    SET_SLAB_QUESTIONS, 
    SET_ERROR_DATA, 
    SET_CLASS, 
    SET_SUBJECT, 
    SET_CHAPTER, 
    SET_BOARD,
    SET_STREAMS,
    POST_STREAM,
    // DELETE_STREAM,
    // UPDATE_STREAM
} from '../actionTypes';

const initialState = {
    boards: [],
    board: [],
    loading: false,
    subjects: [],
    class: {},
    subject: {},
    chapter: {},
    teachers: [],
    slabs: [],
    slab: [],
    streams: [],
    errors: {}
};

const DataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BOARDS:
            return {
                ...state,
                loading: false,
                boards: action.payload
            }
        case SET_BOARD:
            return {
                ...state,
                loading: false,
                board: action.payload
            }
        case POST_NEW_BOARD:
            return {
                ...state,
                loading: false,
                boards: [...state.boards, action.payload]
            }
        case SET_SUBJECTS:
            return {
                ...state,
                loading: false,
                subjects: action.payload
            }
        case SET_SUBJECT:
            return {
                ...state,
                loading: false,
                subject: action.payload
            }
        case SET_SLABS:
            return {
                ...state,
                loading: false,
                slabs: action.payload
            }
        case SET_SLAB_QUESTIONS:
            return {
                ...state,
                loading: false,
                slab: action.payload
            }
        case SET_CHAPTER:
            return {
                ...state,
                loading: false,
                chapter: action.payload
            }
        case SET_CLASS:
            return {
                ...state,
                loading: false,
                class: action.payload
            }
        case SET_TEACHERS_LIST:
            return {
                ...state,
                loading: false,
                teachers: action.payload
            }
        case SET_STREAMS:
            return {
                ...state,
                loading: false,
                streams: action.payload
            }
        case POST_STREAM:
            return {
                ...state,
                loading: false,
                streams: [...state.streams, action.payload]
            }
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_ERROR_DATA:
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
        default:
            return state
    }
}

export default DataReducer