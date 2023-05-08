import axios from '../../api'
import { SET_ADMIN, SET_ADMIN_UNAUTHENTICATED, POST_NEW_BOARD, LOADING_ADMIN_DATA, LOADING_DATA, SET_ERROR_DATA, SET_ERROR_ADMIN, POST_STREAM } from '../actionTypes'
import { setAuthHeaders} from '../../utils/helpers'
import { getBoard, getBoards, getClass, getStreams, getSubject, getTeachers } from './dataAction'

export const getAdminData = () => async (dispatch) => {
    try {
        dispatch({ type: LOADING_ADMIN_DATA })
        const response = await axios.get('/admin/auth/')
        dispatch({ type: SET_ADMIN, payload: response.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_ADMIN, payload: err.response?.data })
    }
}

export const loginAdmin = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_ADMIN_DATA })
        const response = await axios.post('/admin/auth/login', { email: data.email, password: data.password })
        //setheaders
        const tokens = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
        }
        setAuthHeaders(tokens, "admin")
        dispatch(getAdminData())
        dispatch(getBoards())
        //dispatch clear errors
        // data.history.push('/admin')
    } catch(err) {
        //dispatch error
        dispatch({ type: SET_ERROR_ADMIN, payload: err.response?.data })
    }
}

export const logoutAdmin = () => (dispatch) => {
    dispatch({ type: LOADING_ADMIN_DATA })
    localStorage.removeItem('AdminToken')
    localStorage.removeItem('AdminRefreshToken')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: SET_ADMIN_UNAUTHENTICATED })
}

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("AdminRefreshToken")
        const res = await axios.post('/admin/auth/refresh-token', { refreshToken })
        const accessToken = res.data.accessToken
        setAuthHeaders({ accessToken }, "admin")
        return Promise.resolve(accessToken)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const addChapter = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/admin/chapter', { idx: data.idx, name: data.name, subjectId: data.subjectId})
        dispatch(getSubject(data.subjectSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateChapter = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/admin/chapter/${data.chapterSlug}`, 
            { 
                idx: data.idx, 
                name: data.name, 
                active: data.active
            })
        dispatch(getSubject(data.subjectSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteChapter = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/chapter/${data.chapterSlug}`)
        dispatch(getSubject(data.subjectSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const addSubject = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/admin/subject', { name: data.name, classId: data.classId})
        dispatch(getClass(data.classSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateSubject = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/admin/subject/${data.subjectSlug}`, { name: data.name })
        dispatch(getClass(data.classSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteSubject = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/subject/${data.subjectSlug}`)
        dispatch(getClass(data.classSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const addClass = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/admin/board/class', { name: data.name, board: data.boardId})
        dispatch(getBoard(data.boardSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateClass = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/admin/board/class/${data.classSlug}`, { name: data.name })
        dispatch(getBoard(data.boardSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteClass = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/board/class/${data.slug}`)
        dispatch(getBoard(data.boardSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const addBoard = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const response = await axios.post('/admin/board/', { name: data.name })
        dispatch({ type: POST_NEW_BOARD, payload: response.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateBoard = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/admin/board/${data.boardSlug}`, { name: data.name })
        dispatch(getBoards())
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteBoard = (boardSlug) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/board/${boardSlug}`)
        dispatch(getBoards())
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const addTeacher = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/admin/teacher', data)
        dispatch(getTeachers())
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateTeacher = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put('/admin/teacher', data)
        dispatch(getTeachers())
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteTeacher = (id) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/teacher/${id}`)
        dispatch(getTeachers())
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

/* stream actions */
export const addStream = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        const response = await axios.post('/admin/stream', 
            { 
                name: data.name, 
                board: data.board, 
                classId: data.classId, 
                subjects: data.subjects 
            })
        dispatch({ type: POST_STREAM, payload: response.data.data })
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateStream = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/admin/stream/${data.streamSlug}`, { name: data.name, subjects: data.subjects, active: data.active })
        dispatch(getStreams(data.classSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const deleteStream = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`/admin/stream/${data.streamSlug}`)
        dispatch(getStreams(data.classSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}