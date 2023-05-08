import axios from '../../api'
import { SET_TEACHER, SET_TEACHER_UNAUTHENTICATED, LOADING_DATA, LOADING_TEACHER_DATA, SET_ERROR_DATA, SET_ERROR_TEACHER } from '../actionTypes'
import { setAuthHeaders} from '../../utils/helpers'
import { getBoards, getChapter, getSlab } from './dataAction'

export const getTeacherData = () => async (dispatch) => {
    try {
        dispatch({ type: LOADING_TEACHER_DATA })
        const response = await axios.get('/teacher/auth/')
        dispatch({ type: SET_TEACHER, payload: response.data.data})
    } catch(err) {
        dispatch({ type: SET_ERROR_TEACHER, payload: err.response?.data })
    }
}

export const loginTeacher = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_TEACHER_DATA })
        const response = await axios.post('/teacher/auth/login', { email: data.email, password: data.password })
        //setheaders
        const tokens = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
        }
        setAuthHeaders(tokens, "teacher")
        dispatch(getTeacherData())
        dispatch(getBoards())
        //dispatch clear errors
        // data.history.push('/teacher')
    } catch(err) {
        //dispatch error
        dispatch({ type: SET_ERROR_TEACHER, payload: err.response?.data })
    }
}

export const logoutTeacher = () => (dispatch) => {
    dispatch({ type: LOADING_TEACHER_DATA })
    localStorage.removeItem('TeacherToken')
    delete axios.defaults.headers.common['Authorization']
    dispatch({ type: SET_TEACHER_UNAUTHENTICATED })
}

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('TeacherRefreshToken')
        const res = await axios.post('/teacher/auth/refresh-token', { refreshToken })
        const accessToken = res.data.accessToken
        setAuthHeaders({ accessToken }, "teacher")
        return Promise.resolve(accessToken)
    } catch (err) {
        return Promise.reject(err)
    }
}

/* Teacher specific actions */
export const addSlab = (data) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('/teacher/slab', { idx: data.idx, title: data.title, chapterId: data.chapterId})
        dispatch(getChapter(data.chapterSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const updateSlabPoints = ({slabSlug, ...data}) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.put(`/teacher/slab/points/${slabSlug}`, data)
        dispatch(getSlab(slabSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}

export const addQuestion = ( slabSlug, data ) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.post('teacher/question', data)
        dispatch(getSlab(slabSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
        throw err.response.data
    }
}

export const updateQuestion = ({_id, data, slabSlug}) => async (dispatch) => {
    try {
        // console.log(data)
        dispatch({ type: LOADING_DATA })
        await axios.put(`teacher/question/${_id}`, data)
        dispatch(getSlab(slabSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
        throw err.response.data
    }
}

export const deleteQuestion = (props) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_DATA })
        await axios.delete(`teacher/question/${props.id}`)
        dispatch(getSlab(props.slabSlug))
    } catch(err) {
        dispatch({ type: SET_ERROR_DATA, payload: err.response?.data })
    }
}