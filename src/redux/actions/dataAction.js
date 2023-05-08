import axios from '../../api'
import { 
    SET_BOARDS,
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
    SET_STREAMS
} from '../actionTypes'


export const getBoards = () => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get('/data/boards')
        dispatch({ type: SET_BOARDS, payload: res.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getBoard = (boardSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/data/board/${boardSlug}`)
        dispatch({ type: SET_BOARD, payload: res.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getClass = (classSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/data/class/${classSlug}`)
        dispatch({ type: SET_CLASS, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getSubject = (subjectSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/data/subject/${subjectSlug}`)
        dispatch({ type: SET_SUBJECT, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getChapter= (chapterSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/data/chapter/${chapterSlug}`)
        dispatch({ type: SET_CHAPTER, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getSubjects = (classSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/admin/subject/${classSlug}`)
        dispatch({ type: SET_SUBJECTS, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getSlabs = (chapterSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/admin/slab/${chapterSlug}`)
        dispatch({ type: SET_SLABS, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getSlab = (slabSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/teacher/slab/${slabSlug}`)
        dispatch({ type: SET_SLAB_QUESTIONS, payload: res.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

/* only admin */
export const getTeachers = () => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get('/admin/teacher')
        dispatch({ type: SET_TEACHERS_LIST, payload: res.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const getStreams = (classSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const res = await axios.get(`/admin/stream/${classSlug}`)
        dispatch({ type: SET_STREAMS, payload: res.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

/* NOTE: only for teacher and admin */
export const addSlab = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/admin/slab', { idx: data.idx, title: data.title, chapterSlug: data.chapterSlug})
        dispatch(getSlabs(data.chapterSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateSlab = ({slabSlug, chapterSlug, ...data}) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/teacher/slab/${slabSlug}`, data)
        dispatch(getChapter(chapterSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteSlab = ({slabSlug, chapterSlug}) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/teacher/slab/${slabSlug}`)
        dispatch(getChapter(chapterSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}